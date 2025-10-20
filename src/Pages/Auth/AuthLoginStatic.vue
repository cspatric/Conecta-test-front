<template>
  <div class="min-h-screen bg-[#F3F6FB] flex items-center justify-center px-4">
    <div class="w-full max-w-[520px] flex flex-col items-center py-10">
      <!-- Logo / marca -->
      <div class="mb-8 flex flex-col items-center select-none">
        <div class="flex items-center gap-3">
          <!-- aqui vai ficar a logo -->
        </div>
      </div>

      <!-- Título -->
      <h1 class="text-[28px] font-bold text-[#111827] mb-8">Bem-Vindo</h1>

      <!-- Form estático -->
      <form class="w-full">
        <label class="block text-[13px] text-[#374151] mb-1" for="email">Email</label>
        <input
          id="email"
          type="email"
          class="w-full h-[56px] px-4 rounded-2xl bg-white border border-[#E5E7EB] outline-none focus:ring-2 focus:ring-[#5A3EF0]/30 focus:border-[#5A3EF0] mb-5 shadow-sm"
          placeholder=""
        />

        <label class="block text-[13px] text-[#374151] mb-1" for="password">Senha</label>
        <input
          id="password"
          type="password"
          class="w-full h-[56px] px-4 rounded-2xl bg-white border border-[#E5E7EB] outline-none focus:ring-2 focus:ring-[#5A3EF0]/30 focus:border-[#5A3EF0] mb-7 shadow-sm"
          placeholder=""
        />

        <!-- Botão Continuar (abre o popup) -->
        <button
          type="button"
          class="w-full h-16 rounded-full bg-white text-[#111827] font-semibold text-[18px] shadow-sm border border-[#E5E7EB] hover:shadow transition"
          @click="showPopup = true"
        >
          Continuar
        </button>
      </form>

      <!-- Espaço grande -->
      <div class="h-16" />

      <!-- CTA Microsoft (também pode abrir o popup, se quiser) -->
      <button
        type="button"
        class="w-full h-16 rounded-full bg-[#5235E8] text-white font-semibold text-[18px] shadow-sm hover:bg-[#4b2fe2] transition flex items-center justify-center gap-3"
        @click="showPopup = true"
      >
        <svg aria-hidden="true" viewBox="0 0 23 23" class="w-5 h-5">
          <rect width="10" height="10" x="1" y="1" fill="#f25022" />
          <rect width="10" height="10" x="12" y="1" fill="#7fba00" />
          <rect width="10" height="10" x="1" y="12" fill="#00a4ef" />
          <rect width="10" height="10" x="12" y="12" fill="#ffb900" />
        </svg>
        Entrar com Microsoft
      </button>
    </div>
  </div>

  <!-- Popup -->
  <NoAccountPopup :open="showPopup" @close="showPopup = false" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NoAccountPopup from './NoAccountPopup.vue'

const showPopup = ref(false)
</script>