import BaseNode from "../../base-node";
import EqualNode from "./equal";
import GetNode from "./get";

export const registerNodes = (
  prefix: string,
  register: (key: string, nodeType: { new (): BaseNode }) => void
): void => {
  register(`${prefix}equal`, EqualNode);
  register(`${prefix}get`, GetNode);
};
