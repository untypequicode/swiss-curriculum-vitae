import { ref, watch } from 'vue'

export const PREFIXE = 'local:'

const NOM_BASE = 'swiss-cv'
const MAGASIN = 'photos'

let base: Promise<IDBDatabase> | undefined
function ouvrirBase() {
  base ??= new Promise((resolve, reject) => {
    const requete = indexedDB.open(NOM_BASE, 1)
    requete.onupgradeneeded = () => requete.result.createObjectStore(MAGASIN)
    requete.onsuccess = () => resolve(requete.result)
    requete.onerror = () => reject(requete.error)
  })
  return base
}

async function executer<T>(
  mode: IDBTransactionMode,
  action: (magasin: IDBObjectStore) => IDBRequest<T>,
) {
  const bd = await ouvrirBase()
  return new Promise<T>((resolve, reject) => {
    const requete = action(bd.transaction(MAGASIN, mode).objectStore(MAGASIN))
    requete.onsuccess = () => resolve(requete.result)
    requete.onerror = () => reject(requete.error)
  })
}

export const enregistrerPhoto = (nom: string, image: Blob) =>
  executer('readwrite', (magasin) => magasin.put(image, nom))

export const lirePhoto = (nom: string) =>
  executer<Blob | undefined>('readonly', (magasin) => magasin.get(nom))

export const nomDePhoto = (nomFichier: string) =>
  nomFichier
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'photo'

export async function redimensionner(fichier: File, tailleMax = 800) {
  const image = await createImageBitmap(fichier)
  const echelle = Math.min(1, tailleMax / Math.max(image.width, image.height))
  const toile = document.createElement('canvas')
  toile.width = Math.round(image.width * echelle)
  toile.height = Math.round(image.height * echelle)
  const contexte = toile.getContext('2d')!
  contexte.fillStyle = '#fff' // le JPEG n'a pas de transparence
  contexte.fillRect(0, 0, toile.width, toile.height)
  contexte.drawImage(image, 0, 0, toile.width, toile.height)
  image.close()
  return new Promise<Blob>((resolve, reject) =>
    toile.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Conversion impossible'))),
      'image/jpeg',
      0.85,
    ),
  )
}

export function useUrlPhoto(photo: () => string | undefined) {
  const url = ref<string>()
  watch(
    photo,
    async (valeur, _ancienne, nettoyer) => {
      let annule = false
      const urlsCreees: string[] = []
      nettoyer(() => {
        annule = true
        urlsCreees.forEach((adresse) => URL.revokeObjectURL(adresse))
      })
      if (!valeur?.startsWith(PREFIXE)) {
        url.value = valeur
        return
      }
      url.value = undefined
      const image = await lirePhoto(valeur.slice(PREFIXE.length)).catch(() => undefined)
      if (annule || !image) return
      url.value = URL.createObjectURL(image)
      urlsCreees.push(url.value)
    },
    { immediate: true },
  )
  return url
}
