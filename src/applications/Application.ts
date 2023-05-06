import { AppName, AppType } from "../types/TypeApplication";

export default abstract class Application {
  abstract readonly name: AppName;
  abstract readonly type: AppType;

  abstract open(): Promise<this>;

  public static build<T = Application>(this: { new (): T }) {
    return new this();
  }
}
