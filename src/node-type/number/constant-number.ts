import {
  DIR_L,
  DIR_R,
  DIR_T,
  DIR_B,
  COR_TL,
  POS_X,
  POS_Y,
  COR_TR,
  COR_BR
} from "../../enum/canvas.enum";

import {
  Region,
  newCoordinate,
  newRegion,
  preserve2DContext,
  regionCenter,
  regionHeight,
  regionWidth
} from "../../util/canvas";

import BaseNode, { dataSocket, nodeProperty } from "../base-node";

const TITLE = "ConstantNumber";

const CONFIG = {
  spacing: [10, 30, 10, 10],
  fontSize: 16,
  rootRegionHeight: 20,
  controlsGap: 10,
  minTextWidth: 40
};

class ConstantNumberNode extends BaseNode {
  static title = TITLE;

  constructor() {
    super(TITLE, {
      sockets: {
        output: [dataSocket("")]
      },
      properties: [["value", nodeProperty("number", 0)]],
      metadata: [
        ["value", 0],
        ["plusRegion", newRegion(0, 0)],
        ["minusRegion", newRegion(0, 0)]
      ]
    });

    this.resizable = false;
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    if (this.flags.collapsed) {
      return;
    }

    const [restore2DContext, { fillStyle: defaultFill }] =
      preserve2DContext(ctx);

    const minusRegion = newRegion(
      CONFIG.rootRegionHeight,
      CONFIG.rootRegionHeight,
      newCoordinate(CONFIG.spacing[DIR_L], CONFIG.spacing[DIR_T])
    );

    this.setMeta("minusRegion", minusRegion);

    ctx.beginPath();
    ctx.arc(
      minusRegion[COR_TL][POS_X] + regionWidth(minusRegion) / 2,
      minusRegion[COR_TL][POS_Y] + regionHeight(minusRegion) / 2,
      regionWidth(minusRegion) / 2,
      0,
      2 * Math.PI,
      false
    );
    ctx.lineWidth = 2;
    ctx.strokeStyle = defaultFill;
    ctx.stroke();

    ctx.font = "16px monospace";
    ctx.fillStyle = defaultFill;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillText(
      "-",
      regionCenter(minusRegion)[POS_X],
      regionCenter(minusRegion)[POS_Y]
    );

    const valueText = this.getMetaOr<number>(0, "value").toString();

    ctx.font = `${CONFIG.fontSize}px monospace`;

    const { width: valueTextWidth } = ctx.measureText(valueText);

    const numberRegion = newRegion(
      Math.max(valueTextWidth, CONFIG.minTextWidth),
      CONFIG.rootRegionHeight,
      newCoordinate(
        minusRegion[COR_TR][POS_X] + CONFIG.controlsGap,
        minusRegion[COR_TR][POS_Y]
      )
    );

    ctx.fillStyle = defaultFill;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillText(
      valueText,
      regionCenter(numberRegion)[POS_X],
      regionCenter(numberRegion)[POS_Y]
    );

    const plusRegion = newRegion(
      CONFIG.rootRegionHeight,
      CONFIG.rootRegionHeight,
      newCoordinate(
        numberRegion[COR_TR][POS_X] + CONFIG.controlsGap,
        numberRegion[COR_TR][POS_Y]
      )
    );

    this.setMeta("plusRegion", plusRegion);

    ctx.beginPath();
    ctx.arc(
      plusRegion[COR_TL][POS_X] + regionWidth(plusRegion) / 2,
      plusRegion[COR_TL][POS_Y] + regionHeight(plusRegion) / 2,
      regionWidth(plusRegion) / 2,
      0,
      2 * Math.PI,
      false
    );
    ctx.lineWidth = 2;
    ctx.strokeStyle = defaultFill;
    ctx.stroke();

    ctx.font = "14px monospace";
    ctx.fillStyle = defaultFill;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillText(
      "＋",
      regionCenter(plusRegion)[POS_X],
      regionCenter(plusRegion)[POS_Y] + 1
    );

    this.updateSize(
      CONFIG.spacing[DIR_L] +
        regionWidth(minusRegion) +
        CONFIG.controlsGap +
        regionWidth(numberRegion) +
        CONFIG.controlsGap +
        regionWidth(plusRegion) +
        CONFIG.spacing[DIR_R],
      CONFIG.spacing[DIR_T] + CONFIG.rootRegionHeight + CONFIG.spacing[DIR_B]
    );

    restore2DContext();
  }

  onMouseDown(evt: unknown, pos: [number, number]) {
    const minusRegion = this.getMeta<Region>("minusRegion");
    const plusRegion = this.getMeta<Region>("plusRegion");

    if (minusRegion) {
      if (
        pos[POS_X] > minusRegion[COR_TL][POS_X] &&
        pos[POS_X] < minusRegion[COR_BR][POS_X] &&
        pos[POS_Y] > minusRegion[COR_TL][POS_Y] &&
        pos[POS_Y] < minusRegion[COR_BR][POS_Y]
      ) {
        this.setParsedPropertyValue(
          "value",
          this.getParsedPropertyValueOr<number>(0, "value") - 1
        );
      }
    }

    if (plusRegion) {
      if (
        pos[POS_X] > plusRegion[COR_TL][POS_X] &&
        pos[POS_X] < plusRegion[COR_BR][POS_X] &&
        pos[POS_Y] > plusRegion[COR_TL][POS_Y] &&
        pos[POS_Y] < plusRegion[COR_BR][POS_Y]
      ) {
        this.setParsedPropertyValue(
          "value",
          this.getParsedPropertyValueOr<number>(0, "value") + 1
        );
      }
    }
  }

  onPropertyValueChanged(name: string, value: unknown) {
    if (name === "value") {
      this.setMeta("value", value || 0);
    }
  }

  onExecute() {
    this.setOutputData(0, this.getMetaOr<number>(0, "value"));
  }
}

export default ConstantNumberNode;
