import { BaseNodeClass } from "../../base-node";
import FlowNode from "./flow";

export const registerNodes = (
  prefix: string,
  register: (key: string, nodeType: BaseNodeClass) => void
): void => {
  register(`${prefix}flow`, FlowNode);
};
