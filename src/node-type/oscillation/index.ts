import BaseNode from "../base-node";
import BobbingSignalNode from "./bobbing-signal";

export const registerNodes = (
  prefix: string,
  register: (key: string, nodeType: { new (): BaseNode }) => void
): void => {
  register(`${prefix}bobbing-signal`, BobbingSignalNode);
};
