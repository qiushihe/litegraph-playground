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

import BaseNode, { dataSocket } from "../base-node";

const TITLE = "ConstantBoolean";

const CONFIG = {
  spacing: [10, 20, 10, 10],
  fontSize: 16,
  rootRegionHeight: 20,
  controlsGap: 10,
  switchGap: 4,
  switchWidth: 60,
  label: ["off", "on"]
};

class ConstantBooleanNode extends BaseNode {
  static title = TITLE;

  constructor() {
    super(TITLE, {
      sockets: {
        output: [dataSocket("")]
      },
      metadata: [
        ["value", false],
        ["switchRegion", newRegion(0, 0)]
      ]
    });

    this.properties.value = "";
    this.resizable = false;
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    if (this.flags.collapsed) {
      return;
    }

    const [restore2DContext, { fillStyle: defaultFill }] =
      preserve2DContext(ctx);

    ctx.font = "12px monospace";
    const { width: offTextWidth } = ctx.measureText(CONFIG.label[0]);

    const offRegion = newRegion(
      offTextWidth,
      CONFIG.rootRegionHeight,
      newCoordinate(CONFIG.spacing[DIR_L], CONFIG.spacing[DIR_T])
    );

    ctx.fillStyle = defaultFill;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillText(
      CONFIG.label[0],
      regionCenter(offRegion)[POS_X],
      regionCenter(offRegion)[POS_Y]
    );

    const switchRegion = newRegion(
      CONFIG.switchWidth,
      CONFIG.rootRegionHeight,
      newCoordinate(
        offRegion[COR_TR][POS_X] + CONFIG.controlsGap,
        offRegion[COR_TR][POS_Y]
      )
    );

    this.setMeta("switchRegion", switchRegion);

    ctx.lineWidth = 1;
    ctx.strokeStyle = defaultFill;
    ctx.strokeRect(
      switchRegion[COR_TL][POS_X],
      switchRegion[COR_TL][POS_Y],
      regionWidth(switchRegion),
      regionHeight(switchRegion)
    );

    const switchBlockRegion = newRegion(
      CONFIG.rootRegionHeight,
      CONFIG.rootRegionHeight - CONFIG.switchGap * 2,
      newCoordinate(
        this.getMetaOr<boolean>(false, "value")
          ? switchRegion[COR_TR][POS_X] -
              CONFIG.rootRegionHeight -
              CONFIG.switchGap
          : switchRegion[COR_TL][POS_X] + CONFIG.switchGap,
        switchRegion[COR_TL][POS_Y] + CONFIG.switchGap
      )
    );

    ctx.fillStyle = defaultFill;
    ctx.fillRect(
      switchBlockRegion[COR_TL][POS_X],
      switchBlockRegion[COR_TL][POS_Y],
      regionWidth(switchBlockRegion),
      regionHeight(switchBlockRegion)
    );

    ctx.font = "12px monospace";
    const { width: onTextWidth } = ctx.measureText(CONFIG.label[1]);

    const onRegion = newRegion(
      onTextWidth,
      CONFIG.rootRegionHeight,
      newCoordinate(
        switchRegion[COR_TR][POS_X] + CONFIG.controlsGap,
        switchRegion[COR_TR][POS_Y]
      )
    );

    ctx.fillStyle = defaultFill;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillText(
      CONFIG.label[1],
      regionCenter(onRegion)[POS_X],
      regionCenter(onRegion)[POS_Y]
    );

    this.updateSize(
      CONFIG.spacing[DIR_L] +
        regionWidth(offRegion) +
        CONFIG.controlsGap +
        regionWidth(switchRegion) +
        CONFIG.controlsGap +
        regionWidth(onRegion) +
        CONFIG.spacing[DIR_R],
      CONFIG.spacing[DIR_T] + CONFIG.rootRegionHeight + CONFIG.spacing[DIR_B]
    );

    restore2DContext();
  }

  onMouseDown(evt: unknown, pos: [number, number]) {
    const switchRegion = this.getMeta<Region>("switchRegion");

    if (switchRegion) {
      if (
        pos[POS_X] > switchRegion[COR_TL][POS_X] &&
        pos[POS_X] < switchRegion[COR_BR][POS_X] &&
        pos[POS_Y] > switchRegion[COR_TL][POS_Y] &&
        pos[POS_Y] < switchRegion[COR_BR][POS_Y]
      ) {
        this.setMeta("value", !this.getMetaOr<boolean>(false, "value"));
      }
    }
  }

  onPropertyChanged(propertyName: string, propertyValue: unknown) {
    if (propertyName === "value") {
      try {
        this.setMeta("value", !!JSON.parse(`${propertyValue}`));
      } catch {
        this.setMeta("value", undefined);
      }
    }
  }

  onExecute() {
    this.setOutputData(0, this.getMetaOr(false, "value"));
  }
}

export default ConstantBooleanNode;
