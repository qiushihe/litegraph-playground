import { BaseNodeClass } from "../base-node";
import ButtonNode from "./button";
import LabelNode from "./label";
import RgbSliderNode from "./rgb-slider";

export const registerNodes = (
  prefix: string,
  register: (key: string, nodeType: BaseNodeClass) => void
): void => {
  register(`${prefix}button`, ButtonNode);
  register(`${prefix}label`, LabelNode);
  register(`${prefix}rgb-slider`, RgbSliderNode);
};
