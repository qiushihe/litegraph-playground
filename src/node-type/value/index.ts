import { BaseNodeClass } from "../base-node";
import ConstantValueNode from "./constant-value";
import ToStringNode from "./to-string";

export const registerNodes = (
  prefix: string,
  register: (key: string, nodeType: BaseNodeClass) => void
): void => {
  register(`${prefix}constant-value`, ConstantValueNode);
  register(`${prefix}to-string`, ToStringNode);
};
