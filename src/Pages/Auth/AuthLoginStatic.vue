<template>
  <div class="min-h-screen bg-[#F3F6FB] flex items-center justify-center px-4">
    <div class="w-full max-w-[520px] flex flex-col items-center py-10">
      <div class="mb-8 flex flex-col items-center select-none">
        <div class="flex items-center gap-3">
        </div>
      </div>

      <h1 class="text-[28px] font-bold text-[#111827] mb-8">Bem-vindo</h1>

      <button
        type="button"
        class="w-full h-16 rounded-full bg-[#5235E8] text-white font-semibold text-[18px] shadow-sm hover:bg-[#4b2fe2] transition flex items-center justify-center gap-3"
        @click="loginWithMicrosoft"
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
</template>

<script setup lang="ts">
import { authLoginRedirect } from '../../services/auth';

function loginWithMicrosoft() {
  authLoginRedirect()
}
</script>