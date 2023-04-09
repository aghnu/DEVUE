import { ApplicationStyle } from "../types/TypeApplication";
import { getGlobalCSSVarValue } from "./getGlobalCSSVarValue";

export function defaultApplicationStyleFactory(): ApplicationStyle {
  return {
    colorBackground: null,
    colorTitleText: null,
    hideTitleBarFading: false,
    isBgTransparent: false,
  };
}
