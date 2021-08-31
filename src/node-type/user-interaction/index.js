import button from "./button";
import label from "./label";
import rgbSlider from "./rgb-slider";

export const registerNodes = (prefix, register, context) => {
  register(`${prefix}button`, button(context));
  register(`${prefix}label`, label(context));
  register(`${prefix}rgb-slider`, rgbSlider(context));
};
