<!-- src/Pages/Mail/MailIndex.vue -->
<template>
  <div class="min-h-screen bg-[#F3F6FB]">
    <header class="bg-[#5A3EF0] pt-10 pb-16">
      <div class="max-w-[840px] mx-auto px-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-full overflow-hidden bg-white/20 grid place-items-center">
              <div class="w-9 h-9 rounded-full bg-white/20 grid place-items-center">
                <span class="text-white/90 text-sm font-semibold">{{ initials }}</span>
              </div>
            </div>
            <div class="text-white">
              <div class="text-sm/5 opacity-90">{{ $t('app.greetPrefix') }} {{ $t('app.greetTimes.' + greetKey) }},</div>
              <div class="text-xl font-semibold -mt-0.5">{{ displayName }}</div>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              class="w-10 h-10 rounded-xl bg-white/15 hover:bg-white/20 transition grid place-items-center"
              :aria-label="$t('app.actions.home')"
              :title="$t('app.actions.home')"
              @click="goHome"
            >
              <svg viewBox="0 0 24 24" class="w-6 h-6" fill="none" stroke="white" stroke-width="1.8">
                <path d="M3 10.5 12 3l9 7.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M5 10v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-9" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9 21v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>

            <!-- Toggle language -->
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

    <main class="-mt-8 max-w-[840px] mx-auto px-4 pb-28">
      <div class="bg-white rounded-2xl shadow-sm border border-black/5 p-5 sm:p-6">
        <div class="flex flex-col sm:flex-row sm:items-center gap-3">
          <div class="inline-flex rounded-xl border border-[#E5E7EB] p-1 bg-white">
            <button
              type="button"
              class="px-4 h-10 rounded-lg text-sm font-medium"
              :class="tab === 'inbox' ? 'bg-[#5235E8] text-white' : 'text-[#374151] hover:bg-[#F3F4F6]'"
              @click="switchTab('inbox')"
            >
              {{ $t('app.mail.tabs.inbox') }}
            </button>
            <button
              type="button"
              class="px-4 h-10 rounded-lg text-sm font-medium"
              :class="tab === 'sent' ? 'bg-[#5235E8] text-white' : 'text-[#374151] hover:bg-[#F3F4F6]'"
              @click="switchTab('sent')"
            >
              {{ $t('app.mail.tabs.sent') }}
            </button>
          </div>

          <div class="relative flex-1">
            <svg
              class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]"
              viewBox="0 0 24 24" fill="none" stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-4.35-4.35M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" />
            </svg>
            <input
              v-model.trim="q"
              type="text"
              :placeholder="$t('app.search.mailPlaceholder')"
              class="w-full h-11 rounded-xl border border-[#E5E7EB] bg-white pl-10 pr-4 text-sm text-[#374151] outline-none focus:ring-2 focus:ring-[#5A3EF0]/30 focus:border-[#5A3EF0]"
              @keydown.enter.prevent="refetch()"
            />
          </div>
        </div>
      </div>

      <div v-if="loading" class="mt-5 bg-white rounded-2xl shadow-sm border border-black/5 p-5">
        {{ $t('app.mail.loading', { where: $t(tab === 'inbox' ? 'app.mail.tabs.inbox' : 'app.mail.tabs.sent') }) }}
      </div>
      <div v-else-if="error" class="mt-5 bg-white rounded-2xl shadow-sm border border-red-200 p-5 text-red-600">
        {{ error }}
      </div>

      <div v-else class="mt-5 bg-white rounded-2xl shadow-sm border border-black/5">
        <div class="px-5 py-3 text-[#4B5563] text-[15px] font-medium grid grid-cols-[auto_1fr_1fr_auto_auto] items-center gap-3">
          <span></span>
          <span>{{ $t('app.mail.headerSubject') }}</span>
          <span>{{ tab === 'inbox' ? $t('app.mail.headerFrom') : $t('app.mail.headerTo') }}</span>
          <span class="text-right">{{ $t('app.mail.headerDate') }}</span>
          <span class="text-right pr-1">{{ $t('app.mail.headerAction') }}</span>
        </div>
      </div>

      <div v-if="!loading && !error" class="mt-3 bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
        <ul role="list" class="divide-y divide-[#E5E7EB]/70">
          <li
            v-for="m in filtered"
            :key="m.id"
            class="px-5 py-3"
          >
            <div class="grid grid-cols-[auto_1fr_1fr_auto_auto] items-center gap-3">
              <span class="w-8 h-8 rounded-full bg-[#C9D7EA] grid place-items-center text-[#1F2937] text-xs font-semibold">
                {{ getInitials(tab === 'inbox' ? (m.fromName || m.fromEmail) : (m.toName || m.toEmail)) }}
              </span>

              <div class="min-w-0">
                <div class="text-[#111827] truncate" :class="!m.read ? 'font-semibold' : 'font-medium'">
                  {{ m.subject || '(' + $t('app.compose.subject') + '?)' }}
                </div>
                <div class="text-[#6B7280] text-xs truncate">
                  {{ m.snippet || '' }}
                </div>
              </div>

              <div class="min-w-0">
                <div class="text-[#374151] truncate">
                  <template v-if="tab === 'inbox'">
                    {{ m.fromName || m.fromEmail }}
                  </template>
                  <template v-else>
                    {{ m.toName || m.toEmail }}
                  </template>
                </div>
                <div class="text-[#9CA3AF] text-xs truncate">
                  <template v-if="tab === 'inbox'">
                    {{ m.fromEmail }}
                  </template>
                  <template v-else>
                    {{ m.toEmail }}
                  </template>
                </div>
              </div>

              <div class="ml-auto text-right text-[#6B7280] text-sm whitespace-nowrap">
                {{ formatDateTime(m.date) }}
              </div>

              <div class="ml-auto">
                <button
                  type="button"
                  class="w-10 h-10 grid place-items-center rounded-xl border border-[#E5E7EB] hover:bg-[#F3F4F6] transition"
                  :aria-label="$t('app.actions.details')"
                  :title="$t('app.actions.details')"
                  @click="toggleExpand(m.id)"
                >
                  <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="#5235E8" stroke-width="1.8">
                    <circle cx="12" cy="12" r="10" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 8h.01M12 12v4" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>

            <transition name="fade">
              <div v-if="expandedId === m.id" class="mt-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4">
                <div class="text-[#374151] text-sm whitespace-pre-wrap break-words">
                  <div v-if="m.preview || m.snippet">{{ m.preview || m.snippet }}</div>
                  <div v-else-if="loadingBodyId === m.id">{{ $t('app.actions.loading') }}…</div>
                  <div v-else v-html="m.htmlBody || safePlainBody(m.plainBody)"></div>
                </div>
                <div class="pt-3 flex items-center gap-2 justify-end">
                  <button
                    class="h-10 px-4 rounded-xl border border-[#E5E7EB] text-[#111827] hover:bg-[#F3F4F6] transition"
                    @click="reply(m)"
                    :title="$t('app.actions.reply')"
                  >
                    {{ $t('app.actions.reply') }}
                  </button>
                  <button
                    class="h-10 px-4 rounded-xl border border-[#E5E7EB] text-[#111827] hover:bg-[#F3F4F6] transition"
                    @click="forward(m)"
                    :title="$t('app.actions.forward')"
                  >
                    {{ $t('app.actions.forward') }}
                  </button>
                </div>
              </div>
            </transition>
          </li>

          <li v-if="filtered.length === 0" class="px-5 py-6 text-[#6B7280]">
            {{ $t('app.mail.none') }}
          </li>
        </ul>
      </div>
    </main>

    <EmailComposeModal
      v-model:open="composeOpen"
      :to="composeTo"
      @submit="afterComposeSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { authLogout } from '../../services/auth'
