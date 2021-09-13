import BaseNode, { dataSocket, signalSocket } from "../base-node";

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

const TITLE = "VariableSet";

const CONFIG = {
  spacing: [50, 10, 10, 10],
  fontSize: 12,
  minLabelWidth: 120
};

class VariableSetNode extends BaseNode {
  static title = TITLE;

  constructor() {
    super(TITLE, {
      sockets: {
        input: [signalSocket("action"), dataSocket("in")],
        output: [signalSocket("event"), dataSocket("out")]
      },
      properties: [["name", "my-var"]]
    });

    this.resizable = false;
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    const [restore2DContext, { fillStyle: defaultFill }] =
      preserve2DContext(ctx);

    const name = this.getPropertyOr<string>("", "name");
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
    const [taskName, taskParam] = this.getNextTask();

    if (taskName === "action::action") {
      if (this.isInputConnected(1)) {
        this.getStorage().setValue(
          this.getPropertyOr<string>("", "name"),
          this.getInputData(1)
        );
      }

      this.setOutputData(0, this.getInputData(1));

      // We can not trigger the output slot at the same time as the value of the variable is
      // updated in the storage object. The reason for that is because if we don't wait another
      // cycle, any corresponding `VariableGet` node would be return stale value because those
      // value are obtained at the same time as the triggering of the signal. By waiting another
      // cycle, we can ensure any corresponding `VariableGet` node gets the updated value before
      // this signal is triggered.
      this.enqueueTask("send-signal");
    } else if (taskName === "send-signal") {
      this.setOutputData(0, this.getInputData(1));
      this.triggerSlot(0, taskParam);
    }
  }
}

export default VariableSetNode;
