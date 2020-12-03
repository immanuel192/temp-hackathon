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
}
</script>
  <bar-chart :chartdata="chartData" ></bar-chart>
<style lang="scss" scoped>

</style>