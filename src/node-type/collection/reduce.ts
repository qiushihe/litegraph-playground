import BaseNode, { dataSocket, signalSocket } from "../base-node";

const TITLE = "Reduce";

class ReduceNode extends BaseNode {
  static title = TITLE;

  constructor() {
    super(TITLE, {
      sockets: {
        input: [
          signalSocket("start"),
          dataSocket("input"),
          dataSocket("initial"),
          signalSocket("iterate"),
          dataSocket("accumulator")
        ],
        output: [
          signalSocket("iterator"),
          dataSocket("accumulated"),
          dataSocket("element"),
          signalSocket("done"),
          dataSocket("final")
        ]
      },
      metadata: [
        ["index", 0],
        ["accumulator", null]
      ]
    });

    this.resizable = false;
  }

  onExecute() {
    const inputCollection = this.getInputDataOr([], 1);

    const [taskName] = this.getNextTask();

    if (taskName === "action::start") {
      this.setMeta("index", 0);
      this.setMeta("accumulator", this.getInputData(2));

      if (inputCollection.length <= 0) {
        this.enqueueTask("output-final");
      } else {
        this.enqueueTask("output-iterator");
      }
    } else if (taskName === "action::iterate") {
      this.setMeta("index", this.getMetaOr(0, "index") + 1);
      this.setMeta("accumulator", this.getInputData(4));

      if (this.getMetaOr(0, "index") <= inputCollection.length - 1) {
        this.enqueueTask("output-iterator");
      } else {
        this.enqueueTask("output-final");
      }
    } else if (taskName === "output-iterator") {
      this.setOutputData(1, this.getMeta("accumulator"));
      this.setOutputData(2, inputCollection[this.getMetaOr(0, "index")]);
      this.triggerSlot(0, "");
    } else if (taskName === "output-final") {
      this.setOutputData(4, this.getMeta("accumulator"));
      this.triggerSlot(3, "");
    }
  }
}

export default ReduceNode;
