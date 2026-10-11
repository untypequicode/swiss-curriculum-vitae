<template>
  <main
    class="relative my-6 mx-auto p-5 overflow-hidden flex flex-col"
    style="width: 210mm; height: 297mm; counter-reset: numero-section; background-color: white"
    id="feuille"
  >
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
