<template>
  <teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50" @keydown.esc.prevent.stop="onClose">
      <div class="absolute inset-0 bg-black/40" @click="onClose" />

      <div
        class="absolute left-1/2 top-1/2 w-[92vw] max-w-[560px] -translate-x-1/2 -translate-y-1/2
               bg-white rounded-2xl shadow-xl border border-black/5 p-5 sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
      >
        <div class="flex items-center justify-between mb-4">
          <h2 id="contact-modal-title" class="text-lg font-semibold text-[#111827]">
            {{ $t('app.contacts.newTitle', 'Criar contato') }}
          </h2>
          <button
            class="w-9 h-9 grid place-items-center rounded-xl hover:bg-[#F3F4F6] transition"
            :aria-label="$t('app.actions.close', 'Fechar')"
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

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-[#6B7280] mb-1">
                {{ $t('app.contacts.givenName', 'Nome') }}
              </label>
              <input
                ref="firstInputRef"
                v-model.trim="givenName"
                type="text"
                :placeholder="$t('app.contacts.givenNamePh', 'Ex: Patrick')"
                class="w-full h-11 rounded-xl border border-[#E5E7EB] bg-white px-3 text-[#374151] text-sm outline-none
                       focus:ring-2 focus:ring-[#5A3EF0]/30 focus:border-[#5A3EF0]"
              />
              <p v-if="errors.givenName" class="mt-1 text-xs text-red-600">{{ errors.givenName }}</p>
            </div>

            <div>
              <label class="block text-xs font-medium text-[#6B7280] mb-1">
                {{ $t('app.contacts.surname', 'Sobrenome') }}
              </label>
              <input
                v-model.trim="surname"
                type="text"
                :placeholder="$t('app.contacts.surnamePh', 'Opcional')"
                class="w-full h-11 rounded-xl border border-[#E5E7EB] bg-white px-3 text-[#374151] text-sm outline-none
                       focus:ring-2 focus:ring-[#5A3EF0]/30 focus:border-[#5A3EF0]"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-[#6B7280] mb-1">E-mail</label>
            <input
              v-model.trim="email"
              type="email"
              :placeholder="$t('app.contacts.emailPh', 'ex: pessoa@empresa.com')"
              class="w-full h-11 rounded-xl border border-[#E5E7EB] bg-white px-3 text-[#374151] text-sm outline-none
                     focus:ring-2 focus:ring-[#5A3EF0]/30 focus:border-[#5A3EF0]"
            />
            <p v-if="errors.email" class="mt-1 text-xs text-red-600">{{ errors.email }}</p>
          </div>

          <div>
            <div class="flex items-center justify-between">
              <label class="block text-xs font-medium text-[#6B7280] mb-1">
                {{ $t('app.contacts.phones', 'Telefones') }}
              </label>
              <button
                type="button"
                class="text-xs text-[#5235E8] hover:underline"
                @click="addPhone"
              >
                + {{ $t('app.contacts.addPhone', 'Adicionar telefone') }}
              </button>
            </div>

            <div class="space-y-2">
              <div
                v-for="(p, idx) in phones"
                :key="idx"
                class="flex items-center gap-2"
              >
                <input
                  v-model.trim="phones[idx]"
                  type="text"
                  :placeholder="$t('app.contacts.phonePh', '+55 11 99999-0000')"
                  class="flex-1 h-11 rounded-xl border border-[#E5E7EB] bg-white px-3 text-[#374151] text-sm outline-none
                         focus:ring-2 focus:ring-[#5A3EF0]/30 focus:border-[#5A3EF0]"
                />
                <button
                  type="button"
                  class="w-9 h-9 grid place-items-center rounded-xl border border-[#E5E7EB] hover:bg-[#F3F4F6] transition"
                  :aria-label="$t('app.contacts.removePhone', 'Remover telefone')"
                  @click="removePhone(idx)"
                >
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#111827" stroke-width="1.8">
                    <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </button>
              </div>
            </div>

            <p v-if="errors.businessPhones" class="mt-1 text-xs text-red-600">{{ errors.businessPhones }}</p>
          </div>


          <div class="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              class="h-11 px-4 rounded-xl border border-[#E5E7EB] text-[#111827] hover:bg-[#F3F4F6] transition"
              @click="onClose"
              :disabled="submitting"
            >
              {{ $t('app.actions.cancel', 'Cancelar') }}
            </button>
            <button
              type="submit"
              class="h-11 px-5 rounded-xl bg-[#5235E8] text-white font-medium hover:bg-[#4b2fe2] transition disabled:opacity-60"
              :disabled="submitting"
            >
              <span v-if="!submitting">{{ $t('app.contacts.create', 'Criar contato') }}</span>
              <span v-else>{{ $t('app.contacts.creating', 'Criando…') }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { createContact, type CreateContactPayload } from '../../../services/contacts'

const { t } = useI18n()

const props = defineProps<{
  open: boolean
  preset?: Partial<CreateContactPayload>
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'close'): void
  (e: 'created', contact: any): void
}>()

const firstInputRef = ref<HTMLInputElement | null>(null)

const givenName = ref<string>('')
const surname = ref<string>('')
const email = ref<string>('')
const phones = ref<string[]>([])
const extraRaw = ref<string>('')

const submitting = ref(false)
const errors = ref<{ givenName?: string; email?: string; businessPhones?: string; extra?: string }>({})
const serverError = ref<string | null>(null)
const serverSuccess = ref<string | null>(null)

watch(
  () => props.open,
  async (v) => {
    if (v) {
      hydrateFromPreset()
      await nextTick()
      firstInputRef.value?.focus()
    } else {
      clearForm()
    }
  },
  { immediate: true }
)

function hydrateFromPreset() {
  const p = props.preset || {}
  givenName.value = p.givenName ?? ''
  surname.value = (p.surname ?? '') as string
  email.value = (p.email ?? '') as string
  phones.value = Array.isArray(p.businessPhones) ? [...p.businessPhones] : []
  extraRaw.value = p.extra ? JSON.stringify(p.extra, null, 2) : ''
  serverError.value = null
  serverSuccess.value = null
  errors.value = {}
}

function clearForm() {
  givenName.value = ''
  surname.value = ''
  email.value = ''
  phones.value = []
  extraRaw.value = ''
  serverError.value = null
  serverSuccess.value = null
  errors.value = {}
}

function onClose() {
  if (submitting.value) return
  emit('update:open', false)
  emit('close')
}

function isValidEmail(e: string) {
  if (!e) return true 
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
}

function validate() {
  errors.value = {}
  if (!givenName.value.trim()) {
    errors.value.givenName = t('app.contacts.errors.givenRequired', 'Nome é obrigatório.')
  }
  if (email.value && !isValidEmail(email.value.trim())) {
    errors.value.email = t('app.contacts.errors.emailInvalid', 'E-mail inválido.')
  }
  const normalized = phones.value.map(p => p.trim()).filter(Boolean)
  if (phones.value.length && normalized.length === 0) {
    errors.value.businessPhones = t('app.contacts.errors.phoneInvalid', 'Informe ao menos um telefone válido ou remova os campos vazios.')
  }
  return Object.keys(errors.value).length === 0
}

function parseExtra(): Record<string, any> | undefined {
  const raw = extraRaw.value.trim()
  if (!raw) return undefined
  try {
    return JSON.parse(raw)
  } catch (e) {
    errors.value.extra = t('app.contacts.errors.extraInvalid', 'JSON inválido em Extras.')
    return undefined
  }
}

function addPhone() {
  phones.value.push('')
}

function removePhone(idx: number) {
  phones.value.splice(idx, 1)
}

async function handleSubmit() {
  if (!validate()) return
  const extra = parseExtra()
  if (errors.value.extra) return

  submitting.value = true
  serverError.value = null
  serverSuccess.value = null

  const payload: CreateContactPayload = {
    givenName: givenName.value.trim(),
    surname: surname.value?.trim() || undefined,
    email: email.value?.trim() || undefined,
    businessPhones: phones.value.map(p => p.trim()).filter(Boolean),
    extra
  }

  try {
    const created = await createContact(payload)
    serverSuccess.value = t('app.contacts.createdOk', '✅ Contato criado com sucesso!')
    emit('created', created)
    emit('update:open', false)
  } catch (e: any) {
    serverError.value =
      e?.response?.data?.message ||
      e?.response?.data?.error ||
      e?.message ||
      t('app.contacts.errors.fail', 'Falha ao criar o contato.')
  } finally {
    submitting.value = false
  }
}
</script>