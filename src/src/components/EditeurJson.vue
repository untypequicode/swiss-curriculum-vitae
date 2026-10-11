<script setup lang="ts">
import { ref, watch } from 'vue'
import { verifierCandidature } from '@/utils/verifierCandidature'
import type { Candidature } from '@/types'

const props = defineProps<{ candidature: Candidature; nom: string; modifiee: boolean }>()
const emit = defineEmits<{ modifier: [candidature: Candidature]; reinitialiser: [] }>()

const enTexte = (candidature: Candidature) => JSON.stringify(candidature, null, 2)

const texte = ref(enTexte(props.candidature))
const erreur = ref<string | null>(null)

watch(
  () => props.candidature,
  (candidature) => {
    try {
      if (JSON.stringify(JSON.parse(texte.value)) === JSON.stringify(candidature)) return
    } catch {}
    texte.value = enTexte(candidature)
    erreur.value = null
  },
)

function lire(contenu: string) {
  let donnees: unknown
  try {
    donnees = JSON.parse(contenu)
  } catch (e) {
    erreur.value = `JSON invalide : ${e instanceof Error ? e.message : e}`
    return
  }
  erreur.value = verifierCandidature(donnees)
  if (!erreur.value) emit('modifier', donnees as Candidature)
}

const surSaisie = (e: Event) => {
  texte.value = (e.target as HTMLTextAreaElement).value
  lire(texte.value)
}

async function importer(e: Event) {
  const entree = e.target as HTMLInputElement
  const fichier = entree.files?.[0]
  entree.value = ''
  if (!fichier) return
  texte.value = await fichier.text()
  lire(texte.value)
}

function exporter() {
  const lien = document.createElement('a')
  lien.href = URL.createObjectURL(
    new Blob([enTexte(props.candidature)], { type: 'application/json' }),
  )
  lien.download = `${props.nom}.json`
  lien.click()
  URL.revokeObjectURL(lien.href)
}

const bouton =
  'min-h-9 cursor-pointer border-2 border-ink bg-transparent px-3 font-sans text-small leading-none font-semibold text-ink transition-colors hover:border-signal hover:bg-signal hover:text-on-signal'
</script>

<template>
  <aside
    class="flex flex-col gap-2 border-2 border-ink bg-paper p-3 text-ink print:hidden"
    aria-label="Édition du CV"
  >
    <div class="flex flex-wrap items-center gap-2">
      <label :class="bouton" class="inline-flex items-center">
        Importer
        <input type="file" accept=".json,application/json" class="sr-only" @change="importer" />
      </label>
      <button type="button" :class="bouton" @click="exporter">Exporter</button>
      <button v-if="modifiee" type="button" :class="bouton" @click="emit('reinitialiser')">
        Réinitialiser
      </button>
    </div>

    <textarea
      :value="texte"
      spellcheck="false"
      aria-label="Contenu du CV en JSON"
      class="min-h-0 flex-1 resize-none border-2 border-ink bg-paper p-2 font-mono text-[12px] leading-[1.4] text-ink"
      @input="surSaisie"
    ></textarea>

    <p v-if="erreur" role="alert" class="text-small font-semibold">⚠ {{ erreur }}</p>
    <p v-else class="text-small text-ink-muted">
      {{ modifiee ? 'Modifications enregistrées dans ce navigateur.' : 'Aucune modification.' }}
    </p>
  </aside>
</template>
