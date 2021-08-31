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
        const matchResult =
          `${this.getInputData(0)}`.match(HEX_TO_RGB_REGEXP) || [];

        this.setOutputData(0, [
          parseInt(matchResult[1], 16),
          parseInt(matchResult[2], 16),
          parseInt(matchResult[3], 16)
        ]);
      }
    };
  }

  return nodeType.defaultClass;
};

export default defineNodeType;
