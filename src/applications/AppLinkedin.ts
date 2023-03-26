import { AppName } from "../types/TypeApp";
import { ApplicationExternal } from "./ApplicationExternal";

export class AppLinkedin extends ApplicationExternal {
  readonly name: AppName;
  readonly link;

  constructor() {
    super();
    this.name = "linkedin";
    this.link = "https://www.linkedin.com/in/gengyuanh"
  }
}
