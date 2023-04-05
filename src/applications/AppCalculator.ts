import { ApplicationStyle, AppName } from "../types/TypeApp";
import { ApplicationInternal } from "./ApplicationInternal";
import { getGlobalCSSVarValue } from "../utilities/getGlobalCSSVarValue";
import { CalculatorKey, CalculatorPadType } from "../types/TypeCalculator";
import { MovingWindowLocalState } from "../types/TypeWindows";
import { initMovingWindowState } from "../logics/doWindowCreation";
import { defaultApplicationStyleFactory } from "../utilities/application";
import { strToSet } from "../utilities/helpers";

// constants used by calculators
const CALCULATOR_DEFAULT_DISPLAY = "0";

export class AppCalculator extends ApplicationInternal {
  readonly name: AppName = "calculator";
  applicationStyle: ApplicationStyle = defaultApplicationStyleFactory();

  textMain: string = CALCULATOR_DEFAULT_DISPLAY;
  textSub: string = "";
  mathModule: typeof import("mathjs") | null = null;

  constructor() {
    super();

    // set style
    this.applicationStyle.colorBackground = "#eaf1fbe5";
    this.applicationStyle.colorTitleText =
      "var(--color-calculator-text-display)";
    this.applicationStyle.hideTitleBarFading = true;
    this.applicationStyle.isBgTransparent = true;
  }

  public async open() {
    // add loading modules
    this.mathModule = await import("mathjs");
    return await super.open();
  }

  getInitMovingWindowState(): MovingWindowLocalState {
    return initMovingWindowState(this, {
      sizeInitPerc: [0.7, 0.9],
      sizeInitRatio: 1 / 1.95,
    });
  }

  private updateTextMain() {
    const evaludateExpression = (exp: string): string => {
      // base cases
      if (!this.mathModule || exp === "") return CALCULATOR_DEFAULT_DISPLAY;

      // calculate, if no result, recursion
      try {
        const result = this.mathModule.evaluate(exp);
        if (result === undefined)
          return evaludateExpression(exp.slice(0, exp.length - 1));
        return String(result);
      } catch (_) {
        console.log(exp);
        return evaludateExpression(exp.slice(0, exp.length - 1));
      }
    };

    this.textMain = evaludateExpression(this.textSub);
  }

  getInitKeys(): CalculatorKey[] {
    // all the keys
    const keyArrayText =
      "√ ^ π e ( ) CE C 7 8 9 / 4 5 6 * 1 2 3 - 0 . = +".split(" ");

    // key categories
    const keySetIsFunc = strToSet("CE C / * - + ( )");
    const keySetIsPrim = strToSet("=");
    const keySetIsSpecial = strToSet("π e √ ^");

    const keyGroupValu = strToSet("1 2 3 4 5 6 7 8 9 0 . √ ^ % e");
    const keyGroupDelete = strToSet("CE C");
    const keyGroupOperations = strToSet("( ) * - = +");

    // funcs
    const getKeyType = (key: string): CalculatorPadType => {
      if (keySetIsFunc.has(key)) return "function";
      if (keySetIsPrim.has(key)) return "primary";
      if (keySetIsSpecial.has(key)) return "special";
      return "value";
    };

    const keyHandleDelete = (key: string) => {
      if (key === "CE") {
        if (this.textSub.length > 0) {
          this.textSub = this.textSub.slice(0, this.textSub.length - 1);
        }
      } else if (key === "C") {
        this.textSub = "";
      }
    };

    const keyHandleInput = (key: string) => {
      this.textSub += key;
    };

    const keyHandler = (key: string) => {
      if (!this.mathModule) return;

      // process input level down
      if (keyGroupDelete.has(key)) keyHandleDelete(key);
      if (keyGroupValu.has(key)) keyHandleInput(key);
      if (keyGroupOperations.has(key)) keyHandleInput(key);

      // calculate main display result
      this.updateTextMain();
    };

    return keyArrayText.map(
      (t) =>
        Object({
          text: t,
          type: getKeyType(t),
          handler: keyHandler,
        }) satisfies CalculatorKey
    );
  }
}
