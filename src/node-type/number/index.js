import clamp from "./clamp";
import constantNumber from "./constant-number";

export const registerNodes = (prefix, register, context) => {
  register(`${prefix}clamp`, clamp(context));
  register(`${prefix}constant-number`, constantNumber(context));
};
