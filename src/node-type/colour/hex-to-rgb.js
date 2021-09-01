import flow from "lodash/fp/flow";
import trim from "lodash/fp/trim";
import toLower from "lodash/fp/toLower";

const nodeType = {
  title: "HexToRGB",
  defaultClass: null
};

const HEX_TO_RGB_REGEXP = new RegExp(
  "^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$"
);

const defineNodeType = ({ LGraphNode }) => {
  if (nodeType.defaultClass === null) {
    nodeType.defaultClass = class extends LGraphNode {
      static title = nodeType.title;

      constructor() {
        super(nodeType.title);

        this.addInput("hex", "");
        this.addOutput("int[]", "");

        this.resizable = false;
      }

      onExecute() {
        const colourString = flow([trim, toLower])(this.getInputData(0));

        const colourMatches = colourString.match(HEX_TO_RGB_REGEXP) || [];

        this.setOutputData(0, [
          parseInt(colourMatches[1], 16),
          parseInt(colourMatches[2], 16),
          parseInt(colourMatches[3], 16)
        ]);
      }
    };
  }

  return nodeType.defaultClass;
};

export default defineNodeType;
