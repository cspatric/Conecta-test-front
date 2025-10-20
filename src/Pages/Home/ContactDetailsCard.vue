<template>
  <div class="min-h-screen bg-[#F3F6FB]">
    <header class="bg-[#5A3EF0] pt-10 pb-16">
      <div class="max-w-[640px] mx-auto px-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button
              type="button"
              @click="goBack"
              class="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 transition grid place-items-center"
              :aria-label="$t('app.actions.back', 'Voltar')"
              :title="$t('app.actions.back', 'Voltar')"
            >
              <svg viewBox="0 0 24 24" class="w-6 h-6" fill="none" stroke="white" stroke-width="2">
                <path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>

            <div class="text-white">
              <div class="text-sm/5 opacity-90">{{ $t('app.contact.title', 'Contato') }}</div>
              <div class="text-xl font-semibold -mt-0.5">
                {{ contact?.displayName || '—' }}
              </div>
              <div v-if="loading" class="text-white/80 text-xs mt-0.5">{{ $t('app.loading', 'carregando…') }}</div>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              v-if="primaryEmail"
              type="button"
              class="w-10 h-10 rounded-xl bg-white/15 hover:bg-white/20 transition grid place-items-center"
              :aria-label="$t('app.actions.email', 'Enviar email')"
              :title="$t('app.actions.email', 'Enviar email')"
              @click="openCompose(primaryEmail)"
            >
              <svg viewBox="0 0 24 24" class="w-6 h-6" fill="none" stroke="white" stroke-width="1.8">
                <path d="M4 6h16v12H4z" />
                <path d="M22 6l-10 7L2 6" />
              </svg>
            </button>

            <button
              type="button"
              class="w-10 h-10 rounded-xl bg-white/15 hover:bg-white/20 transition grid place-items-center text-white text-sm font-semibold"
              :aria-label="$t('app.actions.language', 'Idioma')"
              :title="$t('app.actions.language', 'Idioma')"
              @click="toggleLanguage"
            >
              {{ locale === 'pt-BR' ? 'EN' : 'PT' }}
            </button>

            <a
              v-if="primaryPhone"
              :href="`tel:${primaryPhone}`"
              class="w-10 h-10 rounded-xl bg-white/15 hover:bg-white/20 transition grid place-items-center"
              :aria-label="$t('app.actions.call', 'Ligar')"
              :title="$t('app.actions.call', 'Ligar')"
            >
              <svg viewBox="0 0 24 24" class="w-6 h-6" fill="none" stroke="white" stroke-width="1.8">
                <path
                  d="M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 3.09 5.18 2 2 0 0 1 5.11 3h3a2 2 0 0 1 2 1.72c.12.9.33 1.77.63 2.6a2 2 0 0 1-.45 2.11L9.09 10.91a16 16 0 0 0 4 4l1.48-1.2a2 2 0 0 1 2.11-.45c.83.3 1.7.51 2.6.63A2 2 0 0 1 22 16.92z"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </header>

    <main class="-mt-8 max-w-[640px] mx-auto px-4 pb-24">
      <div class="bg-white rounded-2xl shadow-sm border border-black/5 p-6 space-y-6">
        <div v-if="error" class="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
          {{ error }}
        </div>

        <template v-else>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-1">
              <div class="text-xs uppercase tracking-wide text-[#6B7280]">{{ $t('app.contact.name', 'Nome') }}</div>
              <div class="text-[#111827] font-medium">{{ contact?.displayName || '—' }}</div>
            </div>
            <div class="space-y-1">
              <div class="text-xs uppercase tracking-wide text-[#6B7280]">{{ $t('app.contact.company', 'Empresa') }}</div>
              <div class="text-[#111827] font-medium">{{ contact?.companyName || '—' }}</div>
            </div>
            <div class="space-y-1">
              <div class="text-xs uppercase tracking-wide text-[#6B7280]">{{ $t('app.contact.titleLabel', 'Cargo') }}</div>
              <div class="text-[#111827] font-medium">{{ contact?.jobTitle || '—' }}</div>
            </div>
            <div class="space-y-1">
              <div class="text-xs uppercase tracking-wide text-[#6B7280]">{{ $t('app.contact.department', 'Departamento') }}</div>
              <div class="text-[#111827] font-medium">{{ contact?.department || '—' }}</div>
            </div>
            <div class="space-y-1">
              <div class="text-xs uppercase tracking-wide text-[#6B7280]">{{ $t('app.contact.location', 'Local') }}</div>
              <div class="text-[#111827] font-medium">{{ contact?.officeLocation || '—' }}</div>
            </div>
            <div class="space-y-1">
              <div class="text-xs uppercase tracking-wide text-[#6B7280]">{{ $t('app.contact.birthday', 'Aniversário') }}</div>
              <div class="text-[#111827] font-medium">{{ birthdayLabel }}</div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-3">
              <div class="text-sm font-semibold text-[#111827]">{{ $t('app.contact.emails', 'Emails') }}</div>
              <ul class="space-y-2">
                <li v-for="e in emails" :key="e.address" class="flex items-center justify-between">
                  <a :href="`mailto:${e.address}`" class="text-[#374151] hover:text-[#5235E8] truncate">{{ e.address }}</a>
                  <button
                    type="button"
                    class="ml-3 text-xs px-2 py-1 rounded-lg border border-[#E5E7EB] hover:bg-[#F3F4F6]"
                    @click="copy(e.address)"
                  >
                    {{ $t('app.actions.copy', 'copiar') }}
                  </button>
                </li>
                <li v-if="emails.length === 0" class="text-[#6B7280]">—</li>
              </ul>
            </div>

            <div class="space-y-3">
              <div class="text-sm font-semibold text-[#111827]">{{ $t('app.contact.phones', 'Telefones') }}</div>
              <ul class="space-y-2">
                <li v-for="p in phones" :key="p.value" class="flex items-center justify-between">
                  <a :href="`tel:${p.value}`" class="text-[#374151] hover:text-[#5235E8] truncate">{{ p.label }}</a>
                  <button
                    type="button"
                    class="ml-3 text-xs px-2 py-1 rounded-lg border border-[#E5E7EB] hover:bg-[#F3F4F6]"
                    @click="copy(p.value)"
                  >
                    {{ $t('app.actions.copy', 'copiar') }}
                  </button>
                </li>
                <li v-if="phones.length === 0" class="text-[#6B7280]">—</li>
              </ul>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <div class="text-sm font-semibold text-[#111827]">{{ $t('app.contact.im', 'IDs de Mensageria') }}</div>
              <div class="text-[#374151]">{{ (contact?.imAddresses && contact?.imAddresses.join(', ')) || '—' }}</div>
            </div>
            <div class="space-y-2">
              <div class="text-sm font-semibold text-[#111827]">{{ $t('app.contact.categories', 'Categorias') }}</div>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="c in contact?.categories || []"
                  :key="c"
                  class="px-2.5 py-1 text-xs rounded-full bg-[#F3F4F6] text-[#374151] border border-[#E5E7EB]"
                >
                  {{ c }}
                </span>
                <span v-if="!contact?.categories || contact?.categories.length === 0" class="text-[#6B7280]">—</span>
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <div class="text-sm font-semibold text-[#111827]">{{ $t('app.contact.notes', 'Notas') }}</div>
            <div class="text-[#374151] whitespace-pre-wrap">{{ contact?.personalNotes || '—' }}</div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div class="text-xs text-[#6B7280]">
              {{ $t('app.contact.createdAt', 'Criado em:') }} <span class="text-[#374151]">{{ formatDate(contact?.createdDateTime) }}</span>
            </div>
            <div class="text-xs text-[#6B7280]">
              {{ $t('app.contact.updatedAt', 'Atualizado em:') }} <span class="text-[#374151]">{{ formatDate(contact?.lastModifiedDateTime) }}</span>
            </div>
          </div>
        </template>
      </div>
    </main>

    <EmailComposeModal
      :open="composeOpen"
      :to="composeTo"
      @close="composeOpen = false"
      @submit="onSubmitEmail"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import EmailComposeModal from '../../Pages/Home/Components/EmailComposeModal.vue'
