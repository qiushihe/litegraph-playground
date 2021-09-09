import flow from "lodash/fp/flow";
import times from "lodash/fp/times";

import BaseNode, { dataSocket } from "../../base-node";

const TITLE = "Flow";

const INPUTS_COUNT = 5;

class FlowNode extends BaseNode {
  static title = TITLE;

  constructor() {
    super(TITLE, {
      sockets: {
        input: times(() => dataSocket(""))(INPUTS_COUNT),
        output: [dataSocket("fn")]
      },
      metadata: [["fns", []]]
    });

    this.execute = this.execute.bind(this);

    this.resizable = false;
  }

  // Called externally by consumer nodes.
  execute(arg: unknown): unknown {
    const fns = this.getMetaOr<(() => unknown)[]>([], "fns");
    return flow(fns)(arg);
  }

  onExecute() {
    const array: (() => unknown)[] = [];

    times((index) => {
      if (this.isInputConnected(index)) {
        array.push(this.getInputData(index) as () => unknown);
      }
    })(INPUTS_COUNT);

    this.setMeta("fns", array);

    this.setOutputData(0, this.execute);
  }
}

export default FlowNode;
