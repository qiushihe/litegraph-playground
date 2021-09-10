import flow from "lodash/fp/flow";
import get from "lodash/fp/get";
import set from "lodash/fp/set";
import forEach from "lodash/fp/forEach";
import reduce from "lodash/fp/reduce";
import cond from "lodash/fp/cond";
import eq from "lodash/fp/eq";
import includes from "lodash/fp/includes";

import { LGraphNode, LiteGraph } from "../litegraph-core";

type BaseNodeSocket = {
  name: string;
  type: "data" | "signal";
};

type BaseNodeTask = {
  name: string;
  param: unknown;
};

type BaseNodeOptions = {
  sockets?: {
    input?: BaseNodeSocket[];
    output?: BaseNodeSocket[];
  };
  metadata?: [string, unknown][];
  properties?: [string, unknown][];
};

export const dataSocket = (name: string): BaseNodeSocket => ({
  name,
  type: "data"
});

export const signalSocket = (name: string): BaseNodeSocket => ({
  name,
  type: "signal"
});

const METADATA_ATTR_NAME = "__node_type_meta";

const isDataIO = flow([get("type"), eq("data")]);
const isSignalIO = flow([get("type"), eq("signal")]);

class BaseNode extends LGraphNode {
  private [METADATA_ATTR_NAME]: Record<string, unknown>;

  constructor(nodeTypeTitle: string, options?: BaseNodeOptions) {
    super(nodeTypeTitle);
    this.initialize(options);
  }

  private initialize(options?: BaseNodeOptions) {
    this.initializeProperties(options);
    this.initializeMetadata(options);
    this.initializeSockets(options);
  }

  private initializeProperties(options?: BaseNodeOptions) {
    flow([
      get("properties"),
      reduce((acc, [name, initialValue]: [string, unknown]) => {
        return {
          ...acc,
          [name]: initialValue
        };
      }, {} as Record<string, unknown>),
      (properties: Record<string, unknown>) => {
        this.properties = properties;
      }
    ])(options);
  }

  getPropertyOr<T>(fallback: T, name: string): T {
    const value = this.properties[name];

    if (value === undefined) {
      return fallback;
    } else {
      return value as T;
    }
  }

  getProperty<T>(name: string): T | null {
    return this.getPropertyOr<T | null>(null, name);
  }

  private initializeMetadata(options?: BaseNodeOptions) {
    this[METADATA_ATTR_NAME] = {};

    this.setMeta("meta::tasks", []);
    this.setMeta("meta::inputSignalNames", []);

    flow([
      get("metadata"),
      forEach(([name, initialValue]) => {
        this.setMeta(name, initialValue);
      })
    ])(options);
  }

  getMetaOr<T>(fallback: T, name: string): T {
    const value = this[METADATA_ATTR_NAME][name];

    if (value === undefined) {
      return fallback;
    } else {
      return value as T;
    }
  }

  getMeta<T>(name: string): T | null {
    return this.getMetaOr<T | null>(null, name);
  }

  setMeta(name: string, value: unknown): void {
    this[METADATA_ATTR_NAME] = set(name, value)(this[METADATA_ATTR_NAME]);
  }

  private initializeSockets(options?: BaseNodeOptions): void {
    const addDataInput = (name: string) => this.addInput(name, "");
    const addSignalInput = (name: string) => {
      this.setMeta("meta::inputSignalNames", [
        ...this.getMetaOr<string[]>([], "meta::inputSignalNames"),
        name
      ]);
      this.addInput(name, LiteGraph.ACTION);
    };

    flow([
      get("sockets.input"),
      forEach(
        cond([
          [isDataIO, flow([get("name"), addDataInput])],
          [isSignalIO, flow([get("name"), addSignalInput])]
        ])
      )
    ])(options);

    const addDataOutput = (name: string) => this.addOutput(name, "");
    const addSignalOutput = (name: string) =>
      this.addOutput(name, LiteGraph.EVENT);

    flow([
      get("sockets.output"),
      forEach(
        cond([
          [isDataIO, flow([get("name"), addDataOutput])],
          [isSignalIO, flow([get("name"), addSignalOutput])]
        ])
      )
    ])(options);
  }

  onAction(action: string, param: unknown): void {
    if (includes(action)(this.getMeta("meta::inputSignalNames"))) {
      this.onInputSignal(action, param);
      this.enqueueTask(`action::${action}`, param);
    }
  }

  onInputSignal(_: string, __: unknown): void {}

  enqueueTask(name: string, param?: unknown): void {
    this.setMeta("meta::tasks", [
      ...this.getMetaOr([], "meta::tasks"),
      { name: name, param }
    ]);
  }

  getNextTask<T = unknown>(): [string | null, T | null] {
    const tasks = this.getMetaOr<BaseNodeTask[]>([], "meta::tasks");
    const task = tasks.shift();

    if (task) {
      return [task.name, task.param as T | null];
    } else {
      return [null, null];
    }
  }

  getInputDataOr<T>(fallback: T, socketIndex: number): T {
    const inputData = super.getInputData(socketIndex);

    if (inputData === undefined) {
      return fallback;
    } else {
      return inputData as T;
    }
  }

  getInputData<T>(socketIndex: number): T | null {
    return this.getInputDataOr<T | null>(null, socketIndex);
  }

  updateSize(width: number, height: number): void {
    if (this.size[0] !== width || this.size[1] !== height) {
      this.size = [width, height];
      this.setDirtyCanvas(true);
    }
  }
}

export default BaseNode;
