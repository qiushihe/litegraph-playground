import reduce from "./reduce";
import size from "./size";

export const registerNodes = (prefix, register, context) => {
  register(`${prefix}reduce`, reduce(context));
  register(`${prefix}size`, size(context));
};
