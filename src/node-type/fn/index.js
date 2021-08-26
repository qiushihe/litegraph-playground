import { registerNodes as registerCollectionNodes } from "./collection";
import { registerNodes as registerMathNodes } from "./math";

import invokeFunction from "./invoke-function";

export const registerNodes = (prefix, register, context) => {
  registerCollectionNodes(`${prefix}collection/`, register, context);
  registerMathNodes(`${prefix}math/`, register, context);

  register(`${prefix}invoke-function`, invokeFunction(context));
};
