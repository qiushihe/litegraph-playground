import get from "./get";
import set from "./set";

export const registerNodes = (prefix, register, context) => {
  register(`${prefix}get`, get(context));
  register(`${prefix}set`, set(context));
};
