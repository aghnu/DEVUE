import { Application, AppName } from "../types/TypeApp";

export class AppGithub implements Application {
  name: AppName = "github";
  link = "https://github.com/aghnu";

  constructor() {}

  getLink() {
    return this.link;
  }
}
