import React, { Children, useState, useEffect, useCallback } from "react";
import PropTypes, { InferProps } from "prop-types";
import flow from "lodash/fp/flow";
import get from "lodash/fp/get";
import keys from "lodash/fp/keys";
import map from "lodash/fp/map";
import size from "lodash/fp/size";
import isEmpty from "lodash/fp/isEmpty";
import constant from "lodash/fp/constant";
import noop from "lodash/fp/noop";

import Panel from "../editor-ui/panel";
import BaseNode from "../node-type/base-node";
import { HorizontalSeparator } from "../editor-ui/separator.style";
import EditorPropertyField from "../editor-property-field";
import { interleave } from "../util/array";
import { IEditorState, withEditorState } from "../editor-state-provider";

import {
  ItemSeparator,
  ItemSpacer,
  Toolbar,
  ToolbarItem
} from "../editor-ui/toolbar.style";

import {
  EmptyState,
  EmptyStateContent,
  ToolbarContainer,
  EditorFields,
  EditorField
} from "./editor-node-inspector.style";

type InspectorPropertyEntry = {
  title: string;
  type: string;
  isEditable: boolean;
  isMultiLine: boolean;
  getValue: () => string;
  setValue: (value: string) => void;
};

const PROP_TYPES = {
  className: PropTypes.string,
  editorState: PropTypes.object,
  onRemoveNode: PropTypes.func,
  onCloneNode: PropTypes.func,
  onFocusNode: PropTypes.func
};

const DEFAULT_PROPS = {
  className: "",
  editorState: {},
  onRemoveNode: () => {},
  onCloneNode: () => {},
  onFocusNode: () => {}
};

const MULTILINE_FIELD: Record<string, boolean> = {
  array: true,
  object: true
};

const EmptyStateNoneSelected = () => (
  <EmptyState>
    <EmptyStateContent>Nothing Selected</EmptyStateContent>
  </EmptyState>
);

const EmptyStateManySelected = () => (
  <EmptyState>
    <EmptyStateContent>Multiple Nodes Selected</EmptyStateContent>
  </EmptyState>
);

type EditorNodeInspectorProps = InferProps<typeof PROP_TYPES>;

const EditorNodeInspector: React.FunctionComponent<EditorNodeInspectorProps> = (
  props
) => {
  const className = props.className || DEFAULT_PROPS.className;
  const editorState = (props.editorState ||
    DEFAULT_PROPS.editorState) as IEditorState;
  const onRemoveNode = props.onRemoveNode || DEFAULT_PROPS.onRemoveNode;
  const onCloneNode = props.onCloneNode || DEFAULT_PROPS.onCloneNode;
  const onFocusNode = props.onFocusNode || DEFAULT_PROPS.onFocusNode;

  const nodeIds = editorState.getSelectedNodeIds();

  const [node, setNode] = useState<BaseNode | null>(null);

  const [propertyEntries, setPropertyEntries] = useState<
    InspectorPropertyEntry[]
  >([]);

  const handleNodePropertyChange = useCallback((node: BaseNode | null) => {
    if (!node) {
      setPropertyEntries([]);
    } else {
      const entries: InspectorPropertyEntry[] = flow([
        get("properties"),
        keys,
        map(
          (propertyKey: string): InspectorPropertyEntry => ({
            title: propertyKey,
            type: "json",
            isEditable: true,
            isMultiLine:
              MULTILINE_FIELD[node.getParsedPropertyType(propertyKey)],
            getValue: () => node.getUnparsedPropertyValue(propertyKey) || "",
            setValue: (value) => {
              node.setUnparsedPropertyValue(propertyKey, value);
              node.setDirtyCanvas(true, true);
            }
          })
        )
      ])(node);

      setPropertyEntries([
        {
          title: "Node Type",
          type: "json",
          isEditable: false,
          isMultiLine: false,
          getValue: constant(node.type),
          setValue: noop
        },
        {
          title: "Title",
          type: "json",
          isEditable: true,
          isMultiLine: false,
          getValue: () => JSON.stringify(node.title),
          setValue: (value) => {
            node.title = JSON.parse(value);
            node.setDirtyCanvas(true, true);
          }
        },
        ...entries
      ]);
    }
  }, []);

  const handleLogNode = useCallback(() => {
    if (node) {
      console.log(node);
    }
  }, [node]);

  useEffect(() => {
    if (size(nodeIds) <= 0 || size(nodeIds) > 1) {
      setNode(null);
    } else {
      setNode(editorState.getNodeById(nodeIds[0]));
    }
  }, [node, nodeIds, editorState]);

  useEffect(() => {
    if (node) {
      node.addEventListener("property-change", handleNodePropertyChange);
      handleNodePropertyChange(node);
    } else {
      handleNodePropertyChange(null);
    }

    return () => {
      if (node) {
        node.removeEventListener("property-change", handleNodePropertyChange);
      }
    };
  }, [node, handleNodePropertyChange]);

  return (
    <Panel className={className} title="Node Inspector">
      <ToolbarContainer>
        <Toolbar>
          <ToolbarItem disabled={size(nodeIds) !== 1} onClick={onCloneNode}>
            Clone
          </ToolbarItem>
          <ItemSpacer />
          <ToolbarItem disabled={size(nodeIds) <= 0} onClick={onRemoveNode}>
            Remove
          </ToolbarItem>
          <ItemSeparator />
          <ToolbarItem disabled={size(nodeIds) <= 0} onClick={onFocusNode}>
            Focus
          </ToolbarItem>
          <ItemSpacer />
          <ToolbarItem disabled={size(nodeIds) !== 1} onClick={handleLogNode}>
            Log
          </ToolbarItem>
        </Toolbar>
      </ToolbarContainer>
      <HorizontalSeparator />
      {isEmpty(propertyEntries) ? (
        size(nodeIds) <= 0 ? (
          <EmptyStateNoneSelected />
        ) : (
          <EmptyStateManySelected />
        )
      ) : (
        <EditorFields>
          {flow([
            map((propertyEntry: InspectorPropertyEntry) => (
              <EditorField>
                <EditorPropertyField
                  isEditable={propertyEntry.isEditable}
                  isMultiLine={propertyEntry.isMultiLine}
                  editorType={propertyEntry.type}
                  propertyName={propertyEntry.title}
                  getPropertyValue={propertyEntry.getValue}
                  onChange={propertyEntry.setValue}
                />
              </EditorField>
            )),
            interleave(<HorizontalSeparator />),
            Children.toArray
          ])(propertyEntries)}
        </EditorFields>
      )}
    </Panel>
  );
};

EditorNodeInspector.propTypes = PROP_TYPES;
EditorNodeInspector.defaultProps = DEFAULT_PROPS;

export default withEditorState<EditorNodeInspectorProps>(EditorNodeInspector);
