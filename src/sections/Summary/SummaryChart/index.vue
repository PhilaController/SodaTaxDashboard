<template>
  <div class="summary-charts-body card-body">
    <div class="summary-body">
      <!-- Donut Chart -->
      <DonutChart :data="data" :colors="colors" class="donut-chart-wrapper" />

      <!-- Bar Chart -->
      <BarChart :data="data" :colors="colors" class="bar-chart-wrapper" />

      <A11yTable
        class="screen-reader-text"
        :data="data"
        :caption="tableCaption"
      />
    </div>
  </div>
</template>

<script>
import BarChart from "./BarChart";
import DonutChart from "./DonutChart";
import A11yTable from "./A11yTable";
import { formatNumber } from "@/utils";

export default {
  name: "SummaryChart",
  components: { BarChart, DonutChart, A11yTable },
  props: {
    data: { type: Map, default: null },
    fiscalYearLabel: { type: String, required: true },
  },
  data() {
    return {
      colors: {
        "Pre-K": "#25cef7",
        "Community Schools": "#f99300",
        "Parks and Recreation, Rebuild": "#58c04d",
        "Debt Service for Rebuild": "#f40000",
        "Program Administration": "#2176d2",
        "General Fund": "#f3c613",
      },
    };
  },
  computed: {
    tableCaption() {
      let v = formatNumber(this.total);
      return `Total dollar amount per spending category associated with beverage tax revenue, which totaled ${v} in ${this.fiscalYearLabel}`;
    },
    series() {
      if (this.data) {
        return Array.from(this.data.values());
      }
      return [];
    },
    total() {
      if (this.series) {
        let total = 0;
        for (let i = 0; i < this.series.length; i++) {
          total += this.series[i];
        }
        return total;
      }
      return null;
    },
  },
};
</script>

<style>
/* Wrappers for charts */
.donut-chart-wrapper {
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 40%;
}

.bar-chart-wrapper {
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 60%;
}

.summary-charts-body {
  padding: 0 !important;
}

/* Body of the card */
.summary-body {
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 0;
  position: relative;
  flex-direction: row;
}

@media only screen and (max-width: 1023px) {
  .summary-header {
    flex-direction: column;
    align-items: flex-start !important;
  }
  .summary-body {
    flex-direction: column;
  }
  .donut-chart-wrapper {
    width: 100%;
    z-index: 1;
  }
  .bar-chart-wrapper {
    width: 100%;
    z-index: 1;
  }
}
</style>
