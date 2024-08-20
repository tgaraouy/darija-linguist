<template>
    <v-container class="darija-linguist">
      <h1 class="text-h4 text-sm-h3 mb-6 text-center primary--text">Open Darija</h1>
  
      <v-card v-if="loading" class="text-center pa-6">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-card>
  
      <v-alert v-else-if="error" type="error" class="mb-6">{{ error }}</v-alert>
  
      <template v-else-if="currentWord">
        <v-card class="mb-6">
          <v-card-title class="justify-center">
            <span class="text-h3 text-sm-h2 darija-font main-word">{{ currentWord.darija }}</span>
          </v-card-title>
          <v-card-subtitle class="text-h6 text-sm-h5 text-center">{{ currentWord.phonetic }}</v-card-subtitle>
          <v-card-text class="text-center">
            <v-btn color="primary" @click="speakWord" class="ma-2">
              <v-icon left>mdi-volume-high</v-icon> Speak
            </v-btn>
            <v-btn color="secondary" @click="openPhoneticDialog" class="ma-2">
              Suggest Correction
            </v-btn>
          </v-card-text>
        </v-card>
  
        <v-row>
          <v-col cols="12" md="6">
            <v-card class="mb-6">
              <v-card-title>Word Details</v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12">
                    <strong>Arabic Script:</strong> <span class="darija-font">{{ currentWord.arabicScript }}</span>
                  </v-col>
                  <v-col cols="12">
                    <strong>MSA Equivalent:</strong> <span class="darija-font">{{ currentWord.msaEquivalent }}</span>
                  </v-col>
                  <v-col cols="12">
                    <strong>Region:</strong> {{ currentWord.region }}
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
  
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title>Examples</v-card-title>
              <v-card-text>
                <v-expansion-panels>
                  <v-expansion-panel>
                    <v-expansion-panel-header>Darija</v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-list dense>
                        <v-list-item v-for="(example, index) in currentWord.usageDarija" :key="`darija-${index}`">
                          <v-list-item-content>
                            <v-list-item-title class="darija-font darija-example">{{ example }}</v-list-item-title>
                          </v-list-item-content>
                          <v-list-item-action>
                            <v-btn icon small @click="speakExample(example)">
                              <v-icon>mdi-volume-high</v-icon>
                            </v-btn>
                          </v-list-item-action>
                        </v-list-item>
                      </v-list>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                  
                  <v-expansion-panel>
                    <v-expansion-panel-header>French</v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-list dense>
                        <v-list-item v-for="(example, index) in currentWord.usageFrench" :key="`french-${index}`">
                          <v-list-item-content>
                            <v-list-item-title class="french-font">{{ example }}</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                  
                  <v-expansion-panel>
                    <v-expansion-panel-header>English</v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-list dense>
                        <v-list-item v-for="(example, index) in currentWord.usageEnglish" :key="`english-${index}`">
                          <v-list-item-content>
                            <v-list-item-title class="english-font">{{ example }}</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
  
        <v-row>
          <v-col cols="12" class="text-center mt-6">
            <v-btn @click="previousWord" class="ma-2">
              <v-icon left>mdi-chevron-left</v-icon> Previous
            </v-btn>
            <v-btn @click="nextWord" class="ma-2">
              Next <v-icon right>mdi-chevron-right</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </template>
  
      <v-dialog v-model="phoneticDialog" max-width="500px">
        <v-card>
          <v-card-title>Suggest Phonetic Correction</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="suggestedPhonetic"
              label="Suggested Phonetic Pronunciation"
              :placeholder="currentWord ? currentWord.phonetic : ''"
            ></v-text-field>
            <v-btn @click="startRecording" v-if="!isRecording" color="primary" class="mb-2">
              Start Recording
            </v-btn>
            <v-btn @click="stopRecording" v-if="isRecording" color="error" class="mb-2">
              Stop Recording
            </v-btn>
            <audio v-if="audioUrl" :src="audioUrl" controls class="w-100"></audio>
            <v-alert v-if="feedback" :type="feedback.includes('Error') ? 'error' : 'success'" class="mt-3">
              {{ feedback }}
            </v-alert>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="submitPhoneticSuggestion" :disabled="!suggestedPhonetic">Submit</v-btn>
            <v-btn color="grey" text @click="phoneticDialog = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue';
  import axios from 'axios';
  
  export default {
    name: 'DarijaLinguist',
    setup() {
      const words = ref([]);
      const currentIndex = ref(0);
      const loading = ref(false);
      const error = ref(null);
      const phoneticDialog = ref(false);
      const suggestedPhonetic = ref('');
      const isRecording = ref(false);
      const audioUrl = ref('');
      const feedback = ref('');
      let mediaRecorder = null;
      let audioChunks = [];
  
      const fetchWords = async () => {
        loading.value = true;
        error.value = null;
        try {
          const response = await axios.get('http://localhost:5000/api/words');
          words.value = response.data;
        } catch (err) {
          error.value = 'Failed to fetch words. Please try again.';
          console.error('Error fetching words:', err);
        } finally {
          loading.value = false;
        }
      };
  
      const currentWord = computed(() => words.value[currentIndex.value]);
  
      const nextWord = () => {
        currentIndex.value = (currentIndex.value + 1) % words.value.length;
      };
  
      const previousWord = () => {
        currentIndex.value = (currentIndex.value - 1 + words.value.length) % words.value.length;
      };
  
      const speak = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ar-MA'; // Moroccan Arabic
        speechSynthesis.speak(utterance);
      };
  
      const speakWord = () => {
        if (currentWord.value) {
          speak(currentWord.value.darija);
        }
      };
  
      const speakExample = (example) => {
        speak(example);
      };
  
      const openPhoneticDialog = () => {
        suggestedPhonetic.value = currentWord.value ? currentWord.value.phonetic : '';
        phoneticDialog.value = true;
      };
  
      const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();
        isRecording.value = true;
        audioChunks = [];
        mediaRecorder.addEventListener("dataavailable", event => {
          audioChunks.push(event.data);
        });
        mediaRecorder.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunks);
          audioUrl.value = URL.createObjectURL(audioBlob);
          isRecording.value = false;
        });
      };
  
      const stopRecording = () => {
        mediaRecorder.stop();
      };
  
      const submitPhoneticSuggestion = async () => {
        if (currentWord.value && suggestedPhonetic.value) {
          try {
            feedback.value = 'Submitting suggestion...';
            console.log('Current word:', currentWord.value);
            console.log('Suggestion data:', { suggestedPhonetic: suggestedPhonetic.value, audioUrl: audioUrl.value });
            const response = await axios.post(`http://localhost:5000/api/words/${currentWord.value._id}/phonetic-suggestion`, {
              suggestedPhonetic: suggestedPhonetic.value,
              audioUrl: audioUrl.value
            });
            console.log('Server response:', response.data);
            feedback.value = 'Suggestion submitted successfully!';
            setTimeout(() => {
              phoneticDialog.value = false;
              feedback.value = '';
              suggestedPhonetic.value = '';
              audioUrl.value = '';
            }, 2000);
          } catch (err) {
            console.error('Error submitting phonetic suggestion:', err);
            if (err.response) {
              console.error('Response data:', err.response.data);
              console.error('Response status:', err.response.status);
              console.error('Response headers:', err.response.headers);
            } else if (err.request) {
              console.error('No response received:', err.request);
            } else {
              console.error('Error setting up request:', err.message);
            }
            feedback.value = `Error submitting suggestion: ${err.response ? err.response.data.message : err.message}`;
          }
        } else {
          feedback.value = 'Please enter a suggested pronunciation.';
        }
      };
  
      onMounted(fetchWords);
  
      return {
        currentWord,
        nextWord,
        previousWord,
        speakWord,
        speakExample,
        loading,
        error,
        phoneticDialog,
        suggestedPhonetic,
        openPhoneticDialog,
        submitPhoneticSuggestion,
        startRecording,
        stopRecording,
        isRecording,
        audioUrl,
        feedback
      };
    },
  };
  </script>
  
  <style scoped>
  .darija-linguist {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .darija-font {
    font-family: 'Scheherazade', 'Amiri', serif;
    text-align: right; /* Align Arabic text to the right */
  }
  
  .main-word {
    font-weight: bold;
  }
  
  .darija-example {
    font-size: 1.2em;
  }
  
  .french-font, .english-font {
    font-family: 'Roboto', 'Arial', sans-serif;
  }
  
  /* Ensure consistent height for list items */
  .v-list-item {
    height: auto !important;
    min-height: 48px;
  }
  
  /* Make sure audio element is responsive */
  audio {
    width: 100%;
    max-width: 300px;
  }
  
  @media (max-width: 600px) {
    .main-word {
      font-size: 2.5em;
    }
    
    .darija-example {
      font-size: 1.1em;
    }
  }
  </style>