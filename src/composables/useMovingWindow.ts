import { storeToRefs } from "pinia";
import { Ref, computed, onMounted, watch } from "vue";
import { useDesktopStatesStore } from "../stores/desktopStates";
import { Tuple } from "../types/TypeBasic";
import { PointerLocation } from "../types/TypeDesktop";
import { MovingWindowLocalState } from "../types/TypeWindows";
import gsap from "gsap";
import { WINDOW_CONFIG } from "../constants/WindowManager";

function getCurrentPositionStyle(
  position: Tuple<number>,
  snapped: PointerLocation
): Tuple<string> {
  switch (snapped) {
    case "left":
      return ["0", "0"];
    case "top":
      return ["0", "0"];
    case "right":
      return ["50%", "0"];
    default:
      return [`${position[0]}px`, `${position[1]}px`];
  }
}

function getCurrentSizeStyle(
  size: Tuple<number>,
  snapped: PointerLocation
): Tuple<string> {
  switch (snapped) {
    case "left":
      return ["50%", "100%"];
    case "top":
      return ["100%", "100%"];
    case "right":
      return ["50%", "100%"];
    default:
      return [`${size[0]}px`, `${size[1]}px`];
  }
}

export function useMovingWindow(state: Ref<MovingWindowLocalState>) {
  const desktopStates = useDesktopStatesStore();

  const { sizeWindowsManager } = storeToRefs(desktopStates);
  const isMovingWindowSnapNarrow = computed(
    () =>
      sizeWindowsManager.value[0] <=
      WINDOW_CONFIG.DEFAULT_SIZE_MIN_WINDOW[0] * 2
  );

  const movingWindowPosition = computed(() => state.value.position);
  const movingWindowSize = computed(() => state.value.size);
  const movingWindowSnapped = computed(() => state.value.snapped);

  function startMovingWindow(windowElement: Ref<HTMLDivElement | undefined>) {
    onMounted(() => {
      watch(
        [movingWindowPosition, movingWindowSize, movingWindowSnapped],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([position, size, snapped], [_, __, snappedOld]) => {
          if (!windowElement.value) return;

          // connect snapped based on desktop width
          // if snapped and width too small, make it top
          const snappedCorrected: PointerLocation =
            snapped === "center"
              ? "center"
              : isMovingWindowSnapNarrow.value
              ? "top"
              : snapped;
          const styleSize = getCurrentSizeStyle(size, snappedCorrected);
          const stylePosition = getCurrentPositionStyle(
            position,
            snappedCorrected
          );

          if (snapped === snappedOld || snappedOld === undefined) {
            gsap.to(windowElement.value, {
              duration: 0,
              overwrite: "auto",
              height: styleSize[1],
              width: styleSize[0],
              left: stylePosition[0],
              top: stylePosition[1],
            });
          } else {
            if (snapped !== "center") {
              gsap.to(windowElement.value, {
                duration: 0.25,
                overwrite: "auto",
                height: styleSize[1],
                width: styleSize[0],
                left: stylePosition[0],
                top: stylePosition[1],
              });
            } else {
              gsap.to(windowElement.value, {
                duration: 0.25,
                overwrite: "auto",
                height: styleSize[1],
                width: styleSize[0],
                left: stylePosition[0],
                top: stylePosition[1],
              });
            }
          }
        },
        { immediate: true }
      );
    });
  }

  return {
    isMovingWindowSnapNarrow,
    movingWindowPosition,
    movingWindowSize,
    movingWindowSnapped,
    startMovingWindow,
  };
}
