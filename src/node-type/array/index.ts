import { BaseNodeClass } from "../base-node";
import ConstantArrayNode from "./constant-array";
import JoinNode from "./join";
import MakeArrayNode from "./make-array";
import ReverseNode from "./reverse";

export const registerNodes = (
  prefix: string,
  register: (key: string, nodeType: BaseNodeClass) => void
): void => {
  register(`${prefix}constant-array`, ConstantArrayNode);
  register(`${prefix}join`, JoinNode);
  register(`${prefix}make-array`, MakeArrayNode);
  register(`${prefix}reverse`, ReverseNode);
};
