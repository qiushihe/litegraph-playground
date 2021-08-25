import { registerNodes as registerArrayNodes } from "./array";
import { registerNodes as registerCollectionNodes } from "./collection";
import { registerNodes as registerFactoryNodes } from "./factory";
import { registerNodes as registerFlowControlNodes } from "./flow-control";
import { registerNodes as registerFnNodes } from "./fn";
import { registerNodes as registerIONodes } from "./io";
import { registerNodes as registerMathNodes } from "./math";
import { registerNodes as registerMiscNodes } from "./misc";
import { registerNodes as registerObjectNodes } from "./object";
import { registerNodes as registerProcessNodes } from "./process";
import { registerNodes as registerUINodes } from "./ui";

export const registerNodes = (prefix, register, context) => {
  registerArrayNodes(`${prefix}array/`, register, context);
  registerCollectionNodes(`${prefix}collection/`, register, context);
  registerFactoryNodes(`${prefix}factory/`, register, context);
  registerFlowControlNodes(`${prefix}flow-control/`, register, context);
  registerFnNodes(`${prefix}fn/`, register, context);
  registerIONodes(`${prefix}io/`, register, context);
  registerMathNodes(`${prefix}math/`, register, context);
  registerMiscNodes(`${prefix}misc/`, register, context);
  registerObjectNodes(`${prefix}object/`, register, context);
  registerProcessNodes(`${prefix}process/`, register, context);
  registerUINodes(`${prefix}ui/`, register, context);
};
