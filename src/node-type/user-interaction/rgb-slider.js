import clamp from "lodash/fp/clamp";

const nodeType = {
  title: "RGBSlider",
  defaultClass: null
};

const UNUSED = null;

const CONFIG = {
  spacing: [6, 60, 10, 10],
  labelSpacing: [12, 6, UNUSED, 10],
  sliderHeight: 16,
  sliderGap: 6,
  sliderColour: {
    red: "#ad5252",
    green: "#295729",
    blue: "#5252ad"
  }
};

const defineNodeType = ({ LGraphNode }) => {
  if (nodeType.defaultClass === null) {
    nodeType.defaultClass = class extends LGraphNode {
      static title = nodeType.title;

      constructor() {
        super(nodeType.title);

        this.addOutput("hex", "");
        this.addOutput("int[]", "");

        this.size = [
          CONFIG.spacing[3] +
            CONFIG.labelSpacing[1] +
            255 +
            CONFIG.labelSpacing[3] +
            CONFIG.spacing[1],
          84
        ];

        this.sliderCoordinates = {};
        this.sliderValues = {
          red: 0,
          green: 0,
          blue: 0
        };

        this.activeMousePos = null;
        this.activeColourKey = null;
      }

      onDrawForeground(ctx) {
        const defaultFill = ctx.fillStyle;

        ["R", "G", "B"].forEach((label, index) => {
          ctx.font = "12px monospace";
          ctx.fillText(
            label,
            CONFIG.labelSpacing[3],
            CONFIG.spacing[0] +
              CONFIG.labelSpacing[0] +
              CONFIG.sliderGap * index +
              CONFIG.sliderHeight * index
          );
        });

        ["red", "green", "blue"].forEach((key, index) => {
          this.sliderCoordinates[key] = [
            CONFIG.spacing[3] + CONFIG.labelSpacing[1] + CONFIG.labelSpacing[3],
            CONFIG.spacing[0] +
              CONFIG.sliderGap * index +
              CONFIG.sliderHeight * index,
            this.size[0] -
              CONFIG.labelSpacing[1] -
              CONFIG.labelSpacing[3] -
              CONFIG.spacing[1],
            CONFIG.sliderHeight
          ];

          ctx.lineWidth = 1;
          ctx.strokeStyle = "white";
          ctx.strokeRect(...this.sliderCoordinates[key]);

          ctx.fillStyle = "black";
          ctx.fillRect(...this.sliderCoordinates[key]);

          ctx.fillStyle = CONFIG.sliderColour[key];
          ctx.fillRect(
            ...[
              this.sliderCoordinates[key][0],
              this.sliderCoordinates[key][1],
              (this.sliderCoordinates[key][2] * this.sliderValues[key]) / 255,
              this.sliderCoordinates[key][3]
            ]
          );

          const valueText = `${this.sliderValues[key]}`;
          const { width: valueWidth } = ctx.measureText(valueText);

          ctx.fillStyle = defaultFill;
          ctx.font = "12px monospace";
          ctx.fillText(
            valueText,
            this.sliderCoordinates[key][0] +
              this.sliderCoordinates[key][2] / 2 -
              valueWidth / 2,
            CONFIG.spacing[0] +
              CONFIG.labelSpacing[0] +
              CONFIG.sliderGap * index +
              CONFIG.sliderHeight * index
          );
        });
      }

      onMouseDown(evt, pos, canvas) {
        this.activeMousePos = null;
        this.activeColourKey = null;

        ["red", "green", "blue"].forEach((key) => {
          const sliderCoordinate = this.sliderCoordinates[key];

          if (
            pos[0] > sliderCoordinate[0] &&
            pos[1] > sliderCoordinate[1] &&
            pos[0] < sliderCoordinate[0] + sliderCoordinate[2] &&
            pos[1] < sliderCoordinate[1] + sliderCoordinate[3]
          ) {
            this.sliderValues[key] = Math.round(
              255 * ((pos[0] - sliderCoordinate[0]) / sliderCoordinate[2])
            );

            this.activeMousePos = pos;
            this.activeColourKey = key;
          }
        });

        if (this.activeMousePos !== null && this.activeColourKey !== null) {
          this.captureInput(true);
          return true;
        }
      }

      onMouseMove(evt, pos, canvas) {
        if (this.activeMousePos !== null && this.activeColourKey !== null) {
          const sliderCoordinate = this.sliderCoordinates[this.activeColourKey];

          const sliderBaseValue = Math.round(
            255 *
              ((this.activeMousePos[0] - sliderCoordinate[0]) /
                sliderCoordinate[2])
          );

          this.sliderValues[this.activeColourKey] = clamp(
            0,
            255
          )(sliderBaseValue + (pos[0] - this.activeMousePos[0]));

          this.setDirtyCanvas(true);
        }
      }

      onMouseUp(evt, pos, canvas) {
        this.captureInput(false);
        this.activeMousePos = null;
      }

      onExecute() {
        this.setOutputData(
          0,
          [
            this.sliderValues.red.toString(16).padStart(2, "0"),
            this.sliderValues.green.toString(16).padStart(2, "0"),
            this.sliderValues.blue.toString(16).padStart(2, "0")
          ].join("")
        );

        this.setOutputData(1, [
          this.sliderValues.red,
          this.sliderValues.green,
          this.sliderValues.blue
        ]);
      }
    };
  }

  return nodeType.defaultClass;
};

export default defineNodeType;
