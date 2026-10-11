<script setup lang="ts">
import type { Entree } from '@/types'

defineProps<Entree>()
</script>

<template>
  <article class="grid grid-cols-12 gap-4">
    <p class="col-span-2 font-mono text-[9.5px] leading-normal pt-px text-ink-soft">{{ date }}</p>
    <div class="col-span-8">
      <h3 class="text-[12px] font-semibold leading-[1.3]">{{ titre }}</h3>
      <p v-if="description" class="mt-0.75">{{ description }}</p>
      <p v-if="note" class="mt-0.5 font-mono text-[9.5px]">{{ note }}</p>
      <ul
        v-if="puces?.length"
        class="mt-0.75"
        :class="{ 'flex flex-wrap gap-3.5': pucesSurUneLigne }"
      >
        <li
          v-for="puce in puces"
          :key="puce"
          class="relative pl-2.5 before:content-[''] before:absolute before:left-px before:top-[0.62em] before:w-0.75 before:h-0.75 before:rounded-full before:bg-ink"
        >
          {{ puce }}
        </li>
      </ul>
      <p v-if="details" class="mt-px text-[10.5px] text-ink-soft">{{ details }}</p>
    </div>
  </article>
</template>
