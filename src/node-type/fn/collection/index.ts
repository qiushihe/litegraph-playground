import BaseNode from "../../base-node";
import FindNode from "./find";
import ReduceNode from "./reduce";

export const registerNodes = (
  prefix: string,
  register: (key: string, nodeType: { new (): BaseNode }) => void
): void => {
  register(`${prefix}find`, FindNode);
  register(`${prefix}reduce`, ReduceNode);
};
