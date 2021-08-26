import { v4 as uuidv4 } from "uuid";

const nodeType = {
  title: "Portal",
  defaultClass: null
};

const defineNodeType = ({ LGraphNode, LiteGraph }) => {
  if (nodeType.defaultClass === null) {
    nodeType.defaultClass = class extends LGraphNode {
      static title = nodeType.title;

      static portals = {};

      constructor() {
        super(nodeType.title);

        this.addInput("action", LiteGraph.ACTION);
        this.addOutput("event", LiteGraph.EVENT);

        this.properties = { name: "my-event" };

        this.uuid = uuidv4();
        this.tasks = [];
      }

      // Called by other instance of this node type.
      replicateSignal(param) {
        this.tasks.push({ name: "replicate-signal", param });
      }

      onAdded() {
        nodeType.defaultClass.portals[this.uuid] = this;
      }

      onRemoved() {
        delete nodeType.defaultClass.portals[this.uuid];
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
            Object.values(nodeType.defaultClass.portals)
              .filter((portal) => {
                return (
                  portal.uuid !== this.uuid &&
                  portal.properties.name === this.properties.name
                );
              })
              .forEach((portal) => {
                portal.replicateSignal(task.param);
              });

            this.triggerSlot(0, task.param);
          } else if (task.name === "replicate-signal") {
            this.triggerSlot(0, task.param);
          }
        }
      }
    };
  }

  return nodeType.defaultClass;
};

export default defineNodeType;
