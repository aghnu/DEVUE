import { storeToRefs } from "pinia";
import { Ref, computed, onMounted, watch } from "vue";
import { useWindowsStatesStore } from "../stores/windowsStates";
import { Tuple } from "../types/TypeBasic";
import { PointerLocation } from "../types/TypeDesktop";
import { MovingWindowLocalState } from "../types/TypeWindows";
import gsap from "gsap";

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

export function connectWindowMoving(
  state: Ref<MovingWindowLocalState>,
  windowElement: Ref<HTMLDivElement | undefined>
) {
  const windowsState = useWindowsStatesStore();
  const { topWindow } = storeToRefs(windowsState);

  const statePosition = computed(() => state.value.position);
  const stateSize = computed(() => state.value.size);
  const stateSnapped = computed(() => state.value.snapped);

  onMounted(() => {
    watch(
      [statePosition, stateSize, stateSnapped],
      ([position, size, snapped], [_, __, snappedOld]) => {
        if (!windowElement.value) return;

        const styleSize = getCurrentSizeStyle(size, snapped);
        const stylePosition = getCurrentPositionStyle(position, snapped);

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
              duration: 0,
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
