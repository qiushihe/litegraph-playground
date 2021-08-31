import {
  SIZE_HEIGHT,
  SIZE_WIDTH,
  DIR_L,
  DIR_R,
  DIR_T,
  DIR_B
} from "../../enum/canvas.enum";

import {
  newCoordinate,
  newRegion,
  regionWidth,
  regionHeight,
  regionCenter
} from "../../util/canvas";

const nodeType = {
  title: "Label",
  defaultClass: null
};

const CONFIG = {
  spacing: [20, 20, 20, 20]
};

const defineNodeType = ({ LGraphNode, LiteGraph }) => {
  if (nodeType.defaultClass === null) {
    nodeType.defaultClass = class extends LGraphNode {
      static title = nodeType.title;

      constructor() {
        super(nodeType.title);

        this.properties = { text: "A Label", fontSize: 16 };
        this.resizable = false;
        this.size = [150, 50];
      }

      updateSize(width, height) {
        if (
          this.size[SIZE_WIDTH] !== width ||
          this.size[SIZE_HEIGHT] !== height
        ) {
          this.size = [width, height];
          this.setDirtyCanvas(true);
        }
      }

      onDrawForeground(ctx) {
        if (this.flags.collapsed) {
          return;
        }

        const defaultTextBaseline = ctx.textBaseline;

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = this.properties.fontSize + "px Arial";

        const {
          width: textWidth,
          fontBoundingBoxAscent,
          fontBoundingBoxDescent
        } = ctx.measureText(this.properties.text);

        const textHeight = fontBoundingBoxAscent + fontBoundingBoxDescent;

        const textOrigin = newCoordinate(
          CONFIG.spacing[DIR_L],
          CONFIG.spacing[DIR_T]
        );

        const textRegion = newRegion(textWidth, textHeight, textOrigin);

        ctx.fillText(this.properties.text, ...regionCenter(textRegion));

        this.updateSize(
          CONFIG.spacing[DIR_L] +
            regionWidth(textRegion) +
            CONFIG.spacing[DIR_R],
          CONFIG.spacing[DIR_T] +
            regionHeight(textRegion) +
            CONFIG.spacing[DIR_B]
        );

        // Not sure why this is the only attribute that needed resetting... but it do be like that.
        ctx.textBaseline = defaultTextBaseline;
      }

      onExecute() {}
    };
  }

  return nodeType.defaultClass;
};

export default defineNodeType;
