import BaseNode from "./base-node";
import { registerNodes as registerArrayNodes } from "./array";
import { registerNodes as registerBooleanNodes } from "./boolean";
import { registerNodes as registerCollectionNodes } from "./collection";
import { registerNodes as registerColourNodes } from "./colour";
import { registerNodes as registerExternalNodes } from "./external";
import { registerNodes as registerFlowControlNodes } from "./flow-control";
import { registerNodes as registerFnNodes } from "./fn";
import { registerNodes as registerMathNodes } from "./math";
import { registerNodes as registerMiscellaneousNodes } from "./miscellaneous";
import { registerNodes as registerNumberNodes } from "./number";
import { registerNodes as registerObjectNodes } from "./object";
import { registerNodes as registerOscillationNodes } from "./oscillation";
import { registerNodes as registerOutputNodes } from "./output";
import { registerNodes as registerStringNodes } from "./string";
import { registerNodes as registerUserInteractionNodes } from "./user-interaction";
import { registerNodes as registerValueNodes } from "./value";

export const registerNodes = (
  prefix: string,
  register: (key: string, nodeType: { new (): BaseNode }) => void
): void => {
  registerArrayNodes(`${prefix}array/`, register);
  registerBooleanNodes(`${prefix}boolean/`, register);
  registerCollectionNodes(`${prefix}collection/`, register);
  registerColourNodes(`${prefix}colour/`, register);
  registerExternalNodes(`${prefix}external/`, register);
  registerFlowControlNodes(`${prefix}flow-control/`, register);
  registerFnNodes(`${prefix}fn/`, register);
  registerMathNodes(`${prefix}math/`, register);
  registerMiscellaneousNodes(`${prefix}miscellaneous/`, register);
  registerNumberNodes(`${prefix}number/`, register);
  registerObjectNodes(`${prefix}object/`, register);
  registerOscillationNodes(`${prefix}oscillation/`, register);
  registerOutputNodes(`${prefix}output/`, register);
  registerStringNodes(`${prefix}string/`, register);
  registerUserInteractionNodes(`${prefix}user-interaction/`, register);
  registerValueNodes(`${prefix}value/`, register);
};
