import { BaseNodeClass } from "../../base-node";
import PoseNetNode from "./pose-net";

export const registerNodes = (
  prefix: string,
  register: (key: string, nodeType: BaseNodeClass) => void
): void => {
  register(`${prefix}pose-net`, PoseNetNode);
};
