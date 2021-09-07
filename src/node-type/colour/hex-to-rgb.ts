import flow from "lodash/fp/flow";
import trim from "lodash/fp/trim";
import toLower from "lodash/fp/toLower";

import BaseNode, { dataSocket } from "../base-node";

const TITLE = "HexToRGB";

const HEX_TO_RGB_REGEXP = new RegExp(
  "^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$"
);

class HexToRGBNode extends BaseNode {
  static title = TITLE;

  constructor() {
    super(TITLE, {
      sockets: {
        input: [dataSocket("hex")],
        output: [dataSocket("int[]")]
      }
    });

    this.resizable = false;
  }

  onExecute() {
    const colourString: string = flow([trim, toLower])(
      this.getInputData<string>(0)
    );

    const colourMatches = colourString.match(HEX_TO_RGB_REGEXP) || [];

    this.setOutputData(0, [
      parseInt(colourMatches[1], 16),
      parseInt(colourMatches[2], 16),
      parseInt(colourMatches[3], 16)
    ]);
  }
}

export default HexToRGBNode;
