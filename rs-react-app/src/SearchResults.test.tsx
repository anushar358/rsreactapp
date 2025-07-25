import { render, screen, waitFor } from "@testing-library/react";
import SearchResults from "./SearchResults";
import { mockFetchSuccess } from "./test-utils/mockFetch";
import { mockFetchPromise } from "./test-utils/mockFetchPromise";

describe("SearchResults component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Renders correct number of items when data is provided", async () => {
    const mockResults = [
      { name: "Item 1", photoUrls: ["url1", "url2"] },
      { name: "Item 2", photoUrls: ["url3"] },
      { name: "Item 3", photoUrls: ["url4", "url5", "url6"] },
    ];
    mockFetchSuccess(mockResults);

    render(<SearchResults submittedText="dummy" />);

    await waitFor(() => {
      const rows = screen.getAllByRole("row");
      expect(rows.length).toBe(4); // 1 header + 3 items
    });
  });

  test("Displays no results message when data array is empty", async () => {
    mockFetchSuccess([]);
    render(<SearchResults submittedText="dummy" />);

    const errorMessage = await screen.findByText(/No results/i);
    expect(errorMessage).toBeInTheDocument();
  });

  test("Shows loading state while fetching data", async () => {
    mockFetchPromise([], 100);

    render(<SearchResults submittedText="dummy" />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
  });

  test("Correctly displays item names and descriptions", async () => {
    const mockResults = [
      { name: "Item 1", photoUrls: ["url1", "url2"] },
      { name: "Item 2", photoUrls: ["url3"] },
      { name: "Item 3", photoUrls: ["url4", "url5", "url6"] },
    ];
    mockFetchSuccess(mockResults);

    render(<SearchResults submittedText="dummy" />);

    for (const result of mockResults) {
      expect(await screen.findByText(result.name)).toBeInTheDocument();
      expect(screen.getByText(result.photoUrls.join(", "))).toBeInTheDocument();
    }
  });

  test("Handles undefined data gracefully", async () => {
    mockFetchSuccess(undefined);

    render(<SearchResults submittedText="dummy" />);
    const message = await screen.findByText(/No results/i);
    expect(message).toBeInTheDocument();
  });

  test("Handles null data gracefully", async () => {
    mockFetchSuccess(null);

    render(<SearchResults submittedText="dummy" />);
    const message = await screen.findByText(/No results/i);
    expect(message).toBeInTheDocument();
  });

  test("Handles non-array data gracefully", async () => {
    mockFetchSuccess({ some: "object" });

    render(<SearchResults submittedText="dummy" />);
    const message = await screen.findByText(/No results/i);
    expect(message).toBeInTheDocument();
  });

  test("Handles empty array gracefully", async () => {
    mockFetchSuccess([]);

    render(<SearchResults submittedText="dummy" />);
    const message = await screen.findByText(/No results/i);
    expect(message).toBeInTheDocument();
  });

  test("Displays error message when API call fails", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    jest
      .spyOn(globalThis, "fetch")
      .mockRejectedValueOnce(new Error("Simulated API failure"));

    render(<SearchResults submittedText="dummy" />);

    const errorMessage = await screen.findByText(/Error loading data/i);

    expect(errorMessage).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });
});
