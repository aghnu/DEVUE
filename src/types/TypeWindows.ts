import { Tuple } from "../types/TypeBasic";
import { ApplicationInstance } from "./TypeApp";

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

export interface MovingWindowActionEvent {
  id: string;
  type: "resize" | "move" | "focus";
  direction?: MovingWindowResizeDirection;
  windowPositionSnapshot: Tuple<number>;
  windowSizeSnapshot: Tuple<number>;
  pointerPositionSnapshot: Tuple<number>;
}

export interface MovingWindowLocation {
  position: Tuple<number>;
  size: Tuple<number>;
  sizeMin: Tuple<number> | null;
  sizeMax: Tuple<number> | null;
}

export interface MovingWindowLocalState extends MovingWindowLocation {
  id: string;
  order: number;
  appInstance: ApplicationInstance;
}

export type MovingWindowID = string;
