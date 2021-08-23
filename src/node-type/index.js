import collectionReduce from "./collection/reduce";

import constantArray from "./constant/array";
import constantValue from "./constant/value";

import mathSum from "./math/sum";

import utilButton from "./util/button";
import utilConsoleLog from "./util/console-log";
import utilInvokeFunction from "./util/invoke-function";
import utilPortal from "./util/portal";

import fnCollectionReduce from "./fn/collection/reduce";

import fnMathSum from "./fn/math/sum";

export const registerNodes = (registerNode, context) => {
  registerNode("_custom::collection/reduce", collectionReduce(context));

  registerNode("_custom::constant/array", constantArray(context));
  registerNode("_custom::constant/value", constantValue(context));

  registerNode("_custom::math/sum", mathSum(context));

  registerNode("_custom::util/button", utilButton(context));
  registerNode("_custom::util/console-log", utilConsoleLog(context));
  registerNode("_custom::util/invoke-function", utilInvokeFunction(context));
  registerNode("_custom::util/portal", utilPortal(context));

  registerNode("_custom::fn/collection/reduce", fnCollectionReduce(context));

  registerNode("_custom::fn/math/sum", fnMathSum(context));
};