import { getContactDetails } from '../../services/contacts'
import { useI18n } from 'vue-i18n'
import { setLocale } from '../../i18n'

type Email = { address: string; name?: string }
type Contact = {
  id: string
  displayName?: string
  givenName?: string
  surname?: string
  emailAddresses?: Email[]
  businessPhones?: string[]
  homePhones?: string[]
  mobilePhone?: string | null
  companyName?: string | null
  jobTitle?: string | null
  department?: string | null
  officeLocation?: string | null
  imAddresses?: string[]
  birthday?: string | null
  personalNotes?: string | null
  categories?: string[]
  createdDateTime?: string | null
  lastModifiedDateTime?: string | null
}

const { t, locale } = useI18n()

function toggleLanguage() {
  const next = locale.value === 'pt-BR' ? 'en' : 'pt-BR'
  setLocale(next)
}

const router = useRouter()
const route = useRoute()

const contact = ref<Contact | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const composeOpen = ref(false)
const composeTo = ref<string | string[] | undefined>(undefined)

function openCompose(to?: string) {
  composeTo.value = to || undefined
  composeOpen.value = true
}
async function onSubmitEmail(payload: { to: string[]; subject: string; body: string }) {
  console.log('[compose submit]', payload)
  composeOpen.value = false
}

const goBack = () => router.back()

