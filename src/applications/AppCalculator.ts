import { ApplicationStyle, AppName } from "../types/TypeApp";
import { ApplicationInternal } from "./ApplicationInternal";
import { getGlobalCSSVarValue } from "../utilities/getGlobalCSSVarValue";
import { CalculatorKey, CalculatorPadType } from "../types/TypeCalculator";
import { MovingWindowLocalState } from "../types/TypeWindows";
import { initMovingWindowState } from "../logics/doWindowCreation";

export class AppCalculator extends ApplicationInternal {
  readonly name: AppName;

  applicationStyle: ApplicationStyle;
  textMain: string;
  textSub: string;

  constructor() {
    super();
    this.name = "calculator";
    this.applicationStyle = {
      colorBackground: "#202020",
      colorTitleText: getGlobalCSSVarValue("--color-taskbar-text-bright"),
    };

    this.textMain = '123456789';
    this.textSub = '';
    
  }

  getInitMovingWindowState(): MovingWindowLocalState {
    return initMovingWindowState(this, {
      sizeInitPerc: [0.95, 0.75],
      sizeInitRatio: 2/3
    })
  }

  getInitKeys(): CalculatorKey[] {

    const keyArrayText = '( ) CE C 7 8 9 / 4 5 6 * 1 2 3 - 0 . = +'.split(' ');
    const keySetIsFunc = new Set('( ) CE C / * - +'.split(' '));
    const keySetIsPrim = new Set('='.split(' '));

    const getKeyType = (key: string): CalculatorPadType => {
      if (keySetIsFunc.has(key)) return 'function';
      if (keySetIsPrim.has(key)) return 'primary';
      
      return 'value';
    };

    return keyArrayText.map((t) => Object({
      text: t,
      type: getKeyType(t),
      handler: () => {
        this.textMain += '0000';
      }
    }) satisfies CalculatorKey);
  }


}
