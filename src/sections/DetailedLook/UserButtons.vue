<template>
  <v-col cols="12" md="6" class="mt-3">
    <!-- Use type button -->
    <v-select
      v-model="selectedSpendingUse"
      :items="spendingUses"
      :menu-props="{ contentClass: 'left-aligned-menu-content' }"
      class="use-type-dropdown"
      label="Spending Use"
      outlined
      hide-details
      :ripple="false"
      @input="changeSelectedSpendingUse"
    />

    <!-- Fiscal Year button -->
    <v-select
      v-model="selectedFiscalYears"
      :items="fiscalYears"
      :menu-props="{ contentClass: 'left-aligned-menu-content' }"
      class="fiscal-year-dropdown w-100 mt-4"
      label="Fiscal Year(s)"
      multiple
      outlined
      hide-details
      :ripple="false"
      @input="changeSelectedFiscalYears"
    />
  </v-col>
</template>

<script>
export default {
  name: "UserButtons",
  props: {
    fiscalYears: { type: Array, default: null },
    spendingUses: { type: Array, default: null },
    defaultFiscalYear: { type: Number, default: null },
    defaultSpendingUse: { type: String, default: null },
  },
  data() {
    return {
      selectedFiscalYears: [this.defaultFiscalYear.toString()],
      selectedSpendingUse: this.defaultSpendingUse,
    };
  },
  methods: {
    changeSelectedSpendingUse(value) {
      this.$emit("spending-use-change", value);
    },
    changeSelectedFiscalYears(value) {
      this.$emit("fiscal-year-change", this.selectedFiscalYears);
    },
  },
};
</script>

<style>
/* Use Type Dropdown */
.use-type-dropdown {
  font-size: 1.1rem;
  max-width: 350px !important;
}

/* Fiscal year Dropdown */
.fiscal-year-dropdown {
  font-size: 1.1rem;
  max-width: 350px !important;
}
</style>