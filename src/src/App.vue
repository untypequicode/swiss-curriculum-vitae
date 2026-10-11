<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import BarreOutils from '@/components/BarreOutils.vue'
import FeuilleCv from '@/components/FeuilleCv.vue'

import type { Candidature } from '@/types'

const fichiers = import.meta.glob<Candidature>('./candidatures/*.js', { eager: true })
const candidatures: Record<string, Candidature> = {}
for (const [chemin, contenu] of Object.entries(fichiers)) {
  const nom = (chemin.split('/').pop() ?? chemin).replace('.js', '')
  candidatures[nom] = contenu
}
const nomsCandidatures = [
  'default',
  ...Object.keys(candidatures).filter((nom) => nom !== 'default'),
]

const nomDansAdresse = new URLSearchParams(location.search).get('cv')
const candidatureChoisie = ref(
  nomDansAdresse && nomDansAdresse in candidatures ? nomDansAdresse : 'default',
)
const cv = computed(() => candidatures[candidatureChoisie.value] as Candidature)

watchEffect(() => {
  history.replaceState(null, '', `?cv=${candidatureChoisie.value}`)
  const nomPdf = `CV ${cv.value.enTete.nom}`
  document.title =
    candidatureChoisie.value === 'default' ? nomPdf : `${nomPdf} - ${candidatureChoisie.value}`
})
</script>

<template>
  <BarreOutils
    v-model:candidature-choisie="candidatureChoisie"
    :noms-candidatures="nomsCandidatures"
  />
  <FeuilleCv />
</template>

<style scoped></style>
