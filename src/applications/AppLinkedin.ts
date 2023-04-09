import { AppName } from "../types/TypeApplication";
import { ApplicationExternal } from "./ApplicationExternal";

export class AppLinkedin extends ApplicationExternal {
  readonly name: AppName;
  readonly link;

  constructor() {
    super();
    this.name = "linkedin";
    this.link = "https://www.linkedin.com/in/gengyuanh";
  }
}
