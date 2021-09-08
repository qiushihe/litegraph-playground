import flow from "lodash/fp/flow";
import find from "lodash/fp/find";
import overEvery from "lodash/fp/overEvery";
import get from "lodash/fp/get";
import getOr from "lodash/fp/getOr";
import eq from "lodash/fp/eq";
import isEmpty from "lodash/fp/isEmpty";
import map from "lodash/fp/map";
import over from "lodash/fp/over";
import size from "lodash/fp/size";
import identity from "lodash/fp/identity";
import times from "lodash/fp/times";
import reduce from "lodash/fp/reduce";
import sortBy from "lodash/fp/sortBy";
import first from "lodash/fp/first";

import io from "../../../socket.io-client";

type PoseNetEntry = [number, number];
export type PoseEntry = [string, number, number];

type EventName = "posesUpdated";

type EventHandlerData = {
  poses: PoseEntry[][];
};

type EventHandler = (data: EventHandlerData) => void;

const extractEntryLabels = flow([
  get("outputs"),
  find(
    overEvery([
      flow([get("name"), eq("poses")]),
      flow([get("type"), eq("array")])
    ])
  ),
  getOr([], "itemType.labels")
]);

const extractPoses = (
  entryLabels: string[]
): ((data: unknown) => PoseEntry[][]) =>
  flow([
    get("poses"),
    map(
      flow([
        over([size, identity]),
        ([entryCount, entries]: [number, PoseNetEntry[]]) =>
          flow([
            times(identity),
            reduce(
              (acc: PoseEntry[], entryIndex: number): PoseEntry[] => [
                ...acc,
                [
                  getOr("", entryIndex)(entryLabels),
                  flow([get(entryIndex), getOr(0, 0)])(entries),
                  flow([get(entryIndex), getOr(0, 1)])(entries)
                ]
              ],
              []
            )
          ])(entryCount),
        sortBy(first)
      ])
    )
  ]);

class MLLabClient {
  socket: io.Socket | null;
  handlers: Record<EventName, EventHandler[]>;
  entryLabels: string[];
  hasEntryLabels: boolean;
  poses: PoseEntry[][];

  constructor() {
    this.socket = null;
    this.handlers = { posesUpdated: [] };
    this.entryLabels = [];
    this.hasEntryLabels = false;
    this.poses = [];

    this.handleInfo = this.handleInfo.bind(this);
    this.handleData = this.handleData.bind(this);
  }

  private handleInfo(evt: unknown) {
    if (this.hasEntryLabels) {
      return;
    }

    this.entryLabels = extractEntryLabels(evt);
    this.hasEntryLabels = !isEmpty(this.entryLabels);
  }

  private handleData(evt: unknown) {
    if (!this.hasEntryLabels) {
      return;
    }

    this.poses = extractPoses(this.entryLabels)(evt);

    this.handlers.posesUpdated.forEach((handler) => {
      handler({ poses: this.poses });
    });
  }

  private ensureSocket() {
    if (this.socket === null) {
      // Due to the _unique_ way MLLab is implemented, the endpoint can NOT be configured.
      this.socket = io.connect("http://localhost:3000", {
        autoConnect: false
      });

      this.socket.on("info", this.handleInfo);
      this.socket.on("data", this.handleData);
    }
  }

  addEventListener(evt: EventName, handler: EventHandler) {
    this.handlers[evt].push(handler);
  }

  removeEventListener(evt: EventName, handler: EventHandler) {
    const index = this.handlers[evt].indexOf(handler);
    if (index > -1) {
      this.handlers[evt].splice(index, 1);
    }
  }

  isConnected() {
    return this.socket && this.socket.connected;
  }

  connect() {
    this.ensureSocket();

    if (this.socket && !this.socket.connected) {
      this.socket.open();
    }
  }

  disconnect() {
    if (this.socket && this.socket.connected) {
      this.socket.close();
    }
  }
}

export default MLLabClient;
