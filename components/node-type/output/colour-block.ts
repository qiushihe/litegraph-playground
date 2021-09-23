import { preserve2DContext } from "../../../util/canvas";

import BaseNode, { dataSocket } from "../base-node";

const TITLE = "ColourBlock";

const CONFIG = {
  radius: 50,
  spacing: [10, 30, 10, 50]
};

const padZero = (str: string, len?: number): string => {
  len = len || 2;
  const zeros = new Array(len).join("0");
  return (zeros + str).slice(-len);
};

const invertColor = (hex: string): string => {
  if (hex.indexOf("#") === 0) {
    hex = hex.slice(1);
  }

  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  if (hex.length !== 6) {
    throw new Error("Invalid HEX color.");
  }

  // invert color components
  const r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
    g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
    b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);

  // pad each with zeros and return
  return "#" + padZero(r) + padZero(g) + padZero(b);
};

class ColourBlockNode extends BaseNode {
  static title = TITLE;

  constructor() {
    super(TITLE, {
      sockets: {
        input: [dataSocket("hex"), dataSocket("int[]")]
      }
    });

    this.size = [
      CONFIG.spacing[3] + CONFIG.radius * 2 + CONFIG.spacing[1],
      CONFIG.spacing[0] + CONFIG.radius * 2 + CONFIG.spacing[2]
    ];

    this.resizable = false;
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    if (this.flags.collapsed) {
      return;
    }

    const [restore2DContext] = preserve2DContext(ctx);

    let colourCode;
    if (this.isInputConnected(0)) {
      colourCode =
        `${this.getInputData(0) || ""}`.replace(/^#/, "") || "000000";
    } else if (this.isInputConnected(1)) {
      const inputValue: string[] = this.getInputData(1) || [];
      colourCode = [
        padZero((inputValue[0] || 0).toString(16)),
        padZero((inputValue[1] || 0).toString(16)),
        padZero((inputValue[2] || 0).toString(16))
      ].join("");
    }

    const colourValue = `#${colourCode || "000000"}`;

    let invertedColorValue;
    try {
      invertedColorValue = invertColor(colourValue);
    } catch {
      invertedColorValue = "#ffffff";
    }

    const center = [
      CONFIG.spacing[3] + CONFIG.radius,
      CONFIG.spacing[0] + CONFIG.radius
    ];

    ctx.beginPath();
    ctx.arc(center[0], center[1], CONFIG.radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = colourValue;
    ctx.fill();

    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = invertedColorValue;
    ctx.stroke();

    ctx.font = "12px monospace";
    const { width: labelWidth, fontBoundingBoxDescent } =
      ctx.measureText(colourValue);

    ctx.fillStyle = invertedColorValue;
    ctx.fillText(
      colourValue,
      center[0] - labelWidth / 2,
      center[1] + fontBoundingBoxDescent
    );

    restore2DContext();
  }

  onExecute() {}
}

export default ColourBlockNode;
