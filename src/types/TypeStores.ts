import { Tuple } from "../types/TypeBasic";
import { AppName } from "./TypeApp";
import { PointerOperation } from "./TypeDesktop";
import {
  MovingWindowLocalState,
  MovingWindowID,
  MovingWindowActionEvent,
} from "./TypeWindows";

export interface DesktopStatesStore {
  positionPointer: Tuple<number>;
  positionWindowsManager: Tuple<number>;
  sizeWindowsManager: Tuple<number>;
  lastPointerOperationType: PointerOperation;
}

export interface WindowsStatesStore {
  movingWindows: Map<MovingWindowID, MovingWindowLocalState>;
  actionEvent: MovingWindowActionEvent | null;
}

export type ApplicationWindowsStatesID = Map<AppName, MovingWindowID[]>;