import { BaseNodeClass } from "../base-node";
import PortalNode from "./portal";
import VariableGetNode from "./variable-get";
import VariableSetNode from "./variable-set";

export const registerNodes = (
  prefix: string,
  register: (key: string, nodeType: BaseNodeClass) => void
): void => {
  register(`${prefix}portal`, PortalNode);
  register(`${prefix}variableGet`, VariableGetNode);
  register(`${prefix}variableSet`, VariableSetNode);
};
