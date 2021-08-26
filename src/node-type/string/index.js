import constantString from "./constant-string";
import template from "./template";

export const registerNodes = (prefix, register, context) => {
  register(`${prefix}constant-string`, constantString(context));
  register(`${prefix}template`, template(context));
};
