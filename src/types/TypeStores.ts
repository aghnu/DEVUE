import { Tuple } from "../types/TypeBasic";
import { PointerOperation } from "./TypeDesktop";
import { MovingWindowLocalState, MovingWindowID } from "./TypeWindows";

export interface DesktopStatesStore {
  positionPointer: Tuple<number>;
  positionWindowsManager: Tuple<number>;
  sizeWindowsManager: Tuple<number>;
  lastPointerOperationType: PointerOperation;
}

export interface WindowsStatesStore {
  movingWindows: Map<MovingWindowID, MovingWindowLocalState>;
  movingWindowsOrderStack: MovingWindowID[];
}
