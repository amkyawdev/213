<template>
  <div class="chat-container h-screen flex flex-col">
    <!-- Chat Header -->
    <header class="chat-header glass px-6 py-4 border-b border-b-burme-gold/10 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center">
          <i class="bi bi-chat-dots text-burme-black text-xl"></i>
        </div>
        <div>
          <h1 class="font-semibold text-lg">Burme Chat</h1>
          <div class="flex items-center gap-2 text-sm">
            <span class="w-2 h-2 rounded-full bg-green-500"></span>
            <span class="text-burme-light/60">Powered by {{ chatStore.currentProvider }}</span>
          </div>
        </div>
      </div>
      
      <div class="flex items-center gap-3">
        <button 
          @click="clearChat"
          class="p-2 rounded-lg hover:bg-burme-gray/30 transition-colors text-burme-light/60 hover:text-burme-gold"
          title="Clear Chat"
        >
          <i class="bi bi-trash text-lg"></i>
        </button>
        <PremiumButton variant="ghost" size="sm" icon="bi bi-person-circle" @click="$router.push('/dashboard')">
          Dashboard
        </PremiumButton>
      </div>
    </header>

    <!-- Chat Messages -->
    <main class="flex-1 overflow-y-auto p-6 space-y-6">
      <div v-if="chatStore.messages.length === 0" class="empty-state">
        <div class="w-20 h-20 rounded-2xl bg-gradient-gold flex items-center justify-center mx-auto mb-6">
          <i class="bi bi-stars text-burme-black text-3xl"></i>
        </div>
        <h2 class="text-2xl font-semibold mb-2">Welcome to Burme AI</h2>
        <p class="text-burme-light/60 max-w-md mx-auto">
          Ask me anything! I can help with code, writing, analysis, math, and much more.
        </p>
        
        <!-- Quick Start Suggestions -->
        <div class="suggestions mt-8">
          <button 
            v-for="suggestion in suggestions" 
            :key="suggestion"
            @click="sendSuggestion(suggestion)"
            class="suggestion-btn"
          >
            {{ suggestion }}
          </button>
        </div>
      </div>

      <div 
        v-for="(message, index) in chatStore.messages" 
        :key="index"
        class="message-wrapper animate-fade-in"
        :class="message.role === 'user' ? 'user-message' : 'ai-message'"
      >
        <div class="flex gap-4" :class="message.role === 'user' ? 'flex-row-reverse' : ''">
          <!-- Avatar -->
          <div 
            class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            :class="message.role === 'user' ? 'bg-gradient-gold' : 'bg-burme-gray'"
          >
            <i :class="message.role === 'user' 
              ? 'bi bi-person text-burme-black' 
              : 'bi bi-robot text-burme-gold'"></i>
          </div>
          
          <!-- Message Content -->
          <div class="chat-bubble max-w-2xl" :class="message.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'">
            <div v-if="message.content" class="markdown-content" v-html="renderMarkdown(message.content)"></div>
            <div v-else class="typing-cursor text-burme-light/50">Typing...</div>
            
            <!-- Provider Badge -->
            <div v-if="message.provider" class="mt-2 text-xs text-burme-light/40">
              <span class="capitalize">{{ message.provider }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading Indicator -->
      <div v-if="chatStore.isLoading" class="message-wrapper ai-message">
        <div class="flex gap-4">
          <div class="w-10 h-10 rounded-xl bg-burme-gray flex items-center justify-center">
            <i class="bi bi-robot text-burme-gold"></i>
          </div>
          <div class="chat-bubble chat-bubble-ai">
            <div class="flex items-center gap-2">
              <div class="loading-dots text-burme-gold">Thinking</div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Chat Input -->
    <footer class="chat-footer glass px-6 py-4 border-t border-t-burme-gold/10">
      <form @submit.prevent="sendMessage" class="flex gap-4 items-end">
        <div class="flex-1 relative">
          <textarea
            ref="inputRef"
            v-model="inputMessage"
            @keydown.enter.exact.prevent="sendMessage"
            @input="autoResize"
            placeholder="Ask anything..."
            rows="1"
            class="w-full bg-burme-gray/50 border border-burme-gold/20 rounded-xl px-4 py-3 pr-12 resize-none focus:border-burme-gold/50 focus:ring-2 focus:ring-burme-gold/20 transition-all"
          ></textarea>
          <button 
            type="button"
            @click="clearInput"
            v-if="inputMessage"
            class="absolute right-3 bottom-3 text-burme-light/40 hover:text-burme-light transition-colors"
          >
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <PremiumButton 
          type="submit" 
          variant="primary" 
          size="md"
          icon="bi bi-send"
          :loading="chatStore.isLoading"
          :disabled="!inputMessage.trim()"
          class="particle-trigger"
        >
          Send
        </PremiumButton>
      </form>
      
      <p class="text-xs text-center text-burme-light/40 mt-3">
        Press Enter to send, Shift+Enter for new line. Powered by multiple AI providers for reliability.
      </p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useChatStore } from '@/stores/chat'
