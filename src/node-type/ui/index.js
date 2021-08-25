import button from "./button";

export const registerNodes = (prefix, register, context) => {
  register(`${prefix}button`, button(context));
};
