export const mockFetchPromise = (data: unknown, delay = 100) => {
  return jest.fn(
    () =>
      new Promise((resolve) =>
        setTimeout(
          () =>
            resolve({
              json: () => Promise.resolve(data),
            }),
          delay,
        ),
      ),
  );
};
