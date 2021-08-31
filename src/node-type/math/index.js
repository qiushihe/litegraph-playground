import divide from "./divide";
import exponent from "./exponent";
import lessThan from "./less-than";
import squareRoot from "./square-root";
import subtract from "./subtract";
import sum from "./sum";

export const registerNodes = (prefix, register, context) => {
  register(`${prefix}divide`, divide(context));
  register(`${prefix}exponent`, exponent(context));
  register(`${prefix}less-than`, lessThan(context));
  register(`${prefix}square-root`, squareRoot(context));
  register(`${prefix}subtract`, subtract(context));
  register(`${prefix}sum`, sum(context));
};
