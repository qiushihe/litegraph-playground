import BaseNode from "../base-node";
import GetNode from "./get";
import KeysNode from "./keys";
import ParseNode from "./parse";
import SetNode from "./set";
import StringifyNode from "./stringify";
import ValuesNode from "./values";

export const registerNodes = (
  prefix: string,
  register: (key: string, nodeType: { new (): BaseNode }) => void
): void => {
  register(`${prefix}get`, GetNode);
  register(`${prefix}keys`, KeysNode);
  register(`${prefix}parse`, ParseNode);
  register(`${prefix}set`, SetNode);
  register(`${prefix}stringify`, StringifyNode);
  register(`${prefix}values`, ValuesNode);
};
