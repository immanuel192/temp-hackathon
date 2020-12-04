<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { Bar } from 'vue-chartjs';

export default {
  extends: Bar,
  props: {
    chartData: {
      type: Object,
      default: null
    },
    options: {
      type: Object,
      default: null
    }
  },
  mounted() {
    // @ts-ignore
    this.renderChart(this.chartData, this.options)
  },
  computed: {
    myStyles () {
      return {
        position: 'relative'
      }
    }
  },
  watch: {
    chartData () {
      // @ts-ignore
      this.renderChart(this.chartData, this.options)
    }
  },
}
</script>

<bar-chart :chartdata="chartData" :styles="myStyles"></bar-chart>

<style lang="scss" scoped>

</style>
