<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
});
</script>
<template>
  <div>
    <b-sidebar visible shadow>
      <div class="item divider">Slack Channel Name</div>
      <div class="item divider">Slack Channel Name</div>
      <div class="item divider">Slack Channel Name</div>
    </b-sidebar>
  </div>
</template>
<style lang="scss" scoped>
$header-height: 50px;

::v-deep .b-sidebar {
  top: $header-height;
  width: 220px;

  .item {
    margin: 0px 16px;
    padding: 10px 0;
  }

  .divider {
    position: relative;
    margin-bottom: 6px;
    border-bottom: 1px solid #ffffff;

    &:last-child {
      border: 0;
    }
  }

  button {
    display: none;
  }

  .b-sidebar-header {
    display: none;
  }
}
</style>