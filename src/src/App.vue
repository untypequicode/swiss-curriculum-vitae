<script setup lang="ts">
import { ref, computed, defineAsyncComponent, watch, watchEffect } from 'vue'
import BarreOutils from '@/components/BarreOutils.vue'
import FeuilleCv from '@/components/FeuilleCv.vue'
import EnTete from '@/components/EnTete.vue'
import SectionNumerotee from '@/components/SectionNumerotee.vue'
import EntreeCv from '@/components/EntreeCv.vue'
import ListeCompetences from '@/components/ListeCompetences.vue'
import ColonnesDeListes from '@/components/ColonnesDeListes.vue'
import { candidaturesOriginales, nomsCandidatures } from '@/candidatures'

// L'éditeur (CodeMirror) n'est téléchargé qu'à la première ouverture du panneau
const EditeurJson = defineAsyncComponent(() => import('@/components/EditeurJson.vue'))

import type { Candidature } from '@/types'

const CLE_STOCKAGE = 'swiss-cv:modifications'

function lireModifications(): Record<string, Candidature> {
  try {
    return JSON.parse(localStorage.getItem(CLE_STOCKAGE) ?? '{}')
  } catch {
    return {}
  }
}
const modifications = ref(lireModifications())
watch(
  modifications,
  (valeur) => {
    try {
      localStorage.setItem(CLE_STOCKAGE, JSON.stringify(valeur))
    } catch {}
  },
  { deep: true },
)

const nomDansAdresse = new URLSearchParams(location.search).get('cv')
const candidatureChoisie = ref(
  nomDansAdresse && nomDansAdresse in candidaturesOriginales ? nomDansAdresse : 'default',
)
const cv = computed(
  () =>
    modifications.value[candidatureChoisie.value] ??
    (candidaturesOriginales[candidatureChoisie.value] as Candidature),
)
const estModifiee = computed(() => candidatureChoisie.value in modifications.value)

function modifier(candidature: Candidature) {
  modifications.value = { ...modifications.value, [candidatureChoisie.value]: candidature }
}
function reinitialiser() {
  const reste = { ...modifications.value }
  delete reste[candidatureChoisie.value]
  modifications.value = reste
}

watchEffect(() => {
  history.replaceState(null, '', `?cv=${candidatureChoisie.value}`)
  const nomPdf = `CV ${cv.value.enTete.nom}`
  document.title =
    candidatureChoisie.value === 'default' ? nomPdf : `${nomPdf} - ${candidatureChoisie.value}`
})

const afficherGrille = ref(false)
const afficherEditeur = ref(false)
</script>

<template>
  <BarreOutils
    v-model:candidature-choisie="candidatureChoisie"
    :noms-candidatures="nomsCandidatures"
    :editeur-ouvert="afficherEditeur"
    @basculer-grille="afficherGrille = !afficherGrille"
    @basculer-editeur="afficherEditeur = !afficherEditeur"
  />
  <div class="flex items-start justify-center gap-6 px-6 print:block print:p-0">
    <EditeurJson
      v-if="afficherEditeur"
      :candidature="cv"
      :nom="candidatureChoisie"
      :modifiee="estModifiee"
      class="sticky top-24 my-6 h-[calc(100vh-8rem)] w-md shrink-0"
      @modifier="modifier"
      @reinitialiser="reinitialiser"
    />
    <FeuilleCv :afficher-grille="afficherGrille">
      <EnTete v-bind="cv.enTete" />
      <SectionNumerotee v-if="cv.profil" titre="Profil">
        <p class="text-justify text-pretty text-[11.5px]" style="line-height: 1.45">
          {{ cv.profil }}
        </p>
      </SectionNumerotee>

      <SectionNumerotee v-if="cv.formations?.length" titre="Formations">
        <EntreeCv v-for="formation in cv.formations" :key="formation.titre" v-bind="formation" />
      </SectionNumerotee>

      <SectionNumerotee v-if="cv.projets?.length" titre="Projets">
        <EntreeCv v-for="projet in cv.projets" :key="projet.titre" v-bind="projet" />
      </SectionNumerotee>

      <SectionNumerotee v-if="cv.experiences?.length" titre="Expériences">
        <EntreeCv
          v-for="experience in cv.experiences"
          :key="experience.titre"
          v-bind="experience"
        />
      </SectionNumerotee>

      <SectionNumerotee v-if="cv.competences?.length" titre="Compétences">
        <ListeCompetences :competences="cv.competences" />
      </SectionNumerotee>

      <SectionNumerotee v-if="cv.infosComplementaires?.length" titre="Infos complémentaires">
        <ColonnesDeListes :colonnes="cv.infosComplementaires" />
      </SectionNumerotee>
    </FeuilleCv>
  </div>
</template>

<style scoped></style>
