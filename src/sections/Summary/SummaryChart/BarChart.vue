<template>
  <apexchart
    class="summary-bar-chart"
    :height="height"
    type="bar"
    :series="series"
    :options="chartOptions"
    @mounted="updateLabels"
    @animationEnd="updateLabels"
    @updated="updateLabels"
  ></apexchart>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import { formatNumber } from "@/utils";
import $ from "jquery";

export default {
  components: { apexchart: VueApexCharts },
  props: {
    data: { type: Map, default: null },
    colors: { type: Object, default: null },
  },
  data() {
    return {
      responsiveLabelWidth: 140,
      labelWidth: 250,
      height: 400,
      aliases: {
        "Parks and Recreation, Rebuild": ["Parks & Recreation,", "Rebuild"],
        "Program Administration": ["Program", "Administration"],
        "Debt Service for Rebuild": ["Debt Service", "for Rebuild"],
      },
      shortAliases: {
        "General Fund": ["General", "Fund"],
        "Parks and Recreation, Rebuild": ["Parks & Rec,", "Rebuild"],
        "Community Schools": ["Community", "Schools"],
      },
    };
  },

  computed: {
    categories() {
      if (this.data) {
        return Array.from(this.data.keys());
      }
      return [];
    },
    series() {
      let data;
      if (this.data) {
        data = Array.from(this.data.values());
      } else data = [];
      return [{ data: data, name: "Spending Total" }];
    },
    total() {
      if (this.series) {
        let total = 0;
        for (let i = 0; i < this.series[0].data.length; i++) {
          total += this.series[0].data[i];
        }
        return total;
      }
      return null;
    },
    colorSeries() {
      let out = [];
      for (let i = 0; i < this.categories.length; i++)
        out.push(this.colors[this.categories[i]]);
      return out;
    },
    chartOptions() {
      return {
        chart: {
          type: "bar",
          height: 350,
          toolbar: {
            show: false,
          },
          zoom: {
            enabled: false,
          },
        },
        legend: { show: false },
        plotOptions: {
          bar: {
            horizontal: true,
            distributed: true,
            dataLabels: { position: "bottom" },
          },
        },
        xaxis: {
          type: "category",
          categories: this.categories,
          tickAmount: 4,
          labels: {
            style: { fontSize: "1rem" },
            formatter: (d) => formatNumber(d, 2),
          },
        },

        yaxis: {
          labels: {
            style: { fontSize: "16px" },
            formatter: (d) => this.getAlias(d),
            minWidth: this.labelWidth,
            maxWidth: this.labelWidth,
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
        colors: this.colorSeries,
        dataLabels: {
          enabled: true,
          formatter: (d) =>
            `${formatNumber(d)} (${((100 * d) / this.total).toFixed(0)}%)`,
          textAnchor: "start",
          offsetY: 7,
          offsetX: 2,
          style: {
            fontSize: "1rem",
            fontWeight: "bold",
          },
        },
        fill: {
          opacity: 0.7,
        },
        tooltip: {
          enabled: false,
          theme: "dark",
          x: { show: true, formatter: (d) => this.getAlias(d) },
          y: { formatter: (d) => formatNumber(d) },
        },
        grid: { show: false, padding: { top: -10, right: 50 } },
        stroke: { colors: ["#666"], width: 1 },
        responsive: [
          {
            breakpoint: 767,
            options: {
              xaxis: {
                tickAmount: 2,
                labels: {
                  style: { fontSize: "0.9rem" },
                  formatter: (d) => formatNumber(d, 2),
                },
              },
              yaxis: {
                labels: {
                  style: { fontSize: "14px" },
                  formatter: (d) => this.getShortAlias(d),
                  minWidth: this.responsiveLabelWidth,
                  maxWidth: this.responsiveLabelWidth,
                },
              },
              dataLabels: {
                enabled: true,
                formatter: (d) =>
                  `${formatNumber(d)} (${((100 * d) / this.total).toFixed(
                    0
                  )}%)`,
                textAnchor: "start",
                offsetY: 7,
                offsetX: 10,
                style: {
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                },
              },
            },
          },
        ],
      };
    },
  },
  mounted() {
    window.addEventListener("resize", this.updateLabels);
  },

  methods: {
    updateLabels() {
      let widths = [];
      $(".apexcharts-series[seriesName=SpendingxTotal] path").each((i, d) => {
        widths.push(+$(d).attr("barWidth"));
      });

      $(".summary-bar-chart .apexcharts-data-labels text").each((i, d) => {
        if (i > 1) {
          let el = $(d);
          let x = +el.attr("x");
          $(d).attr("x", widths[i] + 3);
        }
      });
    },
    getAlias(value) {
      let out = this.aliases[value];
      if (out) return out;
      else return value;
    },
    getShortAlias(value) {
      let a = this.shortAliases;
      let out = a[value];
      if (out) return out;

      out = this.aliases[value];
      if (out) return out;

      return value;
    },
  },
};
</script>

<style>
.summary-bar-chart text {
  fill: rgba(0, 0, 0, 0.87);
}
/* Align y-axis labels in bar chart */
.apexcharts-xaxis-label {
  dominant-baseline: middle !important;
}
.apexcharts-yaxis-label {
  dominant-baseline: middle !important;
}
</style>
