import Vue from 'vue'
import Vuex from 'vuex'
import { csv } from "d3-fetch"
import { getDownloadURL } from "@/utils"

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        expenditures: null,
        summary: null
    },
    actions: {
        fetchExpenditures(store) {
            return csv(getDownloadURL("expenditures")).then((data) => {
                store.commit("setValue", { value: data, key: "expenditures" });
                return data
            });
        },
        fetchSummary(store) {
            return csv(getDownloadURL("summary")).then((data) => {
                store.commit("setValue", { value: data, key: "summary" });
                return data
            });

        }

    },
    mutations: {
        setValue(state, payload) {
            state[payload.key] = payload.value;
        }
    }
})