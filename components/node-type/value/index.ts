import { BaseNodeClass } from "../base-node";
import ToStringNode from "./to-string";

export const registerNodes = (
  prefix: string,
  register: (key: string, nodeType: BaseNodeClass) => void
): void => {
  register(`${prefix}to-string`, ToStringNode);
};
