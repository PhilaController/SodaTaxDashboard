<template>
  <!-- main section of charts -->
  <div class="detailed-look-section">
    <!-- first row of charts -->
    <v-row>
      <!-- Major Class Spending -->
      <v-col sm="12" md="6" class="mt-3">
        <div id="major-class-panel" class="card h-100">
          <h3 class="card-header">Spending by Major Class</h3>
          <div id="major-class" class="card-body">
            <GroupedTable
              :data="filteredData"
              groupby="Major Class Description"
            />
          </div>
        </div>
      </v-col>

      <!-- Payroll Spending -->
      <v-col sm="12" md="6" class="mt-3">
        <div id="payroll-panel" class="card h-100">
          <h3 class="card-header">Payroll Spending</h3>
          <div id="payroll" class="card-body">
            <div class="table-responsive">
              <GroupedTable
                :data="
                  filteredData.filter(
                    (d) => d['Major Class Description'] == 'Payroll'
                  )
                "
                groupby="Minor Class Description"
              />
            </div>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Second row of charts -->
    <v-row>
      <!-- Minor Class Spending -->
      <v-col sm="12" md="6" class="mt-3">
        <div id="minor-class-panel" class="card h-100">
          <h3 class="card-header">Spending by Minor Class</h3>
          <div id="minor-class" class="card-body">
            <div class="table-responsive">
              <GroupedTable
                :data="filteredData"
                groupby="Minor Class Description"
              />
            </div>
          </div>
        </div>
      </v-col>

      <!-- Vendor Spending -->
      <v-col sm="12" md="6" class="mt-3">
        <div id="vendor-panel" class="card h-100">
          <h3 class="card-header">Spending by Vendor</h3>
          <div id="vendor-class" class="card-body">
            <div class="table-responsive">
              <GroupedTable :data="filteredData" groupby="Vendor Name" />
            </div>
          </div>
          <div class="card-footer card-note">
            Note: Expenditures without a vendor are not shown in this table.
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Third row of charts -->
    <v-row>
      <!-- Table -->
      <v-col sm="12" md="12" class="mt-3">
        <div id="table-panel" class="card">
          <h3 class="card-header">All Expenditures</h3>
          <div id="table-body" class="card-body">
            <v-data-table
              :headers="mainTableHeaders"
              :items="filteredData"
              :items-per-page="15"
              sort-by="Amount"
              :sort-desc="true"
              must-sort
              class="main-data-table"
              :search="search"
              mobile-breakpoint="0"
            >
              <template #top>
                <v-row
                  no-gutters
                  class="
                    d-flex
                    align-items-center
                    justify-content-end
                    mb-5
                    mr-5
                    ml-5
                  "
                >
                  <v-col md="3" sm="12">
                    <v-text-field
                      v-model="minAmount"
                      label="Minimum Amount"
                      type="number"
                      class="main-table-search"
                      hide-details
                    ></v-text-field>
                    <v-text-field
                      v-model="maxAmount"
                      label="Maximum Amount"
                      type="number"
                      class="main-table-search"
                      hide-details
                    ></v-text-field>
                    <v-text-field
                      v-model="search"
                      label="Search"
                      class="main-table-search"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
              </template>
              <template #item.Amount="{ item }">
                <span>{{ formatTotal(item.Amount) }}</span>
              </template>
            </v-data-table>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import GroupedTable from "./GroupedTable.vue";
import { format } from "d3-format";
import { sum } from "d3-array";

export default {
  name: "Dashboard",
  components: { GroupedTable },
  props: {
    selectedFiscalYears: { type: Array, default: null },
    selectedSpendingUse: { type: String, default: null },
    data: { type: Array, default: null },
  },
  data() {
    return {
      search: "",
      minAmount: "",
      maxAmount: "",
      mainTableHeaders: [
        {
          text: "Posted Date",
          value: "Posted Date",
          width: "12%",
          sort: (a, b) => {
            let adate = new Date(a);
            let bdate = new Date(b);
            return adate - bdate;
          },
        },
        {
          text: "Amount",
          value: "Amount",
          width: "12%",
          filter: (value) => {
            let out = true;
            if (this.minAmount) out = out && value >= parseInt(this.minAmount);
            if (this.maxAmount) out = out && value <= parseInt(this.maxAmount);

            return out;
          },
        },
        {
          text: "Vendor Name",
          value: "Vendor Name",
          sortable: false,
          width: "15%",
        },
        {
          text: "Major Class Description",
          value: "Major Class Description",
          sortable: false,
          width: "15%",
        },
        {
          text: "Minor Class Description",
          value: "Minor Class Description",
          sortable: false,
          width: "15%",
        },
        {
          text: "Description",
          value: "Description",
          sortable: false,
          width: "15%",
        },
      ],
    };
  },
  computed: {
    isLoading() {
      return this.data == null;
    },
    expendituresTotal() {
      return sum(this.filteredData, (d) => d["Amount"]);
    },
    expendituresNumber() {
      return this.filteredData.length;
    },
    filteredData() {
      /* Filter data by selected fiscal year and spending use */

      //   Return empty if data is not loaded yet
      let data = this.data;
      if (this.data == null) return [];

      //   Do we need to filter by a specific fiscal year?
      if (this.selectedFiscalYears !== null) {
        data = data.filter(
          (d) => this.selectedFiscalYears.indexOf(d["Fiscal Year"]) !== -1
        );
      }

      //   Filter by a specific spending use
      data = data.filter((d) => d["Spending Use"] === this.selectedSpendingUse);

      //   Return filtered data
      return data;
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
.main-data-table thead th,
.main-data-table tbody td,
.main-data-table .v-data-footer,
.main-data-table .v-select__selection {
  font-size: 0.9rem !important;
}
.main-data-table tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.05);
}
.main-table-search input {
  border: 0px solid #fff !important;
}
.v-application--is-ltr .v-data-footer__select {
  margin-left: auto;
  margin-right: 14px;
}
</style>