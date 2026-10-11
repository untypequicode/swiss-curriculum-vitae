export interface Coordonnee {
  texte: string
  lien?: string
  discret?: boolean
}

export interface Entree {
  date: string
  titre: string
  details?: string
  description?: string
  puces?: string[]
}

export interface Candidature {
  enTete: {
    titre: string
    sousTitre?: string
    disponibilite?: string
    photoCover?: boolean
    nom: string
    photo?: string
    coordonnees?: Coordonnee[]
  }
  profil?: string
  experiences?: Entree[]
  formations?: Entree[]
  projets?: Entree[]
  competences?: { categorie: string; detail: string }[]
  infosComplementaires?: { titre: string; elements: string[] }[]
}
