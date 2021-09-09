import flow from "lodash/fp/flow";
import get from "lodash/fp/get";
import getOr from "lodash/fp/getOr";
import map from "lodash/fp/map";
import over from "lodash/fp/over";
import forEach from "lodash/fp/forEach";
import size from "lodash/fp/size";
import sum from "lodash/fp/sum";
import max from "lodash/fp/max";
import reduce from "lodash/fp/reduce";
import flatten from "lodash/fp/flatten";
import slice from "lodash/fp/slice";
import times from "lodash/fp/times";
import cond from "lodash/fp/cond";
import isNumber from "lodash/fp/isNumber";
import isEmpty from "lodash/fp/isEmpty";
import identity from "lodash/fp/identity";
import stubTrue from "lodash/fp/stubTrue";
import constant from "lodash/fp/constant";
import toString from "lodash/fp/toString";

import { flags } from "../../util/property";

import {
  COR_TL,
  POS_X,
  POS_Y,
  REGION_META,
  SIZE_HEIGHT,
  SIZE_WIDTH
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
  regionCenter
} from "../../util/canvas";

import BaseNode, { dataSocket } from "../base-node";

type TableCell = [
  string, // text
  number, // width
  number // height
];

type TableRow = TableCell[];

type RegionMeta = {
  isRow: boolean;
  isCell: boolean;
  isGap: boolean;
  rowIndex: number;
  cellIndex: number;
};

const TITLE = "Table";

const CONFIG = {
  spacing: [30, 20, 10, 20]
};

const interleave = (thing: unknown) =>
  flow([map((n: unknown) => [n, thing]), flatten, slice(0, -1)]);

class TableNode extends BaseNode {
  static title = TITLE;

