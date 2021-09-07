import BaseNode from "../base-node";
import BranchNode from "./branch";
import SequenceNode from "./sequence";

export const registerNodes = (
  prefix: string,
  register: (key: string, nodeType: { new (): BaseNode }) => void
): void => {
  register(`${prefix}branch`, BranchNode);
  register(`${prefix}sequence`, SequenceNode);
};
