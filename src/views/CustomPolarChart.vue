<script lang="ts">
import { PolarArea } from 'vue-chartjs';

export default {
  extends: PolarArea,
  props: {
    chartData: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      options: {
        title: {
          display: true,
          text: 'Sentiment Distribution',
          fontFamily: 'Source Sans Pro',
          fontSize: 18,
        },
      },
    }
  },
  watch: {
    chartData () {
      // @ts-ignore
      this.renderChart(this.chartData, this.options)
    }
  },
  mounted() {
    // @ts-ignore
    this.renderChart(this.chartData, this.options)
  },
  computed: {
    myStyles () {
      return {
        position: 'relative',
      }
    }
  }
}
</script>
<bar-chart :chartdata="chartData" :styles="myStyles"></bar-chart>
