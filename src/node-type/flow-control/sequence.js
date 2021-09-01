import times from "lodash/fp/times";

const nodeType = {
  title: "Sequence",
  defaultClass: null
};

const OUTPUTS_COUNT = 5;

const defineNodeType = ({ LGraphNode, LiteGraph }) => {
  if (nodeType.defaultClass === null) {
    nodeType.defaultClass = class extends LGraphNode {
      static title = nodeType.title;

      constructor() {
        super(nodeType.title);

        this.addInput("action", LiteGraph.ACTION);

        times(() => {
          this.addOutput("", LiteGraph.EVENT);
        })(OUTPUTS_COUNT);

        this.resizable = false;

        this.tasks = [];
      }

      onAction(action, param) {
        if (action === "action") {
          this.tasks.push({ name: "send-signal", param });
        }
      }

      onExecute() {
        if (this.tasks.length > 0) {
          const task = this.tasks.shift();

          if (task.name === "send-signal") {
            times((index) => {
              if (this.isOutputConnected(index)) {
                this.triggerSlot(index, task.param);
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
