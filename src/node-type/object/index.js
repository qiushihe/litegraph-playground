import get from "./get";
import keys from "./keys";
import parse from "./parse";
import set from "./set";
import stringify from "./stringify";
import values from "./values";

export const registerNodes = (prefix, register, context) => {
  register(`${prefix}get`, get(context));
  register(`${prefix}keys`, keys(context));
  register(`${prefix}parse`, parse(context));
  register(`${prefix}set`, set(context));
  register(`${prefix}stringify`, stringify(context));
  register(`${prefix}values`, values(context));
};