import EmailComposeModal from '../Home/Components/EmailComposeModal.vue'
import { useI18n } from 'vue-i18n'
import { setLocale } from '../../i18n'

import {
  listInbox,
  listSent,
  getMessageDetails,
  type MailMessage,
} from '../../services/mail'

type Tab = 'inbox' | 'sent'

const { t, locale } = useI18n()

function toggleLanguage() {
  const next = locale.value === 'pt-BR' ? 'en' : 'pt-BR'
  setLocale(next)
}

const router = useRouter()
const auth = useAuthStore()
auth.loadFromStorage()

const displayName = computed(() => auth.user?.displayName ?? t('app.user.default', 'Usuário'))
const initials = computed(() => getInitials(displayName.value))
const greetKey = computed<'day' | 'afternoon' | 'evening'>(() => {
  const h = new Date().getHours()
  if (h < 12) return 'day'
  if (h < 18) return 'afternoon'
  return 'evening'
})

const tab = ref<Tab>('inbox')
const q = ref('')
const loading = ref(false)
const error = ref<string | null>(null)
const rawItems = ref<MailMessage[]>([])
const expandedId = ref<string | null>(null)
const loadingBodyId = ref<string | null>(null)

const composeOpen = ref(false)
const composeTo = ref<string | string[] | undefined>('')

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

