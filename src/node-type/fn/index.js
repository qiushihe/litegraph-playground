import { registerNodes as registerCollectionNodes } from "./collection";
import { registerNodes as registerMathNodes } from "./math";

export const registerNodes = (prefix, register, context) => {
  registerCollectionNodes(`${prefix}collection/`, register, context);
  registerMathNodes(`${prefix}math/`, register, context);
};
