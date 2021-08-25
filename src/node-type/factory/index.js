import { registerNodes as registerConstantNodes } from "./constant";

import array from "./array";

export const registerNodes = (prefix, register, context) => {
  registerConstantNodes(`${prefix}constant/`, register, context);

  register(`${prefix}array`, array(context));
};
