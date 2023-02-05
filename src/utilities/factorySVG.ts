import { AppName } from "../types/TypeApp";

export interface AppIconStyle {
  size: string;
  color: string;
}
export type AppIconHTML = string;

export function getAppIcon(name: AppName, style: AppIconStyle): AppIconHTML {
  const lookup: Record<AppName, (style: AppIconStyle) => AppIconHTML> = {
    terminal: getAppIconTerminal,
  };

  return lookup[name](style);
}

export function getAppIconTerminal(style: AppIconStyle): AppIconHTML {
  return `
    <svg height="${style.size}" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.80355 40L5.00396 37.248L17.4616 24.9981L5 12.752L7.7996 10L23.0607 24.9981L7.80355 40ZM46 38.622H26.2009V34.7295H46V38.622Z" fill="${style.color}"/>
    </svg>
  `;
}
