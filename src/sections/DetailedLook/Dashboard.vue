<template>
  <!-- main section of charts -->
  <div class="detailed-look-section">
    <!-- first row of charts -->
    <div class="row">
      <!-- Major Class Spending -->
      <div class="col-sm-12 col-md-6 mt-3">
        <div id="major-class-panel" class="card h-100">
          <h3 class="card-header">Spending by Major Class</h3>
          <div id="major-class" class="card-body">
            <GroupedTable
              :data="filteredData"
              groupby="Major Class Description"
            />
          </div>
        </div>
      </div>

      <!-- Payroll Spending -->
      <div class="col-sm-12 col-md-6 mt-3">
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
      </div>
    </div>

    <!-- Second row of charts -->
    <div class="row">
      <!-- Minor Class Spending -->
      <div class="col-sm-12 col-md-6 mt-3">
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
      </div>

      <!-- Vendor Spending -->
      <div class="col-sm-12 col-md-6 mt-3">
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
      </div>
    </div>

    <!-- All expenditures -->
    <div class="row">
      <div class="col-sm-12 col-md-12 mt-3">
        <div id="table-panel" class="card">
          <h3 class="card-header">All Expenditures</h3>
          <div id="table-body" class="card-body">
            <!-- Inputs -->
            <div class="table-filters">
              <div class="table-filters-label">Filter Expenditures</div>
              <input
                id="min-amount-input"
                v-model="minAmount"
                type="text"
                class="form-control"
                placeholder="Minimum Amount"
              />
              <input
                id="max-amount-input"
                v-model="maxAmount"
                type="text"
                class="form-control"
                placeholder="Maximum Amount"
              />
              <input
                id="search-input"
                v-model="searchInput"
                type="text"
                class="form-control"
                placeholder="Search Keywords"
              />

              <div class="table-filters-btn-group">
                <input
                  class="btn btn-sm btn-outline-primary"
                  type="submit"
                  value="Filter"
                  @click="handleFilterSubmit"
                />
                <input
                  class="btn btn-sm btn-outline-primary pl-2"
                  type="button"
                  value="Reset Filters"
                  @click="handleFilterReset"
                />
              </div>
            </div>
            <!-- Table -->
            <vue-good-table
              id="all-expenditures-table"
              :columns="mainTableHeaders"
              :rows="mainTableRows"
              class="grouped-data-table"
              style-class="vgt-table"
              :sort-options="{
                enabled: true,
                initialSortBy: { field: 'Posted Date', type: 'desc' },
              }"
              :pagination-options="{
                enabled: mainTableRows.length > itemsPerPage,
                perPage: itemsPerPage,
              }"
              :search-options="{
                enabled: true,
                externalQuery: search,
              }"
            >
              >
              <template slot="table-row" slot-scope="props">
                <span v-if="props.column.field == 'Amount'">
                  {{ formatTotal(props.row.Amount) }}
                </span>
                <span v-else>
                  {{ props.formattedRow[props.column.field] }}
                </span>
              </template>
              <template slot="pagination-bottom" slot-scope="props">
                <custom-pagination
                  table-id="all-expenditures-table"
                  title="All Expenditures"
                  :total-rows="props.total"
                  :page-changed="props.pageChanged"
                  :per-page-changed="props.perPageChanged"
                  :items-per-page="itemsPerPage"
                />
              </template>
            </vue-good-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { VueGoodTable } from "vue-good-table";
import GroupedTable from "./GroupedTable";
import { format } from "d3-format";
import { sum } from "d3-array";
import CustomPagination from "@/components/CustomPagination";

export default {
  name: "Dashboard",
  components: { GroupedTable, VueGoodTable, CustomPagination },
  props: {
    selectedFiscalYears: { type: Array, default: null },
    selectedSpendingUse: { type: String, default: null },
    data: { type: Array, default: null },
  },
  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      search: "",
      searchInput: "",
      minAmount: "",
      maxAmount: "",
      mainTableRows: [],
      mainTableHeaders: [
        {
          label: "Posted Date",
          field: "Posted Date",
          sortFn: (a, b) => {
            let adate = new Date(a);
            let bdate = new Date(b);
            return adate - bdate;
          },
          width: "12%",
        },
        {
          label: "Amount",
          field: "Amount",
          type: "number",
          width: "12%",
        },
        {
          label: "Vendor Name",
          field: "Vendor Name",
          sortable: false,
          width: "15%",
        },
        {
          label: "Major Class Description",
          field: "Major Class Description",
          sortable: false,
        },
        {
          label: "Minor Class Description",
          field: "Minor Class Description",
          sortable: false,
        },
        {
          label: "Description",
          field: "Description",
          sortable: false,
          width: "30%",
        },
      ],
    };
  },
  computed: {
    isLoading() {
      return this.data == null;
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

  watch: {
    filteredData(newValue) {
      if (newValue) {
        this.emitDataSummary(newValue);
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.mainTableRows = this.filteredData;
      this.emitDataSummary(this.filteredData);
    });
  },
  methods: {
    handleFilterSubmit() {
      // Filter the data by min/max amounts
      let data = this.filteredData;
      if (this.minAmount)
        data = data.filter((d) => d.Amount >= parseInt(this.minAmount));
      if (this.maxAmount)
        data = data.filter((d) => d.Amount <= parseInt(this.maxAmount));

      // Set the data
      this.mainTableRows = data;

      // Set any search value too
      this.$nextTick(() => {
        this.search = this.searchInput;
      });
    },
    handleFilterReset() {
      this.searchInput = "";
      this.minAmount = "";
      this.maxAmount = "";
      this.handleFilterSubmit();
    },
    emitDataSummary(data) {
      let total = sum(data, (d) => d["Amount"]);
      let number = data.length;
      this.$emit("update", [number, total]);
    },
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
.table-filters-btn-group {
  display: flex;
  justify-content: space-between;
}
.table-filters-btn-group input {
  width: 125px !important;
}
.table-filters {
  padding: 1rem;
  width: 300px;
  margin-left: auto;
}
.table-filters input {
  width: 100%;
  margin-bottom: 0.5rem;
}
.table-filters-label {
  margin-left: auto;
  font-weight: 700;
}

@media screen and (max-width: 575.98px) {
  .table-filters {
    width: 100% !important;
  }
  .table-filters-btn-group input {
    width: 45% !important;
  }
}
</style>