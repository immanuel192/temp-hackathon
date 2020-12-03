<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { Bar } from 'vue-chartjs';

export default {
  extends: Bar,
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