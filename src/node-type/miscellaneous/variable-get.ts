import BaseNode, { dataSocket, nodeProperty } from "../base-node";

import VariableStorage from "./variable-storage";

import {
  DIR_L,
  DIR_R,
  DIR_T,
  DIR_B,
  POS_X,
  POS_Y
} from "../../enum/canvas.enum";

import {
  newCoordinate,
  newRegion,
  preserve2DContext,
  regionCenter
} from "../../util/canvas";

const TITLE = "VariableGet";

const CONFIG = {
  spacing: [30, 10, 10, 10],
  fontSize: 12,
  minLabelWidth: 120
};

class VariableGetNode extends BaseNode {
  static title = TITLE;

  constructor() {
    super(TITLE, {
      sockets: {
        input: [dataSocket("fallback")],
        output: [dataSocket("value")]
      },
      properties: [["name", nodeProperty("string", "my-var")]]
    });

    this.resizable = false;
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    const [restore2DContext, { fillStyle: defaultFill }] =
      preserve2DContext(ctx);

    const name = this.getParsedPropertyValueOr<string>("", "name");
    const labelText = `var: ${name}`;

    ctx.font = "12px monospace";

    const {
      width: labelTextWidth,
      fontBoundingBoxAscent,
      fontBoundingBoxDescent
    } = ctx.measureText(labelText);

    const labelWidth = Math.max(CONFIG.minLabelWidth, labelTextWidth);
    const labelHeight = fontBoundingBoxAscent + fontBoundingBoxDescent;

    const labelRegion = newRegion(
      labelWidth,
      fontBoundingBoxAscent + fontBoundingBoxDescent,
      newCoordinate(CONFIG.spacing[DIR_L], CONFIG.spacing[DIR_T])
    );

    ctx.fillStyle = defaultFill;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillText(
      labelText,
      regionCenter(labelRegion)[POS_X],
      regionCenter(labelRegion)[POS_Y]
    );

    this.updateSize(
      CONFIG.spacing[DIR_L] + labelWidth + CONFIG.spacing[DIR_R],
      CONFIG.spacing[DIR_T] + labelHeight + CONFIG.spacing[DIR_B]
    );

    restore2DContext();
  }

  getStorage(): VariableStorage {
    return VariableStorage.getDefaultInstance();
  }

  onExecute() {
    const value = this.getStorage().getValue(
      this.getParsedPropertyValueOr<string>("", "name")
    );

    if (value !== undefined) {
      this.setOutputData(0, value);
    } else {
      this.setOutputData(0, this.getInputData(0));
    }
  }
}

export default VariableGetNode;
