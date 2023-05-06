import {
  ApplicationExternalInterface,
  AppType,
} from "../types/TypeApplication";
import Application from "./Application";

export default abstract class ApplicationExternal
  extends Application
  implements ApplicationExternalInterface
{
  abstract readonly link: string;
  readonly type: AppType;

  constructor() {
    super();
    this.type = "external";
  }

  public async open() {
    window.open(this.link);
    return this;
  }
}
