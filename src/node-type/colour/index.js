import findClosest from "./find-closest";
import hexToRGB from "./hex-to-rgb";

export const registerNodes = (prefix, register, context) => {
  register(`${prefix}find-closest`, findClosest(context));
  register(`${prefix}hex-to-rgb`, hexToRGB(context));
};
