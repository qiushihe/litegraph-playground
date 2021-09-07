import BaseNode from "../../base-node";
import SumNode from "./sum";

export const registerNodes = (
  prefix: string,
  register: (key: string, nodeType: { new (): BaseNode }) => void
): void => {
  register(`${prefix}sum`, SumNode);
};
