import { ApplicationStyle, AppName } from "../types/TypeApp";
import { ApplicationInternal } from "./ApplicationInternal";
import { getGlobalCSSVarValue } from "../utilities/getGlobalCSSVarValue";
import { CalculatorKey, CalculatorPadType } from "../types/TypeCalculator";
import { MovingWindowLocalState } from "../types/TypeWindows";
import { initMovingWindowState } from "../logics/doWindowCreation";
import { defaultApplicationStyleFactory } from "../utilities/application";

// constants used by calculators
const CALCULATOR_DEFAULT_DISPLAY = "0";

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
    this.applicationStyle.colorTitleText =
      "var(--color-calculator-text-display)";
    this.applicationStyle.hideTitleBarFading = true;
    this.applicationStyle.isBgTransparent = true;

    this.textMain = CALCULATOR_DEFAULT_DISPLAY;
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
    const keyArrayOperations = "";
    const keySetIsFunc = new Set("( ) CE C / * - +".split(" "));
    const keySetIsPrim = new Set("=".split(" "));

    // memory
    let lastKey: null | string = null;
    let lastOperation;

    // handlers
    const handlerValue = (text: string) => {
      if (this.textMain === CALCULATOR_DEFAULT_DISPLAY) {
        this.textMain = text;
      } else {
        this.textMain += text;
      }
    };
    const handlerFunc = (text: string) => {
      switch (text) {
        case "CE":
          if (this.textMain.length <= 1) {
            this.textMain = CALCULATOR_DEFAULT_DISPLAY;
            return;
          }
          this.textMain = this.textMain.slice(0, this.textMain.length - 1);
          break;
        case "C":
          this.textMain = CALCULATOR_DEFAULT_DISPLAY;
          break;
        default:
          this.textSub += this.textMain + text;
      }
    };
    const handlerPrim = (text: string) => {};

    const getKeyType = (key: string): CalculatorPadType => {
      if (keySetIsFunc.has(key)) return "function";
      if (keySetIsPrim.has(key)) return "primary";

      return "value";
    };

    const getHandler = (key: string) => {
      if (keySetIsFunc.has(key)) return handlerFunc;
      if (keySetIsPrim.has(key)) return handlerPrim;

      return handlerValue;
    };

    return keyArrayText.map(
      (t) =>
        Object({
          text: t,
          type: getKeyType(t),
          handler: getHandler(t),
        }) satisfies CalculatorKey
    );
  }
}
