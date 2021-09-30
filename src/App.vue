<template>
  <div data-vuetify>
    <v-app id="app">
      <v-main>
        <!-- 1. Introduction -->
        <Intro />

        <!-- 2. Summary -->
        <Summary />

        <!-- 3. Detailed Look -->
        <DetailedLook />
      </v-main>
    </v-app>
  </div>
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
</style>