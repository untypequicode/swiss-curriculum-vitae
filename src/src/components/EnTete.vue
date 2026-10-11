<script setup lang="ts">
import type { Candidature } from '@/types'

defineProps<Candidature['enTete']>()
</script>

<template>
  <section class="grid grid-cols-12 items-stretch gap-4">
    <div class="col-span-7 flex flex-col justify-between gap-2">
      <p
        class="text-[30px] font-semibold whitespace-pre-line"
        style="line-height: 1; letter-spacing: -0.04em"
      >
        {{ titre }}
      </p>
      <p class="text-[12.5px] text-pretty text-ink-soft" style="line-height: 1.35">
        {{ sousTitre }}
      </p>
      <p v-if="disponibilite" class="mt-1 text-[12.5px] font-semibold" style="line-height: 1.35">
        {{ disponibilite }}
      </p>
    </div>

    <div class="col-span-3 flex flex-col justify-between pl-4">
      <h1
        class="mb-1.5 text-[13px] font-semibold flex items-center gap-2 after:content-[''] after:w-1.5 after:h-1.5 after:bg-signal"
        style="letter-spacing: -0.01em"
      >
        {{ nom }}
      </h1>
      <address class="text-[10.5px] flex flex-col" style="line-height: 1.45">
        <template v-for="ligne in coordonnees" :key="ligne.texte">
          <a v-if="ligne.lien" :href="ligne.lien">{{ ligne.texte }}</a>
          <span v-else :class="{ 'text-ink-muted': ligne.discret }">{{ ligne.texte }}</span>
        </template>
      </address>
    </div>

    <div
      v-if="photo"
      class="col-span-2 overflow-hidden"
      :class="photoCover ? 'relative' : 'self-end aspect-square'"
    >
      <img
        :src="photo"
        :alt="`Photo de ${nom}`"
        class="block h-full w-full object-cover"
        :class="{ 'absolute inset-0': photoCover }"
        style="object-position: 50% 40%"
      />
    </div>
  </section>
</template>
