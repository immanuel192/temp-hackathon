<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { PolarArea } from 'vue-chartjs';

export default {
  extends: PolarArea,
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
          text: 'Sentiment Distribution'
        }
      }
    }
  },
  watch: {
    chartData () {
      this.renderChart(this.chartData, this.options)
    }
  },
  mounted() {
    this.renderChart(this.chartData, this.options)
  },
  computed: {
    myStyles () {
      return {
        position: 'relative'
      }
    }
  }
}
</script>
  <bar-chart :chartdata="chartData" :styles="myStyles"></bar-chart>
<style lang="scss" scoped>

</style>