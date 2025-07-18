export const mockFetchFailure = (errorMessage = "API failure") => {
  globalThis.fetch = jest.fn(() =>
    Promise.reject(new Error(errorMessage)),
  ) as jest.Mock;
};

export const mockFetchSuccess = (data: unknown) => {
  globalThis.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(data),
    }),
  ) as jest.Mock;
};
