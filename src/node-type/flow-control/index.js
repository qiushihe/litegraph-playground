import sequence from "./sequence";

export const registerNodes = (prefix, register, context) => {
  register(`${prefix}sequence`, sequence(context));
};
