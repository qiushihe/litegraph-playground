import invokeFunction from "./invoke-function";
import portal from "./portal";
import variable from "./variable";

export const registerNodes = (prefix, register, context) => {
  register(`${prefix}invoke-function`, invokeFunction(context));
  register(`${prefix}portal`, portal(context));
  register(`${prefix}variable`, variable(context));
};
