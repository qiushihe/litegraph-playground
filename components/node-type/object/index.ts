import { BaseNodeClass } from "../base-node";
import ConstantObjectNode from "./constant-object";
import GetNode from "./get";
import KeysNode from "./keys";
import ParseNode from "./parse";
import SetNode from "./set";
import StringifyNode from "./stringify";
import ValuesNode from "./values";

export const registerNodes = (
  prefix: string,
  register: (key: string, nodeType: BaseNodeClass) => void
): void => {
  register(`${prefix}constant-object`, ConstantObjectNode);
  register(`${prefix}get`, GetNode);
  register(`${prefix}keys`, KeysNode);
  register(`${prefix}parse`, ParseNode);
  register(`${prefix}set`, SetNode);
  register(`${prefix}stringify`, StringifyNode);
  register(`${prefix}values`, ValuesNode);
};
