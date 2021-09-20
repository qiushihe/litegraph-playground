import React, { useState, useCallback } from "react";
import PropTypes, { InferProps } from "prop-types";
import noop from "lodash/fp/noop";
import constant from "lodash/fp/constant";
import forEach from "lodash/fp/forEach";

import BaseNode from "../node-type/base-node";

export interface IEditorStateDelegate {
  getNodeById?: (id: number) => BaseNode | null;
}

export interface IEditorState {
  setDelegate: (delegate: IEditorStateDelegate) => void;
  getSelectedNodeIds: () => number[];
  setSelectedNodeIds: (ids: number[]) => void;
  getNodeById: (id: number) => BaseNode | null;
  removeNodesByIds: (ids: number[]) => void;
  cloneNodesByIds: (ids: number[]) => void;
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
  cloneNodesByIds: noop
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

  return (
    <EditorStateContext.Provider
      value={{
        setDelegate: handleSetDelegate,
        getSelectedNodeIds: () => selectedNodeIds,
        setSelectedNodeIds,
        getNodeById: handleGetNodeById,
        removeNodesByIds: handleRemoveNodesByIds,
        cloneNodesByIds: handleCloneNodesByIds
      }}
    >
      {children}
    </EditorStateContext.Provider>
  );
};

EditorStateProvider.propTypes = PROP_TYPES;
EditorStateProvider.defaultProps = DEFAULT_PROPS;

export default EditorStateProvider;
