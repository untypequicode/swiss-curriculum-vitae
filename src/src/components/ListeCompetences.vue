<script setup lang="ts">
import type { Candidature } from '@/types'

defineProps<{ competences: Candidature['competences'] }>()
</script>

<template>
  <dl class="grid grid-cols-10 gap-4 gap-y-1">
    <template v-for="competence in competences" :key="competence.categorie">
      <dt class="col-span-2 font-mono text-[9.5px] pt-px text-ink-muted">
        {{ competence.categorie }}
      </dt>
      <dd class="col-span-8">{{ competence.detail }}</dd>
    </template>
  </dl>
</template>
