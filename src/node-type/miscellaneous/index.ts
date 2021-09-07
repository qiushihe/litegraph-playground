import PortalNode from "./portal";
import VariableGetNode from "./variable-get";
import VariableSetNode from "./variable-set";
import BaseNode from "../base-node";

export const registerNodes = (
  prefix: string,
  register: (key: string, nodeType: { new (): BaseNode }) => void
): void => {
  register(`${prefix}portal`, PortalNode);
  register(`${prefix}variableGet`, VariableGetNode);
  register(`${prefix}variableSet`, VariableSetNode);
};
