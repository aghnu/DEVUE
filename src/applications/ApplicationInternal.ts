import { useWindowsStatesStore } from "../stores/windowsStates";
import {
  ApplicationInternalnterface,
  ApplicationStyle,
  AppType,
} from "../types/TypeApplication";
import { MovingWindowLocalState } from "../types/TypeWindows";
import Application from "./Application";

export default abstract class ApplicationInternal
  extends Application
  implements ApplicationInternalnterface
{
  abstract applicationStyle: ApplicationStyle;

  readonly type: AppType;
  movingWindowID: string | null;

  constructor() {
    super();
    this.type = "internal";
    this.movingWindowID = null;
  }

  abstract getInitMovingWindowState(): MovingWindowLocalState;

  public async open() {
    // init windows
    const windowsState = useWindowsStatesStore();
    const movingWindowState = this.getInitMovingWindowState();
    this.movingWindowID = movingWindowState.id;
    windowsState.addMovingWindow(movingWindowState);
    return this;
  }

  public close(): void {
    if (this.movingWindowID === null) return;

    const windowsState = useWindowsStatesStore();
    windowsState.removeMovingWindow(this.movingWindowID);
  }
}
