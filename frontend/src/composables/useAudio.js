export function useAudio() {
    const speak = (text) => {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'ar-MA' // Moroccan Arabic
      speechSynthesis.speak(utterance)
    }
  
    return { speak }
  }