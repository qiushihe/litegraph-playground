import colourBlock from "./colour-block";
import console from "./console";
import consoleLog from "./console-log";

export const registerNodes = (prefix, register, context) => {
  register(`${prefix}colour-block`, colourBlock(context));
  register(`${prefix}console`, console(context));
  register(`${prefix}console-log`, consoleLog(context));
};
