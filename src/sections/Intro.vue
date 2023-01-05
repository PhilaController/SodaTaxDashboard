<template>
  <div>
    <!-- Date Range -->
    <div class="mb-4">
      <p>
        <span class="font-weight-bold">Data Range:</span> July 1, 2017 through
        {{ endDate }}
      </p>
    </div>

    <div id="intro-1">
      <p>
        As part of an on-going effort to increase transparency around how the
        City spends your tax dollars, the City Controller’s Office is releasing
        information about the revenue and spending for the Philadelphia Beverage
        Tax. This release offers an update on the Beverage Tax through the
        {{ quarterTag }} quarter of fiscal year (FY) {{ fiscalYear }} which
        ended on {{ endDate }}.
      </p>
      <p>
        This release includes data on individual expenditure items associated
        with the main Beverage Tax spending areas: Pre-K, Community Schools, and
        Rebuild.<footnote-reference /> All data is taken directly from the City
        of Philadelphia’s general ledger system, FAMIS, which is used to track
        departmental spending. For each spending area, users can view summaries
        of the expenditures by vendor name and spending category, as well as
        search for individual expenditures using an interactive table. The
        complete data set, which includes expenditures from July 1, 2017 to
        {{ endDate }}, can be downloaded using the button at the top of this
        page.
      </p>
      <p>
        Mayor James Kenney proposed the Philadelphia Beverage Tax in 2016 to
        fund the City of Philadelphia’s Pre-K expansion and Community Schools
        program and to pay debt obligations for the bond borrowing for Rebuild.
        The tax, a 1.5-cents per ounce levy, took effect on January 1, 2017. In
        its first year of operation, the City funded 2,000 Pre-K seats and 9
        Community Schools through the Philadelphia Beverage Tax. In the second
        year, the programs expanded to 2,250 Pre-K seats and 12 Community
        Schools before expanding to the current level of 3,300 Pre-K seats and
        17 Community Schools in the following year. The number of Pre-K seats is
        currently budgeted to increase to 4,000 in FY22 and 4,300 in FY23, while
        the number of Community Schools is set to increase to 20 in FY23.
      </p>
      <p>
        Since FY17, the majority of Beverage Tax revenue has gone to the General
        Fund, where it remains untracked and can be used for other spending
        purposes. The administration has stated that spending associated with
        Beverage Tax revenue would be delayed due to pending litigation against
        the tax and would ramp up following the lawsuit’s end. However, the
        lawsuit was resolved in the City’s favor in in July 2018, and spending
        has remained lower than annual revenue in each year since.
      </p>
    </div>

    <div v-if="data != null" id="intro-2">
      <h2 id="key-takeaways" class="mt-4">Key Takeaways</h2>
      <hr class="titlebar" />
      <ul aria-labelledby="key-takeaways">
        <li class="spaced-out">
          The total revenue generated from the Philadelphia Beverage Tax since
          its inception is {{ formatNumber(totalRevenue) }} million. This
          includes revenue from {{ fiscalYearsDescription }}.
        </li>
        <li class="spaced-out">
          Expenditures related to Beverage Tax funds include spending on Pre-K,
          Community Schools, and the City offices responsible for administering
          these two programs. There is also spending related to Rebuild,
          including debt service for Rebuild bonds and Parks and Recreation
          Special Projects. Beverage Tax revenue not spent in these five areas
          has gone to the General Fund, the City’s main operating fund.
        </li>
        <li class="spaced-out">
          The majority of Beverage Tax revenue,
          {{ getSpendingTotal("General Fund") }} million or
          {{ getSpendingPercent("General Fund") }} of the total, has gone to the
          General Fund.
        </li>
        <li class="spaced-out">
          The total spending for each of the five areas is:
          <ul>
            <li>
              {{ getSpendingTotal("Pre-K") }} million, or
              {{ getSpendingPercent("Pre-K") }} of the total revenue, on Pre-K;
            </li>
            <li>
              {{ getSpendingTotal("Community Schools") }} million, or
              {{ getSpendingPercent("Community Schools") }} of the total
              revenue, on Community Schools;
            </li>
            <li>
              {{ getSpendingTotal("Program Administration") }} million, or
              {{ getSpendingPercent("Program Administration") }}
              of the total revenue, on program administration;
            </li>
            <li>
              {{ getSpendingTotal("Debt Service for Rebuild") }} million, or
              {{ getSpendingPercent("Debt Service for Rebuild") }} of the total
              revenue, on debt service for Rebuild; and
            </li>
            <li>
              {{ getSpendingTotal("Parks and Recreation, Rebuild") }} million,
              or {{ getSpendingPercent("Parks and Recreation, Rebuild") }} of
              the total revenue, on Parks and Recreation, Rebuild.
            </li>
          </ul>
        </li>
      </ul>

      <h2 id="notes" class="mt-4">Notes</h2>
      <hr class="titlebar" />
      <ul aria-labelledby="notes">
        <li class="spaced-out">
          The data for individual expenditures is taken directly from the City
          of Philadelphia’s general ledger system (FAMIS), which the City uses
          to track spending and revenues.
          <ul>
            <li>
              In FAMIS, expenditures are categorized by major and minor classes.
              The major class provides a broad description of the spending,
              e.g., payroll, while the minor classes give a more detailed
              description.
            </li>
            <li>
              Potentially sensitive information has been removed, and some
              formatting changes have been made for clarity.
            </li>
            <li>
              Negative expenditures can be recorded in FAMIS. They are sometimes
              necessary to offset other, possibly erroneous, spending items.
            </li>
          </ul>
        </li>
        <li class="spaced-out">
          Revenue data reflects the latest information listed in FAMIS.
          <ul>
            <li>
              Revenues are reported on a modified accrual basis, which means
              revenues are recognized as soon as they are both measurable and
              available. The City considers revenues to be available if they are
              collected within 60 days of the end of the current fiscal period.
            </li>
          </ul>
        </li>
        <li class="spaced-out">
          In January 2020, the Office of Children and Families was created and
          began administering the Pre-K and Community School programs. Prior to
          this, the Mayor’s Office of Education was responsible for
          administering these programs. Spending data associated with “Program
          Administration” refers to spending by these two offices.
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { sum, rollup } from "d3-array";
import FootnoteReference from "@/components/FootnoteReference";

