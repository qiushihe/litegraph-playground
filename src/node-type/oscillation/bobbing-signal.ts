import BaseNode, { dataSocket, signalSocket } from "../base-node";

import { COR_TL, COR_TR, POS_X, POS_Y, COR_BL } from "../../enum/canvas.enum";

import {
  preserve2DContext,
  newCoordinate,
  newRegion,
  regionHeight,
  regionCenter,
  Coordinate
} from "../../util/canvas";

const TITLE = "BobbingSignal";

const CONFIG = {
  spacing: [30, 10, 10, 90],
  labelSize: [60, 14],
  graphSize: [40, 150]
};

const drawLabel = (
  ctx: CanvasRenderingContext2D,
  coordinate: Coordinate,
  text: string,
  colour: string,
  lineWidth: number
): Coordinate => {
  const labelRegion = newRegion(
    CONFIG.labelSize[0],
    CONFIG.labelSize[1],
    newCoordinate(coordinate[POS_X], coordinate[POS_Y])
  );

  ctx.font = "12px monospace";
  ctx.fillStyle = colour;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillText(text, ...regionCenter(labelRegion));

  const lineStartCoordinate = newCoordinate(
    labelRegion[COR_TR][POS_X],
    labelRegion[COR_TR][POS_Y] + regionHeight(labelRegion) / 2
  );

  ctx.strokeStyle = colour;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.moveTo(lineStartCoordinate[POS_X], lineStartCoordinate[POS_Y]);
  ctx.lineTo(
    lineStartCoordinate[POS_X] + CONFIG.graphSize[0],
    lineStartCoordinate[POS_Y]
  );
  ctx.stroke();

  return lineStartCoordinate;
};

class BobbingSignalNode extends BaseNode {
  static title = TITLE;

  constructor() {
    super(TITLE, {
      sockets: {
        input: [
          dataSocket("value"),
          dataSocket("range max"),
          dataSocket("signal max"),
          dataSocket("signal min"),
          dataSocket("range min")
        ],
        output: [signalSocket("event")]
      },
      metadata: [
        ["value", 0],
        ["rangeMax", 1],
        ["signalMax", 0.7],
        ["signalMin", 0.3],
        ["rangeMin", 0],
        ["valueState", ""],
        ["crossedSignalMax", false],
        ["crossedSignalMin", false]
      ]
    });

    this.size = [
      CONFIG.spacing[3] +
        CONFIG.labelSize[0] +
        CONFIG.graphSize[0] +
        CONFIG.spacing[1],
      CONFIG.spacing[0] + CONFIG.graphSize[1] + CONFIG.spacing[2]
    ];

    this.resizable = false;
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    if (this.flags.collapsed) {
      return;
    }

    const [restore2DContext, { fillStyle: defaultFill }] =
      preserve2DContext(ctx);

    const value = this.getMetaOr<number>(0.0, "value");
    const rangeMax = this.getMetaOr<number>(0.0, "rangeMax");
    const signalMax = this.getMetaOr<number>(0.0, "signalMax");
    const signalMin = this.getMetaOr<number>(0.0, "signalMin");
    const rangeMin = this.getMetaOr<number>(0.0, "rangeMin");

    const graphRegion = newRegion(
      CONFIG.labelSize[0] + CONFIG.graphSize[0],
      CONFIG.graphSize[1],
      newCoordinate(CONFIG.spacing[3], CONFIG.spacing[0])
    );

    const rangeMaxCoordinate = drawLabel(
      ctx,
      newCoordinate(graphRegion[COR_TL][POS_X], graphRegion[COR_TL][POS_Y]),
      rangeMax.toFixed(1),
      defaultFill as string,
      3
    );

    const rangeMinCoordinate = drawLabel(
      ctx,
      newCoordinate(
        graphRegion[COR_BL][POS_X],
        graphRegion[COR_BL][POS_Y] - CONFIG.labelSize[1]
      ),
      rangeMin.toFixed(1),
      defaultFill as string,
      3
    );

    const integerIncrementHeight =
      (rangeMinCoordinate[POS_Y] - rangeMaxCoordinate[POS_Y]) /
      (Math.abs(rangeMin) + Math.abs(rangeMax));

    drawLabel(
      ctx,
      newCoordinate(
        graphRegion[COR_BL][POS_X],
        rangeMaxCoordinate[POS_Y] +
          integerIncrementHeight * Math.abs(rangeMax - signalMax) -
          CONFIG.labelSize[1] / 2
      ),
      signalMax.toFixed(1),
      defaultFill as string,
      1
    );

    drawLabel(
      ctx,
      newCoordinate(
        graphRegion[COR_BL][POS_X],
        rangeMaxCoordinate[POS_Y] +
          integerIncrementHeight * Math.abs(rangeMax - signalMin) -
          CONFIG.labelSize[1] / 2
      ),
      signalMin.toFixed(1),
      defaultFill as string,
      1
    );

    ctx.fillStyle = defaultFill;
    ctx.beginPath();
    ctx.arc(
      graphRegion[COR_BL][POS_X] +
        CONFIG.labelSize[0] +
        CONFIG.graphSize[0] / 2,
      rangeMaxCoordinate[POS_Y] +
        (rangeMax * integerIncrementHeight - value * integerIncrementHeight),
      5,
      0,
      2 * Math.PI
    );
    ctx.fill();

    restore2DContext();
  }

  onExecute() {
    const value = this.getMetaOr<number>(0.0, "value");
    const valueState = this.getMetaOr<string>("", "valueState");
    const signalMax = this.getMetaOr<number>(0.0, "signalMax");
    const signalMin = this.getMetaOr<number>(0.0, "signalMin");

    let newValue = 0.0;
    if (this.isInputConnected(0)) {
      newValue = parseFloat(this.getInputDataOr<string>("0", 0));
    }

    if (newValue !== value) {
      this.setMeta("value", newValue);
      this.setDirtyCanvas(true);
    }

    let newValueState;
    if (value >= signalMax) {
      newValueState = "overMax";
    } else if (value <= signalMin) {
      newValueState = "underMin";
    } else {
      newValueState = "between";
    }

    if (
      (valueState === "between" || valueState === "underMin") &&
      newValueState === "overMax"
    ) {
      this.setMeta("crossedSignalMax", true);
    } else if (
      (valueState === "between" || valueState === "overMax") &&
      newValueState === "underMin"
    ) {
      this.setMeta("crossedSignalMin", true);
    }

    this.setMeta("valueState", newValueState);

    if (
      this.getMetaOr<boolean>(false, "crossedSignalMax") &&
      this.getMetaOr<boolean>(false, "crossedSignalMin") &&
      newValueState === "overMax"
    ) {
      this.setMeta("crossedSignalMax", false);
      this.setMeta("crossedSignalMin", false);

      this.triggerSlot(0, "");
    }
  }
}

export default BobbingSignalNode;
