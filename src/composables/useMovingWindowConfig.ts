import { Ref, computed } from "vue";
import { MovingWindowLocalState } from "../types/TypeWindows";
import { useWindowsStatesStore } from "../stores/windowsStates";
import { storeToRefs } from "pinia";

export function useMovingWindowConfig(state: Ref<MovingWindowLocalState>) {
  const windowsState = useWindowsStatesStore();
  const { topWindow } = storeToRefs(windowsState);

  const styleWindowPositionLeft = computed(
    () => String(state.value.position[0]) + "px"
  );
  const styleWindowPositionTop = computed(
    () => String(state.value.position[1]) + "px"
  );
  const styleWindowSizeWidth = computed(
    () => String(state.value.size[0]) + "px"
  );
  const styleWindowSizeHeight = computed(
    () => String(state.value.size[1]) + "px"
  );
  const styleWindowZIndex = computed(() => String(state.value.order));
  const isWindowFocused = computed(
    () => topWindow !== null && state.value.id === state.value.id
  );

  return {
    styleWindowPositionLeft,
    styleWindowPositionTop,
    styleWindowSizeWidth,
    styleWindowSizeHeight,
    styleWindowZIndex,
    isWindowFocused,
  };
}
