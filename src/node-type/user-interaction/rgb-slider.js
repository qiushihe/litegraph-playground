import flow from "lodash/fp/flow";
import map from "lodash/fp/map";
import forEach from "lodash/fp/forEach";
import clamp from "lodash/fp/clamp";
import over from "lodash/fp/over";
import last from "lodash/fp/last";
import sum from "lodash/fp/sum";
import max from "lodash/fp/max";

import { flags } from "../../util/property";

import {
  DIR_T,
  DIR_R,
  DIR_B,
  DIR_L,
  COR_TL,
  COR_TR,
  REGION_META,
  POS_X,
  POS_Y,
  SIZE_WIDTH,
  SIZE_HEIGHT
} from "../../enum/canvas.enum";

import {
  horizontalStack,
  verticalStack,
  newCoordinate,
  newRegion,
  regionWidth,
  regionHeight,
  regionCenter,
  shiftRegion
} from "../../util/canvas";

const nodeType = {
  title: "RGBSlider",
  defaultClass: null
};

const MAX_SLIDER_VALUE = 255;

const CONFIG = {
  spacing: [8, 60, 10, 10],
  labelRowWidth: 120,
  labelRowHeight: 16,
  sliderRowWidth: 200,
  sliderRowHeight: 20,
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

        this.resizable = false;
        this.size = [100, 100];

        this.sliderCoordinates = {};
        this.sliderValues = {
          red: 0,
          green: 0,
          blue: 0
        };

        this.activeMousePos = null;
        this.activeColourKey = null;
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

        const defaultFill = ctx.fillStyle;
        const defaultTextBaseline = ctx.textBaseline;

        const rootRegions = verticalStack(newCoordinate(0, 0))([
          [...newRegion(1, CONFIG.spacing[DIR_T]), flags("isGap")],
          [
            ...newRegion(CONFIG.labelRowWidth, CONFIG.labelRowHeight),
            flags("isLabel", "hexLabel")
          ],
          [...newRegion(1, 6), flags("isGap")],
          [
            ...newRegion(CONFIG.labelRowWidth, CONFIG.labelRowHeight),
            flags("isLabel", "intArrayLabel")
          ],
          [...newRegion(1, 10), flags("isGap")],
          [
            ...newRegion(CONFIG.sliderRowWidth, CONFIG.sliderRowHeight),
            flags("isSlider", "colourRed")
          ],
          [...newRegion(1, 10), flags("isGap")],
          [
            ...newRegion(CONFIG.sliderRowWidth, CONFIG.sliderRowHeight),
            flags("isSlider", "colourGreen")
          ],
          [...newRegion(1, 10), flags("isGap")],
          [
            ...newRegion(CONFIG.sliderRowWidth, CONFIG.sliderRowHeight),
            flags("isSlider", "colourBlue")
          ],
          [...newRegion(1, CONFIG.spacing[DIR_B]), flags("isGap")]
        ]);

        const rootRegionsSize = over([
          flow([map(regionWidth), max]),
          flow([map(regionHeight), sum])
        ])(rootRegions);

        this.updateSize(
          rootRegionsSize[SIZE_WIDTH] + CONFIG.spacing[DIR_R],
          rootRegionsSize[SIZE_HEIGHT]
        );

        flow([
          map((rootRegion) => {
            if (rootRegion[REGION_META].isLabel) {
              return shiftRegion(
                rootRegionsSize[SIZE_WIDTH] - regionWidth(rootRegion),
                0
              )(rootRegion);
            } else {
              return rootRegion;
            }
          }),
          forEach((rootRegion) => {
            if (!rootRegion[REGION_META].isGap) {
              const rootRegionWidth = regionWidth(rootRegion);
              const rootRegionHeight = regionHeight(rootRegion);

              if (rootRegion[REGION_META].isLabel) {
                ctx.lineWidth = 1;
                ctx.strokeStyle = defaultFill;
                ctx.strokeRect(
                  rootRegion[COR_TL][POS_X],
                  rootRegion[COR_TL][POS_Y],
                  regionWidth(rootRegion),
                  regionHeight(rootRegion)
                );

                ctx.fillStyle = "black";
                ctx.fillRect(
                  rootRegion[COR_TL][POS_X],
                  rootRegion[COR_TL][POS_Y],
                  regionWidth(rootRegion),
                  regionHeight(rootRegion)
                );

                ctx.fillStyle = defaultFill;
                ctx.font = "12px monospace";
                ctx.textBaseline = "middle";
                ctx.textAlign = "center";

                if (rootRegion[REGION_META].hexLabel) {
                  ctx.fillText(this.getHexValue(), ...regionCenter(rootRegion));
                } else if (rootRegion[REGION_META].intArrayLabel) {
                  ctx.fillText(
                    `[${this.getIntArrayValue().join(", ")}]`,
                    ...regionCenter(rootRegion)
                  );
                }
              } else if (rootRegion[REGION_META].isSlider) {
                const sliderFixedRegions = horizontalStack(rootRegion[COR_TL])([
                  [
                    ...newRegion(CONFIG.spacing[DIR_L], rootRegionHeight),
                    flags("isGap")
                  ],
                  [...newRegion(10, rootRegionHeight), flags("isLabel")],
                  [...newRegion(6, rootRegionHeight), flags("isGap")]
                ]);

                const sliderFixedRegionsSize = over([
                  flow([map(regionWidth), sum]),
                  flow([map(regionHeight), max])
                ])(sliderFixedRegions);

                const sliderFlexRegions = horizontalStack(
                  last(sliderFixedRegions)[COR_TR]
                )([
                  [
                    ...newRegion(
                      rootRegionWidth - sliderFixedRegionsSize[SIZE_WIDTH],
                      rootRegionHeight
                    ),
                    flags("isSlider")
                  ]
                ]);

                forEach((sliderRegion) => {
                  if (sliderRegion[REGION_META].isLabel) {
                    let labelText;
                    if (rootRegion[REGION_META].colourRed) {
                      labelText = "R";
                    } else if (rootRegion[REGION_META].colourGreen) {
                      labelText = "G";
                    } else if (rootRegion[REGION_META].colourBlue) {
                      labelText = "B";
                    }

                    if (labelText) {
                      ctx.font = "12px monospace";
                      ctx.fillStyle = defaultFill;
                      ctx.textBaseline = "middle";
                      ctx.textAlign = "center";
                      ctx.fillText(labelText, ...regionCenter(sliderRegion));
                    }
                  } else if (sliderRegion[REGION_META].isSlider) {
                    let sliderKey;
                    if (rootRegion[REGION_META].colourRed) {
                      sliderKey = "red";
                    } else if (rootRegion[REGION_META].colourGreen) {
                      sliderKey = "green";
                    } else if (rootRegion[REGION_META].colourBlue) {
                      sliderKey = "blue";
                    }

                    if (sliderKey) {
                      this.sliderCoordinates[sliderKey] = [
                        sliderRegion[COR_TL][POS_X],
                        sliderRegion[COR_TL][POS_Y],
                        regionWidth(sliderRegion),
                        regionHeight(sliderRegion)
                      ];

                      ctx.lineWidth = 1;
                      ctx.strokeStyle = defaultFill;
                      ctx.strokeRect(...this.sliderCoordinates[sliderKey]);

                      ctx.fillStyle = "black";
                      ctx.fillRect(...this.sliderCoordinates[sliderKey]);

                      ctx.fillStyle = CONFIG.sliderColour[sliderKey];
                      ctx.fillRect(
                        sliderRegion[COR_TL][POS_X],
                        sliderRegion[COR_TL][POS_Y],
                        regionWidth(sliderRegion) *
                          (this.sliderValues[sliderKey] / MAX_SLIDER_VALUE),
                        regionHeight(sliderRegion)
                      );

                      ctx.fillStyle = defaultFill;
                      ctx.font = "12px monospace";
                      ctx.textBaseline = "middle";
                      ctx.textAlign = "center";
                      ctx.fillText(
                        this.sliderValues[sliderKey],
                        ...regionCenter(sliderRegion)
                      );
                    }
                  }
                })([...sliderFixedRegions, ...sliderFlexRegions]);
              }
            }
          })
        ])(rootRegions);

        // Not sure why this is the only attribute that needed resetting... but it do be like that.
        ctx.textBaseline = defaultTextBaseline;
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
              MAX_SLIDER_VALUE *
                ((pos[0] - sliderCoordinate[0]) / sliderCoordinate[2])
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
            MAX_SLIDER_VALUE *
              ((this.activeMousePos[0] - sliderCoordinate[0]) /
                sliderCoordinate[2])
          );

          this.sliderValues[this.activeColourKey] = clamp(
            0,
            MAX_SLIDER_VALUE
          )(
            sliderBaseValue +
              Math.round(
                ((pos[0] - this.activeMousePos[0]) / 128) * MAX_SLIDER_VALUE
              )
          );

          this.setDirtyCanvas(true);
        }
      }

      onMouseUp(evt, pos, canvas) {
        this.captureInput(false);
        this.activeMousePos = null;
      }

      getHexValue() {
        return [
          this.sliderValues.red.toString(16).padStart(2, "0"),
          this.sliderValues.green.toString(16).padStart(2, "0"),
          this.sliderValues.blue.toString(16).padStart(2, "0")
        ].join("");
      }

      getIntArrayValue() {
        return [
          this.sliderValues.red,
          this.sliderValues.green,
          this.sliderValues.blue
        ];
      }

      onExecute() {
        this.setOutputData(0, this.getHexValue());
        this.setOutputData(1, this.getIntArrayValue());
      }
    };
  }

  return nodeType.defaultClass;
};

export default defineNodeType;
