<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default {
  name: 'sidebar',
  props: ['channelList'],
  methods: {
    clickChannel(id: string) {
      this.$emit('change-channel', id)
    }
  }
}
</script>
<template>
  <div>
    <b-sidebar visible shadow>
      <template v-for="channel in channelList">
        <div :key="channel.channelId" class="item" @click="clickChannel(channel)">#{{ channel.name }}</div>
      </template>
      <footer class="position-absolute">
        <div>A Hackathon 2020 project by Thao, Trung, Sarah, Jason, Simon</div>
      </footer>
    </b-sidebar>
  </div>
</template>
<style lang="scss" scoped>
$header-height: 150px;
$header-top: 5px;

::v-deep .b-sidebar {
  top: calc(#{$header-height} + #{$header-top});
  width: 220px;
  background: #212121 !important;
  color: #ccc !important;

  .item {
    margin: 0px 16px;
    padding: 10px 0;
    cursor: pointer;
  }

  button {
    display: none;
  }

  .b-sidebar-header {
    display: none;
  }

  footer {
    bottom: 70px;
  }
}
</style>