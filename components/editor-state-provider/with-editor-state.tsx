import React from "react";
import { ReactComponentLike } from "prop-types";

import { EditorStateContext } from "./editor-state-provider";

const withEditorState = <T extends unknown>(Component: ReactComponentLike) => {
  return function EditorStateHOC(props: T) {
    return (
      <EditorStateContext.Consumer>
        {(editorStateProps) => (
          <Component {...props} editorState={editorStateProps} />
        )}
      </EditorStateContext.Consumer>
    );
  };
};

export default withEditorState;
