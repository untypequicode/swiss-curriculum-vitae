<script setup lang="ts">
import type { Entree } from '@/types'

defineProps<{ titre: Entree['titre'] }>()
</script>

<template>
  <section
    class="mt-1.5 grid flex-[1_0_auto] grid-cols-12 gap-4 border-t border-solid border-ink pt-1.25 first-of-type:mt-4 [counter-increment:numero-section]"
  >
    <h2
      class="col-span-2 col-start-1 flex gap-2 text-[11px] font-semibold before:font-mono before:font-medium before:text-signal before:content-[counter(numero-section,decimal-leading-zero)]"
    >
      {{ titre }}
    </h2>
    <div class="col-span-10 col-start-3 flex flex-col gap-0.75">
      <slot />
    </div>
  </section>
</template>
