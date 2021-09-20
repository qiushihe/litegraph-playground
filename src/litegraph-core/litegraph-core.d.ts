declare module "litegraph.js/build/litegraph.core" {
  declare class LGraph {
    beforeChange(): void;
    afterChange(): void;
    add(node: LGraphNode): void;
    remove(node: LGraphNode): void;
    configure(data: unknown, stop: boolean): void;
    findNodesByType(type: string): LGraphNode[];
    getNodeById(id: number): LGraphNode | null;
    start(rate?: number): void;
    stop(): void;
    serialize(): unknown;
    onPlayEvent(): void;
    onStopEvent(): void;
  }

  declare class LGraphCanvas {
    static onGroupAdd(
      info: unknown,
      entry: unknown,
      mouse_event: unknown
    ): void;

    static active_canvas: LGraphCanvas;

    constructor(elm: HTMLCanvasElement, graph: LGraph, options: unknown): void;

    graph: LGraph;
    canvas: HTMLCanvasElement;
    selected_nodes: Record<number, LGraphNode>;
    align_to_grid: boolean;
    allow_searchbox: boolean;

    convertCanvasToOffset(
      pos: [number, number],
      out?: unknown
    ): [number, number];

    convertEventToCanvasOffset(evt: unknown): [number, number];
    getCanvasWindow(): unknown;
    onShowNodePanel(): void;
    getMenuOptions(): unknown[];
    processContextMenu(): void;
    getNodeMenuOptions(node: LGraphNode): unknown[];
    onSelectionChange(selectedNodes: Record<number, LGraphNode>): void;
  }

  declare class LGraphNode {
    type: string;
    id: number;
    title: string;
    graph: LGraph;
    resizable: boolean;
    size: [number, number];
    pos: [number, number];
    properties: Record<string, unknown>;

    flags: {
      collapsed: boolean;
    };

    constructor(title: string);

    clone(): LGraphNode;
    addInput(name: string, type: string | number);
    addOutput(name: string, type: string | number);
    isInputConnected(index: number): boolean;
    isOutputConnected(index: number): boolean;
    onAction(action: string, param: unknown): void;
    onExecute(): void;
    onPropertyChanged(name: string, value: unknown): void;
    onResize(size: [number, number]): void;
    onMouseDown(evt: unknown, pos: [number, number], canvas: unknown): void;
    onMouseUp(evt: unknown, pos: [number, number], canvas: unknown): void;
    getInputData(index: number): unknown;
    setOutputData(index: number, data: unknown);
    triggerSlot(index: number, param: unknown);
    onDrawForeground(ctx: CanvasRenderingContext2D): void;
    onDrawBackground(ctx: CanvasRenderingContext2D): void;
    setDirtyCanvas(dirtyFg: boolean, dirtyBg?: boolean): void;
    setProperty(name: string, value: unknown): void;
    captureInput(capture: boolean): void;
    getMenuOptions(canvas: LGraphCanvas): unknown[];
  }

  declare class ContextMenu {
    getFirstEvent(): { clientX: number; clientY: number };
  }

  export const LiteGraph: {
    ACTION: number;
    EVENT: number;
    registered_node_types: Record<string, LGraphNode>;
    createNode: (key: string) => LGraphNode | null;
    ContextMenu: {
      new (entries: unknown, options: unknown, window: unknown): ContextMenu;
    };
    registerNodeType: (type: string, base_class: unknown) => void;
    clearRegisteredTypes(): void;
  };
}
