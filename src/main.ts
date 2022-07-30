import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { getCounts } from './functions/database'

//const aa = await getCounts().then((a) => {return a})

createApp(App).use(store).use(router).mount('#app')
