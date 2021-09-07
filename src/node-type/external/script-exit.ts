import BaseNode, { dataSocket, signalSocket } from "../base-node";

const TITLE = "ScriptExit";

type Listener = (data: unknown) => void;

class ScriptExitNode extends BaseNode {
  static title = TITLE;

  constructor() {
    super(TITLE, {
      sockets: {
        input: [signalSocket("action"), dataSocket("data")]
      },
      metadata: [["listeners", []]]
    });

    this.properties = { name: "my-exit" };
    this.resizable = false;
  }

  // Called externally by graph runner.
  addListener(listener: Listener): void {
    this.setMeta("listeners", [
      ...this.getMetaOr<Listener[]>([], "listeners"),
      listener
    ]);
  }

  // Called externally by graph runner.
  fireEvent(param: unknown): void {
    this.enqueueTask("fire-event", param);
  }

  onExecute() {
    const [taskName] = this.getNextTask();

    if (taskName === "action::action" || taskName === "fire-event") {
      this.getMetaOr<Listener[]>([], "listeners").forEach((listener) => {
        listener(this.getInputData(1));
      });
    }
  }
}

export default ScriptExitNode;
