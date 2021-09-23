import { BaseNodeClass } from "../../base-node";
import HeadNode from "./head";

export const registerNodes = (
  prefix: string,
  register: (key: string, nodeType: BaseNodeClass) => void
): void => {
  register(`${prefix}head`, HeadNode);
};
