import { useEffect } from "react";

import { registerNodes } from "../node-type";

export const useCustomNodeTypes = ({ prefix, LiteGraph, LGraphNode }) => {
  useEffect(() => {
    registerNodes(prefix, LiteGraph.registerNodeType.bind(LiteGraph), {
      LGraphNode,
      LiteGraph
    });
  }, [prefix, LiteGraph, LGraphNode]);
};
