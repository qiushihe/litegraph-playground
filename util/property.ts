import reduce from "lodash/fp/reduce";

export const flags = (...values: string[]): Record<string, boolean> => {
  return reduce(
    (acc, value: string) => ({
      ...acc,
      [value]: true
    }),
    {}
  )(values);
};
