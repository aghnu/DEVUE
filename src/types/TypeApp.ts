import { ApplicationInternal } from "../applications/ApplicationInternal";

export type AppName = "terminal" | "github" | "linkedin";
export type AppType = "external" | "internal" | "action";
export type ApplicationInstance = ApplicationInternal;

export interface Application {
  readonly name: AppName;
  readonly type: AppType;

  open(): void;
}

export interface ApplicationExternalInterface {
  readonly link: string;
}

export interface ApplicationInternalnterface {
  movingWindowID: string | null;

  close(): void;
}
