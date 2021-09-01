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

const nodeType = {
  title: "FindClosest",
  defaultClass: null
};

const HEX_TO_RGB_REGEXP = new RegExp(
  "^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$"
);

const splitColourHex = flow([
  toLower,
  trim,
  (str) => str.match(HEX_TO_RGB_REGEXP),
  over([getOr(0, 1), getOr(0, 2), getOr(0, 3)]),
  map((value) => parseInt(value, 16))
]);

const defineNodeType = ({ LGraphNode }) => {
  if (nodeType.defaultClass === null) {
    nodeType.defaultClass = class extends LGraphNode {
      static title = nodeType.title;

      constructor() {
        super(nodeType.title);

        this.addInput("spec", "");
        this.addInput("colour", "");

        this.addOutput("name", "");
        this.addOutput("colour", "");

        this.resizable = false;
      }

      onExecute() {
        const colourRgb = splitColourHex(this.getInputData(1));

        const closest = flow([
          trim,
          split(","),
          reduce(
            (acc, entry) => [
              ...acc,
              flow([
                trim,
                split("|"),
                over([getOr(null, 0), getOr(null, 1)]),
                ([name, colour]) => ({ name, colour })
              ])(entry)
            ],
            []
          ),
          filter(
            overEvery([
              flow([get("name"), negate(isNil)]),
              flow([get("colour"), negate(isNil)])
            ])
          ),
          map((entry) => {
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
          sortBy(get("distance")),
          first
        ])(this.getInputData(0));

        this.setOutputData(0, getOr(null, "name")(closest));
        this.setOutputData(1, getOr(null, "colour")(closest));
      }
    };
  }

  return nodeType.defaultClass;
};

export default defineNodeType;
