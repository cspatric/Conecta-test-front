<template>
  <div class="min-h-screen bg-[#F3F6FB]">
    <header class="bg-[#5A3EF0] pt-10 pb-16">
      <div class="max-w-[640px] mx-auto px-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-full overflow-hidden bg-white/20 grid place-items-center">
              <div class="w-9 h-9 rounded-full bg-white/20 grid place-items-center">
                <span class="text-white/90 text-sm font-semibold">{{ initials }}</span>
              </div>
            </div>
            <div class="text-white">
              <div class="text-sm/5 opacity-90">{{ $t('app.greetPrefix') }} {{ greeting }},</div>
              <div class="text-xl font-semibold -mt-0.5">{{ displayName }}</div>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              class="w-10 h-10 rounded-xl bg-white/15 hover:bg-white/20 transition grid place-items-center"
              :aria-label="$t('app.actions.email')"
              :title="$t('app.actions.email')"
              @click="goToMail"
            >
              <svg viewBox="0 0 24 24" class="w-6 h-6" fill="none" stroke="white" stroke-width="1.8">
                <path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="m22 8-10 6L2 8" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>

            <button
              type="button"
              class="w-10 h-10 rounded-xl bg-white/15 hover:bg-white/20 transition grid place-items-center text-white text-sm font-semibold"
              :aria-label="$t('app.actions.language')"
              :title="$t('app.actions.language')"
              @click="toggleLanguage"
            >
              {{ locale === 'pt-BR' ? 'EN' : 'PT' }}
            </button>

            <button
              type="button"
              class="w-10 h-10 rounded-xl bg-white/15 hover:bg-white/20 transition grid place-items-center disabled:opacity-50"
              :disabled="loggingOut"
              :aria-label="$t('app.actions.logout')"
              :title="$t('app.actions.logout')"
              @click="logout"
            >
              <svg viewBox="0 0 24 24" class="w-6 h-6" fill="none" stroke="white" stroke-width="1.8">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M10 17l5-5-5-5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M15 12H3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="-mt-8 max-w-[640px] mx-auto px-4 pb-28">
      <div class="bg-white rounded-2xl shadow-sm border border-black/5 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:gap-4">
        <select
          v-model="selectedDomain"
          class="w-full sm:w-[220px] h-11 rounded-xl border border-[#E5E7EB] bg-white px-3 text-[#374151] text-sm outline-none focus:ring-2 focus:ring-[#5A3EF0]/30 focus:border-[#5A3EF0]"
        >
          <option :value="''">{{ $t('app.contacts.allDomains', 'Todos os domínios') }}</option>
          <option v-for="d in domains" :key="d" :value="d">{{ d }}</option>
        </select>

        <div class="relative flex-1 mt-3 sm:mt-0">
          <svg
            class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-4.35-4.35M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" />
          </svg>
          <input
            v-model.trim="q"
            type="text"
            :placeholder="$t('app.search.contactsPlaceholder')"
            class="w-full h-11 rounded-xl border border-[#E5E7EB] bg-white pl-10 pr-4 text-sm text-[#374151] outline-none focus:ring-2 focus:ring-[#5A3EF0]/30 focus:border-[#5A3EF0]"
          />
        </div>
      </div>

      <div v-if="loading" class="mt-5 bg-white rounded-2xl shadow-sm border border-black/5 p-5">
        {{ $t('app.contacts.loading') }}
      </div>
      <div v-else-if="error" class="mt-5 bg-white rounded-2xl shadow-sm border border-red-200 p-5 text-red-600">
        {{ error }}
      </div>

      <div v-else class="mt-5 bg-white rounded-2xl shadow-sm border border-black/5">
        <div class="px-5 py-3 text-[#4B5563] text-[15px] font-medium grid grid-cols-[auto_1fr_1fr_auto] items-center gap-3">
          <span></span>
          <span>{{ $t('app.contacts.headerName') }}</span>
          <span>{{ $t('app.contacts.headerEmail') }}</span>
          <span class="text-right pr-1">{{ $t('app.contacts.headerAction') }}</span>
        </div>
      </div>

      <div v-if="!loading && !error" class="mt-3 bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
        <ul role="list" class="divide-y divide-[#E5E7EB]/70">
          <li
            v-for="c in filtered"
            :key="c.id + ':' + c.email"
            class="px-5 py-4 grid grid-cols-[auto_1fr_1fr_auto] items-center gap-3"
          >
            <span class="w-8 h-8 rounded-full bg-[#C9D7EA] grid place-items-center text-[#1F2937] text-xs font-semibold">
              {{ getInitials(c.displayName || c.email) }}
            </span>
            <span class="text-[#111827] font-medium truncate">{{ c.displayName || '—' }}</span>
            <span class="text-[#374151] truncate">{{ c.email }}</span>

            <button
              type="button"
              class="ml-auto w-10 h-10 grid place-items-center rounded-xl border border-[#E5E7EB] hover:bg-[#F3F4F6] transition"
              :aria-label="$t('app.actions.details')"
              :title="$t('app.actions.details')"
              @click="openDetails(c)"
            >
              <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="#5235E8" stroke-width="1.8">
                <circle cx="12" cy="12" r="10" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 8h.01M12 12v4" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </li>

          <li v-if="filtered.length === 0" class="px-5 py-6 text-[#6B7280]">
            {{ $t('app.contacts.none') }}
          </li>
        </ul>
      </div>
    </main>

    <div v-if="showFabActions" class="fixed inset-0 z-40" @click="toggleFab(false)"></div>

    <div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <transition-group name="fab" tag="div" class="flex flex-col items-center gap-3">
        <button
          v-if="showFabActions"
          key="manual"
          type="button"
          class="px-4 h-11 rounded-full bg-white text-[#111827] border border-[#E5E7EB] shadow-sm hover:bg-[#F3F4F6] transition"
          @click.stop="openCreateManual"
        >
          {{ $t('app.actions.manual') }}
        </button>

        <button
          v-if="showFabActions"
          key="gemini"
          type="button"
          class="px-4 h-11 rounded-full bg-white text-[#111827] border border-[#E5E7EB] shadow-sm hover:bg-[#F3F4F6] transition"
          @click.stop="openGemini"
        >
          {{ $t('app.actions.ai') }}
        </button>

        <button
          key="main"
          type="button"
          class="px-10 h-16 rounded-[28px] bg-[#5235E8] hover:bg-[#4b2fe2] text-white font-semibold text-lg shadow-lg"
          :aria-label="$t('app.actions.add')"
          @click.stop="toggleFab()"
        >
          <span class="text-2xl leading-none">+</span>
        </button>
      </transition-group>
    </div>

    <EmailComposeModal v-model:open="composeOpen" :to="composeTo" />
    <AiChatModal
      :open="aiOpen"
      :system-goal="'Ajudar a gerenciar contatos e e-mails.'"
      :system-context="{ page: 'home' }"
      :system-constraints="['Seja breve', 'Português-BR']"
      :tools="['contacts.search','mail.draft','mail.send']"
      @close="aiOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { listContacts } from '../../services/contacts'
