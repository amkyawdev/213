import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'https://bot.amkai.workers.dev'

export const useChatStore = defineStore('chat', () => {
  const messages = ref([])
  const isLoading = ref(false)
  const currentProvider = ref('cerebras')
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
    
    // Add user message
    addMessage('user', message)
    
    isLoading.value = true
    currentProvider.value = 'cerebras'
    
    try {
      const response = await fetch(`${API_URL}/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authStore.getAuthHeader()
        },
        body: JSON.stringify({
          message,
          session_id: sessionId.value
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || errorData.error || 'Failed to send message')
      }
      
      // Create AI message placeholder
      const aiMessageId = Date.now() + 1
      let aiContent = ''
      
      messages.value.push({
        id: aiMessageId,
        role: 'assistant',
        content: '',
        provider: currentProvider.value,
        timestamp: new Date().toISOString()
      })
      
      // Process stream
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              
              if (data.content) {
                aiContent += data.content
                messages.value.find(m => m.id === aiMessageId).content = aiContent
              }
              
              if (data.provider) {
                currentProvider.value = data.provider
                messages.value.find(m => m.id === aiMessageId).provider = data.provider
              }
              
              if (data.error) {
                messages.value.find(m => m.id === aiMessageId).content = `Error: ${data.error}`
              }
            } catch (e) {
              // Skip malformed JSON
            }
          }
        }
      }
      
    } catch (error) {
      addMessage('assistant', `Error: ${error.message}. Please try again.`)
    } finally {
      isLoading.value = false
    }
  }

  function clearMessages() {
    messages.value = []
  }

  function loadHistory(messages) {
    messages.value = messages
  }

  return {
    messages,
    isLoading,
    currentProvider,
    sessionId,
    addMessage,
    sendMessage,
    clearMessages,
    loadHistory
  }
})