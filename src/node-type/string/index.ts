import { BaseNodeClass } from "../base-node";
import ConstantStringNode from "./constant-string";
import SplitNode from "./split";
import TemplateNode from "./template";

export const registerNodes = (
  prefix: string,
  register: (key: string, nodeType: BaseNodeClass) => void
): void => {
  register(`${prefix}constant-string`, ConstantStringNode);
  register(`${prefix}split`, SplitNode);
  register(`${prefix}template`, TemplateNode);
};
