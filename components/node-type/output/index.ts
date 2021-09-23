import { BaseNodeClass } from "../base-node";
import ColourBlockNode from "./colour-block";
import ConsoleNode from "./console";
import ConsoleLogNode from "./console-log";
import ImageNode from "./image";
import TableNode from "./table";
import TextNode from "./text";

export const registerNodes = (
  prefix: string,
  register: (key: string, nodeType: BaseNodeClass) => void
): void => {
  register(`${prefix}colour-block`, ColourBlockNode);
  register(`${prefix}console`, ConsoleNode);
  register(`${prefix}console-log`, ConsoleLogNode);
  register(`${prefix}image`, ImageNode);
  register(`${prefix}table`, TableNode);
  register(`${prefix}text`, TextNode);
};
