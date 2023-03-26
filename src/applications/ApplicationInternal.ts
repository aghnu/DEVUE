import { initMovingWindowState } from "../logics/doWindowCreation";
import { useWindowsStatesStore } from "../stores/windowsStates";
import {
  Application,
  ApplicationInternalnterface,
  AppName,
  AppType,
} from "../types/TypeApp";

export abstract class ApplicationInternal
  implements Application, ApplicationInternalnterface
{
  abstract readonly name: AppName;

  readonly type: AppType;
  movingWindowID: string | null;

  constructor() {
    this.type = "internal";
    this.movingWindowID = null;
  }

  public open(): void {
    const windowsState = useWindowsStatesStore();
    const movingWindowState = initMovingWindowState(this);
    this.movingWindowID = movingWindowState.id;
    windowsState.addMovingWindow(movingWindowState);
  }

  public close(): void {
    if (this.movingWindowID === null) return;

    const windowsState = useWindowsStatesStore();
    windowsState.removeMovingWindow(this.movingWindowID);
  }
}
