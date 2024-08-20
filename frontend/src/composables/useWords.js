import { ref, reactive } from 'vue'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api/words'

export function useWords() {
  const words = ref([])
  const currentWord = ref(null)
  const state = reactive({
    loading: false,
    error: null
  })

  const fetchWords = async () => {
    state.loading = true
    state.error = null
    try {
      const response = await axios.get(API_URL)
      words.value = response.data
      if (words.value.length > 0) {
        currentWord.value = words.value[0]
      }
      console.log('Words fetched:', words.value)
    } catch (error) {
      console.error('Error fetching words:', error)
      state.error = 'Failed to fetch words. Please try again later.'
    } finally {
      state.loading = false
    }
  }

  const nextWord = () => {
    if (words.value.length === 0) return
    const currentIndex = words.value.findIndex(w => w._id === currentWord.value._id)
    const nextIndex = (currentIndex + 1) % words.value.length
    currentWord.value = words.value[nextIndex]
  }

  const addWord = async (newWord) => {
    state.loading = true
    state.error = null
    try {
      const response = await axios.post(API_URL, newWord)
      words.value.push(response.data)
      console.log('Word added:', response.data)
    } catch (error) {
      console.error('Error adding word:', error)
      state.error = 'Failed to add word. Please try again later.'
    } finally {
      state.loading = false
    }
  }

  return { 
    words, 
    currentWord, 
    state, 
    fetchWords, 
    nextWord, 
    addWord 
  }
}