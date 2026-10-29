export type StepType = 'formation' | 'stage' | 'echange' | 'cible'

export interface ParcoursStep {
  id: string
  type: StepType
  period: string
  title: string
  institution: string
  location: string
  description: string
  tags: string[]
  projects?: string[]   // slugs des projets liés
  done: boolean
}

export const PARCOURS: ParcoursStep[] = [
  {
    id: 'but',
    type: 'formation',
    period: '2021 – 2024',
    title: 'BUT Mesures Physiques',
    institution: 'IUT de Bordeaux',
    location: 'Bordeaux',
    description: 'Formation en instrumentation, métrologie, capteurs, traitement du signal et électronique. Base scientifique solide sur la mesure du monde physique.',
    tags: ['Instrumentation', 'Métrologie', 'Électronique', 'Signal', 'Python', 'Arduino'],
    projects: ['regulateur-glycemie', 'eaux-residuaires'],
    done: true,
  },
  {
    id: 'du-sante',
    type: 'formation',
    period: '2022',
    title: 'DU Technologie au Service de la Santé',
    institution: 'IUT de Bordeaux',
    location: 'Bordeaux',
    description: 'Diplôme universitaire complémentaire réalisé en parallèle du BUT. Introduction aux dispositifs médicaux, réglementation, et usages du numérique en santé.',
    tags: ['Dispositifs médicaux', 'Santé numérique', 'Réglementation', 'e-santé'],
    projects: ['main-robotique-emg', 'ethylometre'],
    done: true,
  },
  {
    id: 'stage-excell',
    type: 'stage',
    period: 'Jan – Mars 2023',
    title: 'Stage — Laboratoire Excell',
    institution: 'Laboratoire Excell',
    location: 'Floirac (33)',
    description: 'Stage de 12 semaines en laboratoire d\'analyses. Diagnostic et audit métrologique, participation aux processus qualité.',
    tags: ['Métrologie', 'Qualité', 'Laboratoire', 'Audit'],
    done: true,
  },
  {
    id: 'stage-quantum',
    type: 'stage',
    period: 'Mars – Juin 2024',
    title: 'Stage — Quantum Surgical',
    institution: 'Quantum Surgical',
    location: 'Montpellier',
    description: 'Stage de 16 semaines en robotique chirurgicale. Métrologie ISO 17025, digitalisation des processus qualité (BizzMine), support à la validation de systèmes robotiques médicaux.',
    tags: ['Robotique chirurgicale', 'Métrologie ISO 17025', 'Qualité', 'BizzMine', 'Médical'],
    projects: [],
    done: true,
  },
  {
    id: 'esme',
    type: 'formation',
    period: '2024 – 2027',
    title: 'École d\'ingénieur — ESME',
    institution: 'ESME',
    location: 'Paris',
    description: 'Spécialisation Biotech & Numérique. Machine learning appliqué au médical, IoT, blockchain santé, dispositifs médicaux connectés.',
    tags: ['Machine Learning', 'Deep Learning', 'IoT', 'Blockchain', 'Dispositifs médicaux', 'Java', 'Rust', 'React'],
    projects: ['ct-scan-deep-learning', 'mon-wallet-medical', 'ai4industry-stm', 'anemometre'],
    done: false,
  },
  {
    id: 'coree',
    type: 'echange',
    period: 'Sept. 2025 – Fév. 2026',
    title: 'Semestre international',
    institution: 'Kyungpook National University',
    location: 'Daegu, Corée du Sud',
    description: 'S3 de l\'ESME à l\'étranger. Immersion dans un environnement académique asiatique, enseignements en anglais, découverte de l\'écosystème tech coréen.',
    tags: ['International', 'Anglais', 'Corée du Sud', 'KNU'],
    done: true,
  },
  {
    id: 'stage-inge',
    type: 'stage',
    period: 'Juin – Sept. 2026',
    title: 'Stage ingénieur',
    institution: 'À définir',
    location: 'À définir',
    description: 'Stage ingénieur de 3 à 4 mois prévu en juin 2026, dans le cadre de la 2ème année à l\'ESME. Avant le PFE de fin d\'études.',
    tags: ['Stage', 'Ingénieur', '2ème année ESME', 'Biomédical'],
    done: false,
  },
  {
    id: 'pfe',
    type: 'cible',
    period: 'Début 2027',
    title: 'PFE — Stage ingénieur 6 mois',
    institution: 'À définir',
    location: 'France / International',
    description: 'Recherche d\'un stage de fin d\'études en R&D biomédicale : medtech, imagerie médicale, dispositifs médicaux, data santé.',
    tags: ['R&D', 'Biomédical', 'Medtech', 'Imagerie', 'Data santé'],
    done: false,
  },
]

