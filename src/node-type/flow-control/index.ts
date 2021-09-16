import { BaseNodeClass } from "../base-node";
import BranchNode from "./branch";
import SequenceNode from "./sequence";

export const registerNodes = (
  prefix: string,
  register: (key: string, nodeType: BaseNodeClass) => void
): void => {
  register(`${prefix}branch`, BranchNode);
  register(`${prefix}sequence`, SequenceNode);
};
