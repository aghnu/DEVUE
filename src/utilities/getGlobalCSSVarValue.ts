export function getGlobalCSSVarValue(name: string): string | null {
  if (hasVarInName(name)) name = cleanVarFromName(name);

  const cssValue = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue(name);

  return cssValue === "" ? null : cssValue;
}


export function getCSSVarValue(name: string, element: HTMLElement): string | null {
  if (hasVarInName(name)) name = cleanVarFromName(name);

  const cssValue = window
    .getComputedStyle(element)
    .getPropertyValue(name);

  return cssValue === "" ? null : cssValue;
}

export function getCSSVarValueRecursive(name: string, element: HTMLElement ): string | null {
  const value = getCSSVarValue(name, element);
  if (value !== null && hasVarInName(value)) return getCSSVarValue(value, element);
  return value;
}

export function cleanVarFromName(cssVar: string): string {
  const groups = cssVar.match(/^var\((.+)\)$/);
  if (groups) return groups[1];
  return "";
}

export function hasVarInName(name: string): boolean {
  return name.includes("var(");
}
