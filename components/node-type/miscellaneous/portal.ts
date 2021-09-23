import { v4 as uuidv4 } from "uuid";

import {
  DIR_L,
  DIR_R,
  DIR_T,
  DIR_B,
  POS_X,
  POS_Y
} from "../../../enum/canvas.enum";

import {
  newCoordinate,
  newRegion,
  preserve2DContext,
  regionCenter
} from "../../../util/canvas";

import BaseNode, { signalSocket, nodeProperty } from "../base-node";

const TITLE = "Portal";

const CONFIG = {
  spacing: [30, 10, 10, 10],
  fontSize: 12,
  minLabelWidth: 120
};

class PortalNode extends BaseNode {
  static title = TITLE;

  static portals: Record<string, PortalNode> = {};

  constructor() {
    super(TITLE, {
      sockets: {
        input: [signalSocket("action")],
        output: [signalSocket("event")]
      },
      properties: [["name", nodeProperty("string", "my-event")]],
      metadata: [["uuid", uuidv4()]]
    });

    this.resizable = false;
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    const [restore2DContext, { fillStyle: defaultFill }] =
      preserve2DContext(ctx);

    const name = this.getParsedPropertyValueOr<string>("", "name");
    const labelText = `evt: ${name}`;

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

  // Called by other instance of this node type.
  replicateSignal(param: unknown): void {
    this.enqueueTask("replicate-signal", param);
  }

  getUUID(): string {
    return this.getMetaOr<string>("", "uuid");
  }

  onAdded() {
    PortalNode.portals[this.getUUID()] = this;
  }

  onRemoved() {
    delete PortalNode.portals[this.getUUID()];
  }

  onExecute() {
    const [taskName, taskParam] = this.getNextTask();

    if (taskName === "action::action") {
      Object.values(PortalNode.portals)
        .filter((portal) => {
          return (
            portal.getUUID() !== this.getUUID() &&
            portal.getParsedPropertyValueOr<string>("", "name") ===
              this.getParsedPropertyValueOr<string>("", "name")
          );
        })
        .forEach((portal) => {
          portal.replicateSignal(taskParam);
        });

      this.triggerSlot(0, taskParam);
    } else if (taskName === "replicate-signal") {
      this.triggerSlot(0, taskParam);
    }
  }
}

export default PortalNode;
