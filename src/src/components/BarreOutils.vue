<script setup lang="ts">
defineProps<{ nomsCandidatures: string[] }>()
const candidatureChoisie = defineModel<string>('candidatureChoisie')
const emit = defineEmits(['basculer-grille'])
const exporterEnPdf = () => window.print()

const bouton =
  'min-h-11 cursor-pointer border-2 border-ink px-4 font-sans text-small leading-none font-semibold transition-colors hover:border-signal hover:bg-signal hover:text-on-signal'
</script>

<template>
  <header
    class="sticky top-0 z-10 flex items-center justify-end gap-2 bg-paper-sunken p-4 print:hidden"
  >
    <h1 class="wordmark mr-auto text-[1.25rem]">Swiss Curriculum Vitae</h1>
    <select
      v-model="candidatureChoisie"
      :class="bouton"
      class="bg-transparent text-ink"
      title="Fichier de src/candidatures/ affiché"
    >
      <option v-for="nom in nomsCandidatures" :key="nom" :value="nom">
        {{ nom }}
      </option>
    </select>

    <button :class="bouton" class="bg-transparent text-ink" @click="emit('basculer-grille')">
      Grille
    </button>
    <button :class="bouton" class="bg-ink text-paper" @click="exporterEnPdf">
      Exporter en PDF
    </button>
  </header>
</template>
