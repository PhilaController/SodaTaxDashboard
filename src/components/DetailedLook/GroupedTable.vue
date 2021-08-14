<template>
  <v-data-table
    :headers="headers"
    :items="groupedData"
    sort-by="value"
    :items-per-page="itemsPerPage"
    :sort-desc="true"
    :disable-pagination="groupedData.length <= itemsPerPage"
    :hide-default-footer="groupedData.length <= itemsPerPage"
    mobile-breakpoint="0"
    must-sort
    class="grouped-data-table"
  >
    <template #item.value="{ item }">
      <span>{{ formatTotal(item.value) }}</span>
    </template>
  </v-data-table>
</template>

<script>
import { rollup, sum } from "d3-array";
import { format } from "d3-format";

export default {
  props: {
    data: { type: Array, default: null },
    groupby: { type: String, default: null },
  },
  data() {
    return { itemsPerPage: 15 };
  },
  computed: {
    headers() {
      return [
        {
          text: this.groupby,
          align: "start",
          sortable: false,
          value: "name",
        },
        { text: "Amount", value: "value", align: "right", sortable: false },
      ];
    },
    groupedData() {
      let data = rollup(
        this.data,
        (v) => sum(v, (d) => d["Amount"]),
        (d) => d[this.groupby]
      );

      return Array.from(data, ([name, value]) => ({ name, value })).filter(
        (d) => d["name"] !== ""
      );
    },
  },
  methods: {
    formatTotal(d) {
      if (d == 0) return "$0";
      let fmtString = `,.2f`;
      let s = `$${format(fmtString)(Math.abs(d))}`;
      if (d < 0) s = "\u2212" + s;
      return s;
    },
  },
};
</script>

<style>
.grouped-data-table thead th,
.grouped-data-table tbody td {
  font-size: 1rem !important;
}
.grouped-data-table .v-data-footer,
.grouped-data-table .v-select__selection {
  font-size: 0.9rem !important;
}
</style>