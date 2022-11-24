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
}

export interface CurrentWindowActionState {
  windowPositionSnapshot: [number, number];
  windowSizeSnapshot: [number, number];
  pointerPositionSnapshot: [number, number];
  event: MovingWindowActionEvent;
}

export interface MovingWindowLocalState {
  id: string;
  order: number;
  position: [number, number];
  size: [number, number];
  sizeMin: [number, number] | null;
  sizeMax: [number, number] | null;
}
