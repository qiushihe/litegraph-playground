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

import {
  LiteGraph,
  LGraphNode,
  LGraphCanvas,
  ContextMenu
} from "../litegraph-core";

import plainSet from "../util/plain-set";
import plainGet from "../util/plain-get";

const nodeTypesIndexer = (filterNodeTypes: (node: LGraphNode) => boolean) =>
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
  ]) as (nodeTypes: Record<string, LGraphNode>) => Record<string, LGraphNode>;

const menuBuilder = (
  indexedNodeTypes: Record<string, unknown>,
  mapMenuLabel: (key: string, path: string) => string,
  mapEntryLabel: (key: string, path: string) => string,
  canvas: LGraphCanvas,
  evt: unknown,
  callback: (node: LGraphNode) => void
) => {
  const buildMenu = (baseCategory: string, parentMenu: ContextMenu) => {
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
      map((categoryPath: string) => ({
        value: categoryPath,
        content: mapMenuLabel(
          flow([split("."), last])(categoryPath),
          categoryPath
        ),
        has_submenu: true,
        callback: (
          entry: { value: string },
          evt: unknown,
          mouseEvt: unknown,
          ctxMenu: ContextMenu
        ) => {
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
          callback: (
            entry: { value: string },
            evt: unknown,
            mouseEvt: unknown,
            ctxMenu: ContextMenu
          ) => {
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
  (
    filterNodeTypes: (node: LGraphNode) => boolean = constant(true),
    mapMenuLabel: (key: string, path: string) => string = identity,
    mapEntryLabel: (key: string, path: string) => string = identity
  ) =>
  (
    node: LGraphNode,
    options: unknown,
    evt: unknown,
    parentMenu: ContextMenu,
    callback: (node: LGraphNode) => void
  ) => {
    const canvas = LGraphCanvas.active_canvas;

    if (!canvas.graph) {
      return;
    }

    const indexNodeTypes = nodeTypesIndexer(filterNodeTypes);

    const indexedNodeTypes = indexNodeTypes(LiteGraph.registered_node_types);

    const buildMenu = menuBuilder(
      indexedNodeTypes,
      mapMenuLabel,
      mapEntryLabel,
      canvas,
      evt,
      callback
    );

    buildMenu("", parentMenu);

    return false;
  };

export default addNode;
