import { ApplicationInternal } from "../applications/ApplicationInternal";

export type AppName =
  | "terminal"
  | "github"
  | "linkedin"
  | "welcome"
  | "app_menu"
  | "doc_pdf"
  | "calculator";
export type AppType = "external" | "internal" | "action";
export type ApplicationInstance = ApplicationInternal;

export interface ApplicationStyle {
  colorBackground: string | null;
  colorTitleText: string | null;
}

export interface ApplicationExternalInterface {
  readonly link: string;
}

export interface ApplicationInternalnterface {
  movingWindowID: string | null;
  applicationStyle: ApplicationStyle;

  close(): void;
}