import { useAuthStore } from '../../stores/auth'
import EmailComposeModal from '../../Pages/Home/Components/EmailComposeModal.vue'
import AiChatModal from '../../Pages/Home/Components/AiChatModal.vue'
import { authLogout } from '../../services/auth'
import { useI18n } from 'vue-i18n'
import { setLocale } from '../../i18n'

type ContactItem = { id: string; displayName?: string; email: string }

const router = useRouter()
const auth = useAuthStore()
auth.loadFromStorage()
const { t, locale } = useI18n()

const displayName = computed(() => auth.user?.displayName ?? t('app.user.default'))
const initials = computed(() => getInitials(displayName.value))
const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return t('app.greetTimes.day')
  if (h < 18) return t('app.greetTimes.afternoon')
  return t('app.greetTimes.evening')
})

function toggleLanguage() {
  const next = locale.value === 'pt-BR' ? 'en' : 'pt-BR'
  setLocale(next)
}

const loading = ref(false)
const error = ref<string | null>(null)
const contactsByDomain = ref<Record<string, ContactItem[]>>({})
const selectedDomain = ref<string>('')
const q = ref<string>('')

const domains = computed(() => Object.keys(contactsByDomain.value))

const flattened = computed<ContactItem[]>(() => {
  const arr: ContactItem[] = []
  const keys = selectedDomain.value ? [selectedDomain.value] : domains.value
  for (const d of keys) arr.push(...(contactsByDomain.value[d] || []))
  return arr
})