function getInitials(name?: string) {
  const s = (name || '').trim()
  if (!s) return '??'
  const parts = s.split(/\s+/).slice(0, 2)
  return parts.map(p => p[0]?.toUpperCase() || '').join('')
}

function formatDateTime(d?: string | Date | number | null) {
  if (!d) return ''
  const dt = new Date(d)
  return dt.toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

type MailVM = {
  id: string
  subject?: string
  snippet?: string
  preview?: string
  read?: boolean
  date?: string
  fromName?: string
  fromEmail?: string
  toName?: string
  toEmail?: string
  htmlBody?: string
  plainBody?: string
}

const items = computed<MailVM[]>(() => rawItems.value.map((m) => {
  const from = m.from?.emailAddress
  const to0 = m.toRecipients?.[0]?.emailAddress
  return {
    id: m.id,
    subject: m.subject || '',
    snippet: m.bodyPreview || '',
    preview: undefined,
    read: !!m.isRead,
    date: (tab.value === 'inbox' ? m.receivedDateTime : m.sentDateTime) || m.receivedDateTime || m.sentDateTime,
    fromName: from?.name,
    fromEmail: from?.address,
    toName: to0?.name,
    toEmail: to0?.address,
    htmlBody: undefined,
    plainBody: undefined,
  }
}))

const itemsWithBodies = computed<MailVM[]>(() => {
  return items.value.map(vm => {
    const raw = rawItems.value.find(r => r.id === vm.id) as any
    return {
      ...vm,
      htmlBody: raw?.__htmlBody,
      plainBody: raw?.__plainBody,
    }
  })
})

const filtered = computed<MailVM[]>(() => {
  const list = itemsWithBodies.value
  const term = q.value.toLowerCase().trim()
  if (!term) return list
  return list.filter(i => {
    const hay = [
      i.subject, i.snippet, i.preview,
      i.fromName, i.fromEmail,
      i.toName, i.toEmail
    ].filter(Boolean).join(' ').toLowerCase()
    return hay.includes(term)
  })
})

async function refetch() {
  loading.value = true
  error.value = null
  expandedId.value = null
  try {
    const select = [
      'id','subject','bodyPreview','receivedDateTime','sentDateTime','isRead',
      'from','toRecipients'
    ].join(',')

    if (tab.value === 'inbox') {
      const res = await listInbox(50, select)
      rawItems.value = res?.value ?? []
    } else {
      const res = await listSent(50, select)
      rawItems.value = res?.value ?? []
    }
  } catch (e: any) {
    console.error(e)
    error.value = e?.message || t('app.mail.error', 'Erro ao carregar e-mails')
  } finally {
    loading.value = false
  }
}

function switchTab(t: Tab) {
  if (tab.value === t) return
  tab.value = t
  refetch()
}

async function toggleExpand(id: string) {
  expandedId.value = expandedId.value === id ? null : id
  if (expandedId.value === id) {
    const existing = itemsWithBodies.value.find(i => i.id === id)
    if (existing?.htmlBody || existing?.plainBody) return
    try {
      loadingBodyId.value = id
      const details = await getMessageDetails(id, true)
      const contentType = details.body?.contentType || 'Text'
      const content = details.body?.content || ''
      const rawIdx = rawItems.value.findIndex(r => r.id === id)
      if (rawIdx >= 0) {
        // @ts-expect-error aux fields
        rawItems.value[rawIdx].__htmlBody = contentType === 'HTML' ? content : undefined
        // @ts-expect-error
        rawItems.value[rawIdx].__plainBody = contentType !== 'HTML' ? content : undefined
      }
    } catch (e) {
      console.error('[getMessageDetails] erro:', e)
    } finally {
      loadingBodyId.value = null
    }
  }
}

function safePlainBody(s?: string) {
  return (s || '').replace(/[<>&]/g, (ch) => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[ch] as string))
}

function openCompose(to?: string) {
  composeTo.value = to || ''
  composeOpen.value = true
}

function reply(m: MailVM) {
  const to = tab.value === 'inbox' ? (m.fromEmail || '') : (m.toEmail || '')
  openCompose(to)
}

function forward(_m: MailVM) {
  openCompose('')
}

function afterComposeSubmit() {
  if (tab.value === 'sent') refetch()
}

function goHome() {
  router.push({ name: 'home' })
}

onMounted(refetch)
watch(q, (v) => { if (!v) refetch() })
</script>

<style scoped>
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-4px); }
.fade-enter-active, .fade-leave-active { transition: all 140ms ease; }
</style>