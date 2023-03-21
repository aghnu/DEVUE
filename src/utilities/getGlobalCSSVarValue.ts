export function getGlobalCSSVarValue(colorName: string): string | null {
  const cssValue = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue(colorName);

  return cssValue === "" ? null : cssValue;
}
