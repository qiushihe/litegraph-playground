import { useEffect } from "react";
import { LiteGraph } from "../litegraph-core";

import { registerNodes } from "../node-type";

export const useCustomNodeTypes = (prefix: string) => {
  useEffect(() => {
    registerNodes(prefix, LiteGraph.registerNodeType.bind(LiteGraph));
  }, [prefix]);
};
