import flow from "lodash/fp/flow";
import replace from "lodash/fp/replace";
import map from "lodash/fp/map";
import split from "lodash/fp/split";
import find from "lodash/fp/find";
import first from "lodash/fp/first";
import eq from "lodash/fp/eq";
import get from "lodash/fp/get";

const nodeType = {
  title: "URLHashParameter",
  defaultClass: null
};

const getHashString = () => {
  try {
    return new URL(window.location.href).hash;
  } catch {
    return null;
  }
};

const getParamValue = (name) => {
  return flow([
    replace(/^#/, ""),
    split("&"),
    map(split("=")),
    find(flow([first, eq(name)])),
    get(1)
  ])(getHashString());
};

const defineNodeType = ({ LGraphNode }) => {
  if (nodeType.defaultClass === null) {
    nodeType.defaultClass = class extends LGraphNode {
      static title = nodeType.title;

      constructor() {
        super(nodeType.title);

        this.addInput("name", "");
        this.addOutput("value", "");

        this.size = [170, 26];
        this.resizable = false;
      }

      onExecute() {
        this.setOutputData(0, getParamValue(this.getInputData(0)));
      }
    };
  }

  return nodeType.defaultClass;
};

export default defineNodeType;
