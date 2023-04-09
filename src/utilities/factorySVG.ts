import { AppIconStyle, AppIconHTML } from "../types/TypeApplication";

export function getIconClose(style: AppIconStyle): AppIconHTML {
  return /*html*/ `
    <svg height="${style.size}" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
      <path d="M42.1466 4L46 7.85339L28.8532 25L46 42.1466L42.1466 46L25 28.8532L7.85339 46L4 42.1466L21.1466 25L4 7.85339L7.85339 4L25 21.1466L42.1466 4Z" fill="${style.color}"/>
    </svg>
  `;
}
