import reduce from "./reduce";

export const registerNodes = (prefix, register, context) => {
  register(`${prefix}reduce`, reduce(context));
};
