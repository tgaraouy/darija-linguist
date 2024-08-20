<template>
    <v-card>
      <v-card-title class="text-h4">{{ word.darija }}</v-card-title>
      <v-card-subtitle class="text-h6">{{ word.phonetic }}</v-card-subtitle>
      <v-card-text>
        <v-btn color="primary" @click="$emit('speak-word', word.darija)">
          Speak Word
        </v-btn>
      </v-card-text>
    </v-card>
  </template>
  
  <script>
  import { defineComponent } from 'vue'
  
  export default defineComponent({
    name: 'WordDisplay',
    props: {
      word: {
        type: Object,
        required: true,
      },
    },
    emits: ['speak-word'],
  })
  </script>