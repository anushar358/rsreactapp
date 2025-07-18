import { fireEvent, render, screen } from "@testing-library/react";
import Search from "./Search";
import { mockFetchSuccess } from "./test-utils/mockFetch";

beforeAll(() => {
  mockFetchSuccess([]);
});

describe("Search Form renders input text and search button", () => {
  test("Search screen renders input box", () => {
    render(<Search />);
    const searchinput = screen.getByPlaceholderText(/search/i);
    expect(searchinput).toBeInTheDocument();

    const searchbutton = screen.getByRole("button", { name: /submit/i });
    expect(searchbutton).toBeInTheDocument();
  });
});

describe("Search component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("Displays previously saved search term from localStorage on mount & Retrieves saved search term on component mount", async () => {
    const savedSearchTerm = "tag1";
    localStorage.setItem("searchText", savedSearchTerm);
    render(<Search />);

    const inputElement = (await screen.getByPlaceholderText(
      /search/i,
    )) as HTMLInputElement;
    expect(inputElement.value).toBe(savedSearchTerm);
  });
});

describe("Search component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("Shows empty input when no saved term exists", () => {
    render(<Search />);
    const inputElement = screen.getByPlaceholderText(
      /search/i,
    ) as HTMLInputElement;
    expect(inputElement.value).toBe("");
  });
});

describe("Search component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("Updates input value when user types", () => {
    render(<Search />);
    const inputElement = screen.getByPlaceholderText(
      /search/i,
    ) as HTMLInputElement;
    fireEvent.change(inputElement, { target: { value: "tag2" } });
    expect(inputElement.value).toBe("tag2");
  });
});

describe("Search component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("Saves search term to localStorage when search button is clicked", () => {
    render(<Search />);
    const inputElement = screen.getByPlaceholderText(/search/i);
    fireEvent.change(inputElement, { target: { value: "tag2" } });
    const searchbutton = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(searchbutton);
    expect(localStorage.getItem("searchText")).toBe("tag2");
  });
});

describe("Search component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("Overwrites existing localStorage value when new search is performed", () => {
    const savedSearchTerm = "tag1";
    localStorage.setItem("searchText", savedSearchTerm);

    render(<Search />);
    const inputElement = screen.getByPlaceholderText(/search/i);
    fireEvent.change(inputElement, { target: { value: "tag2" } });

    const searchbutton = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(searchbutton);

    expect(localStorage.getItem("searchText")).toBe("tag2");
  });
});
