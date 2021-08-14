<template>
  <v-app>
    <v-main>
      <!-- 1. Introduction -->
      <Intro />

      <!-- 2. Summary -->
      <Summary />

      <!-- 3. Detailed Look -->
      <DetailedLook />
    </v-main>
  </v-app>
</template>

<script>
import Intro from "@/components/Intro";
import Summary from "@/components/Summary";
import DetailedLook from "@/components/DetailedLook";

export default {
  name: "App",

  components: { Intro, Summary, DetailedLook },

  data() {
    return {};
  },
};
</script>

<style>
/* Shared styles */
.card-footer {
  font-size: 14px;
  font-style: italic;
}
</style>