import entry from "./entry";
import exit from "./exit";

export const registerNodes = (prefix, register, context) => {
  register(`${prefix}entry`, entry(context));
  register(`${prefix}exit`, exit(context));
};
