<!-- src/Pages/Home/HomePage.vue -->
<template>
  <div class="min-h-screen bg-[#F3F6FB]">
    <!-- Header roxo -->
    <header class="bg-[#5A3EF0] pt-10 pb-16">
      <div class="max-w-[640px] mx-auto px-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <!-- avatar -->
            <div class="w-12 h-12 rounded-full overflow-hidden bg-white/20">
              <div class="w-full h-full bg-black/10" />
            </div>
            <div class="text-white">
              <div class="text-sm/5 opacity-90">Boa noite,</div>
              <div class="text-xl font-semibold -mt-0.5">Viktoria</div>
            </div>
          </div>

          <!-- sininho -->
          <button
            type="button"
            class="w-10 h-10 rounded-xl bg-white/15 hover:bg-white/20 transition grid place-items-center"
            aria-label="Notificações"
          >
            <svg viewBox="0 0 24 24" class="w-6 h-6" fill="none" stroke="white" stroke-width="1.8">
              <path
                d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0a3 3 0 1 1-6 0m6 0H9"
                stroke-linecap="round" stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>

    <!-- Conteúdo -->
    <main class="-mt-8 max-w-[640px] mx-auto px-4 pb-28">
      <!-- Filtros -->
      <div class="bg-white rounded-2xl shadow-sm border border-black/5 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:gap-4">
        <!-- Select domínio -->
        <select
          class="w-full sm:w-[180px] h-11 rounded-xl border border-[#E5E7EB] bg-white px-3 text-[#374151] text-sm outline-none focus:ring-2 focus:ring-[#5A3EF0]/30 focus:border-[#5A3EF0]"
        >
          <option selected disabled>Selecionar domínio</option>
          <option>conecta.com</option>
          <option>empresa.com</option>
          <option>outro.com</option>
        </select>

        <!-- Search -->
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
            type="text"
            placeholder="Pesquisar por nome ou email..."
            class="w-full h-11 rounded-xl border border-[#E5E7EB] bg-white pl-10 pr-4 text-sm text-[#374151] outline-none focus:ring-2 focus:ring-[#5A3EF0]/30 focus:border-[#5A3EF0]"
          />
        </div>
      </div>

      <!-- Cabeçalho da lista -->
      <div class="mt-5 bg-white rounded-2xl shadow-sm border border-black/5">
        <div class="px-5 py-3 text-[#4B5563] text-[15px] font-medium grid grid-cols-[auto_1fr_1fr_auto] items-center gap-3">
          <span></span>
          <span>nome</span>
          <span>email</span>
          <span class="text-right pr-1">ação</span>
        </div>
      </div>

      <!-- Lista -->
      <div class="mt-3 bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
        <ul role="list" class="divide-y divide-[#E5E7EB]/70">
          <li v-for="i in 4" :key="i" class="px-5 py-4 grid grid-cols-[auto_1fr_1fr_auto] items-center gap-3">
            <span class="w-8 h-8 rounded-full bg-[#C9D7EA]" />
            <span class="text-[#111827] font-medium">Pedro silva</span>
            <span class="text-[#374151]">pedro@conecta.com</span>

            <!-- Botão ação: enviar -->
            <button
              type="button"
              class="ml-auto w-10 h-10 grid place-items-center rounded-xl border border-[#E5E7EB] hover:bg-[#F3F4F6] transition"
              aria-label="Enviar"
              title="Enviar"
            >
              <!-- Ícone paper-plane -->
              <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="#5235E8" stroke-width="1.8">
                <path d="M5 12L20 4l-4.8 16-3.6-5.2L5 12z" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </li>
        </ul>
      </div>
    </main>

    <!-- FAB + -->
    <button
      type="button"
      class="fixed bottom-6 left-1/2 -translate-x-1/2 px-10 h-16 rounded-[28px] bg-[#5235E8] hover:bg-[#4b2fe2] text-white font-semibold text-lg shadow-lg"
      aria-label="Adicionar"
    >
      <span class="text-2xl leading-none">+</span>
    </button>
  </div>
</template>

<script setup lang="ts">
// estática, sem variáveis ainda
</script>