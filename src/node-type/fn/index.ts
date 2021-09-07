import { registerNodes as registerCollectionNodes } from "./collection";
import { registerNodes as registerMathNodes } from "./math";

import BaseNode from "../base-node";
import InvokeFunctionNode from "./invoke-function";

export const registerNodes = (
  prefix: string,
  register: (key: string, nodeType: { new (): BaseNode }) => void
): void => {
  registerCollectionNodes(`${prefix}collection/`, register);
  registerMathNodes(`${prefix}math/`, register);

  register(`${prefix}invoke-function`, InvokeFunctionNode);
};
