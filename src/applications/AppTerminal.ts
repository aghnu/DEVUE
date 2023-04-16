import { ApplicationStyle, AppName } from "../types/TypeApplication";
import { ApplicationInternal } from "./ApplicationInternal";
import { MovingWindowLocalState } from "../types/TypeWindows";
import { initMovingWindowState } from "../logics/doWindowCreation";
import { defaultApplicationStyleFactory } from "../utilities/application";

interface TerminalTheme {
  colorPlain: string;
  colorFocus: string;
  colorBackground: string;
  colorDesc: string;
  colorAppBackground: string;
}

const COLOR_THEME: Record<string, TerminalTheme> = {
  dark: {
    colorPlain: "#a9a9a9",
    colorFocus: "#f9ca8f",
    colorBackground: "#181721",
    colorDesc: "#7fc5d0",
    colorAppBackground: "#181721",
  },
  abyss: {
    colorPlain: "#6688cc",
    colorFocus: "#ffeebb",
    colorBackground: "#000c18",
    colorDesc: "#19ceda",
    colorAppBackground: "#000c18",
  },
  light: {
    colorPlain: "#b0b8ad",
    colorFocus: "#f59879",
    colorBackground: "#111a1f",
    colorDesc: "#1ca0a9",
    colorAppBackground: "#111a1f",
  },
};

export class AppTerminal extends ApplicationInternal {
  readonly name: AppName;

  applicationStyle: ApplicationStyle;
  colorTheme: TerminalTheme;

  constructor() {
    super();
    this.name = "terminal";
    this.colorTheme = COLOR_THEME.light;
    this.applicationStyle = defaultApplicationStyleFactory();
    this.applicationStyle.colorBackground = this.colorTheme.colorBackground;
  }

  getInitMovingWindowState(): MovingWindowLocalState {
    return initMovingWindowState(this, {
      sizeInitPerc: [0.95, 0.95],
      sizeInitRatio: 5 / 7,
    });
  }

  initTerminal(element: HTMLIFrameElement) {
    element.contentWindow?.postMessage(
      {
        type: "init",
        fontSize: "13px",
        ...this.colorTheme,
      },
      "*"
    );
  }
}
