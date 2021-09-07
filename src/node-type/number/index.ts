import BaseNode from "../base-node";
import ClampNode from "./clamp";
import ConstantNumberNode from "./constant-number";
import RandomNode from "./random";

export const registerNodes = (
  prefix: string,
  register: (key: string, nodeType: { new (): BaseNode }) => void
): void => {
  register(`${prefix}clamp`, ClampNode);
  register(`${prefix}constant-number`, ConstantNumberNode);
  register(`${prefix}random`, RandomNode);
};
