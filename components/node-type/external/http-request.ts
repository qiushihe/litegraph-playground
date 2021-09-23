import BaseNode, { dataSocket, signalSocket } from "../base-node";

const TITLE = "HTTPRequest";

class HTTPRequestNode extends BaseNode {
  static title = TITLE;

  constructor() {
    super(TITLE, {
      sockets: {
        input: [
          signalSocket("action"),
          dataSocket("url"),
          dataSocket("method")
        ],
        output: [
          signalSocket("success"),
          dataSocket("data"),
          signalSocket("failure"),
          dataSocket("error")
        ]
      }
    });

    this.resizable = false;
    this.size = [150, 90];
  }

  onExecute() {
    const [taskName, taskParam] = this.getNextTask();

    if (taskName === "action::action") {
      const url = this.getInputDataOr<string>("", 1);
      const method = this.getInputDataOr<string>("", 2) || "get";

      fetch(url, { method })
        .then((res) => res.text())
        .then((responseText) => {
          this.setOutputData(1, responseText);
          this.triggerSlot(0, taskParam);
        })
        .catch((err) => {
          this.setOutputData(3, err);
          this.triggerSlot(2, taskParam);
        });
    }
  }
}

export default HTTPRequestNode;
