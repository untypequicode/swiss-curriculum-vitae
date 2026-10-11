export const enTete = {
  titre: 'Lorem ipsum\ndolor sit amet', // le retour à la ligne est conservé
  sousTitre: 'Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.',
  disponibilite: 'Disponible dès le 1er janvier', // optionnel
  photoCover: true, // true : la photo prend la hauteur du bloc · false : photo carrée alignée en bas
  nom: 'Prénom Nom',
  photo: 'img/photo.jpg', // optionnel
  coordonnees: [
    { texte: 'prenom.nom@exemple.com', lien: 'mailto:prenom.nom@exemple.com' },
    { texte: '+33 0 00 00 00 00', lien: 'tel:+33000000000' },
    { texte: 'exemple.com/prenom-nom', lien: 'https://exemple.com/prenom-nom' },
    { texte: 'Ville, Pays' },
    { texte: 'Permis B', discret: true }, // texte sans lien, en gris
  ],
}

export const profil =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'

export const experiences = [
  {
    // entrée complète : détails, description, note et puces en liste
    date: '2022 - Aujourd’hui',
    titre: 'Lorem ipsum dolor',
    details: 'Entreprise Lorem · Ville',
    description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.',
    note: 'Stack : Lorem, Ipsum, Dolor, Sit, Amet',
    puces: [
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.',
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.',
      'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.',
      'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.',
    ],
  },
  {
    // puces sur une ligne
    date: '2019 - 2022',
    titre: 'Consectetur adipiscing',
    details: 'Entreprise Ipsum · Ville',
    description: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet.',
    puces: ['Lorem', 'Ipsum', 'Dolor sit amet', 'Consectetur', 'Adipiscing elit'],
    pucesSurUneLigne: true,
  },
  {
    date: '2020 - 2021',
    titre: 'Ipsum dolor sit amet',
    details: 'Entreprise Dolor · Ville',
    description: 'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil.',
    puces: [
      'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus.',
      'Itaque earum rerum hic tenetur a sapiente delectus ut aut reiciendis.',
    ],
  },
  {
    // entrée minimale : seulement la date et le titre
    date: '2018',
    titre: 'Sed do eiusmod tempor',
  },
]

export const formations = [
  {
    date: '2016 - 2019',
    titre: 'Diplôme lorem ipsum',
    details: 'Établissement Dolor · Ville',
    description: 'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis.',
    note: 'Mention : lorem ipsum dolor',
    puces: ['Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse.'],
  },
  {
    date: '2018 - 2019',
    titre: 'Master ipsum dolor',
    details: 'Établissement Sit · Ville',
    description: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.',
    puces: ['Sed quia consequuntur magni dolores eos qui ratione voluptatem sequi.'],
  },
  {
    date: '2014 - 2016',
    titre: 'Certificat sit amet',
    details: 'Établissement Amet · Ville',
  },
]

export const projets = [
  {
    date: '2023',
    titre: 'Projet lorem ipsum',
    details: 'Projet personnel',
    description: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis.',
    note: 'exemple.com/projet-lorem',
    puces: ['Et harum quidem rerum facilis est et expedita distinctio.'],
  },
  {
    date: '2021',
    titre: 'Projet dolor sit',
    description: 'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil.',
    puces: ['Lorem', 'Ipsum', 'Dolor'],
    pucesSurUneLigne: true,
  },
]

export const competences = [
  { categorie: 'Lorem ipsum', detail: 'Dolor sit amet, consectetur, adipiscing, elit, sed do' },
  { categorie: 'Dolor sit', detail: 'Eiusmod tempor, incididunt, ut labore, et dolore magna' },
  { categorie: 'Consectetur', detail: 'Aliqua, ut enim, ad minim veniam, quis nostrud' },
  { categorie: 'Adipiscing', detail: 'Duis aute, irure dolor, in reprehenderit, voluptate velit' },
  { categorie: 'Elit sed', detail: 'Esse cillum, dolore eu fugiat, nulla pariatur, excepteur' },
]

export const infosComplementaires = [
  {
    titre: 'Langues',
    elements: [
      'Français : langue maternelle',
      'Anglais : courant',
      'Lorem : notions',
      'Ipsum : débutant',
    ],
  },
  {
    titre: 'Centres d’intérêt',
    elements: ['Lorem ipsum', 'Dolor sit amet', 'Consectetur', 'Sit amet'],
  },
  {
    titre: 'Divers',
    elements: ['Ipsum dolor', 'Adipiscing elit', 'Sed do'],
  },
]
