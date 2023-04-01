import { Tuple } from "../types/TypeBasic";

export interface WindowConfig {
  readonly MIN_WINDOW_VISIABLE_BOARDER: number;
  readonly DEFAULT_SIZE_MIN_WINDOW: Tuple<number>;
  readonly WIN_INIT_SIZE_PERC: Tuple<number>;
  readonly WIN_INIT_SIZE_RATIO: number;
  readonly WIN_INIT_STACK_POSITION_OFFSET: Tuple<number>;
}

export const WINDOW_CONFIG = {
  MIN_WINDOW_VISIABLE_BOARDER: 50, // minial visual parts of a moving window within window manager
  DEFAULT_SIZE_MIN_WINDOW: [300, 400],
  WIN_INIT_SIZE_PERC: [0.95, 0.95],
  WIN_INIT_SIZE_RATIO: 1 / 1,
  WIN_INIT_STACK_POSITION_OFFSET: [7, 7],
} as WindowConfig;

export const POINTER_CONFIG = {
  POINTER_LOCATION_OFFSET: 16,
} as const;
