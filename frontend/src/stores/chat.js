import { defineStore } from 'pinia'
import { ref } from 'vue'

const API_URL = import.meta.env.VITE_API_URL || 'https://bot.amkai.workers.dev'

export const useChatStore = defineStore('chat', () => {
  const messages = ref([])
  const isLoading = ref(false)
  const currentProvider = ref('nvidia')
  const sessionId = ref(null)

  function addMessage(role, content, provider = null) {
    messages.value.push({
      id: Date.now(),
      role,
      content,
      provider,
      timestamp: new Date().toISOString()
    })
  }

  async function sendMessage(message, authStore) {
    if (!message.trim()) return
    
    addMessage('user', message)
    isLoading.value = true
    currentProvider.value = 'nvidia'
    
    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authStore.getAuthHeader()
        },
        body: JSON.stringify({ message })
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to send message')
      }
      
      const data = await response.json()
      
      addMessage('assistant', data.response, 'nvidia')
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
    sessionId,
    addMessage,
    sendMessage,
    clearMessages
  }
})
