<template>
  <teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50">
      <div class="absolute inset-0 bg-black/40" @click="onClose" />
      <div
        class="absolute left-1/2 top-1/2 w-[92vw] max-w-[720px] -translate-x-1/2 -translate-y-1/2
               bg-white rounded-2xl shadow-xl border border-black/5 flex flex-col h-[80vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-chat-title"
      >
        <header class="px-5 sm:px-6 py-4 border-b border-black/5 flex items-center justify-between">
          <h2 id="ai-chat-title" class="text-lg font-semibold text-[#111827]">
            {{ $t('app.ai.title', 'Assistente IA') }}
          </h2>
          <button
            class="w-9 h-9 grid place-items-center rounded-xl hover:bg-[#F3F4F6] transition"
            :aria-label="$t('app.actions.close', 'Fechar')"
            @click="onClose"
            :disabled="sending"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#111827" stroke-width="1.8">
              <path d="M6 6l12 12M18 6L6 18" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </header>

        <div class="flex-1 overflow-y-auto px-5 sm:px-6 py-4 space-y-4 bg-[#F9FAFB]">
          <div v-if="error" class="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {{ error }}
          </div>

          <template v-for="m in messages" :key="m.id">
            <div
              v-if="m.kind === 'bubble'"
              class="max-w-[85%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap"
              :class="m.role === 'user'
                ? 'ml-auto bg-[#5235E8] text-white rounded-br-md'
                : 'mr-auto bg-white border border-[#E5E7EB] text-[#111827] rounded-bl-md'"
            >
              <div v-if="m.role !== 'user'" class="text-[11px] uppercase tracking-wide text-[#6B7280] mb-1">
                {{ $t('app.ai.assistant', 'IA') }}
              </div>
              <div v-else class="text-[11px] uppercase tracking-wide text-white/80 mb-1">
                {{ $t('app.ai.you', 'Você') }}
              </div>
              <div>{{ m.content }}</div>
            </div>

            <div v-else-if="m.kind === 'contacts_list'" class="mr-auto max-w-[95%]">
              <div class="text-[11px] uppercase tracking-wide text-[#6B7280] mb-2">
                {{ $t('app.ai.contacts', 'Contatos') }}
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  v-for="c in m.contacts"
                  :key="c.id"
                  class="bg-white border border-[#E5E7EB] rounded-xl p-3"
                >
                  <div class="font-medium text-[#111827]">{{ c.displayName || '—' }}</div>
                  <div class="text-xs text-[#6B7280]">
                    <span v-if="c.companyName">{{ c.companyName }}</span>
                    <span v-if="c.jobTitle"> • {{ c.jobTitle }}</span>
                  </div>
                  <div class="mt-2 space-y-1 text-sm">
                    <div v-if="c.emails?.length">📧 {{ c.emails[0] }}</div>
                    <div v-if="c.mobilePhone">📱 {{ c.mobilePhone }}</div>
                    <div v-else-if="c.businessPhones?.length">☎️ {{ c.businessPhones[0] }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else-if="m.kind === 'email_list'" class="mr-auto max-w-[95%]">
              <div class="text-[11px] uppercase tracking-wide text-[#6B7280] mb-2">
                {{ $t('app.ai.emails', 'E-mails') }}
              </div>
              <div class="grid grid-cols-1 gap-3">
                <div
                  v-for="em in m.emails"
                  :key="em.id"
                  class="bg-white border border-[#E5E7EB] rounded-xl p-3"
                >
                  <div class="flex items-start justify-between gap-3">
                    <div>
                      <div class="font-medium text-[#111827] line-clamp-1">
                        {{ em.subject || '(sem assunto)' }}
                      </div>
                      <div class="text-xs text-[#6B7280]">
                        {{ em.fromName || em.fromEmail || '—' }}
                        <span class="mx-1">•</span>
                        {{ tryFormatDate(em.receivedDateTime) }}
                      </div>
                    </div>
                    <a
                      v-if="em.webLink"
                      :href="em.webLink"
                      target="_blank"
                      rel="noopener"
                      class="text-xs text-[#5235E8] hover:underline shrink-0"
                    >
                      {{ $t('app.ai.open', 'Abrir') }}
                    </a>
                  </div>
                  <div class="mt-2 text-sm text-[#111827]/90 line-clamp-2">
                    {{ em.bodyPreview }}
                  </div>
                </div>
              </div>
            </div>
          </template>

          <div v-if="sending" class="mr-auto max-w-[85%]">
            <div class="inline-flex items-center gap-2 rounded-2xl bg-white border border-[#E5E7EB] px-4 py-2">
              <span class="w-2.5 h-2.5 rounded-full animate-pulse bg-[#9CA3AF]"></span>
              <span class="w-2.5 h-2.5 rounded-full animate-pulse bg-[#9CA3AF] [animation-delay:120ms]"></span>
              <span class="w-2.5 h-2.5 rounded-full animate-pulse bg-[#9CA3AF] [animation-delay:240ms]"></span>
            </div>
          </div>
        </div>

        <form class="p-3 sm:p-4 border-t border-black/5" @submit.prevent="send">
          <div class="flex items-end gap-3">
            <textarea
              ref="inputRef"
              v-model="input"
              rows="1"
              :placeholder="$t('app.ai.type', 'Digite sua mensagem…')"
              class="flex-1 rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#111827] outline-none
                     focus:ring-2 focus:ring-[#5A3EF0]/30 focus:border-[#5A3EF0] resize-none"
              @keydown.enter.exact.prevent="send"
            />
            <button
              type="submit"
              class="h-11 px-5 rounded-xl bg-[#5235E8] text-white font-medium hover:bg-[#4b2fe2] transition disabled:opacity-60"
              :disabled="sending || !input.trim()"
            >
              {{ $t('app.actions.send', 'Enviar') }}
            </button>
          </div>
          <div class="mt-2 flex items-center justify-between">
            <div class="text-xs text-[#6B7280]">
              {{ $t('app.ai.hint', 'Use linguagem natural para acionar o agente.') }}
            </div>
            <button
              v-if="canClear"
              type="button"
              class="text-xs text-[#6B7280] hover:text-[#111827]"
              @click="clearChat"
              :disabled="sending"
            >
              {{ $t('app.ai.clear', 'Limpar conversa') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue'
import { runAI, type AiRequest } from '../../../services/ai'
import { useI18n } from 'vue-i18n'

type MessageKind = 'bubble' | 'contacts_list' | 'email_list'
type Role = 'user' | 'assistant'

type Contact = {
  id: string
  displayName?: string | null
  companyName?: string | null
  jobTitle?: string | null
  emails?: string[] | null
  businessPhones?: string[] | null
  mobilePhone?: string | null
}

type EmailListItem = {
  id: string
  subject?: string | null
  fromName?: string | null
  fromEmail?: string | null
  receivedDateTime?: string | null
  isRead?: boolean | null
  bodyPreview?: string | null
  webLink?: string | null
}

type Message =
  | { id: string; role: Role; kind: 'bubble'; content: string }
  | { id: string; role: 'assistant'; kind: 'contacts_list'; contacts: Contact[] }
  | { id: string; role: 'assistant'; kind: 'email_list'; emails: EmailListItem[] }

type Plan = {
  action: string
  params: Record<string, any>
  reason: string
  confidence: number
  message: string
  message_type:
    | 'small_talk' | 'text'
    | 'contacts_list' | 'contact_detail'
    | 'email_list' | 'email_detail' | 'email_sent'
    | 'system' | 'error'
}

type AiResponse = {
  plan: Plan
  result?: any
  error?: string
} | string

const { t } = useI18n()

const props = defineProps<{
  open: boolean
  systemGoal?: string
  systemContext?: Record<string, any>
  systemConstraints?: string[]
  tools?: string[]
}>()

const emit = defineEmits<{ (e: 'close'): void }>()

const messages = ref<Message[]>([])
const input = ref('')
const sending = ref(false)
const error = ref<string | null>(null)
const inputRef = ref<HTMLTextAreaElement | null>(null)

watch(
  () => props.open,
  async (v) => {
    if (v) {
      await nextTick()
      inputRef.value?.focus()
    } else {
      reset()
    }
  }
)

const canClear = computed(() => messages.value.length > 0)

function onClose() {
  if (!sending.value) emit('close')
}

function reset() {
  messages.value = []
  input.value = ''
  sending.value = false
  error.value = null
}

function clearChat() {
  if (sending.value) return
  reset()
  nextTick(() => inputRef.value?.focus())
}

const uid = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`

function tryFormatDate(s?: string | null) {
  if (!s) return '—'
  try {
    return new Date(s).toLocaleString()
  } catch {
    return s
  }
}

function normalizeEmailList(result: any): EmailListItem[] {
  if (!result) return []
  const arr = Array.isArray(result.items) ? result.items
            : Array.isArray(result.value) ? result.value
            : []
  return arr.map((m: any) => ({
    id: m.id,
    subject: m.subject ?? null,
    fromName: m.from?.emailAddress?.name ?? m.fromName ?? null,
    fromEmail: m.from?.emailAddress?.address ?? m.fromEmail ?? null,
    receivedDateTime: m.receivedDateTime ?? null,
    isRead: m.isRead ?? null,
    bodyPreview: m.bodyPreview ?? null,
    webLink: m.webLink ?? null
  }))
}

async function send() {
  const content = input.value.trim()
  if (!content || sending.value) return
  error.value = null

  messages.value.push({ id: uid(), role: 'user', kind: 'bubble', content })
  input.value = ''
  await nextTick()
  inputRef.value?.focus()

  sending.value = true
  try {
    const payload: AiRequest = {
      prompt: content,
      goal: props.systemGoal,
      context: props.systemContext,
      constraints: props.systemConstraints,
      tools: props.tools,
    }

    const data = await runAI(payload)

    if (typeof data === 'string') {
      messages.value.push({ id: uid(), role: 'assistant', kind: 'bubble', content: data })
      return
    }

    const plan = data.plan as Plan
    const respMessage = plan?.message || t('app.ai.ok', 'OK.')
    messages.value.push({ id: uid(), role: 'assistant', kind: 'bubble', content: respMessage })

    if ((plan?.message_type === 'contacts_list' || plan?.action === 'list_contacts')
        && data.result?.items?.length) {
      messages.value.push({
        id: uid(),
        role: 'assistant',
        kind: 'contacts_list',
        contacts: data.result.items
      })
    }

    if ((plan?.message_type === 'email_list' || plan?.action === 'list_inbox' || plan?.action === 'list_sent')) {
      const emails = normalizeEmailList(data.result)
      if (emails.length) {
        messages.value.push({
          id: uid(),
          role: 'assistant',
          kind: 'email_list',
          emails
        })
      }
    }

    if (data.error && plan?.action === 'chat_reply') {
    } else if (data.error) {
      error.value = data.error
    }

  } catch (e: any) {
    error.value =
      e?.response?.data?.message ||
      e?.message ||
      t('app.ai.errors.fail', 'Falha ao consultar o agente.')
    messages.value.push({
      id: uid(),
      role: 'assistant',
      kind: 'bubble',
      content: t('app.ai.cantNow', 'Não consegui processar isso agora.')
    })
  } finally {
    sending.value = false
  }
}
</script>