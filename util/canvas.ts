import reduce from "lodash/fp/reduce";
import get from "lodash/fp/get";

import {
  COR_TL,
  COR_TR,
  COR_BR,
  COR_BL,
  REGION_META,
  POS_X,
  POS_Y
} from "../enum/canvas.enum";

type Restore2DContextFunction = () => void;

type Preserved2DContextAttributes = {
  strokeStyle: typeof CanvasRenderingContext2D.prototype.strokeStyle;
  fillStyle: typeof CanvasRenderingContext2D.prototype.fillStyle;
  globalAlpha: typeof CanvasRenderingContext2D.prototype.globalAlpha;
  lineWidth: typeof CanvasRenderingContext2D.prototype.lineWidth;
  lineCap: typeof CanvasRenderingContext2D.prototype.lineCap;
  lineJoin: typeof CanvasRenderingContext2D.prototype.lineJoin;
  miterLimit: typeof CanvasRenderingContext2D.prototype.miterLimit;
  lineDashOffset: typeof CanvasRenderingContext2D.prototype.lineDashOffset;
  shadowOffsetX: typeof CanvasRenderingContext2D.prototype.shadowOffsetX;
  shadowOffsetY: typeof CanvasRenderingContext2D.prototype.shadowOffsetY;
  shadowBlur: typeof CanvasRenderingContext2D.prototype.shadowBlur;
  shadowColor: typeof CanvasRenderingContext2D.prototype.shadowColor;
  globalCompositeOperation: typeof CanvasRenderingContext2D.prototype.globalCompositeOperation;
  font: typeof CanvasRenderingContext2D.prototype.font;
  textAlign: typeof CanvasRenderingContext2D.prototype.textAlign;
  textBaseline: typeof CanvasRenderingContext2D.prototype.textBaseline;
  direction: typeof CanvasRenderingContext2D.prototype.direction;
  imageSmoothingEnabled: typeof CanvasRenderingContext2D.prototype.imageSmoothingEnabled;
};

// Saved properties: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/save
export const preserve2DContext = (
  ctx: CanvasRenderingContext2D
): [Restore2DContextFunction, Preserved2DContextAttributes] => {
  const {
    strokeStyle,
    fillStyle,
    globalAlpha,
    lineWidth,
    lineCap,
    lineJoin,
    miterLimit,
    lineDashOffset,
    shadowOffsetX,
    shadowOffsetY,
    shadowBlur,
    shadowColor,
    globalCompositeOperation,
    font,
    textAlign,
    textBaseline,
    direction,
    imageSmoothingEnabled
  } = ctx;

  ctx.save();

  return [
    () => ctx.restore(),
    {
      strokeStyle,
      fillStyle,
      globalAlpha,
      lineWidth,
      lineCap,
      lineJoin,
      miterLimit,
      lineDashOffset,
      shadowOffsetX,
      shadowOffsetY,
      shadowBlur,
      shadowColor,
      globalCompositeOperation,
      font,
      textAlign,
      textBaseline,
      direction,
      imageSmoothingEnabled
    }
  ];
};

export type Coordinate = [number, number];

export type Dimension = [number, number];

export type Region = [Coordinate, Coordinate, Coordinate, Coordinate, unknown?];

export const newCoordinate = (x: number, y: number): Coordinate => [
  x || 0,
  y || 0
];

export const newRegion = (
  width: number,
  height: number,
  origin = newCoordinate(0, 0)
): Region => [
  [origin[POS_X], origin[POS_Y]],
  [origin[POS_X] + width, origin[POS_Y]],
  [origin[POS_X] + width, origin[POS_Y] + height],
  [origin[POS_X], origin[POS_Y] + height]
];

export const regionWithMeta = (region: Region, meta: unknown): Region => {
  return [...region.slice(0, 4), meta] as unknown as Region;
};

export const regionWidth = (region: Region): number => {
  return (
    Math.max(region[COR_TR][POS_X], region[COR_BR][POS_X]) -
    Math.min(region[COR_TL][POS_X], region[COR_BL][POS_X])
  );
};

export const regionHeight = (region: Region): number => {
  return (
    Math.max(region[COR_BR][POS_Y], region[COR_BL][POS_Y]) -
    Math.min(region[COR_TL][POS_Y], region[COR_TR][POS_Y])
  );
};

export const regionCenter = (region: Region): Coordinate => {
  const minX = Math.min(region[COR_TL][POS_X], region[COR_BL][POS_X]);
  const maxX = Math.max(region[COR_TR][POS_X], region[COR_BR][POS_X]);
  const minY = Math.min(region[COR_TL][POS_Y], region[COR_BL][POS_Y]);
  const maxY = Math.max(region[COR_TL][POS_Y], region[COR_BL][POS_Y]);

  return newCoordinate(minX + (maxX - minX) / 2, minY + (maxY - minY) / 2);
};

export const shiftRegion =
  (shiftX: number, shiftY: number) =>
  (region: Region): Region => {
    const adjusted = newRegion(regionWidth(region), regionHeight(region), [
      region[COR_TL][POS_X] + shiftX,
      region[COR_TL][POS_Y] + shiftY
    ]);

    return [...adjusted, ...region.slice(REGION_META)] as Region;
  };

type RegionStackIteratorFn = (
  adjusted: Region,
  original?: Region
) => Coordinate;

const regionsStack =
  (iterateOriginFn: RegionStackIteratorFn) =>
  (origin: Coordinate) =>
  (regions: Region[]) => {
    const { regions: result } = reduce(
      (acc, region: Region) => {
        const adjusted = newRegion(
          regionWidth(region),
          regionHeight(region),
          acc.origin
        );

        return {
          ...acc,
          regions: [
            ...acc.regions,
            [...adjusted, ...region.slice(REGION_META)] as Region
          ],
          origin: iterateOriginFn(adjusted, region)
        };
      },
      { regions: [], origin } as { regions: Region[]; origin: Coordinate }
    )(regions);

    return result;
  };

export const horizontalStack = regionsStack(get(COR_TR));

export const verticalStack = regionsStack(get(COR_BL));
