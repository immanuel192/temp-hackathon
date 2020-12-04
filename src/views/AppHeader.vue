<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
});
</script>
<template>
  <div>
    <header class="header d-flex">
      <div class="justify-content-center align-self-center">
        <img class="logo" src="@/assets/sentiMinder-logo.png" alt="logo">
      </div>
    </header>
  </div>
</template>
<style lang="scss" scoped>
$header-height: 150px;
$header-top: 5px;

.header {
  padding: 10px;
  background: #2b577d;
  color: #ffffff;
  height: $header-height;
  margin-top: $header-top;
  width: 100%;

  .logo {
    margin-top: -22px;
  }
}
</style>