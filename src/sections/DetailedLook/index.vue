<template>
  <div>
    <div v-if="data != null" class="detailed-look">
      <!-- Header -->
      <h2>
        A Detailed Look at
        <span class="font-weight-bold">{{ displayedSpendingUse }}</span>
        Spending
      </h2>
      <hr class="titlebar" />

      <!-- user chooses use type and fiscal year -->
      <div class="detailed-look-header">
        <div class="user-buttons">
          <Dropdown
            v-model="selectedSpendingUse"
            :options="spendingUses"
            label="Select the spending use:"
            :width="300"
            class="spending-use-dropdown"
          />

          <vue-accessible-multiselect
            v-model="selectedFiscalYears"
            :options="fiscalYearOptions"
            label="Select the fiscal year(s)"
            placeholder="Select a fiscal year(s)"
            class="fiscal-year-multiselect"
          />
        </div>

        <!-- Show the high level summary -->
        <div class="mt-3 high-level-summary">
          <div
            v-show="expendituresNumber > 0 && expendituresNumber !== null"
            class="sub-header high-level-summary-header"
          >
            You are viewing data for
            <b>{{ expendituresNumber }}</b> expenditures, totaling
            <b>{{ formatTotal(expendituresTotal) }}</b
            >.
          </div>
        </div>
      </div>

      <!-- Dashboard -->
      <Dashboard
        ref="Dashboard"
        :data="data"
        :selected-spending-use="selectedSpendingUse"
        :selected-fiscal-years="selectedFiscalYears"
        @update="
          (value) => {
            expendituresNumber = value[0];
            expendituresTotal = value[1];
          }
        "
      />

      <p
        v-if="selectedSpendingUse === 'Program Administration'"
        class="admin-note"
      >
        Note: "Administrative" spending refers to spending associated with the
        Office of Children & Families beginning in FY21, and prior to that, the
        Office of Education. These offices are responsible for administering the
        Pre-K and Community Schools programs.
      </p>
    </div>
  </div>
</template>

<script>
import VueAccessibleMultiselect from "vue-accessible-multiselect";
import Dropdown from "@/components/Dropdown";
import Dashboard from "./Dashboard.vue";
import { ascending } from "d3-array";
import { format } from "d3-format";
import { fetchAWS } from "@/utils";

export default {
  name: "DetailedLook",
  components: { Dashboard, Dropdown, VueAccessibleMultiselect },
  props: {
    fiscalYear: { type: Number, required: true },
    quarter: { type: Number, required: true },
  },
  data() {
    return {
      data: null,
      selectedSpendingUse: "Pre-K",
      defaultFiscalYear: this.fiscalYear,
      selectedFiscalYears: null,
      expendituresTotal: null,
      expendituresNumber: null,
    };
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
    fiscalYearOptions() {
      let out = [];
      for (let i = 0; i < this.fiscalYears.length; i++) {
        let fy = this.fiscalYears[i];
        out.push({ value: fy, label: fy });
      }
      return out;
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
  async created() {
    // Set the selected values to the default values
    this.selectedFiscalYears = [this.defaultFiscalYear.toString()];

    // Get the expenditure data
    this.data = await fetchAWS("expenditures");
  },

  methods: {
    formatTotal(d) {
      if (d == 0) return "$0";
      let fmtString = `,.0f`;
      let s = `$${format(fmtString)(Math.abs(d))}`;
      if (d < 0) s = "\u2212" + s;
      return s;
    },
    updateFiscalYears(value) {
      this.selectedFiscalYears = value;
    },
  },
};
</script>

<style lang="scss">
@import "~vue-accessible-multiselect/src/styles/core.scss";
@import "~vue-accessible-multiselect/src/styles/themes/default.scss";

.detailed-look-header {
  display: flex;
  flex-direction: row;
}

.user-buttons,
.high-level-summary {
  width: 50%;
}

.detailed-look-header {
  padding: 0.5rem;
}

@media only screen and (max-width: 767.98px) {
  .detailed-look-header {
    flex-direction: column;
  }
  .user-buttons,
  .high-level-summary,
  .spending-use-dropdown,
  .fiscal-year-multiselect {
    width: 100% !important;
  }

  .high-level-summary {
    margin-top: 2rem;
  }
}
.detailed-look {
  margin-top: 75px;
}

.sub-header {
  font-size: 1.25rem;
  line-height: 1.1;
  color: inherit;
  margin-top: 0;
  margin-bottom: 1rem;
}

.admin-note {
  font-style: italic;
  font-size: 0.9rem;
  margin-top: 20px !important;
}

.card-body {
  padding: 0;
}

.v-multiselect__menu {
  z-index: 8 !important;
}
.v-multiselect {
  width: 300px;
}
.v-multiselect__btn {
  height: 100%;
}

.v-multiselect button {
  background-color: #fff;
  border-color: #2176d2;
  color: #2176d2;
  transition: all 0.3s;
  padding: 0.5rem !important;
}
.v-multiselect button:hover {
  background-color: #2176d2;
  border-color: #2176d2;
  color: #fff;
  transition: all 0.3s;
}
.v-multiselect button.focus,
.v-multiselect button:focus {
  background-color: #2176d2;
  border-color: #2176d2;
  color: #fff;
  box-shadow: none;
  outline: 2px solid #175190;
  outline-offset: 2px;
}

.v-multiselect__arrow svg {
  fill: #2176d2;
}

.v-multiselect button:hover .v-multiselect__arrow svg {
  fill: #fff;
}
.v-multiselect__label {
  margin-bottom: 0;
}

.v-multiselect__selected {
  font-weight: 400;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  font-size: 1rem;
  line-height: 1.5;
}
</style>
