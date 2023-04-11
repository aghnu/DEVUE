import { ApplicationStyle, AppName } from "../types/TypeApplication";
import { ApplicationInternal } from "./ApplicationInternal";
import { MovingWindowLocalState } from "../types/TypeWindows";
import { initMovingWindowState } from "../logics/doWindowCreation";
import { defaultApplicationStyleFactory } from "../utilities/application";

export class AppPixel extends ApplicationInternal {
  readonly name: AppName = "pixel";

  applicationStyle: ApplicationStyle;

  constructor() {
    super();
    this.applicationStyle = defaultApplicationStyleFactory();
  }

  getInitMovingWindowState(): MovingWindowLocalState {
    return initMovingWindowState(this, {
      sizeInitRatio: 9 / 10,
    });
  }
}
