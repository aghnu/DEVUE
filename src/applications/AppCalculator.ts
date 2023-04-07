import { ApplicationStyle, AppName } from "../types/TypeApp";
import { ApplicationInternal } from "./ApplicationInternal";
import { getGlobalCSSVarValue } from "../utilities/getGlobalCSSVarValue";
import { CalculatorKey, CalculatorPadType } from "../types/TypeCalculator";
import { MovingWindowLocalState } from "../types/TypeWindows";
import { initMovingWindowState } from "../logics/doWindowCreation";
import { defaultApplicationStyleFactory } from "../utilities/application";
import { strReplaceAll, strToSet } from "../utilities/helpers";

// constants used by calculators
const CALCULATOR_DEFAULT_DISPLAY = "0";

export class AppCalculator extends ApplicationInternal {
  readonly name: AppName = "calculator";
  applicationStyle: ApplicationStyle = defaultApplicationStyleFactory();

  textSub: string = "";
  textMain: string = CALCULATOR_DEFAULT_DISPLAY;
  textInput: string = "";

  mathModule: typeof import("mathjs") | null = null;
  hold: boolean = false;
  error: boolean = false;

  constructor() {
    super();

    // set style
    this.applicationStyle.colorBackground = "#151515ef";
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

  private getInputTextExpression() {
    // translate subtext into expression
    let exp = this.textInput;

    // sqrt
    exp = strReplaceAll(exp, "√", "sqrt(");

    // pi
    exp = strReplaceAll(exp, "π", "pi");

    return exp;
  }

  private getSubTextDisplay() {
    // translate subtext into expression
    let exp = this.textInput;

    // sqrt
    exp = strReplaceAll(exp, "√", "√(");

    return exp;
  }

  private evaluateExp(exp: string): string | null {
    // return default is mathModule missing or textInput empty
    if (!this.mathModule || exp === "") return CALCULATOR_DEFAULT_DISPLAY;

    // return null if cannot evaluate, otherwise return result
    try {
      const result = this.mathModule.evaluate(exp);
      if (result === undefined || isNaN(result)) return null;
      return String(result);
    } catch (_) {
      return null;
    }
  }

  private evaluateExpContinue(exp: string): string {
    const result = this.evaluateExp(exp);
    return result ?? this.evaluateExpContinue(exp.slice(0, exp.length - 1));
  }

  private updateTextMain() {
    const result = this.evaluateExp(this.getInputTextExpression());
    const resultProgress = this.evaluateExpContinue(
      this.getInputTextExpression()
    );

    if (result) {
      this.hold = false;
      this.textMain = resultProgress;
      this.textSub = this.getSubTextDisplay();
    } else {
      this.hold = true;
      this.textMain = resultProgress;
      this.textSub = this.getSubTextDisplay();
    }
  }

  getInitKeys(): CalculatorKey[] {
    // all the keys
    const keyArrayText =
      "√ ^ π e ( ) CE C 7 8 9 / 4 5 6 * 1 2 3 - 0 . = +".split(" ");

    // key categories
    const keyGroupValu = strToSet("1 2 3 4 5 6 7 8 9 0 . √ ^ π e");
    const keyGroupDelete = strToSet("CE C");
    const keyGroupOperations = strToSet("( ) * - + /");
    const keyGroupPrim = strToSet("=");

    const keyHandleDelete = (key: string) => {
      if (key === "CE") {
        if (this.textInput.length > 0) {
          this.textInput = this.textInput.slice(0, this.textInput.length - 1);
        }
      } else if (key === "C") {
        this.textInput = "";
      }
      this.error = false;
      this.updateTextMain();
    };
    const keyHandleConfirm = (key: string) => {
      if (this.hold) {
        this.error = true;
      } else {
        this.error = false;
        this.textInput = this.textMain;
        this.updateTextMain();
      }
    };
    const keyHandleInput = (key: string) => {
      this.error = false;
      this.textInput += key;
      this.updateTextMain();
    };

    const keyHandler = (key: string) => {
      if (!this.mathModule) return;

      // process input level down
      if (keyGroupPrim.has(key)) keyHandleConfirm(key);
      if (keyGroupDelete.has(key)) keyHandleDelete(key);
      if (keyGroupValu.has(key)) keyHandleInput(key);
      if (keyGroupOperations.has(key)) keyHandleInput(key);
    };

    return keyArrayText.map(
      (t) =>
        Object({
          text: t,
          handler: keyHandler,
        }) satisfies CalculatorKey
    );
  }
}
