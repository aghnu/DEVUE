import { AppTerminal } from "../applications/AppTerminal";

export type AppName = "terminal" | "github" | "linkedin";
export type ApplicationInstance = AppTerminal;

export interface Application {
  readonly name: AppName;
}
