import { ApplicationStyle } from "../types/TypeApplication";

export function defaultApplicationStyleFactory(): ApplicationStyle {
  return {
    colorBackground: null,
    colorTitleText: null,
    hideTitleBarFading: false,
    isBgTransparent: false,
  };
}
