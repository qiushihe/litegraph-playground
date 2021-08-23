import { LGraphNode, LiteGraph } from "litegraph.js/build/litegraph.min";
import { v4 as uuidv4 } from "uuid";

class Portal extends LGraphNode {
  static title = "Portal";

  static portals = {};

  constructor() {
    super(Portal.title);

    this.addInput("action", LiteGraph.ACTION);
    this.addOutput("event", LiteGraph.EVENT);

    this.properties = { name: "myevent" };

    this.uuid = uuidv4();
    this.tasks = [];
  }

  replicateSignal(param) {
    this.tasks.push({ name: "replicate-signal", param });
  }

  onAdded() {
    Portal.portals[this.uuid] = this;
  }

  onRemoved() {
    delete Portal.portals[this.uuid];
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
        Object.values(Portal.portals)
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
}

export default Portal;
