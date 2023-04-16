import { ref, computed, onMounted, onUnmounted } from "vue";

export function useDateTime() {
  const dateTime = ref(new Date());

  const timeString = computed(() => {
    const hours = dateTime.value.getHours();
    const minutes = dateTime.value.getMinutes();

    const hoursDisplay = (hours % 13) + Math.floor(hours / 13);
    const minutesDisplay = minutes < 10 ? `0${minutes}` : minutes;
    const amPm = hours < 12 ? "AM" : "PM";

    return `${hoursDisplay}:${minutesDisplay} ${amPm}`;
  });

  const dateString = computed(() => {
    const day = dateTime.value.getDate();
    const month = dateTime.value.getMonth() + 1;
    const year = dateTime.value.getFullYear();

    const dayDisplay = day < 10 ? `0${day}` : day;

    return `${month}/${dayDisplay}/${year}`;
  });

  let timeInterval: number | undefined;
  onMounted(() => {
    timeInterval = window.setInterval(() => {
      dateTime.value = new Date();
    }, 1000);
  });

  onUnmounted(() => {
    window.clearInterval(timeInterval);
  });

  return {
    dateTime,
    timeString,
    dateString,
  };
}
