import BaseNode from "../base-node";
import FindClosestNode from "./find-closest";
import HexToRGBNode from "./hex-to-rgb";

export const registerNodes = (
  prefix: string,
  register: (key: string, nodeType: { new (): BaseNode }) => void
): void => {
  register(`${prefix}find-closest`, FindClosestNode);
  register(`${prefix}hex-to-rgb`, HexToRGBNode);
};
