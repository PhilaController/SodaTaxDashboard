<template>
  <div>
    <div class="detailed-look" v-if="data != null">
      <!-- Header -->
      <h2>
        A Detailed Look at
        <span class="font-weight-bold">{{ displayedSpendingUse }}</span>
        Spending
      </h2>
      <hr class="titlebar" />

      <p
        v-if="selectedSpendingUse === 'Program Administration'"
        class="admin-note"
      >
        Note: "Administrative" spending refers to spending associated with the
        Office of Children & Families beginning in FY21, and prior to that, the
        Office of Education. These offices are responsible for administering the
        Pre-K and Community Schools programs.
      </p>

      <!-- user chooses use type and fiscal year -->
      <div class="user-buttons">
        <v-row>
          <UserButtons
            :spending-uses="spendingUses"
            :fiscal-years="fiscalYears"
            :default-fiscal-year="defaultFiscalYear"
            :default-spending-use="defaultSpendingUse"
            @spending-use-change="updateSpendingUse"
            @fiscal-year-change="updateFiscalYears"
          />

          <!-- Show the high level summary -->
          <v-col cols="12" md="6" class="mt-3 high-level-summary">
            <div
              v-show="expendituresNumber > 0 && expendituresNumber !== null"
              class="sub-header high-level-summary-header"
            >
              You are viewing data for
              <b>{{ expendituresNumber }}</b> expenditures, totaling
              <b>{{ formatTotal(expendituresTotal) }}</b
              >.
            </div>
          </v-col>
        </v-row>
      </div>

      <!-- Dashboard -->
      <Dashboard
        ref="Dashboard"
        :data="data"
        :selected-spending-use="selectedSpendingUse"
        :selected-fiscal-years="selectedFiscalYears"
      />
    </div>
  </div>
</template>

<script>
import UserButtons from "./UserButtons.vue";
import Dashboard from "./Dashboard.vue";
import { ascending } from "d3-array";
import { format } from "d3-format";
import { fetchAWS } from "@/utils";

export default {
  name: "DetailedLook",
  props: ["fiscal_year", "quarter"],
  components: { Dashboard, UserButtons },
  data() {
    return {
      data: null,
      defaultSpendingUse: "Pre-K",
      selectedSpendingUse: null,
      defaultFiscalYear: this.fiscal_year,
      selectedFiscalYears: null,
      expendituresTotal: null,
      expendituresNumber: null,
    };
  },
  async created() {
    // Set the selected values to the default values
    this.selectedSpendingUse = this.defaultSpendingUse;
    this.selectedFiscalYears = [this.defaultFiscalYear.toString()];

    // Get the expenditure data
    this.data = await fetchAWS("expenditures");
  },
  computed: {
    fiscalYears() {
      /* Fiscal years sorted in ascending order */
      if (this.data == null) return [];
      else {
        return [...new Set(this.data.map((d) => d["Fiscal Year"]))].sort(
          ascending
        );
      }
    },
    spendingUses() {
      /* Spending uses sorted in ascending order*/
      if (this.data == null) return [];
      else {
        return [...new Set(this.data.map((d) => d["Spending Use"]))].sort(
          ascending
        );
      }
    },
    displayedSpendingUse() {
      if (this.selectedSpendingUse == "Program Administration")
        return "Administrative";
      else return this.selectedSpendingUse;
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
    updateExpenditureTotals() {
      this.$nextTick(() => {
        this.expendituresNumber = this.$refs.Dashboard.expendituresNumber;
        this.expendituresTotal = this.$refs.Dashboard.expendituresTotal;
      });
    },
    updateSpendingUse(value) {
      this.selectedSpendingUse = value;
      this.updateExpenditureTotals();
    },
    updateFiscalYears(value) {
      this.selectedFiscalYears = value;
      this.updateExpenditureTotals();
    },
  },
};
</script>



<style>
.detailed-look {
  margin-top: 75px;
}

.sub-header {
  font-size: 1.25rem;
  font-family: Montserrat, sans-serif;
  line-height: 1.1;
  color: inherit;
  margin-top: 0;
  margin-bottom: 1rem;
}

.admin-note {
  font-style: italic;
  font-size: 1rem;
}
</style>