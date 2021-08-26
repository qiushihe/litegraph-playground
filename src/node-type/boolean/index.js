import constantBoolean from "./constant-boolean";
import not from "./not";

export const registerNodes = (prefix, register, context) => {
  register(`${prefix}constant-boolean`, constantBoolean(context));
  register(`${prefix}not`, not(context));
};
