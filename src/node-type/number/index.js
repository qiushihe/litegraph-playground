import clamp from "./clamp";
import constantNumber from "./constant-number";
import random from "./random";

export const registerNodes = (prefix, register, context) => {
  register(`${prefix}clamp`, clamp(context));
  register(`${prefix}constant-number`, constantNumber(context));
  register(`${prefix}random`, random(context));
};
