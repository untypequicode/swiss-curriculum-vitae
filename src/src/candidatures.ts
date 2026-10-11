import type { Candidature } from '@/types'

const fichiers = import.meta.glob<Candidature>('./candidatures/*.json', {
  eager: true,
  import: 'default',
})

export const candidaturesOriginales: Record<string, Candidature> = {}
for (const [chemin, contenu] of Object.entries(fichiers)) {
  const nom = (chemin.split('/').pop() ?? chemin).replace('.json', '')
  candidaturesOriginales[nom] = contenu
}

export const nomsCandidatures = [
  'default',
  ...Object.keys(candidaturesOriginales).filter((nom) => nom !== 'default'),
]
