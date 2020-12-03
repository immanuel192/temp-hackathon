<script lang="ts">
import { defineComponent } from '@vue/composition-api';
// import { Bar } from 'vue-chartjs';
import data from '@/sample-data.json';
// @ts-ignore
import CustomPolarChart from '@/views/CustomPolarChart';
import { get, countBy, map, groupBy, chain, sum } from 'lodash';

export default {
  components: {
    CustomPolarChart,
  },
  data() {
    return {
      rawData: data,
    }
  },
  computed: {
    polarChartData() {
      const dataSet = chain(this.rawData)
        .map((item) => {
          return {
            id: item.id,
            time: `${item.tsDetail.year}/${item.tsDetail.month}/${item.tsDetail.day}`,
            ...item.SentimentScore,
          }
        })
        .groupBy('Sentiment')
        .value()

      return {
        datasets: [{
          data: [
            dataSet.Mixed.length,
            dataSet.Positive.length,
            dataSet.NEUTRAL.length,
            dataSet.Negative.length,
          ],
          backgroundColor: [
            "rgba(103, 182, 93,.75)",
            "rgba(182, 87, 56,.75)",
            "rgba(83, 134, 155,.75)"
          ],
          hoverBackgroundColor: [
            "rgba(103, 182, 93,1)",
            "rgba(182, 87, 56,1)",
            "rgba(83, 134, 155,1)"
          ]
        }],
        labels: [
          "Mixed",
          "Positive",
          "Neutral",
          "Negative",
        ],
      }
    },
  },
}
</script>
<template>
  <div class="root-page">
    <custom-polar-chart :chartData="polarChartData" />
  </div>
</template>
<style lang="scss" scoped>
.root-page {
  margin-left: 220px;
}
</style>
