import { LGraphNode, LiteGraph } from "litegraph.js/build/litegraph.min";

class Button extends LGraphNode {
  static title = "Button";

  constructor() {
    super(Button.title);

    this.addOutput("", LiteGraph.EVENT);

    this.properties = { label: "A Button", fontSize: 16 };
    this.size = [164, 84];

    this.active = false;
  }

  onDrawForeground(ctx) {
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
    ctx.fillStyle = this.active ? "white" : this.mouseOver ? "#668" : "#334";
    ctx.fillRect(
      margin,
      margin,
      this.size[0] - margin * 2,
      this.size[1] - margin * 2
    );

    ctx.textAlign = "center";
    ctx.fillStyle = this.active ? "black" : "white";
    ctx.font = this.properties.fontSize + "px Arial";
    ctx.fillText(
      this.properties.label,
      this.size[0] * 0.5,
      this.size[1] * 0.5 + this.properties.fontSize * 0.3
    );
    ctx.textAlign = "left";
  }

  onMouseDown(evt, pos, canvas) {
    if (
      pos[0] > 1 &&
      pos[1] > 1 &&
      pos[0] < this.size[0] - 2 &&
      pos[1] < this.size[1] - 2
    ) {
      this.active = true;
      this.triggerSlot(0, "");
      return true;
    }
  }

  onMouseUp(evt, pos, canvas) {
    this.active = false;
  }

  onExecute() {}
}

export default Button;
