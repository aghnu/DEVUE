import { ApplicationStyle, AppName } from "../types/TypeApp";
import { ApplicationInternal } from "./ApplicationInternal";
import { getGlobalCSSVarValue } from "../utilities/getGlobalCSSVarValue";
import { CalculatorKey, CalculatorPadType } from "../types/TypeCalculator";
import { MovingWindowLocalState } from "../types/TypeWindows";
import { initMovingWindowState } from "../logics/doWindowCreation";
import { defaultApplicationStyleFactory } from "../utilities/application";

export class AppCalculator extends ApplicationInternal {
  readonly name: AppName;

  applicationStyle: ApplicationStyle;
  textMain: string;
  textSub: string;

  constructor() {
    super();
    this.name = "calculator";
    this.applicationStyle = defaultApplicationStyleFactory();

    this.applicationStyle.colorBackground = "#eaf1fbe5";
    this.applicationStyle.colorTitleText = getGlobalCSSVarValue(
      "--color-calculator-text-display"
    );
    this.applicationStyle.hideTitleBarFading = true;
    this.applicationStyle.isBgTransparent = true;

    this.textMain = "0";
    this.textSub = "";
  }

  getInitMovingWindowState(): MovingWindowLocalState {
    return initMovingWindowState(this, {
      sizeInitPerc: [0.7, 0.8],
      sizeInitRatio: 1 / 1.618,
    });
  }

  getInitKeys(): CalculatorKey[] {
    const keyArrayText = "( ) CE C 7 8 9 / 4 5 6 * 1 2 3 - 0 . = +".split(" ");
    const keySetIsFunc = new Set("( ) CE C / * - +".split(" "));
    const keySetIsPrim = new Set("=".split(" "));

    const getKeyType = (key: string): CalculatorPadType => {
      if (keySetIsFunc.has(key)) return "function";
      if (keySetIsPrim.has(key)) return "primary";

      return "value";
    };

    return keyArrayText.map(
      (t) =>
        Object({
          text: t,
          type: getKeyType(t),
          handler: () => {
            this.textSub += "" + t;
            this.textMain += t;
          },
        }) satisfies CalculatorKey
    );
  }
}
