import Vue from 'vue'
import App from '@/App.vue'
import vuetify from '@/plugins/vuetify'
import store from "@/plugins/store"
import { getDownloadURL } from "@/utils"

Vue.config.productionTip = false

// load and set the HTML template we are using
let audit_content = $(".audit-content");
audit_content.html(`<div id="app"></div>`);


// add a button to view the data set
function add_data_button() {

  // add a new button
  let url = getDownloadURL("expenditures");
  let btn = `<a href="${url}" class="btn btn-primary btn-block btn-block">
            <i class="fas fa-download"></i>
            Download Data
        </a>`;

  // add download data button and remove the report button
  $(".entry-header .btn").after(btn);
  $(".entry-header .btn")
    .first()
    .remove();
}

function add_help_message() {
  let helpMessage = `<p class='help-message'>
  Comments or feedback? Please contact
  <a href="mailto:controller@phila.gov">controller@phila.gov</a>.
  </p>`;
  $(".back-link").after(helpMessage);
}

// the link to the dataset
add_data_button();

// add a help message
add_help_message();



new Vue({
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
