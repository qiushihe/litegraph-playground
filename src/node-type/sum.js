import { LGraphNode } from "litegraph.js/build/litegraph.min";

class Sum extends LGraphNode {
  static title = "Sum";

  constructor() {
    super(Sum.title);

    this.addInput("A", "number");
    this.addInput("B", "number");
    this.addOutput("A+B", "number");

    this.properties = { precision: 1 };
  }

  onExecute() {
    let A = this.getInputData(0);
    if (A === undefined) {
      A = 0;
    }

    let B = this.getInputData(1);
    if (B === undefined) {
      B = 0;
    }

    this.setOutputData(0, A + B);
  }
}

export default Sum;
