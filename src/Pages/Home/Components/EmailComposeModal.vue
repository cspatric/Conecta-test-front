<!-- src/components/EmailComposeModal.vue -->
<template>
  <teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50" @keydown.esc.prevent.stop="onClose">
      <div class="absolute inset-0 bg-black/40" @click="onClose" />

      <div
        class="absolute left-1/2 top-1/2 w-[92vw] max-w-[560px] -translate-x-1/2 -translate-y-1/2
               bg-white rounded-2xl shadow-xl border border-black/5 p-5 sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="email-modal-title"
      >
        <div class="flex items-center justify-between mb-4">
          <h2 id="email-modal-title" class="text-lg font-semibold text-[#111827]">
            Enviar e-mail
          </h2>
          <button
            class="w-9 h-9 grid place-items-center rounded-xl hover:bg-[#F3F4F6] transition"
            aria-label="Fechar"
            @click="onClose"
            :disabled="submitting"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#111827" stroke-width="1.8">
              <path d="M6 6l12 12M18 6L6 18" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>

        <form class="space-y-4" @submit.prevent="handleSubmit">
          <div v-if="serverError" class="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {{ serverError }}
          </div>
          <div v-if="serverSuccess" class="p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
            {{ serverSuccess }}
          </div>

          <div>
            <label class="block text-xs font-medium text-[#6B7280] mb-1">Para</label>
            <input
              ref="firstInputRef"
              v-model.trim="toField"
              type="text"
              placeholder="ex: pessoa@empresa.com, outro@dominio.com"
              class="w-full h-11 rounded-xl border border-[#E5E7EB] bg-white px-3 text-[#374151] text-sm outline-none
                     focus:ring-2 focus:ring-[#5A3EF0]/30 focus:border-[#5A3EF0]"
            />
            <p v-if="errors.to" class="mt-1 text-xs text-red-600">{{ errors.to }}</p>
          </div>

          <div>
            <label class="block text-xs font-medium text-[#6B7280] mb-1">Assunto</label>
            <input
              v-model.trim="subject"
              type="text"
              placeholder="Assunto do e-mail"
              class="w-full h-11 rounded-xl border border-[#E5E7EB] bg-white px-3 text-[#374151] text-sm outline-none
                     focus:ring-2 focus:ring-[#5A3EF0]/30 focus:border-[#5A3EF0]"
            />
            <p v-if="errors.subject" class="mt-1 text-xs text-red-600">{{ errors.subject }}</p>
          </div>

          <div>
            <label class="block text-xs font-medium text-[#6B7280] mb-1">Mensagem</label>
            <textarea
              v-model="body"
              rows="7"
              placeholder="Escreva sua mensagem…"
              class="w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-[#374151] text-sm outline-none
                     focus:ring-2 focus:ring-[#5A3EF0]/30 focus:border-[#5A3EF0] resize-y"
            />
            <p v-if="errors.body" class="mt-1 text-xs text-red-600">{{ errors.body }}</p>
          </div>

          <div class="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              class="h-11 px-4 rounded-xl border border-[#E5E7EB] text-[#111827] hover:bg-[#F3F4F6] transition"
              @click="onClose"
              :disabled="submitting"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="h-11 px-5 rounded-xl bg-[#5235E8] text-white font-medium hover:bg-[#4b2fe2] transition disabled:opacity-60"
              :disabled="submitting"
            >
              <span v-if="!submitting">Enviar</span>
              <span v-else>Enviando…</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import { sendMail } from '../../../services/mail'

// ✅ props
const props = defineProps<{ open: boolean; to?: string | string[] }>()

// ✅ declare os eventos aceitos
const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'close'): void
  (e: 'submit', payload: { to: string[]; subject: string; body: string }): void
}>()

// (opcional) se quiser “cair” listeners/attrs no container do modal:
// defineOptions({ inheritAttrs: false })

const firstInputRef = ref<HTMLInputElement | null>(null)
const toField = ref('')
const subject = ref('')
const body = ref('')

const submitting = ref(false)
const errors = ref<{ to?: string; subject?: string; body?: string }>({})
const serverError = ref<string | null>(null)
const serverSuccess = ref<string | null>(null)

watch(
  () => props.open,
  async (v) => {
    if (v) {
      if (Array.isArray(props.to)) toField.value = props.to.join(', ')
      else if (props.to) toField.value = props.to
      await nextTick()
      firstInputRef.value?.focus()
    } else {
      clearForm()
    }
  }
)

function clearForm() {
  subject.value = ''
  body.value = ''
  serverError.value = null
  serverSuccess.value = null
  errors.value = {}
  if (!props.to) toField.value = ''
}

function onClose() {
  if (submitting.value) return
  // ❌ props.open = false
  // ✅ emite para o v-model:open do pai
  emit('update:open', false)
  emit('close')
}

function parseEmails(input: string) {
  return (input || '')
    .split(/[,\s]+/)
    .map((e) => e.trim())
    .filter(Boolean)
}

function isValidEmail(e: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
}

function validate() {
  errors.value = {}
  const emails = parseEmails(toField.value)
  if (!emails.length) errors.value.to = 'Informe pelo menos um destinatário.'
  else if (!emails.every(isValidEmail)) errors.value.to = 'Há e-mail inválido na lista.'
  if (!subject.value.trim()) errors.value.subject = 'Assunto é obrigatório.'
  if (!body.value.trim()) errors.value.body = 'Mensagem é obrigatória.'
  return Object.keys(errors.value).length === 0
}

async function handleSubmit() {
  if (!validate()) return

  submitting.value = true
  serverError.value = null
  serverSuccess.value = null

  const payload = {
    to: parseEmails(toField.value),
    subject: subject.value.trim(),
    body: body.value,
  }

  try {
    await sendMail(payload)
    serverSuccess.value = '✅ E-mail enviado com sucesso!'
    emit('submit', payload) // ✅ opcional, se quiser notificar o pai
    // fecha modal via v-model
    emit('update:open', false)
  } catch (e: any) {
    serverError.value =
      e?.response?.data?.message ||
      e?.response?.data?.error ||
      e?.message ||
      'Falha ao enviar o e-mail.'
  } finally {
    submitting.value = false
  }
}
</script>