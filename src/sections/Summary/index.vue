<template>
  <div>
    <div class="mt-4">
      <div>
        <div class="d-flex flex-column">
          <h2>Total Beverage Tax Revenue and Spending</h2>
          <hr class="titlebar" />
        </div>

        <!-- Button group -->
        <div class="summary-btn-group d-flex align-items-end">
          <Dropdown
            v-model="selectedFiscalYear"
            :options="dropdownOptions"
            label="Select time period to view:"
            :width="200"
            class="summary-dropdown"
          />

          <!-- Download button -->
          <div class="download-summary-button ml-0 ml-md-2 mt-2 mt-md-0">
            <a
              aria-label="Download Data:"
              class="btn btn-md btn-outline-primary p-2 w-100"
              :href="downloadURL"
            >
              Download Data
            </a>
          </div>
        </div>
      </div>

      <!-- Summary Card -->
      <div class="h-100">
        <!-- Main Chart -->
        <SummaryChart
          v-if="data != null"
          :key="loadingState"
          :data="filteredData"
          :fiscal-year-label="fiscalYearLabel"
        />

        <!-- Footer -->
        <div id="summary-chart-footnotes" class="summary-footer">
          <div class="footnote-header">Notes</div>
          <hr class="my-divider" />
          <ul aria-labelledby="summary-chart-footnotes">
            <li class="font-italic">{{ summaryFootnote }}</li>
            <li class="font-italic">
              "Program Administration" refers to spending associated with the
              Office of Children & Families beginning in FY21, and prior to
              that, the Office of Education.
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SummaryChart from "./SummaryChart/index.vue";
import Dropdown from "@/components/Dropdown";
import { getDownloadURL } from "@/utils";

import { rollup, sum, ascending, max, min } from "d3-array";

export default {
  name: "Summary",
  components: { Dropdown, SummaryChart },
  props: {
    data: { type: Array, required: true },
    fiscalYear: { type: Number, required: true },
    quarter: { type: Number, required: true },
  },
  data() {
    return {
      downloadURL: getDownloadURL("summary"),
      selectedFiscalYear: -1,
      loadingState: 0,
    };
  },
  computed: {
    fiscalYearLabel() {
      if (this.selectedFiscalYear !== -1)
        return `fiscal year ${this.selectedFiscalYear}`;
      else {
        let minFY = min(this.fiscalYears);
        let maxFY = max(this.fiscalYears);
        return `fiscal years ${minFY} to ${maxFY}`;
      }
    },
    isLoading() {
      /* Has the data been loaded yet? */
      return this.data == null;
    },
    fiscalYears() {
      /* Fiscal years sorted in ascending order */
      if (this.data == null) return [];
      else {
        return [...new Set(this.data.map((d) => d["Fiscal Year"]))].sort(
          ascending
        );
      }
    },
    filteredData() {
      /* Filter data by selected fiscal year */

      //   Return empty if data is not loaded yet
      let data = this.data;
      if (this.data == null) return [];

      //   Do we need to filter by a specific fiscal year?
      if (this.selectedFiscalYear !== -1) {
        data = data.filter((d) => d["Fiscal Year"] === this.selectedFiscalYear);
      }

      //   Group by spending use and sum the totals
      let out = rollup(
        data,
        (v) => sum(v, (d) => d["Total"]),
        (d) => d["Spending Use"]
      );
      return new Map([...out.entries()].sort((a, b) => b[1] - a[1]));
    },
    dropdownOptions() {
      /* Options for the fiscal year dropdown */

      let out = [{ label: "All Fiscal Years", value: -1 }];
      for (let i = 0; i < this.fiscalYears.length; i++)
        out.push({
          label: `FY ${this.fiscalYears[i]}`,
          value: this.fiscalYears[i],
        });
      return out;
    },
    summaryFootnote() {
      /* The foonote for the summary chart based on the selected fiscal year */

      let fy = this.selectedFiscalYear;

      // All dates
      if (fy == -1) {
        // Figure out the ending quarter
        fy = this.fiscalYear;
        if (this.quarter == 4) {
          return `Totals include expenditures from FY 2017 through FY ${fy}, ending on June 30, ${fy}.`;
        } else if (this.quarter == 3) {
          return `Totals include expenditures from FY 2017 through FY ${fy} Q${this.quarter}, ending on March 31, ${fy}.`;
        } else if (this.quarter == 2) {
          return `Totals include expenditures from FY 2017 through FY ${fy} Q${
            this.quarter
          }, ending on December 31, ${fy - 1}.`;
        } else if (this.quarter == 1) {
          return `Totals include expenditures from FY 2017 through FY ${fy} Q${
            this.quarter
          }, ending on September 30, ${fy - 1}.`;
        }
      }
      // Full fiscal year
      else if (
        fy !== this.fiscalYear ||
        (fy == this.fiscalYear && this.quarter == 4)
      ) {
        return `Totals include expenditures for FY ${fy}, ranging from July 1, ${
          fy - 1
        } to June 30, ${fy}.`;
      }
      // Current fiscal year, but figure out end date
      else {
        let note = `Totals include expenditures through FY ${fy} Q${this.quarter}`;
        if (this.quarter == 3) {
          return `${note}, ranging from July 1, ${fy - 1} to March 31, ${fy}.`;
        } else if (this.quarter == 2) {
          return `${note}, ranging from July 1, ${fy - 1} to December 31, ${
            fy - 1
          }.`;
        } else {
          return `${note}, ranging from July 1, ${fy - 1} to September 30, ${
            fy - 1
          }.`;
        }
      }
      return "";
    },
  },
  watch: {
    isLoading: function (val) {
      !val &&
        setTimeout(() => {
          this.loadingState += 1;
        }, 100);
    },
  },
};
</script>

<style>
.download-btn-wrapper {
  width: 300px;
}
.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.5rem;
  font-family: inherit;
  font-weight: 500;
}

.footnote-header {
  font-style: normal;
  font-weight: 500;
  font-size: 1.25rem;
}

/* Dropdown */
.summary-dropdown {
  max-width: 350px !important;
  width: 350px !important;
}
/* Fix bootstrap collision */
.summary-dropdown input {
  border: 0px solid #fff !important;
  background-color: inherit !important;
}

/* Download button */
.download-summary-button {
  width: 300px;
  display: flex;
  align-items: flex-end;
}

.download-summary-button:active,
.download-summary-button:hover {
  text-decoration: none !important;
}

.summary-btn-group {
  padding: 0.5rem;
}

@media only screen and (max-width: 1023.98px) {
  .summary-btn-group {
    flex-direction: column;
    margin-bottom: 20px;
    align-items: flex-start !important;
  }
}
@media only screen and (max-width: 767.98px) {
  .summary-dropdown {
    width: 100% !important;
    max-width: 100% !important;
  }
  .download-summary-button {
    width: 100%;
    max-width: 100% !important;
  }
}

.my-divider {
  border-top: 4px solid #2176d2 !important;
  margin: 0 0 !important;
  width: 7% !important;
}
</style>
