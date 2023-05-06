import { ApplicationStyle, AppName } from "../types/TypeApplication";
import ApplicationInternal from "./ApplicationInternal";
import { MovingWindowLocalState } from "../types/TypeWindows";
import { initMovingWindowState } from "../logics/doWindowCreation";
import { defaultApplicationStyleFactory } from "../utilities/application";

export default class AppWnfa extends ApplicationInternal {
  readonly name: AppName = "wnfa";

  applicationStyle: ApplicationStyle = defaultApplicationStyleFactory();

  constructor() {
    super();
    this.applicationStyle.colorBackground = "#000000";
    this.applicationStyle.hideTitleBarFading = true;
  }

  getInitMovingWindowState(): MovingWindowLocalState {
    const a = initMovingWindowState(this, {
      sizeInitRatio: 1,
    });
    return a;
  }
}
