import { registerNodes as registerArrayNodes } from "./array";
import { registerNodes as registerCollectionNodes } from "./collection";
import { registerNodes as registerMathNodes } from "./math";
import { registerNodes as registerMiscellaneousNodes } from "./miscellaneous";
import { registerNodes as registerObjectNodes } from "./object";

import BaseNode from "../base-node";
import EvaluateFunctionNode from "./evaluate-function";
import InvokeFunctionNode from "./invoke-function";

export const registerNodes = (
  prefix: string,
  register: (key: string, nodeType: { new (): BaseNode }) => void
): void => {
  registerArrayNodes(`${prefix}array/`, register);
  registerCollectionNodes(`${prefix}collection/`, register);
  registerMathNodes(`${prefix}math/`, register);
  registerMiscellaneousNodes(`${prefix}miscellaneous/`, register);
  registerObjectNodes(`${prefix}object/`, register);

  register(`${prefix}evaluate-function`, EvaluateFunctionNode);
  register(`${prefix}invoke-function`, InvokeFunctionNode);
};
