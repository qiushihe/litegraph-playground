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

export const newCoordinate = (x, y) => [x || 0, y || 0];

export const newRegion = (width, height, origin = newCoordinate(0, 0)) => [
  [origin[POS_X], origin[POS_Y]],
  [origin[POS_X] + width, origin[POS_Y]],
  [origin[POS_X] + width, origin[POS_Y] + height],
  [origin[POS_X], origin[POS_Y] + height]
];

export const regionWidth = (region) => {
  return (
    Math.max(region[COR_TR][POS_X], region[COR_BR][POS_X]) -
    Math.min(region[COR_TL][POS_X], region[COR_BL][POS_X])
  );
};

export const regionHeight = (region) => {
  return (
    Math.max(region[COR_BR][POS_Y], region[COR_BL][POS_Y]) -
    Math.min(region[COR_TL][POS_Y], region[COR_TR][POS_Y])
  );
};

export const regionCenter = (region) => {
  const minX = Math.min(region[COR_TL][POS_X], region[COR_BL][POS_X]);
  const maxX = Math.max(region[COR_TR][POS_X], region[COR_BR][POS_X]);
  const minY = Math.min(region[COR_TL][POS_Y], region[COR_BL][POS_Y]);
  const maxY = Math.max(region[COR_TL][POS_Y], region[COR_BL][POS_Y]);

  return newCoordinate(minX + (maxX - minX) / 2, minY + (maxY - minY) / 2);
};

export const shiftRegion = (shiftX, shiftY) => (region) => {
  const adjusted = newRegion(regionWidth(region), regionHeight(region), [
    region[COR_TL][POS_X] + shiftX,
    region[COR_TL][POS_Y] + shiftY
  ]);

  return [...adjusted, ...region.slice(REGION_META)];
};

const regionsStack = (iterateOriginFn) => (origin) => (regions) => {
  const { regions: result } = reduce(
    (acc, region) => {
      const adjusted = newRegion(
        regionWidth(region),
        regionHeight(region),
        acc.origin
      );

      return {
        ...acc,
        regions: [...acc.regions, [...adjusted, ...region.slice(REGION_META)]],
        origin: iterateOriginFn(adjusted, region)
      };
    },
    { regions: [], origin }
  )(regions);

  return result;
};

export const horizontalStack = regionsStack(get(COR_TR));

export const verticalStack = regionsStack(get(COR_BL));
