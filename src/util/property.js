import reduce from "lodash/fp/reduce";

export const flags = (...values) => {
  return reduce(
    (acc, value) => ({
      ...acc,
      [value]: true
    }),
    {}
  )(values);
};
