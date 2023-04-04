import { ApplicationStyle } from "../types/TypeApp";
import { getGlobalCSSVarValue } from "./getGlobalCSSVarValue";

export function defaultApplicationStyleFactory(): ApplicationStyle {
  return {
    colorBackground: null,
    colorTitleText: null,
    hideTitleBarFading: false,
  };
}
