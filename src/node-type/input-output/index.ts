import BaseNode from "../base-node";
import ColourBlockNode from "./colour-block";
import ConsoleNode from "./console";
import ConsoleLogNode from "./console-log";
import ImageNode from "./image";
import UrlHashParameterNode from "./url-hash-parameter";

export const registerNodes = (
  prefix: string,
  register: (key: string, nodeType: { new (): BaseNode }) => void
): void => {
  register(`${prefix}colour-block`, ColourBlockNode);
  register(`${prefix}console`, ConsoleNode);
  register(`${prefix}console-log`, ConsoleLogNode);
  register(`${prefix}image`, ImageNode);
  register(`${prefix}url-hash-parameter`, UrlHashParameterNode);
};
