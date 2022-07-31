import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { countProducts } from './functions/database'

async function bruh() {
    const aa = await countProducts().then((a) => {return a})
    console.log(aa)
}
bruh()

createApp(App).use(store).use(router).mount('#app')
