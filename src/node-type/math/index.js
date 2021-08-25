import sum from "./sum";

export const registerNodes = (prefix, register, context) => {
  register(`${prefix}sum`, sum(context));
};
