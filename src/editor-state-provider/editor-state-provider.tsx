import React, { useState, useCallback } from "react";
import PropTypes, { InferProps } from "prop-types";
import flow from "lodash/fp/flow";
import noop from "lodash/fp/noop";
import constant from "lodash/fp/constant";
import compact from "lodash/fp/compact";
import map from "lodash/fp/map";
import forEach from "lodash/fp/forEach";
import reduce from "lodash/fp/reduce";

import BaseNode from "../node-type/base-node";
import { Coordinate, Dimension } from "../util/canvas";
import { POS_X, POS_Y, SIZE_HEIGHT, SIZE_WIDTH } from "../enum/canvas.enum";

export interface IEditorStateDelegate {
  getNodeById?: (id: number) => BaseNode | null;
  setCanvasCenter?: (coordinate: Coordinate) => void;
}

export interface IEditorState {
  setDelegate: (delegate: IEditorStateDelegate) => void;
  getSelectedNodeIds: () => number[];
  setSelectedNodeIds: (ids: number[]) => void;
  getNodeById: (id: number) => BaseNode | null;
  removeNodesByIds: (ids: number[]) => void;
  cloneNodesByIds: (ids: number[]) => void;
  focusNodesByIds: (ids: number[]) => void;
}

const PROP_TYPES = {
  children: PropTypes.any
};

const DEFAULT_PROPS = {
  children: null
};

export const EditorStateContext = React.createContext<IEditorState>({
  setDelegate: noop,
  getSelectedNodeIds: constant([]),
  setSelectedNodeIds: noop,
  getNodeById: constant(null),
  removeNodesByIds: noop,
  cloneNodesByIds: noop,
  focusNodesByIds: noop
});

const EditorStateProvider: React.FunctionComponent<
  InferProps<typeof PROP_TYPES>
> = (props) => {
  const children = props.children || DEFAULT_PROPS.children;

  const [delegate, setDelegate] = useState<IEditorStateDelegate | null>(null);
  const [selectedNodeIds, setSelectedNodeIds] = useState<number[]>([]);

  const handleSetDelegate = useCallback(
    (newDelegate: IEditorStateDelegate) => {
      if (newDelegate !== delegate) {
        setDelegate(newDelegate);
      }
    },
    [delegate]
  );

  const handleGetNodeById = useCallback(
    (id: number): BaseNode | null => {
      if (!delegate) {
        return null;
      }

      if (!delegate.getNodeById) {
        return null;
      }

      return delegate.getNodeById(id);
    },
    [delegate]
  );

  const handleRemoveNodesByIds = useCallback(
    (ids: number[]) => {
      if (!delegate) {
        return;
      }

      if (!delegate.getNodeById) {
        return;
      }

      const getNodeById = delegate.getNodeById;

      forEach((nodeId: number) => {
        const node = getNodeById(nodeId);
        if (node) {
          const graph = node.graph;
          graph.beforeChange();
          graph.remove(node);
          graph.afterChange();
          node.setDirtyCanvas(true, true);
        }
      })(ids);
    },
    [delegate]
  );

  const handleCloneNodesByIds = useCallback(
    (ids: number[]) => {
      if (!delegate) {
        return;
      }

      if (!delegate.getNodeById) {
        return;
      }

      const getNodeById = delegate.getNodeById;

      forEach((nodeId: number) => {
        const node = getNodeById(nodeId);
        if (node) {
          const newNode = node.clone();
          if (newNode) {
            newNode.pos = [node.pos[0] + 5, node.pos[1] + 5];
            node.graph.beforeChange();
            node.graph.add(newNode);
            node.graph.afterChange();
            node.setDirtyCanvas(true, true);
          }
        }
      })(ids);
    },
    [delegate]
  );

  const handleFocusNodesByIds = useCallback(
    (ids: number[]) => {
      if (!delegate) {
        return;
      }

      if (!delegate.getNodeById || !delegate.setCanvasCenter) {
        return;
      }

      const getNodeById = delegate.getNodeById;

      const focusCoordinate = flow([
        map(getNodeById),
        compact,
        reduce(
          (acc, node: BaseNode) => {
            if (node.pos[POS_X] < acc.origin[POS_X]) {
              acc.origin[POS_X] = node.pos[POS_X];
            }

            if (node.pos[POS_Y] < acc.origin[POS_Y]) {
              acc.origin[POS_Y] = node.pos[POS_Y];
            }

            if (
              node.pos[POS_X] + node.size[SIZE_WIDTH] >
              acc.origin[POS_X] + acc.size[SIZE_WIDTH]
            ) {
              acc.size[SIZE_WIDTH] =
                node.pos[POS_X] + node.size[SIZE_WIDTH] - acc.origin[POS_X];
            }

            if (
              node.pos[POS_Y] + node.size[SIZE_HEIGHT] >
              acc.origin[POS_Y] + acc.size[SIZE_HEIGHT]
            ) {
              acc.size[SIZE_HEIGHT] =
                node.pos[POS_Y] + node.size[SIZE_HEIGHT] - acc.origin[POS_Y];
            }

            return acc;
          },
          {
            origin: [Infinity, Infinity] as Coordinate,
            size: [0, 0] as Dimension
          }
        ),
        ({
          origin,
          size
        }: {
          origin: Coordinate;
          size: Dimension;
        }): Dimension => [
          origin[POS_X] + size[SIZE_WIDTH] / 2,
          origin[POS_Y] + size[SIZE_HEIGHT] / 2
        ]
      ])(ids) as Coordinate;

      delegate.setCanvasCenter(focusCoordinate);
    },
    [delegate]
  );

  return (
    <EditorStateContext.Provider
      value={{
        setDelegate: handleSetDelegate,
        getSelectedNodeIds: () => selectedNodeIds,
        setSelectedNodeIds,
        getNodeById: handleGetNodeById,
        removeNodesByIds: handleRemoveNodesByIds,
        cloneNodesByIds: handleCloneNodesByIds,
        focusNodesByIds: handleFocusNodesByIds
      }}
    >
      {children}
    </EditorStateContext.Provider>
  );
};

EditorStateProvider.propTypes = PROP_TYPES;
EditorStateProvider.defaultProps = DEFAULT_PROPS;

export default EditorStateProvider;
