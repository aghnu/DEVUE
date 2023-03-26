import { ApplicationExternalInterface, AppType } from "../types/TypeApp";
import { Application } from "./Application";

export abstract class ApplicationExternal
  extends Application
  implements ApplicationExternalInterface
{
  abstract readonly link: string;
  readonly type: AppType;

  constructor() {
    super();
    this.type = "external";
  }

  public open(): this {
    window.open(this.link);
    return this;
  }
}
