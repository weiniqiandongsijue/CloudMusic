import Vue from "vue";
import Vuex from "vuex";
import file from "./file";

Vue.use(Vuex)

export default new Vuex.Store({
    modules:{
        file
    }
})