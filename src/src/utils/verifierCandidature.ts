type Objet = Record<string, unknown>

const estObjet = (valeur: unknown): valeur is Objet =>
  typeof valeur === 'object' && valeur !== null && !Array.isArray(valeur)

function verifierChamp(
  objet: Objet,
  chemin: string,
  cle: string,
  type: 'string' | 'boolean',
  requis = false,
) {
  const valeur = objet[cle]
  if (valeur === undefined) return requis ? `« ${chemin}${cle} » est obligatoire` : null
  if (typeof valeur !== type)
    return `« ${chemin}${cle} » doit être ${type === 'string' ? 'un texte' : 'vrai ou faux'}`
  if (requis && type === 'string' && valeur === '')
    return `« ${chemin}${cle} » ne doit pas être vide`
  return null
}

function verifierListe(
  objet: Objet,
  cle: string,
  verifierElement: (element: Objet, chemin: string) => string | null,
) {
  const liste = objet[cle]
  if (liste === undefined) return null
  if (!Array.isArray(liste)) return `« ${cle} » doit être une liste`
  for (const [i, element] of liste.entries()) {
    if (!estObjet(element)) return `« ${cle}[${i}] » doit être un objet`
    const erreur = verifierElement(element, `${cle}[${i}].`)
    if (erreur) return erreur
  }
  return null
}

function verifierListeDeTextes(objet: Objet, chemin: string, cle: string) {
  const liste = objet[cle]
  if (liste === undefined) return null
  if (!Array.isArray(liste) || liste.some((texte) => typeof texte !== 'string'))
    return `« ${chemin}${cle} » doit être une liste de textes`
  return null
}

const premiereErreur = (...erreurs: (string | null)[]) => erreurs.find(Boolean) ?? null

const verifierEntree = (e: Objet, chemin: string) =>
  premiereErreur(
    verifierChamp(e, chemin, 'date', 'string', true),
    verifierChamp(e, chemin, 'titre', 'string', true),
    verifierChamp(e, chemin, 'details', 'string'),
    verifierChamp(e, chemin, 'description', 'string'),
    verifierChamp(e, chemin, 'note', 'string'),
    verifierChamp(e, chemin, 'pucesSurUneLigne', 'boolean'),
    verifierListeDeTextes(e, chemin, 'puces'),
  )

export function verifierCandidature(donnees: unknown): string | null
export function verifierCandidature(donnees: unknown): string | null {
  if (!estObjet(donnees)) return 'Le JSON doit être un objet'
  const enTete = donnees.enTete
  if (!estObjet(enTete)) return '« enTete » est obligatoire et doit être un objet'

  return premiereErreur(
    verifierChamp(enTete, 'enTete.', 'titre', 'string', true),
    verifierChamp(enTete, 'enTete.', 'nom', 'string', true),
    verifierChamp(enTete, 'enTete.', 'sousTitre', 'string'),
    verifierChamp(enTete, 'enTete.', 'disponibilite', 'string'),
    verifierChamp(enTete, 'enTete.', 'photo', 'string'),
    verifierChamp(enTete, 'enTete.', 'photoCover', 'boolean'),
    verifierListe(enTete, 'coordonnees', (c, chemin) =>
      premiereErreur(
        verifierChamp(c, `enTete.${chemin}`, 'texte', 'string', true),
        verifierChamp(c, `enTete.${chemin}`, 'lien', 'string'),
        verifierChamp(c, `enTete.${chemin}`, 'discret', 'boolean'),
      ),
    ),
    verifierChamp(donnees, '', 'profil', 'string'),
    verifierListe(donnees, 'experiences', verifierEntree),
    verifierListe(donnees, 'formations', verifierEntree),
    verifierListe(donnees, 'projets', verifierEntree),
    verifierListe(donnees, 'competences', (c, chemin) =>
      premiereErreur(
        verifierChamp(c, chemin, 'categorie', 'string', true),
        verifierChamp(c, chemin, 'detail', 'string', true),
      ),
    ),
    verifierListe(donnees, 'infosComplementaires', (c, chemin) =>
      premiereErreur(
        verifierChamp(c, chemin, 'titre', 'string', true),
        c.elements === undefined ? `« ${chemin}elements » est obligatoire` : null,
        verifierListeDeTextes(c, chemin, 'elements'),
      ),
    ),
  )
}
