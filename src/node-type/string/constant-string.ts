import {
  SIZE_WIDTH,
  SIZE_HEIGHT,
  DIR_L,
  DIR_R,
  DIR_T,
  DIR_B,
  COR_TL,
  POS_X,
  POS_Y
} from "../../enum/canvas.enum";

import {
  newCoordinate,
  newRegion,
  preserve2DContext,
  regionHeight,
  regionWidth
} from "../../util/canvas";

import BaseNode, { dataSocket } from "../base-node";

const TITLE = "ConstantString";

const CONFIG = {
  spacing: [10, 20, 10, 10],
  fontSize: 12,
  lineHeight: 14,
  defaultTextWidth: 100
};

class ConstantStringNode extends BaseNode {
  static title = TITLE;

  constructor() {
    super(TITLE, {
      sockets: {
        output: [dataSocket("")]
      },
      properties: [["value", "my-string"]]
    });

    this.size = [
      CONFIG.spacing[DIR_L] + CONFIG.defaultTextWidth + CONFIG.spacing[DIR_R],
      CONFIG.spacing[DIR_T] + CONFIG.lineHeight + CONFIG.spacing[DIR_B]
    ];
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    if (this.flags.collapsed) {
      return;
    }

    const [restore2DContext, { fillStyle: defaultFill }] =
      preserve2DContext(ctx);

    const textRegion = newRegion(
      this.size[SIZE_WIDTH] - CONFIG.spacing[DIR_L] - CONFIG.spacing[DIR_R],
      this.size[SIZE_HEIGHT] - CONFIG.spacing[DIR_T] - CONFIG.spacing[DIR_B],
      newCoordinate(CONFIG.spacing[DIR_L], CONFIG.spacing[DIR_T])
    );

    ctx.font = `${CONFIG.fontSize}px monospace`;

    const {
      width: characterWidth,
      fontBoundingBoxAscent,
      fontBoundingBoxDescent
    } = ctx.measureText("X");

    const charactersCount = Math.floor(
      regionWidth(textRegion) / characterWidth
    );

    const linesCount = Math.floor(
      regionHeight(textRegion) /
        (fontBoundingBoxAscent + fontBoundingBoxDescent)
    );

    let remainingText = this.getPropertyOr<string>("", "value");

    for (let lineIndex = 0; lineIndex < linesCount; lineIndex++) {
      ctx.fillStyle = defaultFill;
      ctx.fillText(
        remainingText.slice(0, charactersCount).trim(),
        textRegion[COR_TL][POS_X],
        textRegion[COR_TL][POS_Y] +
          fontBoundingBoxAscent +
          (fontBoundingBoxAscent + fontBoundingBoxDescent) * lineIndex
      );
      remainingText = remainingText.slice(charactersCount).trim();
    }

    restore2DContext();
  }

  onExecute() {
    this.setOutputData(0, this.getPropertyOr<string>("", "value"));
  }
}

export default ConstantStringNode;
