import { preserve2DContext } from "../../../util/canvas";

import BaseNode, { signalSocket, nodeProperty } from "../base-node";

const TITLE = "Button";

class ButtonNode extends BaseNode {
  static title = TITLE;

  constructor() {
    super(TITLE, {
      sockets: {
        output: [signalSocket("")]
      },
      properties: [
        ["label", nodeProperty("string", "A Button")],
        ["fontSize", nodeProperty("number", 16)]
      ],
      metadata: [["active", false]]
    });

    this.size = [164, 84];
    this.resizable = false;
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    if (this.flags.collapsed) {
      return;
    }

    const [restore2DContext] = preserve2DContext(ctx);

    const margin = 10;
    ctx.fillStyle = "black";
    ctx.fillRect(
      margin + 1,
      margin + 1,
      this.size[0] - margin * 2,
      this.size[1] - margin * 2
    );
    ctx.fillStyle = "#AAF";
    ctx.fillRect(
      margin - 1,
      margin - 1,
      this.size[0] - margin * 2,
      this.size[1] - margin * 2
    );
    ctx.fillStyle = this.getMetaOr<boolean>(false, "active") ? "white" : "#334";
    ctx.fillRect(
      margin,
      margin,
      this.size[0] - margin * 2,
      this.size[1] - margin * 2
    );

    ctx.textAlign = "center";
    ctx.fillStyle = this.getMetaOr<boolean>(false, "active")
      ? "black"
      : "white";
    ctx.font = `${this.getParsedPropertyValueOr<number>(
      0,
      "fontSize"
    )}px Arial`;
    ctx.fillText(
      this.getParsedPropertyValueOr<string>("", "label"),
      this.size[0] * 0.5,
      this.size[1] * 0.5 +
        this.getParsedPropertyValueOr<number>(0, "fontSize") * 0.3
    );
    ctx.textAlign = "left";

    restore2DContext();
  }

  onMouseDown(evt: unknown, pos: [number, number]) {
    if (
      pos[0] > 1 &&
      pos[1] > 1 &&
      pos[0] < this.size[0] - 2 &&
      pos[1] < this.size[1] - 2
    ) {
      this.setMeta("active", true);
      this.triggerSlot(0, "");
      return true;
    }
  }

  onMouseUp() {
    this.setMeta("active", false);
  }

  onExecute() {}
}

export default ButtonNode;