export interface ProjectHighlight {
  value: string
  label: string
  color?: string
}

// ─── Stages ───────────────────────────────────────────────────────────────────

export interface Stage {
  slug: string
  company: string
  role: string
  context: string
  period: string
  duration: string
  location: string
  description: string
  longDescription?: string
  missions: string[]
  tags: string[]
  highlights?: ProjectHighlight[]
  links?: { label: string; href: string }[]
  upcoming?: boolean
}

export const STAGES: Stage[] = [
  {
    slug: 'quantum-surgical',
    company: 'Quantum Surgical',
    role: 'Stagiaire ingénieur qualité & métrologie',
    context: 'Stage BUT 3A',
    period: 'Mars – Juin 2024',
    duration: '16 semaines',
    location: 'Montpellier',
    description: 'Métrologie ISO 17025, digitalisation des processus qualité, support à la validation de systèmes robotiques médicaux guidés par l\'image.',
    longDescription: 'Stage de 16 semaines chez Quantum Surgical à Montpellier (mars–juin 2024), startup spécialisée dans les systèmes robotiques chirurgicaux guidés par l\'image. Mission principale : audit et mise en conformité métrologique ISO 17025 du laboratoire, digitalisation des processus qualité via BizzMine, et support à la validation des performances de robots chirurgicaux. Travail en environnement réglementé (dispositifs médicaux de classe III), en lien direct avec les équipes R&D et qualité.',
    missions: [
      'Audit et mise en conformité métrologique du laboratoire (ISO 17025)',
      'Digitalisation des processus qualité via BizzMine',
      'Support à la validation de performances de robots chirurgicaux',
      'Rédaction de procédures et de rapports d\'étalonnage',
      'Travail en environnement dispositif médical classe III',
    ],
    tags: ['Robotique médicale', 'Métrologie ISO 17025', 'Qualité', 'BizzMine', 'Dispositif classe III'],
    highlights: [
      { value: '16', label: 'semaines', color: '#2d8c5f' },
      { value: 'ISO 17025', label: 'conformité', color: '#2a6db5' },
      { value: 'Classe III', label: 'dispositif médical', color: '#8b5cf6' },
    ],
  },
  {
    slug: 'laboratoire-excell',
    company: 'Laboratoire Excell',
    role: 'Stagiaire métrologie & qualité',
    context: 'Stage BUT 2A',
    period: 'Jan – Mars 2023',
    duration: '12 semaines',
    location: 'Floirac (33)',
    description: 'Diagnostic et audit métrologique d\'un laboratoire d\'analyses. Participation aux processus qualité et à la gestion des instruments de mesure.',
    longDescription: 'Stage de 12 semaines au Laboratoire Excell à Floirac, laboratoire spécialisé en analyses physicochimiques et biologiques. Mission centrée sur le diagnostic métrologique : inventaire et suivi du parc instrumental, vérification des procédures d\'étalonnage, participation aux revues qualité. Immersion dans un environnement normé (ISO 17025), en lien avec les équipes techniques et qualité.',
    missions: [
      'Diagnostic et audit du parc d\'instruments de mesure',
      'Suivi et mise à jour des procédures d\'étalonnage',
      'Participation aux revues qualité internes',
      'Rédaction de documents qualité (fiches d\'intervention, rapports)',
    ],
    tags: ['Métrologie', 'Qualité', 'Laboratoire', 'ISO 17025', 'Audit'],
    highlights: [
      { value: '12', label: 'semaines', color: '#2d8c5f' },
      { value: 'ISO 17025', label: 'environnement', color: '#2a6db5' },
    ],
  },
  {
    slug: 'stage-ingenieur',
    company: 'À définir',
    role: 'Stagiaire ingénieur',
    context: 'Stage ESME 2A',
    period: 'Juin – Sept. 2026',
    duration: '3 – 4 mois',
    location: 'France',
    description: 'Stage ingénieur de 2ème année ESME, prévu en juin 2026. Domaine cible : biomédical, medtech, IoT médical ou data santé.',
    missions: [],
    tags: ['Biomédical', 'Medtech', 'IoT', 'Data santé'],
    upcoming: true,
  },
]

