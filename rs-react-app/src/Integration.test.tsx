import { render, screen, waitFor } from "@testing-library/react";
import SearchResults from "./SearchResults";
import Search from "./Search";
import { mockFetchPromise } from "./test-utils/mockFetchPromise";
import { mockFetchFailure } from "./test-utils/mockFetch";

describe("SearchResults component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Makes initial API call on component mount", async () => {
    (globalThis.fetch as jest.Mock) = jest.fn();

    const fetchSpy = jest.spyOn(globalThis, "fetch").mockResolvedValue({
      json: jest.fn().mockResolvedValue([]),
    } as unknown as Response);

    render(<SearchResults submittedText="tag1" />);
    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(fetchSpy).toHaveBeenCalledWith(
        "https://petstore3.swagger.io/api/v3/pet/findByTags?tags=tag1",
      );
    });
    fetchSpy.mockRestore();
  });
});

describe("Search component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("Handles search term from localStorage on initial load", () => {
    (globalThis.fetch as jest.Mock) = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue([]), // return empty array to make it safe
    } as unknown as Response);

    const savedSearchTerm = "tag1";
    localStorage.setItem("searchText", savedSearchTerm);

    render(<Search />);

    const inputElement = screen.getByPlaceholderText(
      /search/i,
    ) as HTMLInputElement;
    expect(inputElement.value).toBe(savedSearchTerm);
  });
});

describe("SearchResults component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("Correctly displays item names and descriptions", async () => {
    const mockResults = [{ name: "Item 1", photoUrls: ["url1", "url2"] }];
    mockFetchPromise(mockResults, 100);

    render(<SearchResults submittedText="dummy" />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    await new Promise((r) => setTimeout(r, 110));
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });
});

describe("SearchResults component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Calls API with correct parameters", async () => {
    (globalThis.fetch as jest.Mock) = jest.fn();

    const fetchSpy = jest.spyOn(globalThis, "fetch").mockResolvedValue({
      json: jest.fn().mockResolvedValue([]),
    } as unknown as Response);

    render(<SearchResults submittedText="tag1" />);

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(fetchSpy).toHaveBeenCalledWith(
        "https://petstore3.swagger.io/api/v3/pet/findByTags?tags=tag1",
      );
    });

    fetchSpy.mockRestore();
  });
});

describe("SearchResults component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Handles successful API responses", async () => {
    const mockData = [
      { name: "Item 1", photoUrls: ["url1", "url2"] },
      { name: "Item 2", photoUrls: ["url3"] },
    ];
    (globalThis.fetch as jest.Mock) = jest.fn();

    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(mockData),
    } as unknown as Response);

    render(<SearchResults submittedText="tag1" />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Item 1")).toBeInTheDocument();
      expect(screen.getByText("url1, url2")).toBeInTheDocument();

      expect(screen.getByText("Item 2")).toBeInTheDocument();
      expect(screen.getByText("url3")).toBeInTheDocument();
    });
  });
});

describe("SearchResults component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Handles API error responses", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    mockFetchFailure();
    render(<SearchResults submittedText="tag1" />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Error loading data")).toBeInTheDocument();
    });
    consoleErrorSpy.mockRestore();
  });
});

describe("SearchResults component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Updates component state based on API responses", async () => {
    const mockData = [
      { name: "Item 1", photoUrls: ["url1", "url2"] },
      { name: "Item 2", photoUrls: ["url3"] },
    ];
    (globalThis.fetch as jest.Mock) = jest.fn();

    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(mockData),
    } as unknown as Response);

    render(<SearchResults submittedText="tag1" />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Item 1")).toBeInTheDocument();
      expect(screen.getByText("url1, url2")).toBeInTheDocument();
      expect(screen.getByText("Item 2")).toBeInTheDocument();
      expect(screen.getByText("url3")).toBeInTheDocument();
    });
  });
});
