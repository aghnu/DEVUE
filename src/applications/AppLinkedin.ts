import { Application, AppName } from "../types/TypeApp";

export class AppLinkedin implements Application {
  name: AppName = "linkedin";
  link = "https://www.linkedin.com/in/gengyuanh";

  constructor() {}

  getLink() {
    return this.link;
  }
}
