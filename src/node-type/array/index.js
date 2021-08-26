import constantArray from "./constant-array";
import join from "./join";
import makeArray from "./make-array";
import reverse from "./reverse";

export const registerNodes = (prefix, register, context) => {
  register(`${prefix}constant-array`, constantArray(context));
  register(`${prefix}join`, join(context));
  register(`${prefix}make-array`, makeArray(context));
  register(`${prefix}reverse`, reverse(context));
};
