import { useEffect, useState } from "react";
import { useSearchParams, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store";
import { toggleItem, selectAll, clearSelection } from "./selectionSlice";

interface SearchProp {
  submittedText: string;
}

interface SearchResult {
  name: string;
  id: number;
  photoUrls: string[];
}

const ITEMS_PER_PAGE = 5;

// eslint-disable-next-line react/prop-types
const SearchResultsFunctional: React.FC<SearchProp> = ({ submittedText }) => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const dispatch = useDispatch();
  const selectedItems = useSelector(
    (state: RootState) => state.selection.selectedItems,
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const selectedDetailId = searchParams.get("details");

  useEffect(() => {
    if (!submittedText) return;

    const fetchData = async () => {
      setLoading(true);
      setErrorMessage("");
      setSearchResults([]);

      const url = `https://petstore3.swagger.io/api/v3/pet/findByTags?tags=${submittedText}`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          const results = data.map((item) => ({
            id: item.id,
            name: item.name,
            photoUrls: item.photoUrls,
          }));

          setSearchResults(results);
        } else {
          setErrorMessage("No results");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setErrorMessage("Error loading data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [submittedText]);

  const totalPages = Math.ceil(searchResults.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = searchResults.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const handlePageChange = (page: number) => {
    const params: Record<string, string> = { page: page.toString() };
    if (selectedDetailId) params.details = selectedDetailId;
    setSearchParams(params);
  };

  const handleItemClick = (id: number) => {
    const params: Record<string, string> = {
      page: currentPage.toString(),
      details: id.toString(),
    };
    setSearchParams(params);
  };

  const handleCloseDetails = () => {
    const params: Record<string, string> = { page: currentPage.toString() };
    setSearchParams(params);
  };

  // Handle select all logic for current page only
  const handleSelectAllCurrentPage = (checked: boolean) => {
    if (checked) {
      // Add all current items + keep previous selections
      dispatch(
        selectAll([
          ...new Set([...selectedItems, ...currentItems.map((i) => i.id)]),
        ]),
      );
    } else {
      // Remove only current page items
      dispatch(
        selectAll(
          selectedItems.filter(
            (id) => !currentItems.map((i) => i.id).includes(id),
          ),
        ),
      );
    }
  };

  const handleDownload = () => {
    // Example: create CSV or trigger API call
    const selectedData = searchResults.filter((item) =>
      selectedItems.includes(item.id),
    );
    console.log("Downloading items:", selectedData);

    alert(`Downloading ${selectedData.length} item(s)`);
  };

  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: 1 }}>
        {loading && <div>Loading...</div>}

        {!loading && errorMessage && <div>{errorMessage}</div>}

        {!loading && !errorMessage && searchResults.length > 0 && (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        handleSelectAllCurrentPage(e.target.checked)
                      }
                      checked={
                        currentItems.length > 0 &&
                        currentItems.every((item) =>
                          selectedItems.includes(item.id),
                        )
                      }
                    />
                  </th>
                  <th>Item</th>
                  <th>Item Description</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((result) => (
                  <tr key={result.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(result.id)}
                        onChange={() => dispatch(toggleItem(result.id))}
                      />
                    </td>
                    <td
                      style={{ cursor: "pointer" }}
                      onClick={() => handleItemClick(result.id)}
                    >
                      {result.name}
                    </td>
                    <td
                      style={{ cursor: "pointer" }}
                      onClick={() => handleItemClick(result.id)}
                    >
                      {result.photoUrls.join(", ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: "1rem", justifyContent: "right" }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    disabled={page === currentPage}
                    style={{ margin: "0 5px" }}
                  >
                    {page}
                  </button>
                ),
              )}
            </div>
          </>
        )}
      </div>

      {selectedDetailId && (
        <div
          style={{ flex: 1, borderLeft: "1px solid #ccc", paddingLeft: "1rem" }}
        >
          <div>
            <button onClick={handleCloseDetails}>Close</button>
          </div>
          <Outlet />
        </div>
      )}
      {selectedItems.length > 0 && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            backgroundColor: "#333",
            color: "white",
            padding: "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 -2px 5px rgba(0,0,0,0.3)",
          }}
        >
          <span>{selectedItems.length} item(s) selected</span>
          <div>
            <button
              style={{
                marginRight: "10px",
                backgroundColor: "gray",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              onClick={() => dispatch(clearSelection())}
            >
              Unselect All
            </button>
            <button
              style={{
                backgroundColor: "green",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              onClick={handleDownload}
            >
              Download
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResultsFunctional;
