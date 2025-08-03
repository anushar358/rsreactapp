import { render, screen } from "@testing-library/react";
import ErrorBoundary from "./ErrorBoundary";

const FaultyComponent = () => {
  throw new Error("Simulated error");
};

describe("ErrorBoundary", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
  test("Catches and handles JavaScript errors in child components", () => {
    render(
      <ErrorBoundary>
        <FaultyComponent />
      </ErrorBoundary>,
    );
    expect(screen.getByText(/oops! something went wrong/i)).toBeInTheDocument();
    expect(screen.getByText(/Simulated error/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reload/i })).toBeInTheDocument();
  });
});

describe("ErrorBoundary", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
  test("Displays fallback UI when error occurs", () => {
    render(
      <ErrorBoundary>
        <FaultyComponent />
      </ErrorBoundary>,
    );
    expect(screen.getByText(/oops! something went wrong/i)).toBeInTheDocument();
  });
});

describe("ErrorBoundary", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  test("Logs error to console when child component throws", () => {
    render(
      <ErrorBoundary>
        <FaultyComponent />
      </ErrorBoundary>,
    );
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});
