<script setup lang="ts">
import type { Candidature } from '@/types'

defineProps<{ colonnes: Candidature['infosComplementaires'] }>()
</script>

<template>
  <div class="grid auto-cols-fr grid-flow-col gap-x-4">
    <div v-for="colonne in colonnes" :key="colonne.titre">
      <h3 class="mb-0.75 font-mono text-[9.5px] font-normal text-ink-muted">{{ colonne.titre }}</h3>
      <ul>
        <li v-for="element in colonne.elements" :key="element">{{ element }}</li>
      </ul>
    </div>
  </div>
</template>
