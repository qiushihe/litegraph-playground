import scriptEntry from "./script-entry";
import scriptExit from "./script-exit";

export const registerNodes = (prefix, register, context) => {
  register(`${prefix}script-entry`, scriptEntry(context));
  register(`${prefix}script-exit`, scriptExit(context));
};