export type ProjectTier = 1 | 2 | 3
export type ProjectContext = 'BUT' | 'ESME' | 'Perso'

export interface ChainStep {
  label: string
  sublabel?: string
}

export interface Project {
  slug: string
  tier: ProjectTier
  context: ProjectContext
  title: string
  subtitle: string
  description: string
  longDescription?: string
  tags: string[]
  has3D: boolean
  highlights?: ProjectHighlight[]
  links?: { label: string; href: string }[]
  linkedParcoursId?: string
  chain?: ChainStep[]
  chainFeedback?: boolean
  chainLabel?: string
}

export const PROJECTS: Project[] = [
  {
    slug: 'ct-scan-deep-learning',
    tier: 1,
    context: 'ESME',
    title: 'CT-Scan & Deep Learning',
    subtitle: 'Détection cancer du poumon',
    description: 'Classification de scanners thoraciques par transfer learning. EfficientNet-B0 fine-tuné sur dataset Chest CT-Scan Kaggle — 87,6% accuracy, F1=0,885.',
    longDescription: 'Projet académique Ingé2 ESME (trinôme Desmartin / Tassin / Kiefer, encadrant Mbogol Touye Achille). Objectif : classer des scanners thoraciques en cancéreux / sains par deep learning. Approche : fine-tuning de modèles CNN pré-entraînés sur ImageNet — VGG16, ResNet50, puis EfficientNet-B0. EfficientNet-B0 s\'est imposé comme le meilleur compromis performance/poids. Suite prévue : intégration d\'un Vision Transformer (ViT) et déploiement d\'une application de détection accessible.',
    tags: ['PyTorch', 'EfficientNet-B0', 'Transfer Learning', 'Python', 'CNN', 'Kaggle'],
    has3D: true,
    highlights: [
      { value: '87.6%', label: 'Accuracy', color: '#2a6db5' },
      { value: '0.885', label: 'F1 Score', color: '#2d8c5f' },
      { value: '3', label: 'modèles comparés', color: '#8b5cf6' },
    ],
    links: [
      { label: 'GitHub', href: 'https://github.com/TouyeAchille/lung-cancer-ct-detection-ai' },
    ],
    linkedParcoursId: 'esme',
  },
  {
    slug: 'regulateur-glycemie',
    tier: 1,
    context: 'BUT',
    title: 'Régulation glycémie — Diabète T1',
    subtitle: 'Correcteur PID · MATLAB/Simulink',
    description: 'Modélisation et régulation de la glycémie chez le patient diabétique de type 1. Correcteur PID Ziegler-Nichols sur simulateur UVA/Padova (validé FDA), 11 patients × 222 simulations.',
    longDescription: 'Projet tutoré S4 BUT Mesures Physiques (quadrinôme, tuteur J. Cieslak). Modélisation de la dynamique glycémique sur le simulateur UVA/Padova (validé FDA) et synthèse d\'un correcteur PID par la méthode de Ziegler-Nichols. Campagne de simulations sur 11 profils patients × 222 scénarios. Analyses fréquentielles (diagrammes de Bode, Black-Nichols). Extension hardware : détecteur d\'activité physique sur Arduino MKR WiFi 1010 avec capteur GSR et communication BLE pour adapter la correction en temps réel.',
    tags: ['MATLAB', 'Simulink', 'PID', 'Biomédical', 'Arduino', 'BLE', 'GSR'],
    has3D: true,
    highlights: [
      { value: '222', label: 'simulations', color: '#2a6db5' },
      { value: '11', label: 'profils patients', color: '#2d8c5f' },
      { value: 'FDA', label: 'simulateur validé', color: '#d97706' },
    ],
    chain: [
      { label: 'Patient T1D', sublabel: 'glycémie perturbée' },
      { label: 'Simulateur', sublabel: 'UVA/Padova · FDA' },
      { label: 'Mesure glycémie', sublabel: 'mg/dL · temps réel' },
      { label: 'Correcteur PID', sublabel: 'Ziegler-Nichols' },
      { label: 'Pompe insuline', sublabel: 'dose u/h' },
    ],
    chainFeedback: true,
    chainLabel: 'Boucle de régulation',
    linkedParcoursId: 'but',
  },
  {
    slug: 'main-robotique-emg',
    tier: 1,
    context: 'BUT',
    title: 'Main robotique EMG',
    subtitle: 'Commande myoélectrique',
    description: 'Commande d\'une main robotique par signaux EMG de surface. Capteurs sur avant-bras → traitement → servos. Modèle CAO SolidWorks, électronique Arduino.',
    longDescription: 'Acquisition de signaux EMG de surface sur 4 canaux musculaires (flexor digitorum superficialis, extensor digitorum, flexor pollicis longus, abductor pollicis brevis). Amplification différentielle ×1000 (INA128), filtrage FIR bande passante 20–500 Hz, numérisation Arduino Mega à 1 kHz. Classification par seuillage adaptatif de 5 états de préhension : ouvert, fermé, pince, latéral, extension. Actionnement par 5 servomoteurs MG996R. Conception mécanique complète sous SolidWorks, impression 3D des pièces, câblage électronique. Modèle GLB optimisé (−88 % via gltfpack) pour rendu web temps réel.',
    tags: ['Arduino', 'EMG', 'SolidWorks', 'CAO', 'Électronique', 'Servomoteurs', 'INA128', 'FIR'],
    has3D: true,
    highlights: [
      { value: '5', label: 'DoF simulés', color: '#2a6db5' },
      { value: '5 prises', label: 'états de préhension', color: '#8b5cf6' },
      { value: '1 kHz', label: 'fréquence acquisition', color: '#2d8c5f' },
    ],
    chain: [
      { label: 'Électrodes EMG', sublabel: 'surface · 4 canaux' },
      { label: 'Amplificateur', sublabel: 'INA128 · ×1000' },
      { label: 'Filtrage FIR', sublabel: '20–500 Hz' },
      { label: 'Arduino Mega', sublabel: 'ADC 10bit · 1 kHz' },
      { label: 'Classification', sublabel: 'seuillage adaptatif' },
      { label: 'Servomoteurs', sublabel: '5 × MG996R' },
    ],
    chainLabel: 'Chaîne de commande EMG',
    linkedParcoursId: 'du-sante',
  },
  {
    slug: 'mon-wallet-medical',
    tier: 2,
    context: 'Perso',
    title: 'Mon Wallet Médical',
    subtitle: 'Blockchain · Santé · Full-stack',
    description: 'Application de gestion des données de santé personnelles avec stockage décentralisé (IPFS), blockchain Polygon et chiffrement AES-256-GCM côté client.',
    longDescription: 'Projet personnel full-stack en cours depuis mars 2026. Architecture en 5 couches : interface React Native, API Fastify TypeScript, PostgreSQL/Prisma, IPFS (Pinata) pour le stockage décentralisé, smart contracts Solidity sur Polygon. Chiffrement AES-256-GCM côté client avec clés ECDSA secp256k1, identité décentralisée W3C DID, Verifiable Credentials. Conformité RGPD intégrée dès la conception. Monorepo Turborepo/pnpm.',
    tags: ['Next.js', 'Solidity', 'IPFS', 'Blockchain', 'TypeScript', 'Fastify', 'Prisma', 'Polygon'],
    has3D: false,
    highlights: [
      { value: 'AES-256', label: 'chiffrement client', color: '#2a6db5' },
      { value: 'IPFS', label: 'stockage décentralisé', color: '#8b5cf6' },
      { value: 'W3C DID', label: 'identité', color: '#2d8c5f' },
    ],
  },
  {
    slug: 'ethylometre',
    tier: 2,
    context: 'BUT',
    title: 'Éthylomètre connecté',
    subtitle: 'Prototype de A à Z',
    description: 'Conception complète d\'un éthylomètre connecté : capteur alcool, écran OLED, boîtier imprimé 3D. Modèle 3D Three.js réalisé.',
    longDescription: 'Projet BUT 1A conçu de A à Z en binôme. Capteur MQ-3 pour la détection d\'alcool, affichage OLED, LEDs de signalisation, buzzer d\'alerte, boîtier imprimé en 3D avec skin "Police Nationale" pour la démo. Modèle Three.js complet du prototype réalisé (~865 lignes, rendu web en temps réel). Illustre la démarche complète d\'un projet embarqué : spécification, conception électronique, firmware, boîtier mécanique, démonstration.',
    tags: ['Arduino', 'OLED', 'Impression 3D', 'Three.js', 'MQ-3', 'Électronique'],
    has3D: true,
    highlights: [
      { value: '3D', label: 'modèle web interactif', color: '#2a6db5' },
      { value: 'MQ-3', label: 'capteur alcool', color: '#2d8c5f' },
    ],
    linkedParcoursId: 'du-sante',
  },
  {
    slug: 'anemometre',
    tier: 2,
    context: 'ESME',
    title: 'Anémomètre connecté',
    subtitle: 'Éolienne · Effet Hall · SolidWorks',
    description: 'Anémomètre connecté inspiré d\'une nacelle d\'éolienne. Capteur effet Hall, LCD RGB, boîtier imprimé 3D (52h d\'impression).',
    longDescription: 'Projet Ingé1 ESME (parcours Énergie & Environnement, déc. 2024, binôme avec Victor Maggiori, encadrant M. Delahaye). Boîtier inspiré d\'une nacelle d\'éolienne, conçu sous SolidWorks — 52h d\'impression 3D. Mesure de vitesse par capteur à effet Hall, affichage LCD RGB, plage de mesure 11–90 km/h. Note d\'honnêteté sur le projet : un conflit entre les interruptions et la gestion moteur pas-à-pas a empêché la démo complète le jour J. La solution "deux cartes Arduino" a été identifiée mais trop tard — la transparence technique est une qualité ingénieur.',
    tags: ['Arduino', 'Effet Hall', 'SolidWorks', 'Impression 3D', 'LCD RGB', 'CAO'],
    has3D: true,
    highlights: [
      { value: '52h', label: 'impression 3D', color: '#2a6db5' },
      { value: '11–90', label: 'km/h plage', color: '#2d8c5f' },
    ],
    linkedParcoursId: 'esme',
  },
  {
    slug: 'eaux-residuaires',
    tier: 2,
    context: 'BUT',
    title: 'Étude des eaux résiduaires',
    subtitle: 'HPLC · GC-FID · Micropolluants',
    description: 'Analyse de micropolluants (HAP, MTBE, Irgarol) dans des eaux douces et salées par HPLC-UV, GC-FID, SPME et SBSE.',
    longDescription: 'Projet tutoré BUT Mesures Physiques (parcours MAE). Étude de la contamination par micropolluants organiques dans différents types d\'eaux. Analyse des HAP (hydrocarbures aromatiques polycycliques), MTBE et Irgarol par chromatographie liquide haute performance (HPLC-UV) et chromatographie en phase gazeuse (GC-FID). Extraction par SPME (micro-extraction en phase solide) et SBSE (extraction par barrette agitante). Travail d\'analyse environnementale et interprétation des résultats.',
    tags: ['HPLC-UV', 'GC-FID', 'SPME', 'SBSE', 'HAP', 'Micropolluants', 'Chimie analytique'],
    has3D: false,
    highlights: [
      { value: 'HAP', label: 'micropolluants', color: '#2a6db5' },
      { value: '2 milieux', label: 'eau douce & salée', color: '#2d8c5f' },
    ],
    linkedParcoursId: 'but',
  },
]
