import { Component } from "vue";
import { ApplicationInternal } from "../applications/ApplicationInternal";
import { Tuple } from "../types/TypeBasic";
import { PointerLocation } from "./TypeDesktop";

// type
export type MovingWindowResizeDirection =
  | "se"
  | "sw"
  | "ne"
  | "nw"
  | "n"
  | "w"
  | "s"
  | "e";

export type MovingWindowCursorType =
  | "nwse-resize"
  | "nesw-resize"
  | "ns-resize"
  | "ew-resize"
  | "move";

export interface MovingWindowActionEventBase {
  id: string;
  windowPositionSnapshot: Tuple<number>;
  windowSizeSnapshot: Tuple<number>;
  pointerPositionSnapshot: Tuple<number>;
}

export interface MovingWindowActionEventResize
  extends MovingWindowActionEventBase {
  type: "resize";
  direction: MovingWindowResizeDirection;
}

export interface MovingWindowActionEventMove
  extends MovingWindowActionEventBase {
  type: "move";
}

export interface MovingWindowActionEventFocus
  extends MovingWindowActionEventBase {
  type: "focus";
}

export type MovingWindowActionEvent =
  | MovingWindowActionEventFocus
  | MovingWindowActionEventResize
  | MovingWindowActionEventMove;

export interface MovingWindowLocation {
  position: Tuple<number>;
  size: Tuple<number>;
  sizeMin: Tuple<number> | null;
  sizeMax: Tuple<number> | null;
}

export interface MovingWindowLocalState extends MovingWindowLocation {
  id: string;
  order: number;
  snapped: PointerLocation;
  appInstance: ApplicationInternal;
}

export type MovingWindowID = string;
