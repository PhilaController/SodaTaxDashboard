<template>
  <div id="app">
    <div v-if="fiscalYear !== null && data !== null">
      <!-- 1. Introduction -->
      <Intro :data="data" :fiscal-year="fiscalYear" :quarter="quarter" />

      <!-- 2. Summary -->
      <Summary :data="data" :fiscal-year="fiscalYear" :quarter="quarter" />

      <!-- 3. Detailed Look -->
      <DetailedLook :fiscal-year="fiscalYear" :quarter="quarter" />

      <!-- 4. Footnotes -->
      <div id="footnotes">
        <h2 id="footnote-label">Footnotes</h2>
        <hr class="titlebar" />

        <div class="mt-2">
          <Footnote
            text="In the past, the Kenney Administration has noted that there are
            additional areas of spending for Beverage Tax revenue that are not
            captured by the main areas presented here. These additional spending
            areas do not have an identifying index code in the City’s general
            ledger system and cannot be tracked or verified by the Controller’s
            Office."
          />
        </div>
      </div>
    </div>
    <div v-else class="loader-wrapper"><span class="loader"></span></div>
  </div>
</template>

<script>
import Intro from "@/sections/Intro";
import Summary from "@/sections/Summary";
import DetailedLook from "@/sections/DetailedLook";
import Footnote from "@/components/Footnote";
import { fetchAWS, fetchLatestRelease } from "@/utils";

export default {
  name: "App",
  components: { Intro, Summary, DetailedLook, Footnote },
  data() {
    return { data: null, fiscalYear: null, quarter: null };
  },
  async created() {
    // Get latest fiscal year and quarter
    let config = await fetchLatestRelease();
    this.fiscalYear = config.fiscal_year;
    this.quarter = config.quarter;

    // Get the summary data
    this.data = await fetchAWS("summary");
  },
};
</script>

<style>
#app {
  counter-reset: footnotes;
}

.loader-wrapper {
  display: flex;
  justify-content: center;
}
.loader {
  width: 48px;
  height: 48px;
  border: 5px solid #fff;
  border-bottom-color: #2176d2;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
#footnotes {
  margin-top: 50px !important;
}
#app {
  overflow-y: hidden !important;
  overflow-x: hidden !important;
}
/* Shared styles */
.card-footer {
  font-size: 14px;
  font-style: italic;
}
#app p {
  margin-bottom: 1rem;
}

#app h2 {
  margin-bottom: 0.5rem;
  margin-top: 1rem;
}

#app h3 {
  padding: 1rem;
}
.card-footer {
  padding: 0.5rem;
}

#startOverlay {
  align-items: flex-start !important;
}

.titlebar {
  max-width: 200px;
  padding-bottom: 30px !important;
}
.left-aligned-menu-content {
  left: 0 !important;
}
</style>
