import button from "./button";
import rgbSlider from "./rgb-slider";

export const registerNodes = (prefix, register, context) => {
  register(`${prefix}button`, button(context));
  register(`${prefix}rgb-slider`, rgbSlider(context));
};
