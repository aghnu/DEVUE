import { AppName } from "../types/TypeApp";
import { ApplicationExternal } from "./ApplicationExternal";

export class AppGithub extends ApplicationExternal {
  readonly name: AppName;
  readonly link;

  constructor() {
    super();
    this.name = "github";
    this.link = "https://github.com/aghnu"
  }
}