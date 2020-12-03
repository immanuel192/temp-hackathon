<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import data from '@/sample-data.json';
// @ts-ignore
import CustomPolarChart from '@/views/CustomPolarChart';
// @ts-ignore
import CustomBarChart from '@/views/CustomBarChart';
import { get, countBy, map, groupBy, chain, sum, filter } from 'lodash';
import { db } from '@/main';

export default {
  components: {
    CustomPolarChart,
    CustomBarChart,
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
    <div class="title">#{{ currentChannel.name }}</div>
    <custom-bar-chart class="bar-chart"/>
    <custom-polar-chart v-if="loaded" class="polar-chart" :chartData="polarChartData" />
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

  .polar-chart {
    width: 350px;
    background: #ffffff;
    border-radius: 4px;
    padding: 20px;
  }
}
</style>
