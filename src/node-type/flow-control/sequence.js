import times from "lodash/fp/times";

const nodeType = {
  title: "Sequence",
  defaultClass: null
};

const OUTPUTS_COUNT = 3;

const defineNodeType = ({ LGraphNode, LiteGraph }) => {
  if (nodeType.defaultClass === null) {
    nodeType.defaultClass = class extends LGraphNode {
      static title = nodeType.title;

      constructor() {
        super(nodeType.title);

        this.addInput("action", LiteGraph.ACTION);
        this.addInput("input", "");

        times(() => {
          this.addOutput("event", LiteGraph.EVENT);
          this.addOutput("output", "");
        })(OUTPUTS_COUNT);

        this.tasks = [];
      }

      sendSignal(param) {
        this.tasks.push({ name: "send-signal", param });
      }

      onAction(action, param) {
        if (action === "action") {
          this.sendSignal(param);
        }
      }

      onExecute() {
        if (this.tasks.length > 0) {
          const task = this.tasks.shift();

          if (task.name === "send-signal") {
            times((index) => {
              if (this.isOutputConnected(index * 2)) {
                this.triggerSlot(index * 2, task.param);
              }
              if (this.isOutputConnected(index * 2 + 1)) {
                this.setOutputData(index * 2 + 1, this.getInputData(1));
              }
            })(OUTPUTS_COUNT);
          }
        }
      }
    };
  }

  return nodeType.defaultClass;
};

export default defineNodeType;
