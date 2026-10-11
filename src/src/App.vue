<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import BarreOutils from '@/components/BarreOutils.vue'
import FeuilleCv from '@/components/FeuilleCv.vue'
import EnTete from '@/components/EnTete.vue'
import SectionNumerotee from '@/components/SectionNumerotee.vue'
import EntreeCv from '@/components/EntreeCv.vue'

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

const afficherGrille = ref(false)
</script>

<template>
  <BarreOutils
    v-model:candidature-choisie="candidatureChoisie"
    :noms-candidatures="nomsCandidatures"
    @basculer-grille="afficherGrille = !afficherGrille"
  />
  <FeuilleCv :afficher-grille="afficherGrille">
    <EnTete v-bind="cv.enTete" />
    <SectionNumerotee titre="Profil">
      <p class="text-justify text-pretty text-[11.5px]" style="line-height: 1.45">
        {{ cv.profil }}
      </p>
    </SectionNumerotee>

    <SectionNumerotee titre="Formations">
      <EntreeCv v-for="formation in cv.formations" :key="formation.titre" v-bind="formation" />
    </SectionNumerotee>

    <SectionNumerotee v-if="cv.projets?.length" titre="Projets">
      <EntreeCv v-for="projet in cv.projets" :key="projet.titre" v-bind="projet" />
    </SectionNumerotee>

    <SectionNumerotee titre="Expériences">
      <EntreeCv v-for="experience in cv.experiences" :key="experience.titre" v-bind="experience" />
    </SectionNumerotee>
  </FeuilleCv>
</template>

<style scoped></style>
