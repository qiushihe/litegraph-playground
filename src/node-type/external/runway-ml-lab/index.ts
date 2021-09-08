import BaseNode from "../../base-node";
import PoseNetNode from "./pose-net";

export const registerNodes = (
  prefix: string,
  register: (key: string, nodeType: { new (): BaseNode }) => void
): void => {
  register(`${prefix}pose-net`, PoseNetNode);
};
