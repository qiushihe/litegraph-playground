import BaseNode from "../../base-node";
import FlowNode from "./flow";

export const registerNodes = (
  prefix: string,
  register: (key: string, nodeType: { new (): BaseNode }) => void
): void => {
  register(`${prefix}flow`, FlowNode);
};
