import { BaseNodeClass } from "../../base-node";
import EqualNode from "./equal";
import GetNode from "./get";

export const registerNodes = (
  prefix: string,
  register: (key: string, nodeType: BaseNodeClass) => void
): void => {
  register(`${prefix}equal`, EqualNode);
  register(`${prefix}get`, GetNode);
};
