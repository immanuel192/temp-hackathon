<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import data from '@/sample-data.json';
// @ts-ignore
import CustomPolarChart from '@/views/CustomPolarChart';
// @ts-ignore
import CustomBarChart from '@/views/CustomBarChart';
// @ts-ignore
import ProgressBar from '@/views/ProgressBar';
import { get, countBy, map, groupBy, chain, sum, filter } from 'lodash';
import { db } from '@/main';

export default {
  components: {
    CustomPolarChart,
    CustomBarChart,
    ProgressBar,
  },
  props: ['currentChannel'],
  data() {
    return {
      rawData: [],
      currentChannelList: [],
      polarChartData: {},
      loaded: false,
    }
  },
  watch: {
    currentChannel () {
      this.getCurrentChannelList()
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData() {
      this.loaded = false;
      db.collection("messagesentiments").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.rawData.push({ ...doc.data() })
        });
        this.getCurrentChannelList()
      });
    },
    getCurrentChannelList() {
      const dataSet = filter(this.rawData, (item) => {
        return item.channelId === this.currentChannel.channelId
      })

      this.currentChannelList = dataSet

      if (this.currentChannelList.length !== 0) {
        this.getPolarChartData()
      } else {
        console.log('no match data')
      }
    },
    getPolarChartData() {
      const dataSet = chain(this.currentChannelList)
        .map((item) => {
        return {
          time: `${item.tsDetail.year}/${item.tsDetail.month}/${item.tsDetail.day}`,
          ...item.sentimentScore,
        }
      })
      .groupBy('sentiment')
      .value()

      this.polarChartData = {
        datasets: [{
          data: [
            dataSet.MIXED.length,
            dataSet.POSITIVE.length,
            dataSet.NEUTRAL.length,
            dataSet.NEGATIVE.length,
          ],
          backgroundColor: [
            "rgba(102, 102, 102, .75)",
            "rgba(15, 176, 99, .75)",
            "rgba(204, 204, 204, .75)",
            "rgba(247, 85, 68, .75)"
          ],
          hoverBackgroundColor: [
            "rgba(102, 102, 102, 1)",
            "rgba(15, 176, 99, 1)",
            "rgba(204, 204, 204, 1)",
            "rgba(247, 85, 68, 1)"
          ]
        }],
        labels: [
          "Mixed",
          "Positive",
          "Neutral",
          "Negative",
        ],
      }
      this.loaded = true
    }
  },
}
</script>
<template>
  <div class="root-page shadow">
    <div class="d-md-flex">
      <div class="title">#{{ currentChannel.name }}</div>
      <div class="refresh" @click="this.getData">
        <img src="@/assets/icon-refresh.png" alt="refresh">
      </div>
    </div>
    <custom-bar-chart class="bar-chart p-3 p-md-5 m-md-3"/>
    <div class="d-md-flex flex-md-equal w-100 my-md-3 pl-md-3">
      <progress-bar class="progress-chart mr-md-3 pt-3 px-3 pt-md-5 px-md-5" :chartData="polarChartData" />
      <custom-polar-chart v-if="loaded" class="polar-chart d-flex mr-md-3 pt-3 px-3 pt-md-5 px-md-5" :chartData="polarChartData" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.root-page {
  margin-left: 220px;
  position: relative;
  z-index: 10;
  margin-top: -50px;
  background: #f6f6f6;
  height: 100vh;
  border-radius: 4px;
  padding: 36px 24px;
  width: 80%;

  .title {
    font-size: 36px;
    color: #333333;
  }

  .refresh {
    margin-left: auto;
    cursor: pointer;
    line-height: 54px;

    img {
      width: 16px;
    }
  }

  .bar-chart {
    width: 350px;
    background: #ffffff;
  }

  .progress-chart {
    width: 350px;
    background: #ffffff;
    border-radius: 4px;
    padding: 20px;
  }

  .polar-chart {
    width: 350px;
    background: #ffffff;
    border-radius: 4px;
    padding: 20px;
  }
}
</style>