const filtered = computed<ContactItem[]>(() => {
  const term = q.value.toLowerCase().trim()
  if (!term) return flattened.value
  return flattened.value.filter((c) =>
    (c.displayName || '').toLowerCase().includes(term) ||
    (c.email || '').toLowerCase().includes(term)
  )
})

function getInitials(name?: string) {
  const s = (name || '').trim()
  if (!s) return '??'
  const parts = s.split(/\s+/).slice(0, 2)
  return parts.map(p => p[0]?.toUpperCase() || '').join('')
}

function persistFromHash() {
  const hash = window.location.hash || ''
  const m = hash.match(/^#session=([^&]+)/)
  if (!m) return
  try {
    const b64 = decodeURIComponent(m[1]!)
    let base = b64.replace(/-/g, '+').replace(/_/g, '/')
    while (base.length % 4 !== 0) base += '='
    const json = atob(base)
    const data = JSON.parse(json)
    localStorage.setItem('auth_session_v1', JSON.stringify({
      msAccessToken: data.ms_access_token,
      tokenMeta: data.token,
      user: data.me,
    }))
    localStorage.setItem('ms_access_token', data.ms_access_token)
    localStorage.setItem('ms_user', JSON.stringify(data.me))
    auth.user = data.me
  } catch (e) {
    console.error(e)
  } finally {
    history.replaceState(null, '', window.location.pathname + window.location.search)
  }
}

async function refetch() {
  loading.value = true
  error.value = null
  try {
    const data = await listContacts()
    contactsByDomain.value = data || {}
  } catch (e: any) {
    error.value = e?.message || t('app.contacts.error')
  } finally {
    loading.value = false
  }
}

function openDetails(c: ContactItem) {
  router.push({
    name: 'contact-details',
    params: { id: c.id },
    query: { data: encodeURIComponent(JSON.stringify(c)) },
  })
}

const showFabActions = ref(false)
function toggleFab(force?: boolean) {
  showFabActions.value = typeof force === 'boolean' ? force : !showFabActions.value
}

const composeOpen = ref(false)
const composeTo = ref<string | string[] | undefined>(undefined)
function openCreateManual() {
  showFabActions.value = false
  composeTo.value = ''
  composeOpen.value = true
}

function goToMail() {
  router.push({ name: 'mail' })
}

const aiOpen = ref(false)
function openGemini() {
  showFabActions.value = false
  aiOpen.value = true
}

const loggingOut = ref(false)
async function logout() {
  if (loggingOut.value) return
  loggingOut.value = true
  try {
    await authLogout()
    localStorage.removeItem('auth_session_v1')
    localStorage.removeItem('ms_access_token')
    localStorage.removeItem('ms_user')
    auth.$reset?.()
    ;(auth as any).user = undefined
    router.replace({ path: '/login' })
  } catch (e) {
    console.error('[logout] erro:', e)
    router.replace({ path: '/login' })
  } finally {
    loggingOut.value = false
  }
}

onMounted(async () => {
  persistFromHash()
  await refetch()
})
</script>

<style scoped>
.fab-enter-from,
.fab-leave-to { opacity: 0; transform: translateY(12px); }
.fab-enter-active,
.fab-leave-active { transition: all 160ms ease; }
</style>