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
          <h2 id="ai-chat-title" class="text-lg font-semibold text-[#111827]">Assistente IA</h2>
          <button
            class="w-9 h-9 grid place-items-center rounded-xl hover:bg-[#F3F4F6] transition"
            aria-label="Fechar"
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

          <template v-for="(m, idx) in messages" :key="idx">
            <div
              class="max-w-[85%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap"
              :class="m.role === 'user'
                ? 'ml-auto bg-[#5235E8] text-white rounded-br-md'
                : 'mr-auto bg-white border border-[#E5E7EB] text-[#111827] rounded-bl-md'"
            >
              <div v-if="m.role !== 'user'" class="text-[11px] uppercase tracking-wide text-[#6B7280] mb-1">IA</div>
              <div v-if="m.role === 'user'" class="text-[11px] uppercase tracking-wide text-white/80 mb-1">Você</div>
              <div>{{ m.content }}</div>
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
              placeholder="Digite sua mensagem…"
              class="flex-1 rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#111827] outline-none
                     focus:ring-2 focus:ring-[#5A3EF0]/30 focus:border-[#5A3EF0] resize-none"
              @keydown.enter.exact.prevent="send"
            />
            <button
              type="submit"
              class="h-11 px-5 rounded-xl bg-[#5235E8] text-white font-medium hover:bg-[#4b2fe2] transition disabled:opacity-60"
              :disabled="sending || !input.trim()"
            >
              Enviar
            </button>
          </div>
          <div class="mt-2 flex items-center justify-between">
            <div class="text-xs text-[#6B7280]">Use linguagem natural para acionar o agente.</div>
            <button
              v-if="canClear"
              type="button"
              class="text-xs text-[#6B7280] hover:text-[#111827]"
              @click="clearChat"
              :disabled="sending"
            >
              Limpar conversa
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

type Message = { role: 'user' | 'assistant'; content: string }

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

async function send() {
  const content = input.value.trim()
  if (!content || sending.value) return
  error.value = null

  messages.value.push({ role: 'user', content })
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
    const reply = typeof data === 'string'
      ? data
      : data?.message || data?.reply || JSON.stringify(data, null, 2)
    messages.value.push({ role: 'assistant', content: reply || 'OK.' })
  } catch (e: any) {
    error.value = e?.response?.data?.message || e?.message || 'Falha ao consultar o agente.'
    messages.value.push({ role: 'assistant', content: 'Não consegui processar isso agora.' })
  } finally {
    sending.value = false
  }
}
</script>