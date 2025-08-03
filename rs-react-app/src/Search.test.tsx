import { fireEvent, render, screen } from "@testing-library/react";
import Search from "./Search";
import { mockFetchSuccess } from "./test-utils/mockFetch";

beforeAll(() => {
  mockFetchSuccess([]); // prevent real network calls
});

describe("Search component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("renders input and search button", () => {
    render(<Search />);
    const input = screen.getByPlaceholderText(/search/i);
    expect(input).toBeInTheDocument();

    const button = screen.getByRole("button", { name: /search/i });
    expect(button).toBeInTheDocument();
  });

  test("loads previously saved search term from localStorage", () => {
    localStorage.setItem("searchText", "tag1");
    render(<Search />);
    const input = screen.getByPlaceholderText(/search/i) as HTMLInputElement;
    expect(input.value).toBe("tag1");
  });

  test("shows empty input if no saved search exists", () => {
    render(<Search />);
    const input = screen.getByPlaceholderText(/search/i) as HTMLInputElement;
    expect(input.value).toBe("");
  });

  test("updates input when user types", () => {
    render(<Search />);
    const input = screen.getByPlaceholderText(/search/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "dogs" } });
    expect(input.value).toBe("dogs");
  });

  test("saves search term to localStorage on submit", () => {
    render(<Search />);
    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.change(input, { target: { value: "cats" } });

    const button = screen.getByRole("button", { name: /search/i });
    fireEvent.click(button);

    expect(localStorage.getItem("searchText")).toBe("cats");
  });

  test("overwrites saved search term on new search", () => {
    localStorage.setItem("searchText", "oldTerm");
    render(<Search />);
    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.change(input, { target: { value: "newTerm" } });

    fireEvent.click(screen.getByRole("button", { name: /search/i }));
    expect(localStorage.getItem("searchText")).toBe("newTerm");
  });
});
