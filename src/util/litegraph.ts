import { LGraphCanvas, LiteGraph, LGraphNode } from "../litegraph-core";
import { POS_X, POS_Y } from "../enum/canvas.enum";

import { Coordinate } from "./canvas";

export const addNodeToCanvas =
  (canvas: LGraphCanvas) =>
  (nodeKey: string, coordinate: Coordinate): LGraphNode | null => {
    canvas.graph.beforeChange();

    const node = LiteGraph.createNode(nodeKey);

    if (node) {
      const rect = canvas.canvas.getBoundingClientRect();

      node.pos = canvas.convertCanvasToOffset([
        coordinate[POS_X] -
          canvas.canvas.offsetLeft -
          (rect.left - canvas.canvas.offsetLeft),
        coordinate[POS_Y] -
          canvas.canvas.offsetTop -
          (rect.top - canvas.canvas.offsetTop)
      ]);

      canvas.graph.add(node);
    }

    canvas.graph.afterChange();

    return node;
  };
