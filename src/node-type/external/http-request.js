const nodeType = {
  title: "HTTPRequest",
  defaultClass: null
};

const defineNodeType = ({ LGraphNode, LiteGraph }) => {
  if (nodeType.defaultClass === null) {
    nodeType.defaultClass = class extends LGraphNode {
      static title = nodeType.title;

      constructor() {
        super(nodeType.title);

        this.addInput("action", LiteGraph.ACTION);
        this.addInput("url", "");
        this.addInput("method", "");

        this.addOutput("success", LiteGraph.EVENT);
        this.addOutput("data", "");
        this.addOutput("failure", LiteGraph.EVENT);
        this.addOutput("error", "");

        this.resizable = false;
        this.size = [150, 90];

        this.tasks = [];
      }

      onAction(action, param) {
        if (action === "action") {
          this.tasks.push({ name: "make-request", param });
        }
      }

      onExecute() {
        if (this.tasks.length > 0) {
          const task = this.tasks.shift();

          if (task.name === "make-request") {
            const url = this.getInputData(1);
            const method = this.getInputData(2) || "get";

            fetch(url, { method })
              .then((res) => res.text())
              .then((responseText) => {
                this.setOutputData(1, responseText);
                this.triggerSlot(0, task.param);
              })
              .catch((err) => {
                this.setOutputData(3, err);
                this.triggerSlot(2, task.param);
              });
          }
        }
      }
    };
  }

  return nodeType.defaultClass;
};

export default defineNodeType;
