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
    period: '2021 – 2023',
    title: 'DU Techniques au Service de la Santé (TSS)',
    institution: 'IUT de Bordeaux',
    location: 'Bordeaux',
    description: 'Diplôme universitaire suivi en parallèle des deux premières années du BUT. Introduction aux dispositifs médicaux, à leur réglementation et aux usages du numérique en santé.',
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
    description: 'Stage de 16 semaines chez un fabricant de robots chirurgicaux. Optimisation du processus de gestion du parc métrologique et digitalisation des processus qualité (BizzMine).',
    tags: ['Robotique chirurgicale', 'Métrologie', 'Qualité', 'BizzMine', 'Dispositifs médicaux'],
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
    description: 'Majeure Biotech & Numérique, en dernière année. Machine learning appliqué au médical, imagerie, dispositifs médicaux connectés et IoT.',
    tags: ['Machine Learning', 'Deep Learning', 'Imagerie médicale', 'IoT', 'Dispositifs médicaux'],
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
    id: 'stage-inserm',
    type: 'stage',
    period: 'Juin – Sept. 2026',
    title: 'Stage — INSERM U1211 (MRGM)',
    institution: 'INSERM · Université de Bordeaux',
    location: 'Bordeaux',
    description: 'Stage de 12 semaines en bio-informatique pour le programme Austral-Omics : chaîne d\'analyse de metabarcoding sur lectures Nanopore, validée sur des communautés de composition connue, avec un apport de deep learning et une application web pour l\'équipe.',
    tags: ['Bio-informatique', 'Metabarcoding', 'Nanopore', '16S / COI', 'Deep Learning', 'Application web'],
    done: true,
  },
  {
    id: 'pfe',
    type: 'cible',
    period: 'Avril 2027',
    title: 'PFE — Stage de fin d\'études, 6 mois',
    institution: 'À définir',
    location: 'France / International',
    description: 'Recherche d\'un stage de fin d\'études de 6 mois à partir du 7 avril 2027, en R&D biomédicale : medtech, imagerie médicale, dispositifs médicaux, data santé.',
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
    slug: 'inserm-mrgm',
    company: 'INSERM U1211 — MRGM',
    role: 'Stagiaire bio-informatique',
    context: 'Stage ESME 4ᵉ année',
    period: '22 juin – 11 sept. 2026',
    duration: '12 semaines',
    location: 'Bordeaux',
    description: 'Construction et validation d\'une chaîne d\'analyse de metabarcoding sur séquençage Nanopore, pour les échantillons de l\'océan Austral du programme Austral-Omics.',
    longDescription: 'Stage de 12 semaines au sein de l\'unité INSERM U1211 Maladies Rares : Génétique et Métabolisme (MRGM), sous la double tutelle de l\'INSERM et de l\'Université de Bordeaux, encadré par Christophe Hubert, ingénieur en métagénomique. L\'unité porte le programme Austral-Omics, une campagne d\'analyse multiomique du plancton et des procaryotes de l\'océan Austral orientée vers la bioprospection en santé humaine. Les échantillons de l\'expédition seront séquencés à bord avec un séquenceur portable Nanopore et n\'étaient pas encore prélevés : il fallait construire et valider la méthode en amont, sur des communautés de composition connue et sur des données publiques. La question centrale : qu\'y a-t-il dans cet échantillon, et à quel point peut-on croire la réponse ?',
    missions: [
      'Chaîne d\'analyse de metabarcoding complète, des lectures brutes Nanopore à la composition de l\'échantillon',
      'Deux marqueurs : 16S pour les bactéries, COI pour les animaux',
      'Mesure de la fiabilité face à une vérité connue et identification du rang taxonomique à partir duquel la chaîne cesse d\'être fiable (initiative personnelle)',
      'Deep learning pour situer les séquences absentes des banques de référence, et mesure de son apport réel face à la méthode classique (initiative personnelle)',
      'Application web pour rendre la chaîne utilisable par l\'équipe',
    ],
    tags: ['Bio-informatique', 'Metabarcoding', 'Nanopore', '16S', 'COI', 'Deep Learning', 'Application web'],
    highlights: [
      { value: '12', label: 'semaines', color: '#2d8c5f' },
      { value: 'Nanopore', label: 'séquençage portable', color: '#3f5f86' },
      { value: '16S · COI', label: 'marqueurs', color: '#3f5f86' },
    ],
  },
  {
    slug: 'quantum-surgical',
    company: 'Quantum Surgical',
    role: 'Stagiaire métrologie & qualité',
    context: 'Stage BUT 3A',
    period: 'Mars – Juin 2024',
    duration: '16 semaines',
    location: 'Montpellier',
    description: 'Optimisation du processus de gestion du parc métrologique et digitalisation des processus qualité, chez un fabricant de robots chirurgicaux.',
    longDescription: 'Stage de 16 semaines chez Quantum Surgical à Montpellier, entreprise qui conçoit Epione, un robot d\'assistance aux procédures percutanées guidées par l\'image en oncologie interventionnelle. Mission : optimiser le processus de gestion du parc métrologique et digitaliser les processus qualité associés via BizzMine, dans le cadre exigeant d\'un fabricant de dispositifs médicaux.',
    missions: [
      'Optimisation du processus de gestion du parc métrologique',
      'Digitalisation des processus qualité via BizzMine',
      'Travail selon les bonnes pratiques de laboratoire et le référentiel ISO 17025',
    ],
    tags: ['Robotique chirurgicale', 'Métrologie', 'Qualité', 'BizzMine', 'Dispositifs médicaux'],
    highlights: [
      { value: '16', label: 'semaines', color: '#2d8c5f' },
      { value: 'Medtech', label: 'robotique chirurgicale', color: '#3f5f86' },
    ],
  },
  {
    slug: 'laboratoire-excell',
    company: 'Laboratoire Excell',
    role: 'Stagiaire métrologie',
    context: 'Stage BUT 2A',
    period: 'Jan – Mars 2023',
    duration: '12 semaines',
    location: 'Floirac (33)',
    description: 'Étude et diagnostic du dispositif de métrologie d\'un laboratoire d\'analyses accrédité ISO/IEC 17025.',
    longDescription: 'Stage de 12 semaines au Laboratoire Excell à Floirac, laboratoire d\'analyses agroalimentaires et de boissons accrédité Cofrac selon la norme ISO/IEC 17025. Mission : étudier et diagnostiquer le dispositif de métrologie du laboratoire.',
    missions: [
      'Étude et diagnostic du dispositif de métrologie du laboratoire',
      'Immersion dans un environnement accrédité ISO/IEC 17025',
    ],
    tags: ['Métrologie', 'Qualité', 'Laboratoire', 'ISO 17025'],
    highlights: [
      { value: '12', label: 'semaines', color: '#2d8c5f' },
      { value: 'ISO 17025', label: 'labo accrédité', color: '#3f5f86' },
    ],
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
    subtitle: 'Classification de nodules pulmonaires · 4 classes',
    description: 'Classification de CT-scans thoraciques en 4 classes (3 sous-types de cancer + tissu sain) par transfer learning. Ensemble ResNet50 + DenseNet121 : 93,7 % d\'accuracy test, F1 macro 0,939.',
    longDescription: 'Projet d\'application Ingé2 ESME (avril 2026), en trinôme avec Camille Tassin et Julia Kiefer, encadré par Achille Mbogol Touye. Données : Chest CT-Scan Images Dataset (Kaggle), environ 1 000 images réparties en adénocarcinome, carcinome à grandes cellules, carcinome épidermoïde et tissu normal, avec un découpage train / validation / test fourni, ce qui limite le risque de fuite de données. Déséquilibre des classes compensé par une pondération de la CrossEntropyLoss. Méthode : augmentation de données à l\'entraînement (recadrage 224×224, flips, rotation ±15°), puis fine-tuning en deux phases (backbone gelé, puis réseau dégelé avec CosineAnnealingLR et early stopping). Benchmark de plusieurs architectures pré-entraînées sur ImageNet : DenseNet121 91,7 %, ResNet50 91,4 %, EfficientNet-B1 86,0 %, EfficientNet-B0 85,4 %, VGG16 61,0 %. Un soft voting entre ResNet50 et DenseNet121 atteint 93,7 % d\'accuracy et 0,939 de F1 macro, au-delà de l\'objectif de 90 %. Une application web charge une image CT et renvoie la classe prédite, les probabilités par classe et une description clinique. Limites : 1 000 images restent insuffisantes pour une validation clinique ; l\'étape suivante serait une validation sur un jeu clinique plus large comme LIDC-IDRI (images DICOM annotées par des radiologues).',
    tags: ['PyTorch', 'Transfer Learning', 'DenseNet121', 'ResNet50', 'Ensemble learning', 'Python'],
    has3D: true,
    highlights: [
      { value: '93.7%', label: 'accuracy test (ensemble)', color: '#3f5f86' },
      { value: '0.939', label: 'F1 macro', color: '#2d8c5f' },
      { value: '4', label: 'classes', color: '#3f5f86' },
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
    subtitle: 'Synthèse de correcteur · MATLAB/Simulink',
    description: 'Synthèse et validation d\'un correcteur de glycémie pour un patient diabétique de type 1 virtuel, sur le simulateur UVA/Padova. Correcteur conçu pour le patient n°11 et vérifié sur ses 222 scénarios.',
    longDescription: 'Projet tutoré S4 du BUT Mesures Physiques, en quadrinôme, tuteur J. Cieslak. Le simulateur UVA/Padova (UvaT1DM), accepté par la FDA comme alternative aux essais précliniques sur l\'animal, modélise le métabolisme du glucose d\'une cohorte de 11 patients virtuels, chacun avec 222 scénarios de simulation. Nous avons synthétisé un correcteur pour le patient n°11 à partir de son diagramme de Bode, vérifié le cahier des charges dans le diagramme de Black-Nichols sur ses 222 scénarios, ajusté le correcteur sur le cas le plus défavorable, puis intégré le correcteur dans le simulateur sous Simulink. En parallèle, nous avons prototypé un détecteur d\'activité physique : seuil de fréquence cardiaque réglable, capteur GSR pour écarter les fortes émotions, alerte par buzzer et transmission Bluetooth vers un smartphone. Son intégration dans la boucle de régulation reste une perspective.',
    tags: ['MATLAB', 'Simulink', 'Automatique', 'Bode / Black-Nichols', 'Arduino', 'BLE', 'GSR'],
    has3D: true,
    highlights: [
      { value: '222', label: 'scénarios simulés', color: '#3f5f86' },
      { value: '11', label: 'patients virtuels', color: '#2d8c5f' },
      { value: 'UVA/Padova', label: 'simulateur', color: '#3f5f86' },
    ],
    chain: [
      { label: 'Patient T1D', sublabel: 'patient virtuel n°11' },
      { label: 'Simulateur', sublabel: 'UVA/Padova' },
      { label: 'Mesure glycémie', sublabel: 'mg/dL' },
      { label: 'Correcteur', sublabel: 'Bode · Black-Nichols' },
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
    description: 'Main robotique imprimée en 3D, commandée par l\'activité musculaire de l\'avant-bras (EMG de surface) et actionnée par des servomoteurs pilotés par Arduino.',
    longDescription: 'Projet du BUT Mesures Physiques. Des électrodes EMG de surface captent l\'activité musculaire de l\'avant-bras ; le signal est traité par une carte Arduino qui commande les servomoteurs actionnant les doigts d\'une main imprimée en 3D, conçue sous SolidWorks. Les fichiers CAO d\'origine ayant été perdus, le modèle 3D présenté ici a été reconstruit à partir du rendu SolidWorks avec un outil image-to-3D (Trellis), puis optimisé pour le web (−88 % de poids). Les signaux affichés dans la démo sont une simulation illustrative, pas des enregistrements du prototype.',
    tags: ['Arduino', 'EMG', 'SolidWorks', 'Impression 3D', 'Servomoteurs', 'Électronique'],
    has3D: true,
    highlights: [
      { value: 'EMG', label: 'commande myoélectrique', color: '#3f5f86' },
      { value: '3D', label: 'main imprimée', color: '#2d8c5f' },
      { value: '−88 %', label: 'poids du modèle web', color: '#3f5f86' },
    ],
    chain: [
      { label: 'Électrodes EMG', sublabel: 'surface · avant-bras' },
      { label: 'Conditionnement', sublabel: 'signal musculaire' },
      { label: 'Arduino', sublabel: 'traitement · commande' },
      { label: 'Servomoteurs', sublabel: 'doigts' },
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