  constructor() {
    super(TITLE, {
      sockets: {
        input: [dataSocket("value[][]")],
        output: [dataSocket("value[][]")]
      },
      metadata: [["tableData", null]]
    });

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

    const data = this.getMetaOr<unknown[][]>([], "tableData");

    const columnsCount = flow([
      map(size),
      max,
      cond([
        [isNumber, identity],
        [stubTrue, constant(0)]
      ])
    ])(data);

    const rowRegions: Region[] = flow([
      // Measure cell dimension and generate `TableCell` entries inside `TableRow` entries.
      reduce(
        (acc: TableRow[], row: unknown[]) => [
          ...acc,
          map((cell: unknown) => {
            const cellText = toString(cell);

            // Set font size before measuring text.
            ctx.font = "12px monospace";

            const {
              width: cellWidth,
              fontBoundingBoxAscent,
              fontBoundingBoxDescent
            } = ctx.measureText(cellText) as TextMetrics & {
              fontBoundingBoxAscent: number;
              fontBoundingBoxDescent: number;
            };

            return [
              cellText,
              cellWidth,
              fontBoundingBoxAscent + fontBoundingBoxDescent
            ] as TableCell;
          })(row)
        ],
        []
      ),

      // Calculate max column widths for each column.
      reduce(
        (acc, row: TableRow) => {
          const columnWidths: number[] = [...acc.columnWidths];

          flow([
            times(identity),
            forEach((columnIndex: number) => {
              const columnWidth = getOr(0, columnIndex)(columnWidths);
              columnWidths[columnIndex] =
                row[columnIndex][1] > columnWidth
                  ? row[columnIndex][1]
                  : columnWidth;
            })
          ])(columnsCount);

          return {
            ...acc,
            rows: [...acc.rows, row],
            columnWidths
          };
        },
        {
          rows: [] as TableRow[],
          columnWidths: [] as number[]
        }
      ),

      // Render rows/cells with data.
      ({ rows, columnWidths }) => {
        const rowRegions: Region[] = flow([
          // Apply max column width from previous calculation.
          map((row: TableRow) => {
            flow([
              times(identity),
              forEach((columnIndex: number) => {
                row[columnIndex][1] = columnWidths[columnIndex];
              })
            ])(columnsCount);

            return row;
          }),

          // Generate row regions.
          over([flow([size, times(identity)]), identity]),
          ([indices, rows]: [number[], TableRow[]]) => {
            return map((rowIndex: number) => {
              const row = rows[rowIndex];
              const rowWidth = flow([map(get(1)), sum])(row);
              const rowHeight = flow([map(get(2)), max])(row);

              return regionWithMeta(newRegion(rowWidth, rowHeight), {
                ...flags("isRow"),
                rowIndex
              });
            })(indices);
          },

          // Insert gap between each row.
          interleave(regionWithMeta(newRegion(1, 3), flags("isGap"))),

          // Stack rows vertically.
          verticalStack(newCoordinate(CONFIG.spacing[3], CONFIG.spacing[0])),

          map((rowRegion: Region) => {
            const rowRegionMeta = rowRegion[REGION_META] as RegionMeta;

            if (rowRegionMeta.isRow) {
              const rowIndex = rowRegionMeta.rowIndex;
              const row = rows[rowIndex];

              const cellRegions = flow([
                // Generate cell regions.
                over([flow([size, times(identity)]), identity]),
                ([indices, row]: [number[], TableRow]) => {
                  return map((cellIndex: number) => {
                    const cell = row[cellIndex];
                    return regionWithMeta(newRegion(cell[1], cell[2]), {
                      ...flags("isCell"),
                      cellIndex
                    });
                  })(indices);
                },

                // Insert gaps between cells.
                interleave(regionWithMeta(newRegion(6, 1), flags("isGap"))),

                // Stack cells horizontally.
                horizontalStack(rowRegion[COR_TL])
              ])(row);

              // Render cell.
              forEach((cellRegion: Region) => {
                const cellRegionMeta = cellRegion[REGION_META] as RegionMeta;

                if (cellRegionMeta.isCell) {
                  const cellIndex = cellRegionMeta.cellIndex;
                  const cell = rows[rowIndex][cellIndex];

                  ctx.fillStyle = "black";
                  ctx.fillRect(
                    cellRegion[COR_TL][POS_X],
                    cellRegion[COR_TL][POS_Y],
                    regionWidth(cellRegion),
                    regionHeight(cellRegion)
                  );

                  ctx.font = "12px monospace";
                  ctx.fillStyle = defaultFill;
                  ctx.textBaseline = "middle";
                  ctx.textAlign = "center";
                  ctx.fillText(cell[0], ...regionCenter(cellRegion));
                }
              })(cellRegions);

              // Calculate total width/height of the current row.
              const cellsWidth = flow([map(regionWidth), sum])(cellRegions);
              const cellsHeight = flow([map(regionHeight), max])(cellRegions);

              // Return a new row region with the updated width height so the dimension of the row
              // region accurately matches the content.
              return newRegion(
                cellsWidth,
                cellsHeight,
                newCoordinate(
                  rowRegion[COR_TL][POS_X],
                  rowRegion[COR_TL][POS_Y]
                )
              );
            } else {
              // For gap row regions, return as is (they would have a slightly smaller width but
              // that's okay because the data row regions would be larger and those larger width
              // would be taken over the small ones anyawy).
              return rowRegion;
            }
          })
        ])(rows);

        return rowRegions;
      }
    ])(data);

    if (isEmpty(rowRegions)) {
      const placeholderSize = [150, 50];

      ctx.font = "24px monospace";
      ctx.fillStyle = defaultFill;
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.fillText(
        "NO DATA",
        ...regionCenter(
          newRegion(
            placeholderSize[0],
            placeholderSize[1],
            newCoordinate(CONFIG.spacing[3], CONFIG.spacing[0])
          )
        )
      );

      this.updateSize(
        CONFIG.spacing[3] + placeholderSize[0] + CONFIG.spacing[1],
        CONFIG.spacing[0] + placeholderSize[1] + CONFIG.spacing[2]
      );
    } else {
      const totalWidth = flow([map(regionWidth), max])(rowRegions);
      const totalHeight = flow([map(regionHeight), sum])(rowRegions);

      this.updateSize(
        CONFIG.spacing[3] + totalWidth + CONFIG.spacing[1],
        CONFIG.spacing[0] + totalHeight + CONFIG.spacing[2]
      );
    }

    // Not sure why this is the only attribute that needed resetting... but it do be like that.
    ctx.textBaseline = defaultTextBaseline;
  }

  onExecute() {
    if (this.isInputConnected(0)) {
      this.setMeta("tableData", this.getInputDataOr<unknown[][]>([], 0));
      this.setDirtyCanvas(true);
    }

    this.setOutputData(0, this.getInputData(0));
  }
}

export default TableNode;
