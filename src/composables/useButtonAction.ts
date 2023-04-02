import { onMounted, onUnmounted, ref } from "vue";

export function useButtonAction(click: () => void) {
  const pointerDown = ref(false);
  const pointerHover = ref(false);

  function handlerPointerDown() {
    pointerDown.value = true;
  }

  function handlerPointerUp() {
    if (pointerDown.value) {
      pointerDown.value = false;
      click();
    }
  }

  function handlerHover() {
    pointerHover.value = true;
  }

  function handlerLeave() {
    pointerHover.value = false;
  }

  onMounted(() => {
    document.addEventListener("mouseup", handlerPointerUp);
    document.addEventListener("touchend", handlerPointerUp);
  });

  onUnmounted(() => {
    document.removeEventListener("mouseup", handlerPointerUp);
    document.removeEventListener("touchend", handlerPointerUp);
  });

  return {
    pointerDown,
    pointerHover,
    handlerPointerDown,
    handlerPointerUp,
    handlerHover,
    handlerLeave,
  };
}
