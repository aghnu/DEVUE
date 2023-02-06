import { Application, AppName } from "../types/TypeApp";
import { AppTerminal } from "./AppTerminal";

export const applicationClassLookup: Record<AppName, Application> = {
  terminal: AppTerminal as Application,
};
