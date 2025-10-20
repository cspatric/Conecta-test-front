<template>
  <div
    v-if="open"
    class="fixed inset-0 z-40 bg-black/50 backdrop-blur-[1px] transition-opacity"
    @click="$emit('close')"
  />

  <div
    v-if="open"
    class="fixed left-1/2 -translate-x-1/2 z-50 w-full max-w-[560px] px-4 pb-8"
    :class="[
      'bottom-6',
    ]"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="bg-white rounded-[32px] shadow-xl border border-black/5 overflow-hidden"
    >
      <div class="px-6 sm:px-10 pt-8 pb-2 text-center">
        <h2 class="text-[24px] sm:text-[28px] font-bold text-[#111827] leading-snug">
          Opss, nenhuma conta<br class="hidden sm:block" /> encontrada :(
        </h2>
        <p class="mt-3 text-[15px] sm:text-[16px] text-[#374151] leading-relaxed">
          Você ainda não tem nenhuma conta vinculada, entre com Microsoft no seu
          primeiro acesso!
        </p>
      </div>

      <div class="px-6 sm:px-10 pt-6 pb-8">
        <button
          type="button"
          class="w-full h-16 rounded-full bg-[#5235E8] text-white font-semibold text-[17px] sm:text-[18px] shadow-sm hover:bg-[#4b2fe2] transition"
          @click="$emit('close')"
        >
          Entrar com Microsoft
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ open: boolean }>()
defineEmits<{ (e: 'close'): void }>()
</script>