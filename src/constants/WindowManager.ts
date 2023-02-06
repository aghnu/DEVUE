import { Tuple } from "../types/TypeBasic";

export const WINDOW_CONFIG = {
  MIN_WINDOW_VISIABLE_BOARDER: 50, // minial visual parts of a moving window within window manager
  DEFAULT_SIZE_MIN_WINDOW: [125, 200] as Tuple<number>,
  WIN_INIT_SIZE_PERC: [0.75, 0.95] as Tuple<number>,
  WIN_INIT_SIZE_RATIO: (1 / 1) as number,
  WIN_INIT_STACK_POSITION_OFFSET: [20, 35] as Tuple<number>,
} as const;

export const POINTER_CONFIG = {
  POINTER_LOCATION_OFFSET: 16,
} as const;
