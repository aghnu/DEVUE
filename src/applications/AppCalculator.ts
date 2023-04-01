import { ApplicationStyle, AppName } from "../types/TypeApp";
import { ApplicationInternal } from "./ApplicationInternal";
import { getGlobalCSSVarValue } from "../utilities/getGlobalCSSVarValue";
import { CalculatorKey } from "../types/TypeCalculator";
import { MovingWindowLocalState } from "../types/TypeWindows";
import { initMovingWindowState } from "../logics/doWindowCreation";

export class AppCalculator extends ApplicationInternal {
  readonly name: AppName;

  applicationStyle: ApplicationStyle;
  keys: CalculatorKey[];

  constructor() {
    super();
    this.name = "calculator";
    this.applicationStyle = {
      colorBackground: "#202020",
      colorTitleText: getGlobalCSSVarValue("--color-taskbar-text-bright"),
    };
    this.keys = this.getInitKeys();
  }

  getInitMovingWindowState(): MovingWindowLocalState {
    return initMovingWindowState(this, {
      sizeInitPerc: [0.95, 0.75],
      sizeInitRatio: 2/3
    })
  }

  private getInitKeys() {
    return [
      { text: "(", type: "function", handler: () => {} },
      { text: ")", type: "function", handler: () => {} },
      { text: "%", type: "function", handler: () => {} },
      { text: "CE", type: "function", handler: () => {} },
    
      { text: "7", type: "value", handler: () => {} },
      { text: "8", type: "value", handler: () => {} },
      { text: "9", type: "value", handler: () => {} },
      { text: "/", type: "function", handler: () => {} },
    
      { text: "4", type: "value", handler: () => {} },
      { text: "5", type: "value", handler: () => {} },
      { text: "6", type: "value", handler: () => {} },
      { text: "*", type: "function", handler: () => {} },
    
      { text: "1", type: "value", handler: () => {} },
      { text: "2", type: "value", handler: () => {} },
      { text: "3", type: "value", handler: () => {} },
      { text: "-", type: "function", handler: () => {} },
    
      { text: "0", type: "value", handler: () => {} },
      { text: ".", type: "value", handler: () => {} },
      { text: "=", type: "primary", handler: () => {} },
      { text: "+", type: "function", handler: () => {} },
    ] satisfies CalculatorKey[] as CalculatorKey[];
  }


}
