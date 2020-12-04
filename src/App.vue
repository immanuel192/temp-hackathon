<script lang="ts">
import {
  defineComponent, ref, watchEffect, onMounted, reactive,
} from '@vue/composition-api';
// @ts-ignore
import AppHeader from '@/views/AppHeader';
// @ts-ignore
import Sidebar from '@/views/Sidebar';
// @ts-ignore
import RootPage from '@/views/RootPage';
import { db } from '@/main';

export default {
  name: 'App',
  components: {
    AppHeader,
    Sidebar,
    RootPage,
  },
  data() {
    return {
      channelList: [],
      currentChannel: {},
    }
  },
  mounted() {
    this.getChannels()
  },
  methods: {
    async getChannels() {
      db.collection("channels").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.channelList.push(
            {
              channelId: doc.data().channelId,
              name: doc.data().name,
            }
          )
        });

        this.setDefaultChannel()

      });
    },
    changeChannel(channel) {
      this.currentChannel = channel
    },
    setDefaultChannel() {
      this.currentChannel = this.channelList[0]
    },
  },
}

</script>

<template>
  <div class="app">
    <app-header/>
    <div class="main-container d-flex">
      <sidebar :channelList="channelList" :currentChannel="currentChannel" @change-channel="changeChannel" />
      <root-page :currentChannel="currentChannel" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
$header-height: 150px;
$header-top: 5px;

* {
  font-size: 16px;
  font-family: 'Source Sans Pro', sans-serif;
}

.app {
  background: #212121;
}
.main-container {
  background: #212121;
}
</style>
