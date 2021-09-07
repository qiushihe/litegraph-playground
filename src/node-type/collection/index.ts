import BaseNode from "../base-node";
import ReduceNode from "./reduce";
import SizeNode from "./size";

export const registerNodes = (
  prefix: string,
  register: (key: string, nodeType: { new (): BaseNode }) => void
): void => {
  register(`${prefix}reduce`, ReduceNode);
  register(`${prefix}size`, SizeNode);
};
