<template>
  <apexchart
    class="summary-donut-chart"
    :height="height"
    type="donut"
    :series="series"
    :options="chartOptions"
  ></apexchart>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import { formatNumber } from "@/utils";

export default {
  components: { apexchart: VueApexCharts },
  props: {
    data: { type: Map, default: null },
    colors: { type: Object, default: null },
  },
  data() {
    return {
      height: 350,
      responsiveLabelWidth: 125,
      labelWidth: 250,
    };
  },
  computed: {
    labels() {
      if (this.data) {
        return Array.from(this.data.keys());
      }
      return [];
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
    colorSeries() {
      let out = [];
      for (let i = 0; i < this.labels.length; i++)
        out.push(this.colors[this.labels[i]]);
      return out;
    },
    chartOptions() {
      return {
        grid: { padding: { left: 20, right: 20, top: 10, bottom: 0 } },
        labels: this.labels,
        colors: this.colorSeries,
        legend: { show: false },
        dataLabels: {
          enabled: true,
          background: { enabled: false },
          dropShadow: { enabled: false },
          style: {
            fontSize: "16px",
          },
        },
        plotOptions: {
          pie: {
            expandOnClick: false,
            dataLabels: {
              offset: 0,
              minAngleToShowLabel: 20,
            },
            donut: {
              labels: {
                show: true,
                name: {
                  show: true,
                  fontSize: "15px",
                },

                value: {
                  show: true,
                  color: "#868e96",
                  fontSize: "14px",
                  formatter: function (value) {
                    return "$" + value.toString();
                  },
                },
                total: {
                  show: true,
                  showAlways: true,
                  label: "Total Revenue",
                  formatter: () => formatNumber(this.total),
                },
              },
            },
          },
        },
        states: {
          hover: {
            filter: {
              type: "none",
            },
          },
          active: {
            filter: {
              type: "none",
            },
          },
        },
        fill: {
          opacity: 0.9,
        },
        stroke: { colors: ["#666"], width: 1 },
        tooltip: {
          fillSeriesColor: false,
          theme: "light",
          enabled: false,
          x: { show: false },
          y: {
            formatter: (d) =>
              `${formatNumber(d)} (${((100 * d) / this.total).toFixed(0)}%)`,
          },
        },
      };
    },
  },
};
</script>

<style>
.summary-donut-chart text {
  fill: rgba(0, 0, 0, 0.87);
}
.summary-donut-chart .apexcharts-tooltip-text {
  color: rgba(0, 0, 0, 0.87);
  font-size: 1rem !important;
}

.summary-donut-chart .apexcharts-datalabels-group text:first-child {
  font-size: 1.6rem;
  font-family: inherit;
  font-weight: 500;
  z-index: 0;
}
.summary-donut-chart .apexcharts-datalabels-group text:nth-of-type(2) {
  font-size: 1.5rem;
  font-family: inherit;
  font-weight: 300;
  z-index: 0;
}
</style>
