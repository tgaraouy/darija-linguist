import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import './assets/css/main.css'
import './assets/css/typography.css'
import './assets/css/layout.css'
import './assets/css/components.css'

loadFonts()

createApp(App)
  .use(vuetify)
  .mount('#app')