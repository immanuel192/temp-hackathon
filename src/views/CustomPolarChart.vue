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
  mounted() {
    this.renderChart(this.chartData)
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