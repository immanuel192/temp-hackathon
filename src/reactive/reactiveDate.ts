import {
  computed, ref, onMounted, onBeforeUnmount,
} from '@vue/composition-api';

function reactiveDate() {
  const currentDate = ref(new Date());

  const ret = {
    currentDateTitle: computed(() => new Intl.DateTimeFormat('en', { day: 'numeric', month: 'long', weekday: 'long' }).format(currentDate.value)),
  };
  let timeUpdateInterval;

  onMounted(() => {
    timeUpdateInterval = setInterval(() => {
      currentDate.value = new Date();
    }, 1000);
  });

  onBeforeUnmount(() => {
    clearInterval(timeUpdateInterval);
  });

  return (ret);
}

export {
  // eslint-disable-next-line import/prefer-default-export
  reactiveDate,
};
