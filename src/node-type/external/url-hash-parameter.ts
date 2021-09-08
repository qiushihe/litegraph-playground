import flow from "lodash/fp/flow";
import replace from "lodash/fp/replace";
import map from "lodash/fp/map";
import split from "lodash/fp/split";
import find from "lodash/fp/find";
import first from "lodash/fp/first";
import eq from "lodash/fp/eq";
import get from "lodash/fp/get";

import BaseNode, { dataSocket } from "../base-node";

const TITLE = "URLHashParameter";

const getHashString = () => {
  try {
    return new URL(window.location.href).hash;
  } catch {
    return null;
  }
};

const getParamValue = (name: string): string => {
  return flow([
    replace(/^#/, ""),
    split("&"),
    map(split("=")),
    find(flow([first, eq(name)])),
    get(1)
  ])(getHashString());
};

class URLHashParameterNode extends BaseNode {
  static title = TITLE;

  constructor() {
    super(TITLE, {
      sockets: {
        input: [dataSocket("name")],
        output: [dataSocket("value")]
      }
    });

    this.size = [170, 26];
    this.resizable = false;
  }

  onExecute() {
    this.setOutputData(0, getParamValue(this.getInputDataOr<string>("", 0)));
  }
}

export default URLHashParameterNode;
