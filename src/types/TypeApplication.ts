/**
 * Application name
 */
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
  objectClass: AppObjectClassInternal;
  vueComponent: AppVueComponent;
}

export interface ApplicationMetaExternal extends ApplicationMetaCommon {
  name: AppNameExternal;
  type: "external";
  description: string;
  objectClass: AppObjectClassExternal;
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
