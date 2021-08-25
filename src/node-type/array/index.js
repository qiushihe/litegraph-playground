import join from "./join";
import reverse from "./reverse";

export const registerNodes = (prefix, register, context) => {
  register(`${prefix}join`, join(context));
  register(`${prefix}reverse`, reverse(context));
};
