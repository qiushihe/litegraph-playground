const nodeType = {
  title: "Reduce",
  defaultClass: null
};

const defineNodeType = ({ LGraphNode, LiteGraph }) => {
  if (nodeType.defaultClass === null) {
    nodeType.defaultClass = class extends LGraphNode {
      static title = nodeType.title;

      constructor() {
        super(nodeType.title);

        this.addInput("start", LiteGraph.ACTION);
        this.addInput("array", "");
        this.addInput("initial", "");
        this.addInput("iterate", LiteGraph.ACTION);
        this.addInput("accumulator", "");

        this.addOutput("iterator", LiteGraph.EVENT);
        this.addOutput("accumulated", "");
        this.addOutput("element", "");
        this.addOutput("done", LiteGraph.EVENT);
        this.addOutput("final", "");

        this.resizable = false;

        this.index = 0;
        this.accumulator = null;

        this.tasks = [];
      }

      getInputArray() {
        return this.getInputData(1) || [];
      }

      onAction(action) {
        if (action === "start") {
          this.index = 0;
          this.accumulator = this.getInputData(2);

          if (this.getInputArray().length <= 0) {
            this.tasks.push("output-final");
          } else {
            this.tasks.push("output-iterator");
          }
        } else if (action === "iterate") {
          this.accumulator = this.getInputData(4);
          this.index = this.index + 1;

          if (this.index <= this.getInputArray().length - 1) {
            this.tasks.push("output-iterator");
          } else {
            this.tasks.push("output-final");
          }
        }
      }

      onExecute() {
        if (this.tasks.length > 0) {
          const task = this.tasks.shift();

          if (task === "output-iterator") {
            this.setOutputData(1, this.accumulator);
            this.setOutputData(2, this.getInputArray()[this.index]);
            this.triggerSlot(0, "");
          } else if (task === "output-final") {
            this.setOutputData(4, this.accumulator);
            this.triggerSlot(3, "");
          }
        }
      }
    };
  }

  return nodeType.defaultClass;
};

export default defineNodeType;
