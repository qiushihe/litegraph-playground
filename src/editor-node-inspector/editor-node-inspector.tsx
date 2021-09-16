import React, { Children } from "react";
import PropTypes, { InferProps } from "prop-types";
import flow from "lodash/fp/flow";
import get from "lodash/fp/get";
import keys from "lodash/fp/keys";
import map from "lodash/fp/map";
import size from "lodash/fp/size";
import negate from "lodash/fp/negate";
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

const EditorNodeInspector: React.FunctionComponent<
  InferProps<typeof PROP_TYPES>
> = (props) => {
  const className = props.className || DEFAULT_PROPS.className;
  const nodes = props.nodes || DEFAULT_PROPS.nodes;
  const onRemoveNode = props.onRemoveNode || DEFAULT_PROPS.onRemoveNode;
  const onCloneNode = props.onCloneNode || DEFAULT_PROPS.onCloneNode;

  let renderedContent;

  if (size(nodes) <= 0) {
    renderedContent = (
      <EmptyState>
        <EmptyStateContent>Nothing Selected</EmptyStateContent>
      </EmptyState>
    );
  } else if (size(nodes) > 1) {
    renderedContent = (
      <EmptyState>
        <EmptyStateContent>Multiple Nodes Selected</EmptyStateContent>
      </EmptyState>
    );
  } else {
    const node = nodes[0];

    renderedContent = (
      <EditorFields>
        <EditorField>
          <EditorPropertyField
            isMultiLine={false}
            editorType="json"
            propertyName="Title"
            getPropertyValue={() => JSON.stringify(node.title)}
            onChange={(value) => {
              node.title = JSON.parse(value);
              node.setDirtyCanvas(true, true);
            }}
          />
        </EditorField>
        {flow([get("properties"), negate(isEmpty)])(node) ? (
          <>
            <HorizontalSeparator />
            {flow([
              get("properties"),
              keys,
              map((propertyKey: string) => (
                <EditorField>
                  <EditorPropertyField
                    isMultiLine={
                      MULTILINE_FIELD[node.getPropertyType(propertyKey)]
                    }
                    editorType="json"
                    propertyName={propertyKey}
                    getPropertyValue={() =>
                      node.getPropertyValue(propertyKey) || ""
                    }
                    onChange={(value) => {
                      node.setPropertyValue(propertyKey, value);
                      node.setDirtyCanvas(true, true);
                    }}
                  />
                </EditorField>
              )),
              interleave(<HorizontalSeparator />),
              Children.toArray
            ])(node)}
          </>
        ) : null}
      </EditorFields>
    );
  }

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
      {renderedContent}
    </Panel>
  );
};

export default EditorNodeInspector;
