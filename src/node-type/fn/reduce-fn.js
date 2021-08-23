import { LGraphNode } from "litegraph.js/build/litegraph.min";
import reduce from "lodash/fp/reduce";

class ReduceFn extends LGraphNode {
  static title = "ReduceFn";

  constructor() {
    super(ReduceFn.title);

    this.addInput("reducer", "function");
    this.addOutput("fn", "function");

    this.execute = this.execute.bind(this);
  }

  execute(accumulator, array) {
    return reduce(this.getInputData(0), accumulator)(array);
  }

  onExecute() {
    this.setOutputData(0, this.execute);
  }
}

export default ReduceFn;
