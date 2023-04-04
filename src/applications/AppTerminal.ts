import { ApplicationStyle, AppName } from "../types/TypeApp";
import { ApplicationInternal } from "./ApplicationInternal";
import { getGlobalCSSVarValue } from "../utilities/getGlobalCSSVarValue";
import { MovingWindowLocalState } from "../types/TypeWindows";
import { initMovingWindowState } from "../logics/doWindowCreation";
import { defaultApplicationStyleFactory } from "../utilities/application";

export class AppTerminal extends ApplicationInternal {
  readonly name: AppName;

  applicationStyle: ApplicationStyle;
  backgroundColor: string;

  constructor() {
    super();
    this.name = "terminal";
    this.backgroundColor = "#100f19";
    this.applicationStyle = defaultApplicationStyleFactory();
    this.applicationStyle.colorBackground = this.backgroundColor;
  }

  getInitMovingWindowState(): MovingWindowLocalState {
    return initMovingWindowState(this, {
      sizeInitRatio: 9 / 10,
    });
  }

  initTerminal(element: HTMLIFrameElement) {
    element.contentWindow?.postMessage(
      {
        type: "init",

        colorPlain: "#a9a9a9",
        colorFocus: "#f9ca8f",
        colorBackground: this.backgroundColor,
        colorDesc: "#7fc5d0",
        colorAppBackground: "transparent",

        fontSize: "14px",
      },
      "*"
    );
  }
}
