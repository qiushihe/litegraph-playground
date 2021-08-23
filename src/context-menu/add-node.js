import { LGraphCanvas, LiteGraph } from "litegraph.js/build/litegraph.min";
import flow from "lodash/fp/flow";
import keys from "lodash/fp/keys";
import reduce from "lodash/fp/reduce";
import compact from "lodash/fp/compact";
import uniq from "lodash/fp/uniq";
import filter from "lodash/fp/filter";
import map from "lodash/fp/map";
import trim from "lodash/fp/trim";
import split from "lodash/fp/split";
import join from "lodash/fp/join";
import getOr from "lodash/fp/getOr";
import over from "lodash/fp/over";
import sortBy from "lodash/fp/sortBy";
import identity from "lodash/fp/identity";
import constant from "lodash/fp/constant";
import concat from "lodash/fp/concat";
import reverse from "lodash/fp/reverse";
import negate from "lodash/fp/negate";
import slice from "lodash/fp/slice";
import last from "lodash/fp/last";
import isEmpty from "lodash/fp/isEmpty";
import startsWith from "lodash/fp/startsWith";

import plainSet from "../util/plain-set";
import plainGet from "../util/plain-get";

const nodeTypesIndexer = ({ filterNodeTypes }) =>
  flow([
    keys,
    filter(filterNodeTypes),
    map(trim),
    compact,
    reduce((acc, nodeTypeKey) => {
      const nodeType = LiteGraph.registered_node_types[nodeTypeKey];
      const nodeTypePaths = split("/")(nodeTypeKey);
      const nodeTypePath = join(".")(nodeTypePaths);

      const nodeTypeIsMenuPath = flow([
        split("."),
        slice(0, -1),
        reverse,
        concat("@@@isMenu"),
        reverse,
        join(".")
      ])(nodeTypePath);

      const nodeTypeEntriesPath = flow([
        split("."),
        slice(0, -1),
        reverse,
        concat("@@@entries"),
        reverse,
        join(".")
      ])(nodeTypePath);

      return flow([
        plainSet(nodeTypeIsMenuPath, true),
        plainSet(nodeTypeEntriesPath, [
          ...getOr([], nodeTypeEntriesPath)(acc),
          last(nodeTypePaths)
        ]),
        plainSet(nodeTypePath, nodeType)
      ])(acc);
    }, {})
  ]);

const menuBuilder = ({
  indexedNodeTypes,
  mapMenuLabel,
  mapEntryLabel,
  canvas,
  evt,
  callback
}) => {
  const buildMenu = (baseCategory, parentMenu) => {
    const entry = isEmpty(baseCategory)
      ? indexedNodeTypes
      : plainGet(baseCategory)(indexedNodeTypes) || {};

    const entryKeys = flow([
      keys,
      filter(negate(startsWith("@@@"))),
      uniq,
      sortBy(identity)
    ])(entry);

    const menuEntries = flow([
      map(flow([concat(baseCategory), compact, join(".")])),
      filter((entryPath) =>
        plainGet(`${entryPath}.@@@isMenu`)(indexedNodeTypes)
      ),
      map((categoryPath) => ({
        value: categoryPath,
        content: mapMenuLabel(
          flow([split("."), last])(categoryPath),
          categoryPath
        ),
        has_submenu: true,
        callback: (entry, evt, mouseEvt, ctxMenu) => {
          buildMenu(entry.value, ctxMenu);
        }
      }))
    ])(entryKeys);

    const itemEntries = flow([
      map(flow([concat(baseCategory), compact, join(".")])),
      filter(
        (entryPath) => !plainGet(`${entryPath}.@@@isMenu`)(indexedNodeTypes)
      ),
      map(
        over([
          identity,
          (nodeTypePath) => plainGet(nodeTypePath)(indexedNodeTypes)
        ])
      ),
      map(([nodeTypeKey, nodeType]) => {
        return {
          value: nodeTypeKey,
          content: mapEntryLabel(nodeType.title, nodeTypeKey),
          has_submenu: false,
          callback: (entry, evt, mouseEvt, ctxMenu) => {
            canvas.graph.beforeChange();

            const node = LiteGraph.createNode(
              flow([split("."), join("/")])(entry.value)
            );

            if (node) {
              node.pos = canvas.convertEventToCanvasOffset(
                ctxMenu.getFirstEvent()
              );
              canvas.graph.add(node);
            }

            if (callback) {
              callback(node);
            }

            canvas.graph.afterChange();
          }
        };
      })
    ])(entryKeys);

    new LiteGraph.ContextMenu(
      [...menuEntries, ...itemEntries],
      { event: evt, parentMenu: parentMenu },
      canvas.getCanvasWindow()
    );
  };

  return buildMenu;
};

const addNode =
  ({
    filterNodeTypes = constant(true),
    mapMenuLabel = identity,
    mapEntryLabel = identity
  } = {}) =>
  (node, options, evt, parentMenu, callback) => {
    const canvas = LGraphCanvas.active_canvas;

    if (!canvas.graph) {
      return;
    }

    const indexNodeTypes = nodeTypesIndexer({ filterNodeTypes });

    const indexedNodeTypes = indexNodeTypes(LiteGraph.registered_node_types);

    const buildMenu = menuBuilder({
      indexedNodeTypes,
      mapMenuLabel,
      mapEntryLabel,
      canvas,
      evt,
      callback
    });

    buildMenu("", parentMenu);

    return false;
  };

export default addNode;
