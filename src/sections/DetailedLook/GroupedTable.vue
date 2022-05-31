<template>
  <vue-good-table
    :columns="columns"
    :rows="groupedData"
    class="grouped-data-table"
    style-class="vgt-table"
    :sort-options="{
      enabled: true,
      initialSortBy: { field: 'value', type: 'desc' },
    }"
    :pagination-options="{
      enabled: groupedData.length > itemsPerPage,
      perPage: itemsPerPage,
      position: 'top',
    }"
  >
    >
    <template slot="table-row" slot-scope="props">
      <span v-if="props.column.field == 'value'">
        {{ formatTotal(props.row.value) }}
      </span>
      <span v-else>
        {{ props.formattedRow[props.column.field] }}
      </span>
    </template>
    <template slot="pagination-top" slot-scope="props">
      <custom-pagination
        :table-id="id"
        :title="title"
        :total-rows="props.total"
        :page-changed="props.pageChanged"
        :per-page-changed="props.perPageChanged"
        :items-per-page="itemsPerPage"
      />
    </template>
  </vue-good-table>
</template>

<script>
import CustomPagination from "@/components/CustomPagination";
import "vue-good-table/dist/vue-good-table.css";
import { VueGoodTable } from "vue-good-table";

import { rollup, sum } from "d3-array";
import { format } from "d3-format";

export default {
  components: { VueGoodTable, CustomPagination },
  props: {
    data: { type: Array, default: null },
    groupby: { type: String, default: null },
    id: {
      type: String,
      default: () => `table_${Math.random().toString(12).substring(2, 8)}`,
    },
  },
  data() {
    return { itemsPerPage: 15 };
  },
  computed: {
    title() {
      return this.groupby + " Table";
    },
    columns() {
      return [
        {
          label: this.groupby,
          sortable: false,
          field: "name",
        },
        {
          label: "Amount",
          field: "value",
          sortable: false,
          type: "number",
        },
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
      let fmtString = `,.0f`;
      let s = `$${format(fmtString)(Math.abs(d))}`;
      if (d < 0) s = "\u2212" + s;
      return s;
    },
  },
};
</script>

<style>
table.vgt-table {
  border: 0px solid #dcdfe6 !important;
}
</style>