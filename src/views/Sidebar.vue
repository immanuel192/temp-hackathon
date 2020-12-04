<script lang="ts">
import { isEmpty } from 'lodash';

export default {
  name: 'sidebar',
  props: ['channelList', 'currentChannel'],
  methods: {
    clickChannel(id: string) {
      this.$emit('change-channel', id)
    },
    isItemSelected(id: string) {
      return !isEmpty(this.currentChannel) ? id === this.currentChannel.channelId : false
    },
  },
}
</script>
<template>
  <div>
    <b-sidebar visible shadow>
      <template v-for="channel in channelList">
        <div :key="channel.channelId" class="item" :class="{ selected: isItemSelected(channel.channelId) }" @click="clickChannel(channel)">#{{ channel.name }}</div>
      </template>
      <footer class="position-absolute">
        <div>A Hackathon 2020 project by Thao, Trung, Sarah, Jason, Simon</div>
      </footer>
    </b-sidebar>
  </div>
</template>
<style lang="scss" scoped>
$header-height: 150px;

::v-deep .b-sidebar {
  top: $header-height;
  width: 220px;
  background: #212121 !important;
  color: #ccc !important;

  .item {
    margin: 0px 16px;
    padding: 10px 0;
    cursor: pointer;

    &.selected {
      font-weight: 400;
      color: #f7544d;
    }
  }

  button {
    display: none;
  }

  .b-sidebar-header {
    display: none;
  }

  footer {
    bottom: 170px;
    left: 16px;
  }
}
</style>
