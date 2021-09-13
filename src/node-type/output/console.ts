import flow from "lodash/fp/flow";
import reverse from "lodash/fp/reverse";
import slice from "lodash/fp/slice";
import map from "lodash/fp/map";
import toString from "lodash/fp/toString";

import { preserve2DContext } from "../../util/canvas";

import BaseNode, { dataSocket, signalSocket } from "../base-node";

const TITLE = "Console";

const CONFIG = {
  spacing: [10, 60, 10, 100],
  history: 100
};

class ConsoleNode extends BaseNode {
  static title = TITLE;

  constructor() {
    super(TITLE, {
      sockets: {
        input: [
          signalSocket("action"),
          signalSocket("clear"),
          dataSocket("message")
        ],
        output: [signalSocket("event")]
      },
      metadata: [["messageLines", []]]
    });

    this.size = [640, 220];
    this.resizable = true;
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    if (this.flags.collapsed) {
      return;
    }

    const [restore2DContext] = preserve2DContext(ctx);

    ctx.strokeStyle = "white";
    ctx.lineWidth = 1;

    const boxWidth = this.size[0] - CONFIG.spacing[3] - CONFIG.spacing[1];
    const boxHeight = this.size[1] - CONFIG.spacing[0] - CONFIG.spacing[2];

    ctx.strokeRect(CONFIG.spacing[3], CONFIG.spacing[0], boxWidth, boxHeight);

    ctx.font = "12px monospace";

    const {
      width: letterWidth,
      fontBoundingBoxAscent,
      fontBoundingBoxDescent
    } = ctx.measureText(" ");

    const letterHeight = fontBoundingBoxAscent + fontBoundingBoxDescent;
    const maxLineChars = Math.floor(boxWidth / letterWidth);
    const maxLines = Math.floor(boxHeight / letterHeight);

    const textOrigin = [
      CONFIG.spacing[3],
      CONFIG.spacing[0] + fontBoundingBoxAscent
    ];

    const visibleLines = flow([reverse, slice(0, maxLines), reverse])(
      this.getMetaOr<string[]>([], "messageLines")
    );

    for (let lineIndex = 0; lineIndex < visibleLines.length; lineIndex++) {
      const line = visibleLines[lineIndex];

      ctx.fillText(
        line.slice(0, maxLineChars),
        textOrigin[0],
        textOrigin[1] + letterHeight * lineIndex
      );
    }

    restore2DContext();
  }

  onExecute() {
    const [taskName] = this.getNextTask();

    if (taskName === "action::action") {
      this.setMeta(
        "messageLines",
        flow([reverse, slice(0, CONFIG.history), reverse, map(toString)])([
          ...this.getMetaOr<string[]>([], "messageLines"),
          this.getInputData(2) || ""
        ])
      );
      this.triggerSlot(0, "");
    } else if (taskName === "action::clear") {
      this.setMeta("messageLines", []);
    }
  }
}

export default ConsoleNode;
