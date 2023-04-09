import { AppName } from "../types/TypeApplication";
import { ApplicationExternal } from "./ApplicationExternal";

export class AppGithub extends ApplicationExternal {
  readonly name: AppName;
  readonly link;

  constructor() {
    super();
    this.name = "github";
    this.link = "https://github.com/aghnu";
  }
}
