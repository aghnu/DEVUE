export type Listner = (message?: string) => void;

export default class GlobalAnimation {
  static _instance: GlobalAnimation | undefined;
  loopRun: boolean = false;
  listeners: Listner[] = [];

  constructor() {
    if (GlobalAnimation._instance) {
      return GlobalAnimation._instance;
    }

    GlobalAnimation._instance = this;
    this.start();
  }

  static getInstance() {
    if (GlobalAnimation._instance) {
      return GlobalAnimation._instance;
    }

    return new GlobalAnimation();
  }

  private loop() {
    if (!this.loopRun) return;
    window.requestAnimationFrame(() => {
      this.listeners.forEach((func) => func());
      this.loop();
    });
  }

  public start() {
    if (this.loopRun) return;
    this.loopRun = true;
    this.loop();
  }

  public stop() {
    this.loopRun = false;
  }

  public destroy() {
    this.stop();
    GlobalAnimation._instance = undefined;
  }

  public subscribe(listner: Listner) {
    this.listeners.push(listner);
  }

  public unsubscribe(listner: Listner) {
    this.listeners = this.listeners.filter((func) => func !== listner);
  }
}
