import { useEffect, useState } from "react";
import { useSearchParams, Outlet } from "react-router-dom";

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
                  <th>Item</th>
                  <th>Item Description</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((result) => (
                  <tr
                    key={result.id}
                    onClick={() => handleItemClick(result.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{result.name}</td>
                    <td>{result.photoUrls.join(", ")}</td>
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
    </div>
  );
};

export default SearchResultsFunctional;
