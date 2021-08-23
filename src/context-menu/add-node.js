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
import first from "lodash/fp/first";
import last from "lodash/fp/last";
import over from "lodash/fp/over";
import sortBy from "lodash/fp/sortBy";
import identity from "lodash/fp/identity";
import constant from "lodash/fp/constant";
import concat from "lodash/fp/concat";
import negate from "lodash/fp/negate";
import slice from "lodash/fp/slice";
import isEmpty from "lodash/fp/isEmpty";
import startsWith from "lodash/fp/startsWith";

import plainSet from "../util/plain-set";
import plainGet from "../util/plain-get";

const nodeTypesIndexer = ({ LiteGraph, filterNodeTypes }) =>
  flow([
    keys,
    filter(filterNodeTypes),
    map(trim),
    compact,
    map(
      over([
        flow([split("/"), join(".")]),
        (nodeTypeKey) => LiteGraph.registered_node_types[nodeTypeKey]
      ])
    ),
    reduce(
      (acc, [nodeTypePath, nodeType]) =>
        flow([
          ...flow([
            split("."),
            over([first, slice(1, -1)]),
            ([fragment, fragments]) => [
              ...reduce(
                (acc, fragment) => [...acc, `${last(acc)}.${fragment}`],
                [fragment]
              )(fragments)
            ],
            map((path) => plainSet(`${path}.@@@isMenu`, true))
          ])(nodeTypePath),
          plainSet(nodeTypePath, nodeType)
        ])(acc),
      {}
    )
  ]);

const menuBuilder = ({
  LiteGraph,
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
    LGraphCanvas,
    LiteGraph,
    filterNodeTypes = constant(true),
    mapMenuLabel = identity,
    mapEntryLabel = identity
  } = {}) =>
  (node, options, evt, parentMenu, callback) => {
    const canvas = LGraphCanvas.active_canvas;

    if (!canvas.graph) {
      return;
    }

    const indexNodeTypes = nodeTypesIndexer({ LiteGraph, filterNodeTypes });

    const indexedNodeTypes = indexNodeTypes(LiteGraph.registered_node_types);

    const buildMenu = menuBuilder({
      LiteGraph,
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
