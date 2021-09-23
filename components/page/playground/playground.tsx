import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import EditorStateProvider from "../../editor-state-provider";
import Editor from "../../editor";

import { GlobalStyle } from "./playground.style";

const Playground = () => {
  return (
    <>
      <GlobalStyle />
      <DndProvider backend={HTML5Backend}>
        <EditorStateProvider>
          <Editor />
        </EditorStateProvider>
      </DndProvider>
    </>
  );
};

export default Playground;
