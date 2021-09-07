import BaseNode from "../base-node";
import HttpRequestNode from "./http-request";
import ScriptEntryNode from "./script-entry";
import ScriptExitNode from "./script-exit";

export const registerNodes = (
  prefix: string,
  register: (key: string, nodeType: { new (): BaseNode }) => void
): void => {
  register(`${prefix}http-request`, HttpRequestNode);
  register(`${prefix}script-entry`, ScriptEntryNode);
  register(`${prefix}script-exit`, ScriptExitNode);
};
