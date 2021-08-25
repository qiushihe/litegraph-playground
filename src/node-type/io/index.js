import consoleLog from "./console-log";

export const registerNodes = (prefix, register, context) => {
  register(`${prefix}console-log`, consoleLog(context));
};
