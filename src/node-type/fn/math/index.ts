import { BaseNodeClass } from "../../base-node";
import SumNode from "./sum";

export const registerNodes = (
  prefix: string,
  register: (key: string, nodeType: BaseNodeClass) => void
): void => {
  register(`${prefix}sum`, SumNode);
};
