import { BaseNodeClass } from "../base-node";
import DivideNode from "./divide";
import ExponentNode from "./exponent";
import LessThanNode from "./less-than";
import SquareRootNode from "./square-root";
import SubtractNode from "./subtract";
import SumNode from "./sum";

export const registerNodes = (
  prefix: string,
  register: (key: string, nodeType: BaseNodeClass) => void
): void => {
  register(`${prefix}divide`, DivideNode);
  register(`${prefix}exponent`, ExponentNode);
  register(`${prefix}less-than`, LessThanNode);
  register(`${prefix}square-root`, SquareRootNode);
  register(`${prefix}subtract`, SubtractNode);
  register(`${prefix}sum`, SumNode);
};
