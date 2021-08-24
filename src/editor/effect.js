import { useEffect } from "react";

import { registerNodes } from "../node-type";

export const useCustomNodeTypes = ({ LiteGraph, LGraphNode }) => {
  useEffect(() => {
    registerNodes(LiteGraph.registerNodeType.bind(LiteGraph), {
      LGraphNode,
      LiteGraph
    });
  }, [LiteGraph, LGraphNode]);
};
