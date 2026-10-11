<script setup lang="ts">
import type { Candidature } from '@/types'

defineProps<Candidature['enTete']>()
</script>

<template>
  <header class="grid grid-cols-12 items-stretch gap-4">
    <div class="col-span-7 flex flex-col justify-between gap-2">
      <p class="text-[30px] leading-none font-semibold tracking-[-0.04em] whitespace-pre-line">
        {{ titre }}
      </p>
      <p class="text-[12.5px] leading-[1.35] text-pretty text-ink-soft">
        {{ sousTitre }}
      </p>
      <p v-if="disponibilite" class="mt-1 text-[12.5px] leading-[1.35] font-semibold">
        {{ disponibilite }}
      </p>
    </div>

    <div class="col-span-3 flex flex-col justify-between pl-4">
      <h1
        class="mb-1.5 flex items-center gap-2 text-[13px] font-semibold tracking-[-0.01em] after:size-1.75 after:bg-signal after:content-['']"
      >
        {{ nom }}
      </h1>
      <address class="flex flex-col text-[10.5px] leading-[1.45] not-italic">
        <template v-for="ligne in coordonnees" :key="ligne.texte">
          <a v-if="ligne.lien" :href="ligne.lien">{{ ligne.texte }}</a>
          <span v-else :class="{ 'text-ink-muted': ligne.discret }">{{ ligne.texte }}</span>
        </template>
      </address>
    </div>

    <div
      v-if="photo"
      class="col-span-2 overflow-hidden"
      :class="photoCover ? 'relative' : 'aspect-square self-end'"
    >
      <img
        :src="photo"
        :alt="`Photo de ${nom}`"
        class="block h-full w-full object-cover object-[50%_40%]"
        :class="{ 'absolute inset-0': photoCover }"
      />
    </div>
  </header>
</template>
