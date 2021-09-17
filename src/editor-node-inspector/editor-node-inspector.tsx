import React, { Children, useState, useEffect, useCallback } from "react";
import PropTypes, { InferProps } from "prop-types";
import flow from "lodash/fp/flow";
import get from "lodash/fp/get";
import keys from "lodash/fp/keys";
import map from "lodash/fp/map";
import size from "lodash/fp/size";
import isEmpty from "lodash/fp/isEmpty";

import Panel from "../editor-ui/panel";
import BaseNode from "../node-type/base-node";
import { HorizontalSeparator } from "../editor-ui/separator.style";
import EditorPropertyField from "../editor-property-field";
import { interleave } from "../util/array";

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
  isMultiLine: boolean;
  getValue: () => string;
  setValue: (value: string) => void;
};

const PROP_TYPES = {
  className: PropTypes.string,
  nodes: PropTypes.arrayOf(PropTypes.instanceOf(BaseNode).isRequired),
  onRemoveNode: PropTypes.func,
  onCloneNode: PropTypes.func
};

const DEFAULT_PROPS = {
  className: "",
  nodes: [],
  onRemoveNode: () => {},
  onCloneNode: () => {}
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

const EditorNodeInspector: React.FunctionComponent<
  InferProps<typeof PROP_TYPES>
> = (props) => {
  const className = props.className || DEFAULT_PROPS.className;
  const nodes = props.nodes || DEFAULT_PROPS.nodes;
  const onRemoveNode = props.onRemoveNode || DEFAULT_PROPS.onRemoveNode;
  const onCloneNode = props.onCloneNode || DEFAULT_PROPS.onCloneNode;

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
          title: "Title",
          type: "json",
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

  useEffect(() => {
    if (size(nodes) <= 0 || size(nodes) > 1) {
      setNode(null);
    } else {
      setNode(nodes[0]);
    }
  }, [node, nodes]);

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
          <ToolbarItem disabled={size(nodes) <= 0} onClick={onRemoveNode}>
            Remove
          </ToolbarItem>
          <ItemSpacer />
          <ToolbarItem disabled={size(nodes) !== 1} onClick={onCloneNode}>
            Clone
          </ToolbarItem>
          <ItemSeparator />
          <ToolbarItem disabled={true}>Focus</ToolbarItem>
        </Toolbar>
      </ToolbarContainer>
      <HorizontalSeparator />
      {isEmpty(propertyEntries) ? (
        size(nodes) <= 0 ? (
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

export default EditorNodeInspector;
