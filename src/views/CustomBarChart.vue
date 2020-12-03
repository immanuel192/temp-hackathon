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
  }
}
</script>

<bar-chart :chartdata="chartData" :styles="myStyles"></bar-chart>

<style lang="scss" scoped>

</style>