import { marked } from 'marked'
import katex from 'katex'
import PremiumButton from '@/components/PremiumButton.vue'

const authStore = useAuthStore()
const chatStore = useChatStore()
const inputRef = ref(null)
const inputMessage = ref('')

const suggestions = [
  'Write a Python function to sort a list',
  'Explain quantum computing in simple terms',
  'Help me debug this code snippet',
  'What are the best practices for REST APIs?'
]

function renderMarkdown(text) {
  if (!text) return ''
  
  // Render KaTeX for math expressions
  text = text.replace(/\$\$([\s\S]+?)\$\$/g, (match, math) => {
    try {
      return `<div class="katex-display">${katex.renderToString(math.trim(), { displayMode: true })}</div>`
    } catch (e) {
      return match
    }
  })
  
  text = text.replace(/\$([^\$]+)\$/g, (match, math) => {
    try {
      return katex.renderToString(math.trim(), { displayMode: false })
    } catch (e) {
      return match
    }
  })
  
  // Configure marked
  marked.setOptions({
    breaks: true,
    gfm: true,
    highlight: function(code, lang) {
      return `<pre><code class="language-${lang || 'plaintext'}">${code}</code></pre>`
    }
  })
  
  return marked.parse(text)
}

function autoResize() {
  if (inputRef.value) {
    inputRef.value.style.height = 'auto'
    inputRef.value.style.height = Math.min(inputRef.value.scrollHeight, 200) + 'px'
  }
}

function clearInput() {
  inputMessage.value = ''
  if (inputRef.value) {
    inputRef.value.style.height = 'auto'
  }
}

async function sendMessage() {
  if (!inputMessage.value.trim() || chatStore.isLoading) return
  
  const message = inputMessage.value.trim()
  inputMessage.value = ''
  clearInput()
  
  await chatStore.sendMessage(message, authStore)
  
  // Scroll to bottom
  nextTick(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
  })
}

function sendSuggestion(suggestion) {
  inputMessage.value = suggestion
  sendMessage()
}

function clearChat() {
  chatStore.clearMessages()
}

onMounted(() => {
  if (inputRef.value) {
    inputRef.value.focus()
  }
})
</script>

<style scoped>
.chat-container {
  height: calc(100vh - 80px);
}

.chat-header {
  flex-shrink: 0;
}

.chat-footer {
  flex-shrink: 0;
}

.empty-state {
  @apply flex flex-col items-center justify-center h-full text-center;
}

.suggestion-btn {
  @apply px-4 py-2 rounded-full text-sm bg-burme-gray/50 border border-burme-gold/20 text-burme-light/70;
  @apply hover:border-burme-gold/50 hover:text-burme-gold transition-all duration-300;
}

.suggestions {
  @apply flex flex-wrap justify-center gap-3;
}

.message-wrapper {
  animation: fadeIn 0.5s ease forwards;
}

.user-message .chat-bubble {
  @apply rounded-2xl rounded-tr-sm;
}

.ai-message .chat-bubble {
  @apply rounded-2xl rounded-tl-sm;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>