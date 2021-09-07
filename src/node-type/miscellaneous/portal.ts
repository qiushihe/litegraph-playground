import { v4 as uuidv4 } from "uuid";

import BaseNode, { signalSocket } from "../base-node";

const TITLE = "Portal";

class PortalNode extends BaseNode {
  static title = TITLE;

  static portals: Record<string, PortalNode> = {};

  constructor() {
    super(TITLE, {
      sockets: {
        input: [signalSocket("action")],
        output: [signalSocket("event")]
      },
      metadata: [["uuid", uuidv4()]]
    });

    this.properties = { name: "my-event" };
    this.resizable = false;
  }

  // Called by other instance of this node type.
  replicateSignal(param: unknown): void {
    this.enqueueTask("replicate-signal", param);
  }

  getUUID(): string {
    return this.getMetaOr<string>("", "uuid");
  }

  onAdded() {
    PortalNode.portals[this.getUUID()] = this;
  }

  onRemoved() {
    delete PortalNode.portals[this.getUUID()];
  }

  onExecute() {
    const [taskName, taskParam] = this.getNextTask();

    if (taskName === "action::action") {
      Object.values(PortalNode.portals)
        .filter((portal) => {
          return (
            portal.getUUID() !== this.getUUID() &&
            portal.properties.name === this.properties.name
          );
        })
        .forEach((portal) => {
          portal.replicateSignal(taskParam);
        });

      this.triggerSlot(0, taskParam);
    } else if (taskName === "replicate-signal") {
      this.triggerSlot(0, taskParam);
    }
  }
}

export default PortalNode;
