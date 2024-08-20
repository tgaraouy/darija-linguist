<template>
    <div>
      <h2 class="text-h4 mb-4">Quiz Mode</h2>
      <v-card v-if="currentQuestion">
        <v-card-title>{{ currentQuestion.question }}</v-card-title>
        <v-card-text>
          <v-radio-group v-model="selectedAnswer">
            <v-radio
              v-for="option in currentQuestion.options"
              :key="option"
              :label="option"
              :value="option"
            ></v-radio>
          </v-radio-group>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="checkAnswer" :disabled="!selectedAnswer">Submit</v-btn>
        </v-card-actions>
      </v-card>
      <v-alert v-if="feedback" :type="feedbackType" class="mt-4">
        {{ feedback }}
      </v-alert>
      <v-btn @click="nextQuestion" class="mt-4" :disabled="!answered">Next Question</v-btn>
      <p class="mt-4">Score: {{ score }} / {{ totalQuestions }}</p>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  
  export default {
    name: 'QuizMode',
    props: {
      words: {
        type: Array,
        required: true,
      },
    },
    setup(props) {
      const currentQuestionIndex = ref(0);
      const selectedAnswer = ref('');
      const score = ref(0);
      const feedback = ref('');
      const feedbackType = ref('');
      const answered = ref(false);
  
      const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      };
  
      const generateQuestion = (word) => {
        const questionTypes = [
          { question: `What is the phonetic pronunciation of "${word.darija}"?`, answer: word.phonetic },
          { question: `What is the MSA equivalent of "${word.darija}"?`, answer: word.msaEquivalent },
          { question: `Which region is "${word.darija}" commonly used in?`, answer: word.region },
        ];
        const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
        const correctAnswer = questionType.answer;
        const options = [correctAnswer];
        
        while (options.length < 4) {
          const randomWord = props.words[Math.floor(Math.random() * props.words.length)];
          const randomAnswer = randomWord[questionType.answer.toLowerCase()];
          if (!options.includes(randomAnswer)) {
            options.push(randomAnswer);
          }
        }
  
        return {
          question: questionType.question,
          options: shuffleArray(options),
          correctAnswer,
        };
      };
  
      const questions = computed(() => props.words.map(generateQuestion));
  
      const currentQuestion = computed(() => questions.value[currentQuestionIndex.value]);
  
      const totalQuestions = computed(() => questions.value.length);
  
      const checkAnswer = () => {
        if (selectedAnswer.value === currentQuestion.value.correctAnswer) {
          score.value++;
          feedback.value = 'Correct!';
          feedbackType.value = 'success';
        } else {
          feedback.value = `Incorrect. The correct answer is: ${currentQuestion.value.correctAnswer}`;
          feedbackType.value = 'error';
        }
        answered.value = true;
      };
  
      const nextQuestion = () => {
        currentQuestionIndex.value++;
        selectedAnswer.value = '';
        feedback.value = '';
        answered.value = false;
      };
  
      return {
        currentQuestion,
        selectedAnswer,
        score,
        totalQuestions,
        feedback,
        feedbackType,
        answered,
        checkAnswer,
        nextQuestion,
      };
    },
  };
  </script>