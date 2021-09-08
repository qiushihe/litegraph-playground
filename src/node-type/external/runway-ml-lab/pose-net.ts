import BaseNode, { dataSocket, signalSocket } from "../../base-node";

import MLLabClient, { PoseEntry } from "./ml-lab-client";

const TITLE = "PoseNet";

class PoseNetNode extends BaseNode {
  static title = TITLE;

  constructor() {
    super(TITLE, {
      sockets: {
        input: [signalSocket("connect"), signalSocket("disconnect")],
        output: [dataSocket("connected"), dataSocket("poses")]
      },
      metadata: [
        ["client", new MLLabClient()],
        ["poses", []]
      ]
    });

    this.resizable = false;

    this.setupClient();
  }

  setupClient() {
    const client = this.getMeta<MLLabClient>("client");

    if (client) {
      client.addEventListener("posesUpdated", ({ poses }) => {
        this.setMeta("poses", poses);
      });
    }
  }

  onInputSignal(action: string, param: unknown): void {
    const client = this.getMeta<MLLabClient>("client");

    if (action === "connect") {
      if (client) {
        client.connect();
      }
    } else if (action === "disconnect") {
      if (client) {
        client.disconnect();
      }
    }
  }

  onExecute() {
    const client = this.getMeta<MLLabClient>("client");

    if (!client) {
      this.setOutputData(0, false);
    } else {
      this.setOutputData(0, client.isConnected());
    }

    const poses = this.getMetaOr<PoseEntry[][]>([], "poses");

    this.setOutputData(1, poses);
  }
}

export default PoseNetNode;
