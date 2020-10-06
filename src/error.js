import Vue from 'vue'

Vue.config.errorHandler = e => {
    console.error(e.message)
    Vue.prototype.$toast(e.message)
    console.log('error')
}