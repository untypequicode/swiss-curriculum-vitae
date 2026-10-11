<script setup lang="ts">
import { ref, useTemplateRef, watch, onMounted, onBeforeUnmount } from 'vue'
import { EditorState } from '@codemirror/state'
import { EditorView, keymap, lineNumbers } from '@codemirror/view'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import {
  bracketMatching,
  HighlightStyle,
  indentOnInput,
  syntaxHighlighting,
} from '@codemirror/language'
import { json } from '@codemirror/lang-json'
import { tags } from '@lezer/highlight'
import { verifierCandidature } from '@/utils/verifierCandidature'
import {
  compterPhotos,
  enregistrerPhoto,
  nomDePhoto,
  PREFIXE,
  redimensionner,
  supprimerPhotos,
} from '@/utils/photosLocales'
import type { Candidature } from '@/types'

const props = defineProps<{ candidature: Candidature; nom: string; modifiee: boolean }>()
const emit = defineEmits<{ modifier: [candidature: Candidature]; reinitialiser: [] }>()

const enTexte = (candidature: Candidature) => JSON.stringify(candidature, null, 2)

const conteneur = useTemplateRef<HTMLElement>('conteneur')
const erreur = ref<string | null>(null)
let editeur: EditorView | undefined
let miseAJourExterne = false

const theme = EditorView.theme({
  '&': {
    height: '100%',
    backgroundColor: 'var(--paper)',
    color: 'var(--ink)',
    fontSize: '12px',
  },
  '.cm-scroller': { overflow: 'auto', fontFamily: 'var(--font-mono)', lineHeight: '1.4' },
  '.cm-content': { caretColor: 'var(--ink)', padding: '8px 0' },
  '.cm-content:focus-visible, &.cm-focused': { outline: 'none' },
  '.cm-cursor': { borderLeftColor: 'var(--ink)' },
  '.cm-gutters': {
    backgroundColor: 'var(--paper-sunken)',
    color: 'var(--ink-muted)',
    border: 'none',
  },
  '.cm-selectionBackground, &.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground':
    { backgroundColor: 'color-mix(in oklab, var(--signal) 30%, transparent)' },
  '&.cm-focused .cm-matchingBracket': {
    backgroundColor: 'color-mix(in oklab, var(--signal) 30%, transparent)',
  },
})

const coloration = HighlightStyle.define([
  { tag: tags.propertyName, color: 'var(--ink)', fontWeight: '600' },
  { tag: tags.string, color: 'var(--signal)' },
  { tag: [tags.number, tags.bool, tags.null], color: 'var(--ink-muted)' },
  { tag: [tags.brace, tags.squareBracket, tags.separator], color: 'var(--ink-muted)' },
])

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

function remplacerTexte(texte: string, externe: boolean) {
  if (!editeur) return
  miseAJourExterne = externe
  editeur.dispatch({ changes: { from: 0, to: editeur.state.doc.length, insert: texte } })
  miseAJourExterne = false
}

const nombrePhotos = ref(0)
const actualiserNombrePhotos = async () => {
  nombrePhotos.value = await compterPhotos().catch(() => 0)
}

async function viderPhotos() {
  const n = nombrePhotos.value
  if (
    !confirm(
      `Supprimer ${n} photo${n > 1 ? 's' : ''} enregistrée${n > 1 ? 's' : ''} dans ce navigateur ?`,
    )
  )
    return
  try {
    await supprimerPhotos()
    nombrePhotos.value = 0
  } catch {
    erreur.value = 'Impossible de supprimer les photos de ce navigateur'
  }
}

onMounted(() => {
  actualiserNombrePhotos()
  editeur = new EditorView({
    parent: conteneur.value!,
    state: EditorState.create({
      doc: enTexte(props.candidature),
      extensions: [
        lineNumbers(),
        history(),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        indentOnInput(),
        bracketMatching(),
        json(),
        syntaxHighlighting(coloration),
        EditorView.lineWrapping,
        EditorView.contentAttributes.of({ 'aria-label': 'Contenu du CV en JSON' }),
        theme,
        EditorView.updateListener.of((u) => {
          if (u.docChanged && !miseAJourExterne) lire(u.state.doc.toString())
        }),
      ],
    }),
  })
})
onBeforeUnmount(() => editeur?.destroy())

watch(
  () => props.candidature,
  (candidature) => {
    if (!editeur) return
    try {
      if (JSON.stringify(JSON.parse(editeur.state.doc.toString())) === JSON.stringify(candidature))
        return
    } catch {}
    remplacerTexte(enTexte(candidature), true)
    erreur.value = null
  },
)

async function importer(e: Event) {
  const entree = e.target as HTMLInputElement
  const fichier = entree.files?.[0]
  entree.value = ''
  if (fichier) remplacerTexte(await fichier.text(), false)
}

async function ajouterPhoto(e: Event) {
  const entree = e.target as HTMLInputElement
  const fichier = entree.files?.[0]
  entree.value = ''
  if (!fichier || !editeur) return

  let donnees: { enTete?: Record<string, unknown> }
  try {
    donnees = JSON.parse(editeur.state.doc.toString())
  } catch {
    erreur.value = 'Corrigez le JSON avant d’ajouter une photo'
    return
  }
  if (!donnees?.enTete) {
    erreur.value = 'Corrigez le JSON avant d’ajouter une photo : « enTete » est manquant'
    return
  }

  try {
    const nom = `${nomDePhoto(fichier.name)}.jpg`
    await enregistrerPhoto(nom, await redimensionner(fichier))
    donnees.enTete.photo = PREFIXE + nom
    remplacerTexte(JSON.stringify(donnees, null, 2), false)
    actualiserNombrePhotos()
  } catch {
    erreur.value = 'Impossible d’enregistrer la photo dans ce navigateur'
  }
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
      <label :class="bouton" class="inline-flex items-center">
        Photo
        <input type="file" accept="image/*" class="sr-only" @change="ajouterPhoto" />
      </label>
      <button type="button" :class="bouton" @click="exporter">Exporter</button>
      <button v-if="modifiee" type="button" :class="bouton" @click="emit('reinitialiser')">
        Réinitialiser
      </button>
      <button v-if="nombrePhotos > 0" type="button" :class="bouton" @click="viderPhotos">
        Supprimer les photos ({{ nombrePhotos }})
      </button>
    </div>

    <div
      ref="conteneur"
      class="min-h-0 flex-1 overflow-hidden border-2 border-ink focus-within:outline-3 focus-within:outline-offset-3 focus-within:outline-signal"
    ></div>

    <p v-if="erreur" role="alert" class="text-small font-semibold">⚠ {{ erreur }}</p>
    <p v-else class="text-small text-ink-muted">
      {{ modifiee ? 'Modifications enregistrées dans ce navigateur.' : 'Aucune modification.' }}
    </p>
  </aside>
</template>
