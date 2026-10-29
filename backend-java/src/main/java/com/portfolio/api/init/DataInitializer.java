package com.portfolio.api.init;

import com.portfolio.api.entity.*;
import com.portfolio.api.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final ProjectRepository projectRepository;
    private final ParcoursRepository parcoursRepository;
    private final StageRepository stageRepository;

    @Override
    public void run(String... args) {
        if (projectRepository.count() > 0) return;

        seedProjects();
        seedParcours();
        seedStages();
    }

    private void seedProjects() {
        Project p1 = new Project();
        p1.setSlug("ct-scan-deep-learning");
        p1.setTier(1);
        p1.setContext("ESME");
        p1.setTitle("CT-Scan & Deep Learning");
        p1.setSubtitle("Détection cancer du poumon");
        p1.setDescription("Classification de scanners thoraciques par transfer learning. EfficientNet-B0 fine-tuné sur dataset Chest CT-Scan Kaggle — 87,6% accuracy, F1=0,885.");
        p1.setLongDescription("Projet académique Ingé2 ESME (trinôme Desmartin / Tassin / Kiefer, encadrant Mbogol Touye Achille). Objectif : classer des scanners thoraciques en cancéreux / sains par deep learning. Approche : fine-tuning de modèles CNN pré-entraînés sur ImageNet — VGG16, ResNet50, puis EfficientNet-B0. EfficientNet-B0 s'est imposé comme le meilleur compromis performance/poids. Suite prévue : intégration d'un Vision Transformer (ViT) et déploiement d'une application de détection accessible.");
        p1.setTags(List.of("PyTorch", "EfficientNet-B0", "Transfer Learning", "Python", "CNN", "Kaggle"));
        p1.setHas3D(true);
        p1.setLinkedParcoursId("esme");
        p1.setHighlights(List.of(
                new Highlight("87.6%", "Accuracy", "#2a6db5"),
                new Highlight("0.885", "F1 Score", "#2d8c5f"),
                new Highlight("3", "modèles comparés", "#8b5cf6")
        ));
        p1.setLinks(List.of(new ResourceLink("GitHub", "https://github.com/TouyeAchille/lung-cancer-ct-detection-ai")));

        Project p2 = new Project();
        p2.setSlug("regulateur-glycemie");
        p2.setTier(1);
        p2.setContext("BUT");
        p2.setTitle("Régulation glycémie — Diabète T1");
        p2.setSubtitle("Correcteur PID · MATLAB/Simulink");
        p2.setDescription("Modélisation et régulation de la glycémie chez le patient diabétique de type 1. Correcteur PID Ziegler-Nichols sur simulateur UVA/Padova (validé FDA), 11 patients × 222 simulations.");
        p2.setLongDescription("Projet tutoré S4 BUT Mesures Physiques (quadrinôme, tuteur J. Cieslak). Modélisation de la dynamique glycémique sur le simulateur UVA/Padova (validé FDA) et synthèse d'un correcteur PID par la méthode de Ziegler-Nichols. Campagne de simulations sur 11 profils patients × 222 scénarios. Analyses fréquentielles (diagrammes de Bode, Black-Nichols). Extension hardware : détecteur d'activité physique sur Arduino MKR WiFi 1010 avec capteur GSR et communication BLE pour adapter la correction en temps réel.");
        p2.setTags(List.of("MATLAB", "Simulink", "PID", "Biomédical", "Arduino", "BLE", "GSR"));
        p2.setHas3D(true);
        p2.setLinkedParcoursId("but");
        p2.setHighlights(List.of(
                new Highlight("222", "simulations", "#2a6db5"),
                new Highlight("11", "profils patients", "#2d8c5f"),
                new Highlight("FDA", "simulateur validé", "#d97706")
        ));

        Project p3 = new Project();
        p3.setSlug("main-robotique-emg");
        p3.setTier(1);
        p3.setContext("BUT");
        p3.setTitle("Main robotique EMG");
        p3.setSubtitle("Commande myoélectrique");
        p3.setDescription("Commande d'une main robotique par signaux EMG de surface. Capteurs sur avant-bras → traitement → servos. Modèle CAO SolidWorks, électronique Arduino.");
        p3.setLongDescription("Conception complète d'une main robotique commandée par électromyographie de surface. Les capteurs EMG sont placés sur l'avant-bras de l'utilisateur ; les signaux bruts sont filtrés, amplifiés, puis traités pour extraire l'intention de mouvement. La commande pilote des servomoteurs assurant les différentes prises de la main. Modélisation mécanique 3D sous SolidWorks, électronique Arduino. Modèle 3D optimisé disponible (GLB, 241 KB) pour rendu web temps réel.");
        p3.setTags(List.of("Arduino", "EMG", "SolidWorks", "CAO", "Électronique", "Servomoteurs"));
        p3.setHas3D(true);
        p3.setLinkedParcoursId("du-sante");
        p3.setHighlights(List.of(
                new Highlight("5", "DoF simulés", "#2a6db5"),
                new Highlight("241 KB", "modèle 3D GLB", "#2d8c5f"),
                new Highlight("EMG", "surface signals", "#8b5cf6")
        ));

        Project p4 = new Project();
        p4.setSlug("mon-wallet-medical");
        p4.setTier(2);
        p4.setContext("Perso");
        p4.setTitle("Mon Wallet Médical");
        p4.setSubtitle("Blockchain · Santé · Full-stack");
        p4.setDescription("Application de gestion des données de santé personnelles avec stockage décentralisé (IPFS), blockchain Polygon et chiffrement AES-256-GCM côté client.");
        p4.setLongDescription("Projet personnel full-stack en cours depuis mars 2026. Architecture en 5 couches : interface React Native, API Fastify TypeScript, PostgreSQL/Prisma, IPFS (Pinata) pour le stockage décentralisé, smart contracts Solidity sur Polygon. Chiffrement AES-256-GCM côté client avec clés ECDSA secp256k1, identité décentralisée W3C DID, Verifiable Credentials. Conformité RGPD intégrée dès la conception. Monorepo Turborepo/pnpm.");
        p4.setTags(List.of("Next.js", "Solidity", "IPFS", "Blockchain", "TypeScript", "Fastify", "Prisma", "Polygon"));
        p4.setHas3D(false);
        p4.setHighlights(List.of(
                new Highlight("AES-256", "chiffrement client", "#2a6db5"),
                new Highlight("IPFS", "stockage décentralisé", "#8b5cf6"),
                new Highlight("W3C DID", "identité", "#2d8c5f")
        ));

        Project p5 = new Project();
        p5.setSlug("ethylometre");
        p5.setTier(2);
        p5.setContext("BUT");
        p5.setTitle("Éthylomètre connecté");
        p5.setSubtitle("Prototype de A à Z");
        p5.setDescription("Conception complète d'un éthylomètre connecté : capteur alcool, écran OLED, boîtier imprimé 3D. Modèle 3D Three.js réalisé.");
        p5.setLongDescription("Projet BUT 1A conçu de A à Z en binôme. Capteur MQ-3 pour la détection d'alcool, affichage OLED, LEDs de signalisation, buzzer d'alerte, boîtier imprimé en 3D avec skin \"Police Nationale\" pour la démo. Modèle Three.js complet du prototype réalisé (~865 lignes, rendu web en temps réel). Illustre la démarche complète d'un projet embarqué : spécification, conception électronique, firmware, boîtier mécanique, démonstration.");
        p5.setTags(List.of("Arduino", "OLED", "Impression 3D", "Three.js", "MQ-3", "Électronique"));
        p5.setHas3D(true);
        p5.setLinkedParcoursId("du-sante");
        p5.setHighlights(List.of(
                new Highlight("3D", "modèle web interactif", "#2a6db5"),
                new Highlight("MQ-3", "capteur alcool", "#2d8c5f")
        ));

        Project p6 = new Project();
        p6.setSlug("anemometre");
        p6.setTier(2);
        p6.setContext("ESME");
        p6.setTitle("Anémomètre connecté");
        p6.setSubtitle("Éolienne · Effet Hall · SolidWorks");
        p6.setDescription("Anémomètre connecté inspiré d'une nacelle d'éolienne. Capteur effet Hall, LCD RGB, boîtier imprimé 3D (52h d'impression).");
        p6.setLongDescription("Projet Ingé1 ESME (parcours Énergie & Environnement, déc. 2024, binôme avec Victor Maggiori, encadrant M. Delahaye). Boîtier inspiré d'une nacelle d'éolienne, conçu sous SolidWorks — 52h d'impression 3D. Mesure de vitesse par capteur à effet Hall, affichage LCD RGB, plage de mesure 11–90 km/h. Note d'honnêteté sur le projet : un conflit entre les interruptions et la gestion moteur pas-à-pas a empêché la démo complète le jour J. La solution \"deux cartes Arduino\" a été identifiée mais trop tard — la transparence technique est une qualité ingénieur.");
        p6.setTags(List.of("Arduino", "Effet Hall", "SolidWorks", "Impression 3D", "LCD RGB", "CAO"));
        p6.setHas3D(true);
        p6.setLinkedParcoursId("esme");
        p6.setHighlights(List.of(
                new Highlight("52h", "impression 3D", "#2a6db5"),
                new Highlight("11–90", "km/h plage", "#2d8c5f")
        ));

        Project p7 = new Project();
        p7.setSlug("eaux-residuaires");
        p7.setTier(2);
        p7.setContext("BUT");
        p7.setTitle("Étude des eaux résiduaires");
        p7.setSubtitle("HPLC · GC-FID · Micropolluants");
        p7.setDescription("Analyse de micropolluants (HAP, MTBE, Irgarol) dans des eaux douces et salées par HPLC-UV, GC-FID, SPME et SBSE.");
        p7.setLongDescription("Projet tutoré BUT Mesures Physiques (parcours MAE). Étude de la contamination par micropolluants organiques dans différents types d'eaux. Analyse des HAP (hydrocarbures aromatiques polycycliques), MTBE et Irgarol par chromatographie liquide haute performance (HPLC-UV) et chromatographie en phase gazeuse (GC-FID). Extraction par SPME (micro-extraction en phase solide) et SBSE (extraction par barrette agitante). Travail d'analyse environnementale et interprétation des résultats.");
        p7.setTags(List.of("HPLC-UV", "GC-FID", "SPME", "SBSE", "HAP", "Micropolluants", "Chimie analytique"));
        p7.setHas3D(false);
        p7.setLinkedParcoursId("but");
        p7.setHighlights(List.of(
                new Highlight("HAP", "micropolluants", "#2a6db5"),
                new Highlight("2 milieux", "eau douce & salée", "#2d8c5f")
        ));

        projectRepository.saveAll(List.of(p1, p2, p3, p4, p5, p6, p7));
    }

    private void seedParcours() {
        ParcoursStep s1 = new ParcoursStep();
        s1.setId("but");
        s1.setType("formation");
        s1.setPeriod("2021 – 2024");
        s1.setTitle("BUT Mesures Physiques");
        s1.setInstitution("IUT de Bordeaux");
        s1.setLocation("Bordeaux");
        s1.setDescription("Formation en instrumentation, métrologie, capteurs, traitement du signal et électronique. Base scientifique solide sur la mesure du monde physique.");
        s1.setTags(List.of("Instrumentation", "Métrologie", "Électronique", "Signal", "Python", "Arduino"));
        s1.setProjects(List.of("regulateur-glycemie", "eaux-residuaires"));
        s1.setDone(true);
        s1.setDisplayOrder(1);

        ParcoursStep s2 = new ParcoursStep();
        s2.setId("du-sante");
        s2.setType("formation");
        s2.setPeriod("2022");
        s2.setTitle("DU Technologie au Service de la Santé");
        s2.setInstitution("IUT de Bordeaux");
        s2.setLocation("Bordeaux");
        s2.setDescription("Diplôme universitaire complémentaire réalisé en parallèle du BUT. Introduction aux dispositifs médicaux, réglementation, et usages du numérique en santé.");
        s2.setTags(List.of("Dispositifs médicaux", "Santé numérique", "Réglementation", "e-santé"));
        s2.setProjects(List.of("main-robotique-emg", "ethylometre"));
        s2.setDone(true);
        s2.setDisplayOrder(2);

        ParcoursStep s3 = new ParcoursStep();
        s3.setId("stage-excell");
        s3.setType("stage");
        s3.setPeriod("Jan – Mars 2023");
        s3.setTitle("Stage — Laboratoire Excell");
        s3.setInstitution("Laboratoire Excell");
        s3.setLocation("Floirac (33)");
        s3.setDescription("Stage de 12 semaines en laboratoire d'analyses. Diagnostic et audit métrologique, participation aux processus qualité.");
        s3.setTags(List.of("Métrologie", "Qualité", "Laboratoire", "Audit"));
        s3.setDone(true);
        s3.setDisplayOrder(3);

        ParcoursStep s4 = new ParcoursStep();
        s4.setId("stage-quantum");
        s4.setType("stage");
        s4.setPeriod("Mars – Juin 2024");
        s4.setTitle("Stage — Quantum Surgical");
        s4.setInstitution("Quantum Surgical");
        s4.setLocation("Montpellier");
        s4.setDescription("Stage de 16 semaines en robotique chirurgicale. Métrologie ISO 17025, digitalisation des processus qualité (BizzMine), support à la validation de systèmes robotiques médicaux.");
        s4.setTags(List.of("Robotique chirurgicale", "Métrologie ISO 17025", "Qualité", "BizzMine", "Médical"));
        s4.setProjects(List.of("stage-quantum-surgical"));
        s4.setDone(true);
        s4.setDisplayOrder(4);

        ParcoursStep s5 = new ParcoursStep();
        s5.setId("esme");
        s5.setType("formation");
        s5.setPeriod("2024 – 2027");
        s5.setTitle("École d'ingénieur — ESME");
        s5.setInstitution("ESME");
        s5.setLocation("Paris");
        s5.setDescription("Spécialisation Biotech & Numérique. Machine learning appliqué au médical, IoT, blockchain santé, dispositifs médicaux connectés.");
        s5.setTags(List.of("Machine Learning", "Deep Learning", "IoT", "Blockchain", "Dispositifs médicaux", "Java", "Rust", "React"));
        s5.setProjects(List.of("ct-scan-deep-learning", "mon-wallet-medical", "ai4industry-stm", "anemometre"));
        s5.setDone(false);
        s5.setDisplayOrder(5);

        ParcoursStep s6 = new ParcoursStep();
        s6.setId("coree");
        s6.setType("echange");
        s6.setPeriod("Sept. 2025 – Fév. 2026");
        s6.setTitle("Semestre international");
        s6.setInstitution("Kyungpook National University");
        s6.setLocation("Daegu, Corée du Sud");
        s6.setDescription("S3 de l'ESME à l'étranger. Immersion dans un environnement académique asiatique, enseignements en anglais, découverte de l'écosystème tech coréen.");
        s6.setTags(List.of("International", "Anglais", "Corée du Sud", "KNU"));
        s6.setDone(true);
        s6.setDisplayOrder(6);

        ParcoursStep s7 = new ParcoursStep();
        s7.setId("stage-inge");
        s7.setType("stage");
        s7.setPeriod("Juin – Sept. 2026");
        s7.setTitle("Stage ingénieur");
        s7.setInstitution("À définir");
        s7.setLocation("À définir");
        s7.setDescription("Stage ingénieur de 3 à 4 mois prévu en juin 2026, dans le cadre de la 2ème année à l'ESME. Avant le PFE de fin d'études.");
        s7.setTags(List.of("Stage", "Ingénieur", "2ème année ESME", "Biomédical"));
        s7.setDone(false);
        s7.setDisplayOrder(7);

        ParcoursStep s8 = new ParcoursStep();
        s8.setId("pfe");
        s8.setType("cible");
        s8.setPeriod("Début 2027");
        s8.setTitle("PFE — Stage ingénieur 6 mois");
        s8.setInstitution("À définir");
        s8.setLocation("France / International");
        s8.setDescription("Recherche d'un stage de fin d'études en R&D biomédicale : medtech, imagerie médicale, dispositifs médicaux, data santé.");
        s8.setTags(List.of("R&D", "Biomédical", "Medtech", "Imagerie", "Data santé"));
        s8.setDone(false);
        s8.setDisplayOrder(8);

        parcoursRepository.saveAll(List.of(s1, s2, s3, s4, s5, s6, s7, s8));
    }

    private void seedStages() {
        Stage st1 = new Stage();
        st1.setSlug("quantum-surgical");
        st1.setCompany("Quantum Surgical");
        st1.setRole("Stagiaire ingénieur qualité & métrologie");
        st1.setContext("Stage BUT 3A");
        st1.setPeriod("Mars – Juin 2024");
        st1.setDuration("16 semaines");
        st1.setLocation("Montpellier");
        st1.setDescription("Métrologie ISO 17025, digitalisation des processus qualité, support à la validation de systèmes robotiques médicaux guidés par l'image.");
        st1.setLongDescription("Stage de 16 semaines chez Quantum Surgical à Montpellier (mars–juin 2024), startup spécialisée dans les systèmes robotiques chirurgicaux guidés par l'image. Mission principale : audit et mise en conformité métrologique ISO 17025 du laboratoire, digitalisation des processus qualité via BizzMine, et support à la validation des performances de robots chirurgicaux. Travail en environnement réglementé (dispositifs médicaux de classe III), en lien direct avec les équipes R&D et qualité.");
        st1.setMissions(List.of(
                "Audit et mise en conformité métrologique du laboratoire (ISO 17025)",
                "Digitalisation des processus qualité via BizzMine",
                "Support à la validation de performances de robots chirurgicaux",
                "Rédaction de procédures et de rapports d'étalonnage",
                "Travail en environnement dispositif médical classe III"
        ));
        st1.setTags(List.of("Robotique médicale", "Métrologie ISO 17025", "Qualité", "BizzMine", "Dispositif classe III"));
        st1.setHighlights(List.of(
                new Highlight("16", "semaines", "#2d8c5f"),
                new Highlight("ISO 17025", "conformité", "#2a6db5"),
                new Highlight("Classe III", "dispositif médical", "#8b5cf6")
        ));

        Stage st2 = new Stage();
        st2.setSlug("laboratoire-excell");
        st2.setCompany("Laboratoire Excell");
        st2.setRole("Stagiaire métrologie & qualité");
        st2.setContext("Stage BUT 2A");
        st2.setPeriod("Jan – Mars 2023");
        st2.setDuration("12 semaines");
        st2.setLocation("Floirac (33)");
        st2.setDescription("Diagnostic et audit métrologique d'un laboratoire d'analyses. Participation aux processus qualité et à la gestion des instruments de mesure.");
        st2.setLongDescription("Stage de 12 semaines au Laboratoire Excell à Floirac, laboratoire spécialisé en analyses physicochimiques et biologiques. Mission centrée sur le diagnostic métrologique : inventaire et suivi du parc instrumental, vérification des procédures d'étalonnage, participation aux revues qualité. Immersion dans un environnement normé (ISO 17025), en lien avec les équipes techniques et qualité.");
        st2.setMissions(List.of(
                "Diagnostic et audit du parc d'instruments de mesure",
                "Suivi et mise à jour des procédures d'étalonnage",
                "Participation aux revues qualité internes",
                "Rédaction de documents qualité (fiches d'intervention, rapports)"
        ));
        st2.setTags(List.of("Métrologie", "Qualité", "Laboratoire", "ISO 17025", "Audit"));
        st2.setHighlights(List.of(
                new Highlight("12", "semaines", "#2d8c5f"),
                new Highlight("ISO 17025", "environnement", "#2a6db5")
        ));

        Stage st3 = new Stage();
        st3.setSlug("stage-ingenieur");
        st3.setCompany("À définir");
        st3.setRole("Stagiaire ingénieur");
        st3.setContext("Stage ESME 2A");
        st3.setPeriod("Juin – Sept. 2026");
        st3.setDuration("3 – 4 mois");
        st3.setLocation("France");
        st3.setDescription("Stage ingénieur de 2ème année ESME, prévu en juin 2026. Domaine cible : biomédical, medtech, IoT médical ou data santé.");
        st3.setMissions(List.of());
        st3.setTags(List.of("Biomédical", "Medtech", "IoT", "Data santé"));
        st3.setUpcoming(true);

        stageRepository.saveAll(List.of(st1, st2, st3));
    }
}
