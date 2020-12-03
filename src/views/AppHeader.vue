<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
});
</script>
<template>
  <div>
    <header class="header d-flex">
      <div class="justify-content-center align-self-center">SentiMinder</div>
    </header>
  </div>
</template>
<style lang="scss" scoped>
$header-height: 50px;

.header {
  padding: 10px;
  background: #004085;
  color: #ffffff;
  height: $header-height;
}
</style>