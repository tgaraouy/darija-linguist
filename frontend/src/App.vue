<template>
  <v-app>
    <v-main>
      <DarijaLinguist />
    </v-main>
  </v-app>
</template>

<script>
import { defineComponent } from 'vue'
import DarijaLinguist from './components/DarijaLinguist.vue'

export default defineComponent({
  name: 'App',
  components: {
    DarijaLinguist,
  },
})
</script>