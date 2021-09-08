import { registerNodes as registerRunwayMLLabNodes } from "./runway-ml-lab";

import BaseNode from "../base-node";
import HttpRequestNode from "./http-request";
import ScriptEntryNode from "./script-entry";
import ScriptExitNode from "./script-exit";
import UrlHashParameterNode from "./url-hash-parameter";

export const registerNodes = (
  prefix: string,
  register: (key: string, nodeType: { new (): BaseNode }) => void
): void => {
  registerRunwayMLLabNodes(`${prefix}runway-ml-lab/`, register);

  register(`${prefix}http-request`, HttpRequestNode);
  register(`${prefix}script-entry`, ScriptEntryNode);
  register(`${prefix}script-exit`, ScriptExitNode);
  register(`${prefix}url-hash-parameter`, UrlHashParameterNode);
};
