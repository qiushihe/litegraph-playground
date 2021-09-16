import { BaseNodeClass } from "../base-node";
import ReduceNode from "./reduce";
import SizeNode from "./size";

export const registerNodes = (
  prefix: string,
  register: (key: string, nodeType: BaseNodeClass) => void
): void => {
  register(`${prefix}reduce`, ReduceNode);
  register(`${prefix}size`, SizeNode);
};
