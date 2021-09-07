declare module "litegraph.js/build/litegraph.core" {
  declare class LGraph {}

  declare class LGraphCanvas {}

  declare class LGraphNode {
    resizable: boolean;
    size: [number, number];
    properties: Record<string, unknown>;

    flags: {
      collapsed: boolean;
    };

    constructor(title: string);

    addInput(name: string, type: string | number);
    addOutput(name: string, type: string | number);

    isInputConnected(index: number): boolean;
    isOutputConnected(index: number): boolean;

    onAction(action: string, param: unknown): void;
    onExecute(): void;
    onPropertyChanged(name: string, value: unknown): void;
    onMouseDown(evt: unknown, pos: [number, number], canvas: unknown): void;
    onMouseUp(evt: unknown, pos: [number, number], canvas: unknown): void;

    getInputData(index: number): unknown;
    setOutputData(index: number, data: unknown);
    triggerSlot(index: number, param: unknown);

    onDrawForeground(ctx: CanvasRenderingContext2D): void;
    onDrawBackground(ctx: CanvasRenderingContext2D): void;
    setDirtyCanvas(dirty: boolean): void;

    captureInput(capture: boolean): void;
  }

  export const LiteGraph: {
    ACTION: number;
    EVENT: number;
  };
}
