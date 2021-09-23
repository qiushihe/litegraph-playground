import flow from "lodash/fp/flow";
import trim from "lodash/fp/trim";
import toLower from "lodash/fp/toLower";
import split from "lodash/fp/split";
import map from "lodash/fp/map";
import reduce from "lodash/fp/reduce";
import get from "lodash/fp/get";
import getOr from "lodash/fp/getOr";
import filter from "lodash/fp/filter";
import over from "lodash/fp/over";
import overEvery from "lodash/fp/overEvery";
import negate from "lodash/fp/negate";
import isNil from "lodash/fp/isNil";
import sortBy from "lodash/fp/sortBy";
import first from "lodash/fp/first";

import BaseNode, { dataSocket } from "../base-node";

type ColourEntry = {
  name: string;
  colour: string;
};

type MeasuredColourEntry = ColourEntry & {
  distance: number;
};

const TITLE = "FindClosest";

const HEX_TO_RGB_REGEXP = new RegExp(
  "^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$"
);

const splitColourHex = flow([
  toLower,
  trim,
  (str) => str.match(HEX_TO_RGB_REGEXP),
  over([getOr(0, 1), getOr(0, 2), getOr(0, 3)]),
  map((value: string): number => parseInt(value, 16))
]);

class FindClosestNode extends BaseNode {
  static title = TITLE;

  constructor() {
    super(TITLE, {
      sockets: {
        input: [dataSocket("spec"), dataSocket("colour")],
        output: [dataSocket("name"), dataSocket("colour")]
      }
    });

    this.resizable = false;
  }

  onExecute() {
    const colourRgb = splitColourHex(this.getInputData(1));

    const closest: MeasuredColourEntry | null = flow([
      trim,
      split(","),
      reduce(
        (acc: ColourEntry[], entry: string) => [
          ...acc,
          flow([
            trim,
            split("|"),
            over<string>([getOr(null, 0), getOr(null, 1)]),
            ([name, colour]) => ({ name, colour })
          ])(entry)
        ],
        []
      ),
      filter<ColourEntry>(
        overEvery([
          flow([get("name"), negate(isNil)]),
          flow([get("colour"), negate(isNil)])
        ])
      ),
      map<ColourEntry, MeasuredColourEntry>((entry) => {
        const entryRgb = flow([get("colour"), splitColourHex])(entry);

        return {
          ...entry,
          distance: Math.sqrt(
            (entryRgb[0] - colourRgb[0]) ** 2 +
              (entryRgb[1] - colourRgb[2]) ** 2 +
              (entryRgb[1] - colourRgb[2]) ** 2
          )
        };
      }),
      sortBy<MeasuredColourEntry>(get("distance")),
      first
    ])(this.getInputData(0));

    if (closest) {
      this.setOutputData(0, closest.name);
      this.setOutputData(1, closest.colour);
    } else {
      this.setOutputData(0, null);
      this.setOutputData(1, null);
    }
  }
}

export default FindClosestNode;
