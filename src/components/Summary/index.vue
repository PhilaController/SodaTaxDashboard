<template>
  <v-row>
    <v-col sm="12" md="12" class="mt-3">
      <!-- Overlay a lodader -->
      <v-overlay :value="isLoading" absolute opacity="1" color="#fff">
        <v-progress-circular indeterminate size="64" color="#2176d2" />
      </v-overlay>

      <div>
        <div class="d-flex flex-column">
          <h2>Total Beverage Tax Revenue and Spending</h2>
          <hr class="titlebar" />
        </div>

        <!-- Button group -->
        <div class="summary-btn-group d-flex align-items-center">
          <!-- Fiscal Year Dropdown -->
          <v-select
            v-model="selectedFiscalYear"
            class="summary-dropdown"
            :items="dropdownOptions"
            item-text="label"
            item-value="value"
            label="Select Time Period To View"
            outlined
            hide-details
            :ripple="false"
          />

          <!-- Download button -->
          <v-btn
            class="download-summary-button ml-0 ml-md-2 mt-2 mt-md-0"
            large
            outlined
            :ripple="false"
            :href="downloadURL"
            >Download Data</v-btn
          >
        </div>
      </div>

      <!-- Summary Card -->
      <div class="h-100">
        <!-- Main Chart -->
        <SummaryChart
          v-if="data != null"
          :key="loadingState"
          :data="filteredData"
        />

        <!-- Footer -->
        <div class="summary-footer" id="summary-chart-footnotes">
          <div class="footnote-header">Notes</div>
          <v-divider class="my-divider" />
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
    </v-col>
  </v-row>
</template>

<script>
import SummaryChart from "./SummaryChart";
import { rollup, sum, ascending } from "d3-array";
import { getDownloadURL } from "@/utils";

export default {
  name: "Summary",
  components: { SummaryChart },
  props: ["data", "fiscal_year", "quarter"],
  data() {
    return {
      downloadURL: getDownloadURL("summary"),
      selectedFiscalYear: null,
      loadingState: 0,
    };
  },
  computed: {
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
      if (this.selectedFiscalYear !== null) {
        data = data.filter((d) => d["Fiscal Year"] === this.selectedFiscalYear);
      }

      //   Group by spending use and sum the totals
      return rollup(
        data,
        (v) => sum(v, (d) => d["Total"]),
        (d) => d["Spending Use"]
      );
    },
    dropdownOptions() {
      /* Options for the fiscal year dropdown */

      let out = [{ label: "All Fiscal Years", value: null }];
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
      if (fy == null) {
        // Figure out the ending quarter
        fy = this.fiscal_year;
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
        fy !== this.fiscal_year ||
        (fy == this.fiscal_year && this.quarter == 4)
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
  width: 350px;
  min-height: 56px;
  border-color: rgba(0, 0, 0, 0.5) !important;
}

.download-summary-button:active,
.download-summary-button:hover {
  text-decoration: none !important;
}

@media only screen and (max-width: 1023px) {
  .summary-btn-group {
    flex-direction: column;
    margin-bottom: 20px;
    align-items: flex-start !important;
  }
}
@media only screen and (max-width: 767px) {
  .summary-dropdown {
    width: 100%;
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

