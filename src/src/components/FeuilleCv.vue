<script setup lang="ts">
defineProps({
  afficherGrille: Boolean,
})
</script>

<template>
  <main
    class="relative my-6 mx-auto p-5 overflow-hidden flex flex-col bg-white text-ink text-[12px] leading-4.25"
    style="width: 210mm; height: 297mm; counter-reset: numero-section"
    id="feuille"
  >
    <div
      v-if="afficherGrille"
      class="grid gap-x-4 absolute pointer-events-none inset-x-5 inset-y-0"
      style="grid-template-columns: repeat(12, minmax(0, 1fr))"
      aria-hidden="true"
    >
      <i v-for="n in 12" :key="n" class="bg-signal opacity-10"></i>
    </div>
    <slot />
  </main>
</template>

<style scoped>
@media print {
  #feuille {
    margin: 0;
  }
}
</style>