try {
  const q = route.query?.data ? JSON.parse(decodeURIComponent(String(route.query.data))) : null
  if (q && typeof q === 'object') contact.value = q as Contact
} catch {}

async function fetchDetails() {
  const id = String(route.params.id || '')
  if (!id) {
    error.value = t('app.contact.errors.missingId', 'ID do contato não informado')
    return
  }
  loading.value = true
  error.value = null
  try {
    contact.value = await getContactDetails(
      id,
      'id,displayName,givenName,surname,emailAddresses,businessPhones,homePhones,mobilePhone,companyName,jobTitle,department,officeLocation,imAddresses,birthday,personalNotes,categories,createdDateTime,lastModifiedDateTime'
    )
  } catch (e: any) {
    error.value = e?.response?.data?.message || e?.message || t('app.contact.errors.loadFail', 'Erro ao carregar contato')
  } finally {
    loading.value = false
  }
}
onMounted(fetchDetails)

const emails = computed(() => contact.value?.emailAddresses || [])
const primaryEmail = computed(() => emails.value[0]?.address || '')

const phones = computed(() => {
  const arr: { label: string; value: string }[] = []
  ;(contact.value?.businessPhones || []).forEach(p => arr.push({ label: p, value: normalizePhone(p) }))
  ;(contact.value?.homePhones || []).forEach(p => arr.push({ label: p, value: normalizePhone(p) }))
  if (contact.value?.mobilePhone) arr.push({ label: contact.value.mobilePhone, value: normalizePhone(contact.value.mobilePhone) })
  return arr
})
const primaryPhone = computed(() => phones.value[0]?.value || '')

const birthdayLabel = computed(() => {
  const b = contact.value?.birthday
  if (!b) return '—'
  return formatDate(b)
})

function normalizePhone(p: string) {
  return (p || '').replace(/[^\d+]/g, '')
}
function formatDate(iso?: string | null) {
  if (!iso) return '—'
  try {
    const d = new Date(iso)
    if (isNaN(d.getTime())) return '—'
    return d.toLocaleString('pt-BR', { dateStyle: 'medium', timeStyle: 'short' })
  } catch {
    return '—'
  }
}
async function copy(text: string) {
  try { await navigator.clipboard.writeText(text) } catch {}
}
</script>