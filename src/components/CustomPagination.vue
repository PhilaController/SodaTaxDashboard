<template>
  <!-- Navigation -->
  <nav
    role="navigation"
    class="vgt-wrap__footer vgt-clearfix"
    :aria-labelledby="`${id}__header`"
  >
    <!-- Title for screen readers only -->
    <h4 :id="`${id}__header`" class="sr-only">{{ title }} Pagination</h4>

    <div
      class="footer__navigation vgt-pull-right"
      :aria-labelledby="`${id}__header`"
    >
      <div
        class="footer__navigation__page-info"
        aria-label="Displayed rows info"
      >
        <div>{{ startRow }} - {{ stopRow }} of {{ totalRows }}</div>
      </div>

      <div class="footer__navigation__buttons">
        <!-- Previous button -->
        <button
          type="button"
          class="footer__navigation__page-btn"
          :class="{ disabled: previousButtonDisabled }"
          :aria-controls="tableId"
          :aria-label="
            previousButtonDisabled
              ? 'Button disabled'
              : `Goto Page ${currentPage - 1}`
          "
          :aria-disabled="previousButtonDisabled"
          :tabindex="previousButtonDisabled ? '-1' : '0'"
          @click="handlePreviousClick"
        >
          <span aria-hidden="true" class="chevron left"></span>
          <span>Previous</span>
        </button>

        <!-- Next button -->
        <button
          type="button"
          class="footer__navigation__page-btn"
          :class="{ disabled: nextButtonDisabled }"
          :aria-controls="tableId"
          :aria-label="
            nextButtonDisabled
              ? 'Button disabled'
              : `Goto Page ${currentPage + 1}`
          "
          :aria-disabled="nextButtonDisabled"
          :tabindex="nextButtonDisabled ? '-1' : '0'"
          @click="handleNextClick"
        >
          <span>Next</span>
          <span aria-hidden="true" class="chevron right"></span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  props: {
    title: { type: String, required: true },
    tableId: { type: String, required: true },
    pageChanged: {
      type: Function,
      required: true,
    },
    perPageChanged: {
      type: Function,
      required: true,
    },
    totalRows: {
      type: Number,
      required: true,
    },
    itemsPerPage: { type: Number, required: true },
    id: {
      type: String,
      default: () => `pagination_${Math.random().toString(12).substring(2, 8)}`,
    },
  },
  data() {
    return { currentPage: 1 };
  },
  computed: {
    previousButtonDisabled() {
      return this.currentPage == 1;
    },
    nextButtonDisabled() {
      return this.stopRow == this.totalRows;
    },
    startRow() {
      return (this.currentPage - 1) * this.itemsPerPage + 1;
    },
    stopRow() {
      let out = this.currentPage * this.itemsPerPage;
      if (out > this.totalRows) out = this.totalRows;
      return out;
    },
  },

  methods: {
    customPageChange() {
      this.pageChanged({ currentPage: this.currentPage });
    },
    handlePreviousClick() {
      this.currentPage = this.currentPage - 1;
      this.customPageChange();
    },
    handleNextClick() {
      this.currentPage = this.currentPage + 1;
      this.customPageChange();
    },
  },
};
</script>

<style>
.footer__navigation {
  display: flex;
  flex-direction: row;
  align-items: center;
}

@media screen and (max-width: 575.98px) {
  .footer__navigation {
    display: flex;
    flex-direction: column;
  }
  .footer__navigation__page-info {
    text-align: right;
  }
}
</style>