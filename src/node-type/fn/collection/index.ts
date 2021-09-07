import BaseNode from "../../base-node";
import ReduceNode from "./reduce";

export const registerNodes = (
  prefix: string,
  register: (key: string, nodeType: { new (): BaseNode }) => void
): void => {
  register(`${prefix}reduce`, ReduceNode);
};
