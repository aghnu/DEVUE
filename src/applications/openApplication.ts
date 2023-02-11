import { v4 as uuid } from "uuid";
import { AppTerminal } from "./AppTerminal";
import { AppName } from "../types/TypeApp";
import { MovingWindowLocalState } from "../types/TypeWindows";
import { initMovingWindowState } from "../logics/doWindowCreation";
import { useWindowsStatesStore } from "../stores/windowsStates";
import { AppGithub } from "./AppGithub";
import { AppLinkedin } from "./AppLinkedin";

export function openApp(name: AppName) {
  const appRunLookup: Record<AppName, () => void> = {
    terminal: openAppTerminal,
    github: openAppGithub,
    linkedin: openAppLinkedin,
  };

  // run the application
  if (appRunLookup[name]) {
    appRunLookup[name]();
  }
}

function openAppTerminal() {
  const windowsState = useWindowsStatesStore();
  const appInstance = new AppTerminal();
  const movingWindowState: MovingWindowLocalState = initMovingWindowState({
    id: uuid(),
    order: 0,
    position: [0, 0],
    size: [0, 0],
    sizeMin: null,
    sizeMax: null,
    snapped: "center",
    appInstance: appInstance,
  });

  windowsState.addMovingWindow(initMovingWindowState(movingWindowState));
}

function openAppGithub() {
  const appInstance = new AppGithub();
  window.open(appInstance.getLink());
}

function openAppLinkedin() {
  const appInstance = new AppLinkedin();
  window.open(appInstance.getLink());
}
