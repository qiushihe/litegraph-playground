import type { NextPage } from "next";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import PageHead from "../../components/page-head";
import EditorStateProvider from "../../components/editor-state-provider";
import Editor from "../../components/editor";

import { GlobalStyle } from "./playground.style";

const PlaygroundPage: NextPage = () => {
  return (
    <>
      <GlobalStyle />
      <PageHead
        title="LiteGraph Playground"
        description="A LiteGraph Playground"
      />
      <DndProvider backend={HTML5Backend}>
        <EditorStateProvider>
          <Editor />
        </EditorStateProvider>
      </DndProvider>
    </>
  );
};

export default PlaygroundPage;
