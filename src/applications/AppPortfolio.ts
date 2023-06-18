import { ApplicationStyle, AppName } from "../types/TypeApplication";
import ApplicationInternal from "./ApplicationInternal";
import { MovingWindowLocalState } from "../types/TypeWindows";
import { initMovingWindowState } from "../logics/doWindowCreation";
import { defaultApplicationStyleFactory } from "../utilities/application";

export default class AppPortfolio extends ApplicationInternal {
  readonly name: AppName;
  applicationStyle: ApplicationStyle;

  constructor() {
    super();
    this.name = "portfolio";
    this.applicationStyle = defaultApplicationStyleFactory();
  }

  getInitMovingWindowState(): MovingWindowLocalState {
    return initMovingWindowState(this, {
      sizeInitPerc: [0.95, 0.95],
      sizeInitRatio: 5 / 7,
    });
  }

  initTerminal() {
    //
  }
}
