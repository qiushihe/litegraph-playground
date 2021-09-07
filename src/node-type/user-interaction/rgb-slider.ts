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
  Region,
  horizontalStack,
  verticalStack,
  newCoordinate,
  newRegion,
  regionWithMeta,
  regionWidth,
  regionHeight,
  regionCenter,
  shiftRegion
} from "../../util/canvas";

import BaseNode, { dataSocket } from "../base-node";

const TITLE = "RGBSlider";

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

type RegionMeta = {
  isGap: boolean;
  isLabel: boolean;
  isSlider: boolean;
  hexLabel: boolean;
  intArrayLabel: boolean;
  colourRed: boolean;
  colourGreen: boolean;
  colourBlue: boolean;
};

class RGBSliderNode extends BaseNode {
  static title = TITLE;

  constructor() {
    super(TITLE, {
      sockets: {
        output: [dataSocket("hex"), dataSocket("int[]")]
      },
      metadata: [
        ["sliderCoordinates", {}],
        ["sliderValues", { red: 0, green: 0, blue: 0 }],
        ["activeMousePos", null],
        ["activeColourKey", null]
      ]
    });

    this.size = [100, 100];
    this.resizable = false;
  }

  updateSize(width: number, height: number): void {
    if (this.size[SIZE_WIDTH] !== width || this.size[SIZE_HEIGHT] !== height) {
      this.size = [width, height];
      this.setDirtyCanvas(true);
    }
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    if (this.flags.collapsed) {
      return;
    }

    const defaultFill = ctx.fillStyle;
    const defaultTextBaseline = ctx.textBaseline;

    const rootRegions = verticalStack(newCoordinate(0, 0))([
      regionWithMeta(newRegion(1, CONFIG.spacing[DIR_T]), flags("isGap")),
      regionWithMeta(
        newRegion(CONFIG.labelRowWidth, CONFIG.labelRowHeight),
        flags("isLabel", "hexLabel")
      ),
      regionWithMeta(newRegion(1, 6), flags("isGap")),
      regionWithMeta(
        newRegion(CONFIG.labelRowWidth, CONFIG.labelRowHeight),
        flags("isLabel", "intArrayLabel")
      ),
      regionWithMeta(newRegion(1, 10), flags("isGap")),
      regionWithMeta(
        newRegion(CONFIG.sliderRowWidth, CONFIG.sliderRowHeight),
        flags("isSlider", "colourRed")
      ),
      regionWithMeta(newRegion(1, 10), flags("isGap")),
      regionWithMeta(
        newRegion(CONFIG.sliderRowWidth, CONFIG.sliderRowHeight),
        flags("isSlider", "colourGreen")
      ),
      regionWithMeta(newRegion(1, 10), flags("isGap")),
      regionWithMeta(
        newRegion(CONFIG.sliderRowWidth, CONFIG.sliderRowHeight),
        flags("isSlider", "colourBlue")
      ),
      regionWithMeta(newRegion(1, CONFIG.spacing[DIR_B]), flags("isGap"))
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
      map((rootRegion: Region) => {
        const meta = rootRegion[REGION_META] as RegionMeta;

        if (meta.isLabel) {
          return shiftRegion(
            rootRegionsSize[SIZE_WIDTH] - regionWidth(rootRegion),
            0
          )(rootRegion);
        } else {
          return rootRegion;
        }
      }),
      forEach((rootRegion: Region) => {
        const rootRegionMeta = rootRegion[REGION_META] as RegionMeta;

        if (!rootRegionMeta.isGap) {
          const rootRegionWidth = regionWidth(rootRegion);
          const rootRegionHeight = regionHeight(rootRegion);

          if (rootRegionMeta.isLabel) {
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

            if (rootRegionMeta.hexLabel) {
              ctx.fillText(this.getHexValue(), ...regionCenter(rootRegion));
            } else if (rootRegionMeta.intArrayLabel) {
              ctx.fillText(
                `[${this.getIntArrayValue().join(", ")}]`,
                ...regionCenter(rootRegion)
              );
            }
          } else if (rootRegionMeta.isSlider) {
            const sliderFixedRegions = horizontalStack(rootRegion[COR_TL])([
              regionWithMeta(
                newRegion(CONFIG.spacing[DIR_L], rootRegionHeight),
                flags("isGap")
              ),
              regionWithMeta(newRegion(10, rootRegionHeight), flags("isLabel")),
              regionWithMeta(newRegion(6, rootRegionHeight), flags("isGap"))
            ]);

            const sliderFixedRegionsSize = over([
              flow([map(regionWidth), sum]),
              flow([map(regionHeight), max])
            ])(sliderFixedRegions);

            const sliderFlexRegions = horizontalStack(
              (last(sliderFixedRegions) as Region)[COR_TR]
            )([
              regionWithMeta(
                newRegion(
                  rootRegionWidth - sliderFixedRegionsSize[SIZE_WIDTH],
                  rootRegionHeight
                ),
                flags("isSlider")
              )
            ]);

            forEach((sliderRegion: Region) => {
              const sliderRegionMeta = sliderRegion[REGION_META] as RegionMeta;

              if (sliderRegionMeta.isLabel) {
                let labelText;
                if (rootRegionMeta.colourRed) {
                  labelText = "R";
                } else if (rootRegionMeta.colourGreen) {
                  labelText = "G";
                } else if (rootRegionMeta.colourBlue) {
                  labelText = "B";
                }

                if (labelText) {
                  ctx.font = "12px monospace";
                  ctx.fillStyle = defaultFill;
                  ctx.textBaseline = "middle";
                  ctx.textAlign = "center";
                  ctx.fillText(labelText, ...regionCenter(sliderRegion));
                }
              } else if (sliderRegionMeta.isSlider) {
                let sliderKey;
                if (rootRegionMeta.colourRed) {
                  sliderKey = "red";
                } else if (rootRegionMeta.colourGreen) {
                  sliderKey = "green";
                } else if (rootRegionMeta.colourBlue) {
                  sliderKey = "blue";
                }

                if (sliderKey) {
                  this.setMeta("sliderCoordinates", {
                    ...this.getMetaOr<
                      Record<string, [number, number, number, number]>
                    >({}, "sliderCoordinates"),
                    [sliderKey]: [
                      sliderRegion[COR_TL][POS_X],
                      sliderRegion[COR_TL][POS_Y],
                      regionWidth(sliderRegion),
                      regionHeight(sliderRegion)
                    ]
                  });

                  ctx.lineWidth = 1;
                  ctx.strokeStyle = defaultFill;
                  ctx.strokeRect(
                    ...this.getMetaOr<
                      Record<string, [number, number, number, number]>
                    >({}, "sliderCoordinates")[sliderKey]
                  );

                  ctx.fillStyle = "black";
                  ctx.fillRect(
                    ...this.getMetaOr<
                      Record<string, [number, number, number, number]>
                    >({}, "sliderCoordinates")[sliderKey]
                  );

                  ctx.fillStyle = (
                    CONFIG.sliderColour as Record<string, string>
                  )[sliderKey];
                  ctx.fillRect(
                    sliderRegion[COR_TL][POS_X],
                    sliderRegion[COR_TL][POS_Y],
                    regionWidth(sliderRegion) *
                      (this.getMetaOr<Record<string, number>>(
                        {},
                        "sliderValues"
                      )[sliderKey] /
                        MAX_SLIDER_VALUE),
                    regionHeight(sliderRegion)
                  );

                  ctx.fillStyle = defaultFill;
                  ctx.font = "12px monospace";
                  ctx.textBaseline = "middle";
                  ctx.textAlign = "center";
                  ctx.fillText(
                    `${
                      this.getMetaOr<Record<string, number>>(
                        {},
                        "sliderValues"
                      )[sliderKey]
                    }`,
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

  onMouseDown(evt: unknown, pos: [number, number]) {
    this.setMeta("activeMousePos", null);
    this.setMeta("activeColourKey", null);

    ["red", "green", "blue"].forEach((key) => {
      const sliderCoordinate = this.getMetaOr<
        Record<string, [number, number, number, number]>
      >({}, "sliderCoordinates")[key];

      if (
        pos[0] > sliderCoordinate[0] &&
        pos[1] > sliderCoordinate[1] &&
        pos[0] < sliderCoordinate[0] + sliderCoordinate[2] &&
        pos[1] < sliderCoordinate[1] + sliderCoordinate[3]
      ) {
        this.setMeta("sliderValues", {
          ...this.getMetaOr<Record<string, number>>({}, "sliderValues"),
          [key]: Math.round(
            MAX_SLIDER_VALUE *
              ((pos[0] - sliderCoordinate[0]) / sliderCoordinate[2])
          )
        });

        this.setMeta("activeMousePos", pos);
        this.setMeta("activeColourKey", key);
      }
    });

    if (
      this.getMeta("activeMousePos") !== null &&
      this.getMeta("activeColourKey") !== null
    ) {
      this.captureInput(true);
      return true;
    }
  }

  onMouseMove(evt: unknown, pos: [number, number]) {
    if (
      this.getMeta("activeMousePos") !== null &&
      this.getMeta("activeColourKey") !== null
    ) {
      const sliderCoordinate = this.getMetaOr<
        Record<string, [number, number, number, number]>
      >({}, "sliderCoordinates")[this.getMetaOr<string>("", "activeColourKey")];

      const sliderBaseValue = Math.round(
        MAX_SLIDER_VALUE *
          ((this.getMetaOr<[number, number]>([0, 0], "activeMousePos")[0] -
            sliderCoordinate[0]) /
            sliderCoordinate[2])
      );

      this.setMeta("sliderValues", {
        ...this.getMetaOr<Record<string, number>>({}, "sliderValues"),
        [this.getMetaOr<string>("", "activeColourKey")]: clamp(
          0,
          MAX_SLIDER_VALUE
        )(
          sliderBaseValue +
            Math.round(
              ((pos[0] -
                this.getMetaOr<[number, number]>([0, 0], "activeMousePos")[0]) /
                128) *
                MAX_SLIDER_VALUE
            )
        )
      });

      this.setDirtyCanvas(true);
    }
  }

  onMouseUp() {
    this.captureInput(false);
    this.setMeta("activeMousePos", null);
  }

  getHexValue() {
    return [
      this.getMetaOr<Record<string, number>>({}, "sliderValues")
        .red.toString(16)
        .padStart(2, "0"),
      this.getMetaOr<Record<string, number>>({}, "sliderValues")
        .green.toString(16)
        .padStart(2, "0"),
      this.getMetaOr<Record<string, number>>({}, "sliderValues")
        .blue.toString(16)
        .padStart(2, "0")
    ].join("");
  }

  getIntArrayValue() {
    return [
      this.getMetaOr<Record<string, number>>({}, "sliderValues").red,
      this.getMetaOr<Record<string, number>>({}, "sliderValues").green,
      this.getMetaOr<Record<string, number>>({}, "sliderValues").blue
    ];
  }

  onExecute() {
    this.setOutputData(0, this.getHexValue());
    this.setOutputData(1, this.getIntArrayValue());
  }
}

export default RGBSliderNode;