export default {
  name: "Intro",
  components: { FootnoteReference },
  props: {
    data: { type: Array, required: true },
    fiscalYear: { type: Number, required: true },
    quarter: { type: Number, required: true },
  },
  computed: {
    fiscalYearsDescription() {
      let out = "fiscal year 2017 through";
      if (this.quarter == 4) out += ` fiscal year ${this.fiscalYear}`;
      else out += ` the ${this.quarterTag} quarter of ${this.fiscalYear}`;

      return out;
    },
    dataBySpendingUse() {
      if (this.data)
        return rollup(
          this.data,
          (v) => sum(v, (d) => d["Total"]),
          (d) => d["Spending Use"]
        );
      else return [];
    },
    totalRevenue() {
      if (this.data) return sum(this.data, (d) => d["Total"]);
      else return 0;
    },
    quarterTag() {
      let tags = { 1: "first", 2: "second", 3: "third", 4: "fourth" };
      return tags[this.quarter];
    },
    endDate() {
      // Determine the year
      let year;
      if (this.quarter == 1 || this.quarter == 2) year = this.fiscalYear - 1;
      else year = this.fiscalYear;

      let months = {
        1: "September 30",
        2: "December 31",
        3: "March 31",
        4: "June 30",
      };
      let month = months[this.quarter];

      return `${month}, ${year}`;
    },
  },
  methods: {
    formatNumber(d) {
      return `$${(d / 1e6).toFixed(1)}`;
    },
    getSpendingTotal(use) {
      let value = this.dataBySpendingUse.get(use);
      return this.formatNumber(value);
    },
    getSpendingPercent(use) {
      let value = this.dataBySpendingUse.get(use);
      value = value / this.totalRevenue;
      return `${(100 * value).toFixed(1)}%`;
    },
  },
};
</script>

<style scoped>
li.spaced-out {
  margin-bottom: 0.75rem;
}
</style>
