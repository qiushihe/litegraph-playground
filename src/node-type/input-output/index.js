import colourBlock from "./colour-block";
import console from "./console";
import consoleLog from "./console-log";
import urlHashParameter from "./url-hash-parameter";

export const registerNodes = (prefix, register, context) => {
  register(`${prefix}colour-block`, colourBlock(context));
  register(`${prefix}console`, console(context));
  register(`${prefix}console-log`, consoleLog(context));
  register(`${prefix}url-hash-parameter`, urlHashParameter(context));
};
