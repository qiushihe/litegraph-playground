import array from "./array";
import value from "./value";

export const registerNodes = (prefix, register, context) => {
  register(`${prefix}array`, array(context));
  register(`${prefix}value`, value(context));
};
