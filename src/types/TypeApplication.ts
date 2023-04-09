import {
  APPLICATION_INDEX_NAME_ACTION,
  APPLICATION_INDEX_NAME_EXTERNAL,
  APPLICATION_INDEX_NAME_INTERNAL,
  APPLICATION_OBJECT_CLASS_EXTERNAL,
  APPLICATION_OBJECT_CLASS_INTERNAL,
} from "../applications/META";

/**
 * Application name
 */
export type AppNameInternal = typeof APPLICATION_INDEX_NAME_INTERNAL[number];
export type AppNameExternal = typeof APPLICATION_INDEX_NAME_EXTERNAL[number];
export type AppNameAction = typeof APPLICATION_INDEX_NAME_ACTION[number];
export type AppName = AppNameInternal | AppNameExternal | AppNameAction;

/**
 * Application type
 */
export type AppType = ApplicationMeta["type"];

/**
 * Application meta related
 */
export interface ApplicationMetaCommon {
  nameDisplay: string;
  getAppIcon: (style: AppIconStyle) => AppIconHTML;
}

export interface ApplicationMetaInternal extends ApplicationMetaCommon {
  name: AppNameInternal;
  type: "internal";
  description: string;
  objectClass: typeof APPLICATION_OBJECT_CLASS_INTERNAL[number];
}

export interface ApplicationMetaExternal extends ApplicationMetaCommon {
  name: AppNameExternal;
  type: "external";
  description: string;
  objectClass: typeof APPLICATION_OBJECT_CLASS_EXTERNAL[number];
}

export interface ApplicationMetaAction extends ApplicationMetaCommon {
  name: AppNameAction;
  type: "action";
}

export type ApplicationMeta =
  | ApplicationMetaInternal
  | ApplicationMetaExternal
  | ApplicationMetaAction;

/**
 * Application icon style related
 */
export interface AppIconStyle {
  size: string;
  color: string;
}
export type AppIconHTML = string;

export interface ApplicationStyle {
  colorBackground: string | null;
  colorTitleText: string | null;
  hideTitleBarFading: boolean;
  isBgTransparent: boolean;
}

/**
 * Application class interface
 */
export interface ApplicationExternalInterface {
  readonly link: string;
}

export interface ApplicationInternalnterface {
  movingWindowID: string | null;
  applicationStyle: ApplicationStyle;

  close(): void;
}

export interface ActionBarAppIconStyle {
  colorBackground: string;
  colorText: string;
}
