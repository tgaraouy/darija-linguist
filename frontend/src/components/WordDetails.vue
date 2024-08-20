<template>
    <v-card>
      <v-card-title>Word Details</v-card-title>
      <v-card-text>
        <p><strong>Arabic Script:</strong> {{ word.arabicScript }}</p>
        <p><strong>MSA Equivalent:</strong> {{ word.msaEquivalent }}</p>
        <p><strong>Region:</strong> {{ word.region }}</p>
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-title>Usage Examples</v-expansion-panel-title>
            <v-expansion-panel-text>
              <p><strong>Darija:</strong> {{ word.usageDarija[0] }}</p>
              <p><strong>French:</strong> {{ word.usageFrench[0] }}</p>
              <p><strong>English:</strong> {{ word.usageEnglish[0] }}</p>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
    </v-card>
  </template>
  
  <script>
  import { defineComponent } from 'vue'
  
  export default defineComponent({
    name: 'WordDetails',
    props: {
      word: {
        type: Object,
        required: true,
      },
    },
  })
  </script>