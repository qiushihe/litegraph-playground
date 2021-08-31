import constantString from "./constant-string";
import split from "./split";
import template from "./template";

export const registerNodes = (prefix, register, context) => {
  register(`${prefix}constant-string`, constantString(context));
  register(`${prefix}split`, split(context));
  register(`${prefix}template`, template(context));
};
