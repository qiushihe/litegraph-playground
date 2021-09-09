import BaseNode from "../../base-node";
import HeadNode from "./head";

export const registerNodes = (
  prefix: string,
  register: (key: string, nodeType: { new (): BaseNode }) => void
): void => {
  register(`${prefix}head`, HeadNode);
};
