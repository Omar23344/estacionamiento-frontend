import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import router from './router'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'

// Limpia la sesión al arrancar el proyecto
localStorage.removeItem('usuario')

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.use(createVuetify())
app.mount('#app')




