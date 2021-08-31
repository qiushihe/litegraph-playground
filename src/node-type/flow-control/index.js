import branch from "./branch";
import sequence from "./sequence";

export const registerNodes = (prefix, register, context) => {
  register(`${prefix}branch`, branch(context));
  register(`${prefix}sequence`, sequence(context));
};
