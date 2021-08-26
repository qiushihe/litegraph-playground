import portal from "./portal";
import variableGet from "./variable-get";
import variableSet from "./variable-set";

export const registerNodes = (prefix, register, context) => {
  register(`${prefix}portal`, portal(context));
  register(`${prefix}variableGet`, variableGet(context));
  register(`${prefix}variableSet`, variableSet(context));
};
