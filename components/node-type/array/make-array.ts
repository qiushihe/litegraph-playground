import times from "lodash/fp/times";

import BaseNode, { dataSocket } from "../base-node";

const TITLE = "MakeArray";
const INPUTS_COUNT = 5;

class MakeArrayNode extends BaseNode {
  static title = TITLE;

  constructor() {
    super(TITLE, {
      sockets: {
        input: times(() => dataSocket(""))(INPUTS_COUNT),
        output: [dataSocket("array")]
      }
    });

    this.resizable = false;
  }

  onExecute() {
    const array: unknown[] = [];

    times((index) => {
      if (this.isInputConnected(index)) {
        array.push(this.getInputData(index));
      }
    })(INPUTS_COUNT);

    this.setOutputData(0, array);
  }
}

export default MakeArrayNode;
