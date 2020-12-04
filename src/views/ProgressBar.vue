<script lang="ts">
import { sum, round } from 'lodash';

export default {
  name: 'ProgressBar',
  props: {
    chartData: {
      type: Object,
      default: null,
    }
  },
  data() {
    return {
      options: {
        title: {
          display: true,
          text: 'Sentiment Distribution',
        },
      },
    }
  },
  computed: {
    percentage(): Number {
      return round((this.noMixedAmount as number) /
        (this.totalAmount as number), 2)
    },
    totalAmount(): Number {
      return sum(this.chartData.datasets[0].data)
    },
    noMixedAmount(): Number {
      return this.chartData.datasets[0].data[1] +
        this.chartData.datasets[0].data[2] +
        this.chartData.datasets[0].data[3] -
        this.chartData.datasets[0].data[0]
    }
  },
}
</script>
<template>
  <div class="progress-bar-container">
    <div class="title">Confidence Rating</div>
    <div class="progress">
      <div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" style="width:70%">
      </div>
    </div>
    <div class="figure">{{ percentage * 100 }}%</div>
    <div class="description">{{ noMixedAmount }} of {{ totalAmount }} messages successfully analysed</div>
  </div>
</template>
<style lang="scss" scoped>
.progress-bar-container {
  text-align: center;

  .title {
    font-size: 18px;
    font-weight: 400;
    margin-bottom: 40px;
    color: #666666;
  }

  .progress {
    background-color: #b4e3e6;
    border-radius: 0;

    .progress-bar-success {
      background-color: #0fb063;
    }
  }

  .figure {
    font-weight: 300;
    font-size: 60px;
  }

  .description {
    color: #919191;
    font-weight: 300;
  }
}
</style>
