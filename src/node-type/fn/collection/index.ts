import { BaseNodeClass } from "../../base-node";
import FindNode from "./find";
import ReduceNode from "./reduce";

export const registerNodes = (
  prefix: string,
  register: (key: string, nodeType: BaseNodeClass) => void
): void => {
  register(`${prefix}find`, FindNode);
  register(`${prefix}reduce`, ReduceNode);
};
