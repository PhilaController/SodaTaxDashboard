<template>
  <div data-vuetify>
    <!-- Overlay a lodader -->
    <v-overlay
      :value="fiscal_year == null"
      id="startOverlay"
      absolute
      opacity="1"
      color="#fff"
    >
      <v-progress-circular
        class="mt-5"
        indeterminate
        size="64"
        color="#2176d2"
      />
    </v-overlay>

    <v-app id="app">
      <v-main v-if="fiscal_year !== null">
        <!-- 1. Introduction -->
        <Intro :data="data" :fiscal_year="fiscal_year" :quarter="quarter" />

        <!-- 2. Summary -->
        <Summary :data="data" :fiscal_year="fiscal_year" :quarter="quarter" />

        <!-- 3. Detailed Look -->
        <DetailedLook :fiscal_year="fiscal_year" :quarter="quarter" />

        <!-- 4. Footnotes -->
        <div id="footnotes">
          <h2>Footnotes</h2>
          <hr class="titlebar" />
          <p>
            <span>
              <a
                class="text-link"
                href="#fn1"
                id="ref1"
                title="Jump back to footnote 1 in the
        text."
                >[1]</a
              >
            </span>
            <span class="ml-2"
              >In the past, the Kenney Administration has noted that there are
              additional areas of spending for Beverage Tax revenue that are not
              captured by the main areas presented here. These additional
              spending areas do not have an identifying index code in the City’s
              general ledger system and cannot be tracked or verified by the
              Controller’s Office.</span
            >
          </p>
        </div>
      </v-main>
    </v-app>
  </div>
</template>

<script>
import Intro from "@/components/Intro";
import Summary from "@/components/Summary";
import DetailedLook from "@/components/DetailedLook";
import { fetchAWS, fetchLatestRelease } from "@/utils";

export default {
  name: "App",
  components: { Intro, Summary, DetailedLook },
  data() {
    return { data: null, fiscal_year: null, quarter: null };
  },
  async created() {
    // Get latest fiscal year and quarter
    let config = await fetchLatestRelease();
    this.fiscal_year = config.fiscal_year;
    this.quarter = config.quarter;

    // Get the summary data
    this.data = await fetchAWS("summary");
  },
};
</script>

<style>
#app {
  overflow-y: hidden !important;
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

.v-menu__content {
  left: 0px !important;
}
#startOverlay {
  align-items: flex-start !important;
}

.titlebar {
  max-width: 200px;
}
</style>