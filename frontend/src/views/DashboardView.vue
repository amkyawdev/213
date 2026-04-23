<template>
  <div class="dashboard-container min-h-screen p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <header class="mb-8">
        <h1 class="heading-font text-4xl font-bold golden-text mb-2">Admin Dashboard</h1>
        <p class="text-burme-light/60">Real-time system monitoring and analytics</p>
      </header>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div v-for="stat in stats" :key="stat.label" class="stat-card glass-light rounded-2xl p-6 gold-border">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center" :class="stat.bgClass">
              <i :class="[stat.icon, stat.iconClass]"></i>
            <span class="text-2xl font-bold" :class="stat.trend > 0 ? 'text-green-500' : 'text-red-500'">
              <i :class="stat.trend > 0 ? 'bi bi-arrow-up' : 'bi bi-arrow-down'"></i>
              {{ Math.abs(stat.trend) }}%
            </span>
          </div>
          <div class="text-3xl font-bold mb-1">{{ stat.value }}</div>
          <div class="text-burme-light/60 text-sm">{{ stat.label }}</div>
        </div>
      </div>

      <!-- Charts and Activity -->
      <div class="grid lg:grid-cols-3 gap-6 mb-8">
        <!-- Provider Distribution -->
        <div class="glass-light rounded-2xl p-6 gold-border">
          <h3 class="font-semibold mb-4 flex items-center gap-2">
            <i class="bi bi-pie-chart text-burme-gold"></i>
            Provider Distribution
          </h3>
          <div class="space-y-4">
            <div v-for="provider in providerStats" :key="provider.name" class="provider-bar">
              <div class="flex justify-between mb-1">
                <span class="text-sm">{{ provider.name }}</span>
                <span class="text-sm text-burme-light/60">{{ provider.percentage }}%</span>
              </div>
              <div class="h-2 bg-burme-gray rounded-full overflow-hidden">
                <div 
                  class="h-full bg-gradient-to-r from-burme-gold to-burme-champagne rounded-full transition-all duration-500"
                  :style="{ width: provider.percentage + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="glass-light rounded-2xl p-6 gold-border lg:col-span-2">
          <h3 class="font-semibold mb-4 flex items-center gap-2">
            <i class="bi bi-activity text-burme-gold"></i>
            Recent Activity
          </h3>
          <div class="space-y-3 max-h-80 overflow-y-auto">
            <div 
              v-for="(log, index) in recentLogs" 
              :key="index"
              class="activity-item flex items-center gap-4 p-3 rounded-xl bg-burme-gray/30 hover:bg-burme-gray/50 transition-colors"
            >
              <div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="getLogIconClass(log.action)">
                <i :class="getLogIcon(log.action)"></i>
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-medium truncate">{{ log.action }}</p>
                <p class="text-xs text-burme-light/50">{{ formatTime(log.timestamp) }}</p>
              </div>
              <span class="text-xs px-2 py-1 rounded-full bg-burme-gold/10 text-burme-gold">
                {{ log.details?.username || 'System' }}
              </span>
            </div>
            <div v-if="recentLogs.length === 0" class="text-center text-burme-light/50 py-8">
              No recent activity
            </div>
          </div>
        </div>
      </div>

      <!-- Users Table (Admin Only) -->
      <div v-if="authStore.isAdmin" class="glass-light rounded-2xl p-6 gold-border">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-semibold flex items-center gap-2">
            <i class="bi bi-people text-burme-gold"></i>
            User Management
          </h3>
          <PremiumButton variant="secondary" size="sm" icon="bi bi-plus">
            Add User
          </PremiumButton>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-burme-gold/10">
                <th class="text-left py-3 px-4 text-burme-light/60 text-sm font-medium">User</th>
                <th class="text-left py-3 px-4 text-burme-light/60 text-sm font-medium">Email</th>
                <th class="text-left py-3 px-4 text-burme-light/60 text-sm font-medium">Role</th>
                <th class="text-left py-3 px-4 text-burme-light/60 text-sm font-medium">Joined</th>
                <th class="text-left py-3 px-4 text-burme-light/60 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="user in users" 
                :key="user.username"
                class="border-b border-burme-gold/5 hover:bg-burme-gray/30 transition-colors"
              >
                <td class="py-4 px-4">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-gradient-gold flex items-center justify-center">
                      <span class="text-burme-black text-sm font-semibold">{{ user.username.charAt(0).toUpperCase() }}</span>
                    </div>
                    <span class="font-medium">{{ user.username }}</span>
                  </div>
                </td>
                <td class="py-4 px-4 text-burme-light/70">{{ user.email }}</td>
                <td class="py-4 px-4">
                  <span 
                    class="px-2 py-1 rounded-full text-xs"
                    :class="user.role === 'admin' ? 'bg-burme-gold/20 text-burme-gold' : 'bg-burme-gray text-burme-light/70'"
                  >
                    {{ user.role }}
                  </span>
                </td>
                <td class="py-4 px-4 text-burme-light/60 text-sm">{{ formatDate(user.created_at) }}</td>
                <td class="py-4 px-4">
                  <div class="flex gap-2">
                    <button class="p-2 rounded-lg hover:bg-burme-gray transition-colors text-burme-light/60 hover:text-burme-gold">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button class="p-2 rounded-lg hover:bg-burme-gray transition-colors text-burme-light/60 hover:text-red-500">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- API Status -->
      <div class="glass-light rounded-2xl p-6 gold-border mt-6">
        <h3 class="font-semibold mb-4 flex items-center gap-2">
          <i class="bi bi-cloud text-burme-gold"></i>
          API Provider Status
        </h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div 
            v-for="provider in apiProviders" 
            :key="provider.name"
            class="api-card p-4 rounded-xl border text-center transition-all duration-300"
            :class="provider.status === 'online' ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'"
          >
            <div class="w-3 h-3 rounded-full mx-auto mb-2" :class="provider.status === 'online' ? 'bg-green-500' : 'bg-red-500'"></div>
            <p class="font-medium text-sm">{{ provider.name }}</p>
            <p class="text-xs text-burme-light/50 capitalize">{{ provider.status }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'
import PremiumButton from '@/components/PremiumButton.vue'

const authStore = useAuthStore()
const stats = ref([
  { label: 'Total Users', value: '1,234', icon: 'bi bi-users', iconClass: 'text-2xl text-burme-gold', bgClass: 'bg-burme-gold/10', trend: 12 },
  { label: 'Active Sessions', value: '89', icon: 'bi bi-activity', iconClass: 'text-2xl text-green-500', bgClass: 'bg-green-500/10', trend: 5 },
  { label: 'API Requests', value: '45.2K', icon: 'bi bi-cloud', iconClass: 'text-2xl text-blue-500', bgClass: 'bg-blue-500/10', trend: 23 },
  { label: 'Avg Response Time', value: '127ms', icon: 'bi bi-lightning', iconClass: 'text-2xl text-burme-champagne', bgClass: 'bg-burme-champagne/10', trend: -8 }
])

const providerStats = ref([
  { name: 'Cerebras', percentage: 65 },
  { name: 'Groq', percentage: 20 },
  { name: 'OpenRouter', percentage: 10 },
  { name: 'NVIDIA', percentage: 5 }
])

const recentLogs = ref([])
const users = ref([])
const apiProviders = ref([
  { name: 'Cerebras', status: 'online' },
  { name: 'Groq', status: 'online' },
  { name: 'OpenRouter', status: 'online' },
  { name: 'NVIDIA', status: 'offline' }
])

function formatTime(timestamp) {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return date.toLocaleString()
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString()
}

function getLogIcon(action) {
  const icons = {
    'user_login': 'bi bi-box-arrow-in-right',
    'user_register': 'bi bi-person-plus',
    'chat_message': 'bi bi-chat-dots',
    'provider_error': 'bi bi-exclamation-triangle',
    'app_start': 'bi bi-play-circle',
    'app_stop': 'bi bi-stop-circle'
  }
  return icons[action] || 'bi bi-activity'
}

function getLogIconClass(action) {
  const classes = {
    'user_login': 'bg-green-500/10 text-green-500',
    'user_register': 'bg-blue-500/10 text-blue-500',
    'chat_message': 'bg-burme-gold/10 text-burme-gold',
    'provider_error': 'bg-red-500/10 text-red-500',
    'app_start': 'bg-green-500/10 text-green-500',
    'app_stop': 'bg-red-500/10 text-red-500'
  }
  return classes[action] || 'bg-burme-gray text-burme-light'
}

async function fetchDashboardData() {
  try {
    const response = await axios.get('/api/dashboard/stats', {
      headers: authStore.getAuthHeader()
    })
    
    stats.value[0].value = response.data.total_users?.toString() || '1,234'
    stats.value[2].value = response.data.total_requests > 1000 
      ? `${(response.data.total_requests / 1000).toFixed(1)}K` 
      : response.data.total_requests?.toString() || '45.2K'
    
    recentLogs.value = response.data.recent_logs || []
  } catch (error) {
    console.log('Using demo data')
  }
  
  try {
    if (authStore.isAdmin) {
      const usersResponse = await axios.get('/api/dashboard/users', {
        headers: authStore.getAuthHeader()
      })
      users.value = usersResponse.data || []
    }
  } catch (error) {
    // Demo users
    users.value = [
      { username: 'admin', email: 'admin@burme.ai', role: 'admin', created_at: '2025-01-01T00:00:00' },
      { username: 'user1', email: 'user1@example.com', role: 'user', created_at: '2025-01-15T00:00:00' },
      { username: 'user2', email: 'user2@example.com', role: 'user', created_at: '2025-01-20T00:00:00' }
    ]
  }
}

onMounted(() => {
  fetchDashboardData()
})
</script>

<style scoped>
.dashboard-container {
  background: linear-gradient(180deg, #0A0A0A 0%, #111111 100%);
  min-height: 100vh;
}

.stat-card {
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.provider-bar {
  animation: slideUp 0.3s ease forwards;
}

@keyframes slideUp {
  to { opacity: 1; transform: translateY(0); }
}

.api-card {
  transition: all 0.3s ease;
}

.api-card:hover {
  transform: scale(1.02);
}
</style>