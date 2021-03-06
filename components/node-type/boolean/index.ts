import { BaseNodeClass } from "../base-node";
import ConstantBooleanNode from "./constant-boolean";
import NotNode from "./not";

export const registerNodes = (
  prefix: string,
  register: (key: string, nodeType: BaseNodeClass) => void
): void => {
  register(`${prefix}constant-boolean`, ConstantBooleanNode);
  register(`${prefix}not`, NotNode);
};
