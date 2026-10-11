<script setup lang="ts">
const exporterEnPdf = () => window.print()

const bouton =
  'min-h-11 cursor-pointer border-2 border-ink px-4 font-sans text-small leading-none font-semibold transition-colors hover:border-signal hover:bg-signal hover:text-on-signal'
</script>

<template>
  <header class="sticky bg-paper-sunken top-0 z-10 flex justify-end gap-2 p-4 print:hidden">
    <button :class="bouton" class="bg-ink text-paper" @click="exporterEnPdf">
      Exporter en PDF
    </button>
  </header>
</template>
