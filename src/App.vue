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

export default defineComponent({
  components: {
    AppHeader,
    Sidebar,
    RootPage,
  },
  setup() {

    return {
    };
  },
});

</script>

<template>
  <div>
    <app-header/>
    <sidebar/>
    <root-page/>
  </div>
</template>
