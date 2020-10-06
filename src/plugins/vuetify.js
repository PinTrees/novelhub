import Vue from 'vue';
import Vuetify, { VSnackbar, VBtn, VIcon } from 'vuetify/lib';
import VuetifyToast from 'vuetify-snackbar'

Vue.use(Vuetify, {
    components: {
        VSnackbar,
        VBtn,
        VIcon
    }
});
Vue.use(VuetifyToast, {
    absolute: false,
    bottom: true,
    timeout: 3000,
    property: '$toast'
})
export default new Vuetify({});
