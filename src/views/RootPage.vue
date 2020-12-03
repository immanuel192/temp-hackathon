<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import data from '@/sample-data.json';
import data1 from '@/sample-data-1.json';
import data2 from '@/sample-data-2.json';
// @ts-ignore
import CustomPolarChart from '@/views/CustomPolarChart';
// @ts-ignore
import CustomBarChart from '@/views/CustomBarChart';
// @ts-ignore
import ProgressBar from '@/views/ProgressBar';
// @ts-ignore
import Loading from '@/views/Loading';
import { get, map, groupBy, chain, filter } from 'lodash';
import { db } from '@/main';

interface SentimentScore {
  mixed: number
  negative: number
  neutral: number
  positive: number
  sentiment: string
}

interface TsDetail {
  day: number
  month: number
  year: number
}

interface Ts {
  seconds: number,
  nanoseconds: number,
}

interface MessageSentiment {
  id?: string
  channelId: string
  channelName?: string
  sentimentScore: SentimentScore
  ts: Ts
  tsDetail: TsDetail
}

interface DateSentiment {
  dateStr: string,
  count: number,
  sentiment: string,
}

export default {
  components: {
    CustomPolarChart,
    CustomBarChart,
    ProgressBar,
    Loading,
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
        this.loaded = true
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
  computed: {
    barChartData() {
      const messageSentiments: MessageSentiment[] = this.rawData

      const sentimentsByDate = groupBy(messageSentiments, (sentiment) => {
        return (new Date(sentiment.ts.seconds * 1000)).toDateString()
      })

      let dateSentiments: DateSentiment[] = []

      for (const dateKey in sentimentsByDate) {
        let positiveCount = 0
        let negativeCount = 0

        sentimentsByDate[dateKey].forEach(sentiment => {
          if (sentiment.sentimentScore.sentiment.toLowerCase() === 'positive') {
            positiveCount += 1
          }

          if (sentiment.sentimentScore.sentiment.toLowerCase() === 'negative') {
            negativeCount += 1
          }
        })

        if (positiveCount > negativeCount) {
          dateSentiments.push({
            dateStr: dateKey,
            count: positiveCount,
            sentiment: 'positive',
          })
        } else {
          dateSentiments.push({
            dateStr: dateKey,
            count: negativeCount,
            sentiment: 'negative',
          })
        }
      }

      // console.log(JSON.stringify(dateSentiments, null, 2))
      dateSentiments = dateSentiments.sort((dS1, dS2) => {
        return (new Date(dS1.dateStr)) > (new Date(dS2.dateStr)) ? 1 : -1
      })

      const dataSets = dateSentiments.map(s => {
        if (s.sentiment === 'positive') {
          return {
            label: s.dateStr,
            backgroundColor: 'rgba(15, 176, 99, .75)',
            data: [s.count],
          }
        }
        return {
          label: s.dateStr,
          backgroundColor: 'rgba(247, 85, 68, 1)',
          data: [-s.count],
        }
      })

      return {
        datasets: dataSets,
      }
    },
    barChartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false,
        },
        tooltips: {
          enabled: true,
          callbacks: {
            // label: function(tooltipItem, data) {
            //   return ''
            // },
            title: function(tooltipItem, data) {
              return ''
            }
          }
        }
      }
    }
  }
}
</script>
<template>
  <div class="root-page shadow">
    <div class="root-page-container">
      <div class="d-md-flex">
        <div class="title">#{{ currentChannel.name }}</div>
        <div class="refresh" @click="this.getData">
          <img src="@/assets/icon-refresh.png" alt="refresh">
        </div>
      </div>
      <loading v-if="!loaded" class="loading-container p-3 p-md-5 m-md-3"/>
      <custom-bar-chart v-if="loaded" class="bar-chart p-3 p-md-5 m-md-3" :chartData="barChartData" :options="barChartOptions"/>
      <div class="d-md-flex flex-md-equal w-100 my-md-3 pl-md-3">
        <progress-bar v-if="loaded" class="progress-chart" :chartData="polarChartData" />
        <custom-polar-chart v-if="loaded" class="polar-chart d-flex" :chartData="polarChartData" />
      </div>
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
  border-radius: 4px;
  padding: 36px 24px;
  width: 80%;

  .root-page-container {
    margin: auto;
    max-width: 1000px;

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
      width: 1000px;
      height: 500px;
    }

    .progress-chart {
      background: #ffffff;
      border-radius: 4px;
      padding: 20px;
      margin-right: 16px;
      min-width: 50%;
    }

    .polar-chart {
      background: #ffffff;
      border-radius: 4px;
      padding: 20px;
      min-width: 50%;
    }

    .loading-container {
      background: #ffffff;
      text-align: center;
      min-height: 700px;
      padding-top: 30% !important;
    }
  }
}
</style>
