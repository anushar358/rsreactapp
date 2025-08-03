import { render, screen, waitFor } from "@testing-library/react";
import SearchResults from "./SearchResults";
import { mockFetchSuccess, mockFetchFailure } from "./test-utils/mockFetch";
import { mockFetchPromise } from "./test-utils/mockFetchPromise";

describe("SearchResults component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("shows loading state initially", async () => {
    mockFetchPromise([], 100);
    render(<SearchResults submittedText="dogs" />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
    );
  });

  test("renders correct number of items", async () => {
    const mockResults = [
      { name: "Dog 1", photoUrls: ["url1"] },
      { name: "Dog 2", photoUrls: ["url2"] },
    ];
    mockFetchSuccess(mockResults);

    render(<SearchResults submittedText="dogs" />);
    await waitFor(() => {
      const rows = screen.getAllByRole("row");
      expect(rows.length).toBe(1 + mockResults.length); // header + data
    });
  });

  test("shows 'No results' when empty array returned", async () => {
    mockFetchSuccess([]);
    render(<SearchResults submittedText="dogs" />);
    expect(await screen.findByText(/No results/i)).toBeInTheDocument();
  });

  test("handles undefined/null/non-array responses gracefully", async () => {
    mockFetchSuccess(undefined);
    render(<SearchResults submittedText="dogs" />);
    expect(await screen.findByText(/No results/i)).toBeInTheDocument();

    mockFetchSuccess(null);
    render(<SearchResults submittedText="dogs" />);
    expect(await screen.findByText(/No results/i)).toBeInTheDocument();

    mockFetchSuccess({ something: "wrong" });
    render(<SearchResults submittedText="dogs" />);
    expect(await screen.findByText(/No results/i)).toBeInTheDocument();
  });

  test("shows error message on API failure", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    mockFetchFailure();

    render(<SearchResults submittedText="dogs" />);
    expect(await screen.findByText(/Error loading data/i)).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  test("renders item names and URLs correctly", async () => {
    const mockResults = [
      { name: "Dog 1", photoUrls: ["url1", "url2"] },
      { name: "Dog 2", photoUrls: ["url3"] },
    ];
    mockFetchSuccess(mockResults);

    render(<SearchResults submittedText="dogs" />);
    await waitFor(() => {
      expect(screen.getByText("Dog 1")).toBeInTheDocument();
      expect(screen.getByText("url1, url2")).toBeInTheDocument();
      expect(screen.getByText("Dog 2")).toBeInTheDocument();
      expect(screen.getByText("url3")).toBeInTheDocument();
    });
  });
});
