import ConstantValueNode from "./constant-value";
import ToStringNode from "./to-string";
import BaseNode from "../base-node";

export const registerNodes = (
  prefix: string,
  register: (key: string, nodeType: { new (): BaseNode }) => void
): void => {
  register(`${prefix}constant-value`, ConstantValueNode);
  register(`${prefix}to-string`, ToStringNode);
};
