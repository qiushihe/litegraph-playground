import { LGraphNode } from "litegraph.js/build/litegraph.min";

class SumFn extends LGraphNode {
  static title = "SumFn";

  constructor() {
    super(SumFn.title);

    this.addOutput("fn", "function");

    this.execute = this.execute.bind(this);
  }

  execute(a, b) {
    return a + b;
  }

  onExecute() {
    this.setOutputData(0, this.execute);
  }
}

export default SumFn;
