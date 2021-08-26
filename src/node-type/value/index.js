import constantValue from "./constant-value";
import toString from "./to-string";

export const registerNodes = (prefix, register, context) => {
  register(`${prefix}constant-value`, constantValue(context));
  register(`${prefix}to-string`, toString(context));
};
