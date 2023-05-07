import { ApplicationStyle, AppName } from "../types/TypeApplication";
import ApplicationInternal from "./ApplicationInternal";
import { MovingWindowLocalState } from "../types/TypeWindows";
import { initMovingWindowState } from "../logics/doWindowCreation";
import { defaultApplicationStyleFactory } from "../utilities/application";

export default class AppTerminal extends ApplicationInternal {
  readonly name: AppName;
  applicationStyle: ApplicationStyle = defaultApplicationStyleFactory();

  constructor() {
    super();
    this.name = "portfolio";
  }

  getInitMovingWindowState(): MovingWindowLocalState {
    return initMovingWindowState(this, {
      sizeInitPerc: [0.95, 0.95],
      sizeInitRatio: 1 / 1,
    });
  }
}
