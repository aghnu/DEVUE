import { AppName } from "../types/TypeApp";
import { ApplicationInternal } from "./ApplicationInternal";

export class AppTerminal extends ApplicationInternal {
  readonly name: AppName;

  constructor() {
    super();
    this.name = "terminal";
  }
}
