export class DoubleClickDetector {
  callBackFunc: () => void;
  clicked: boolean;
  delayms: number;
  clickedTimeout: number;
  constructor(callBackFunc: () => void, delayms: number = 50) {
    this.callBackFunc = callBackFunc;
    this.clicked = false;
    this.clickedTimeout = 0;
    this.delayms = delayms;
  }

  click() {
    if (this.clicked) {
      clearTimeout(this.clickedTimeout);
      this.clicked = false;
      this.callBackFunc;
    } else {
      this.clicked = true;
      this.clickedTimeout = window.setTimeout(() => {
        this.clicked = false;
      }, this.delayms);
    }
  }
}
