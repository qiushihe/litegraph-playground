import React, { Children, useState, useCallback } from "react";
import PropTypes, { InferProps } from "prop-types";
import { useDrag } from "react-dnd";
import flow from "lodash/fp/flow";
import reduce from "lodash/fp/reduce";
import map from "lodash/fp/map";
import split from "lodash/fp/split";
import slice from "lodash/fp/slice";
import join from "lodash/fp/join";
import isEmpty from "lodash/fp/isEmpty";
import toPairs from "lodash/fp/toPairs";

import { PREFIX } from "../enum/node-type.enum";
import { interleave } from "../util/array";
import Panel from "../editor-ui/panel";
import { HorizontalSeparator } from "../editor-ui/separator.style";

import {
  Category,
  CategoryLabel,
  CategoryNodeTypes,
  NodeTypeLabel
} from "./editor-node-types-list.style";

const PROP_TYPES = {
  className: PropTypes.string,
  manifest: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      title: PropTypes.string
    }).isRequired
  )
};

const DEFAULT_PROPS = {
  className: "",
  manifest: []
};

const NodeTypeEntry = (props: { nodeTypeKey: string; title: string }) => {
  const [{ opacity }, dragRef] = useDrag(
    () => ({
      type: "CUSTOM_NODE_TYPE",
      item: { nodeTypeKey: props.nodeTypeKey },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.5 : 1
      })
    }),
    []
  );

  return (
    <NodeTypeLabel ref={dragRef} style={{ opacity }}>
      {props.title}
    </NodeTypeLabel>
  );
};

const EditorNodeTypesList: React.FunctionComponent<
  InferProps<typeof PROP_TYPES>
> = (props) => {
  const className = props.className || DEFAULT_PROPS.className;
  const manifest = props.manifest || DEFAULT_PROPS.manifest;

  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});

  const indexedManifest: [string, { key: string; title: string }[]][] = flow([
    reduce((acc, entry: { key: string; title: string }) => {
      const namespaceMatch = entry.key.match(/(.+::)(.*)/);

      if (namespaceMatch) {
        const [, namespace, path] = namespaceMatch;
        const categoryPath = flow([split("/"), slice(0, -1), join("/")])(path);

        if (namespace === PREFIX && !isEmpty(categoryPath)) {
          return {
            ...acc,
            [categoryPath]: [...(acc[categoryPath] || []), entry]
          };
        } else {
          return acc;
        }
      } else {
        return acc;
      }
    }, {} as Record<string, { key: string; title: string }[]>),
    toPairs
  ])(manifest);

  const handleToggleCategory = useCallback(
    (categoryName) => () => {
      setExpandedCategories({
        ...expandedCategories,
        [categoryName]: !expandedCategories[categoryName]
      });
    },
    [expandedCategories]
  );

  return (
    <Panel className={className} title="Node Types">
      {flow([
        map((categoryEntry: [string, { key: string; title: string }[]]) => {
          return (
            <Category>
              <CategoryLabel onClick={handleToggleCategory(categoryEntry[0])}>
                {expandedCategories[categoryEntry[0]] ? "▼" : "▶"}{" "}
                {categoryEntry[0]}
              </CategoryLabel>
              {expandedCategories[categoryEntry[0]] ? (
                <>
                  <HorizontalSeparator />
                  <CategoryNodeTypes>
                    {flow([
                      map((nodeTypeEntry: { key: string; title: string }) => {
                        return (
                          <NodeTypeEntry
                            nodeTypeKey={nodeTypeEntry.key}
                            title={nodeTypeEntry.title}
                          />
                        );
                      }),
                      Children.toArray
                    ])(categoryEntry[1])}
                  </CategoryNodeTypes>
                </>
              ) : null}
            </Category>
          );
        }),
        interleave(<HorizontalSeparator />),
        Children.toArray
      ])(indexedManifest)}
    </Panel>
  );
};

EditorNodeTypesList.propTypes = PROP_TYPES;
EditorNodeTypesList.defaultProps = DEFAULT_PROPS;

export default EditorNodeTypesList;
