import { defineStore } from 'pinia'
import { ref } from 'vue'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const useChatStore = defineStore('chat', () => {
  const messages = ref([])
  const isLoading = ref(false)
  const currentProvider = ref('groq')

  function addMessage(role, content, provider = null) {
    messages.value.push({
      id: Date.now(),
      role,
      content,
      provider,
      timestamp: new Date().toISOString()
    })
  }

  async function sendMessage(message) {
    if (!message.trim()) return
    
    addMessage('user', message)
    isLoading.value = true
    
    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: message })
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to send message')
      }
      
      const data = await response.json()
      
      addMessage('assistant', data.reply || data.response, 'groq')
      return true
    } catch (err) {
      addMessage('assistant', err.message, 'error')
      return false
    } finally {
      isLoading.value = false
    }
  }

  function clearMessages() {
    messages.value = []
  }

  return {
    messages,
    isLoading,
    currentProvider,
    addMessage,
    sendMessage,
    clearMessages
  }
})
