<template>
  <table>
    <caption>
      {{
        caption
      }}
    </caption>
    <!-- Header -->
    <thead>
      <tr>
        <th scope="col">Spending Use</th>
        <th scope="col">Total Amount (Percentage)</th>
      </tr>
    </thead>
    <!-- Body -->
    <tbody>
      <tr
        v-for="(category, rowIndex) in categories"
        :key="`row-header-${rowIndex}`"
      >
        <th scope="row">{{ category }}</th>
        <td>
          {{ getValue(category) }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { formatNumber } from "@/utils";

export default {
  name: "A11yTable",
  props: {
    caption: { type: String, default: "" },
    data: { type: Map, default: null },
  },
  computed: {
    categories() {
      if (this.data) {
        return Array.from(this.data.keys());
      }
      return [];
    },
    values() {
      if (this.data) {
        return Array.from(this.data.values());
      }
      return [];
    },
    total() {
      let out = 0;
      for (let i = 0; i < this.values.length; i++) out += this.values[i];
      return out;
    },
  },
  methods: {
    getValue(category) {
      let d = this.data.get(category) || 0;
      return `${formatNumber(d)} (${((100 * d) / this.total).toFixed(0)}%)`;
    },
  },
};
</script>