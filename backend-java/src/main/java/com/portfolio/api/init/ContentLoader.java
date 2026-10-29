package com.portfolio.api.init;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.api.entity.ParcoursStep;
import com.portfolio.api.entity.Project;
import com.portfolio.api.entity.Stage;
import com.portfolio.api.repository.ParcoursRepository;
import com.portfolio.api.repository.ProjectRepository;
import com.portfolio.api.repository.StageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

/**
 * Charge le contenu du portfolio depuis content/portfolio.json, généré à partir de
 * frontend/src/lib/data.ts (npm run export-content). Le JSON est la seule source :
 * les tables sont reconstruites à chaque démarrage, en dev comme en prod.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class ContentLoader implements ApplicationRunner {

    static final String CONTENT_PATH = "content/portfolio.json";

    private final ProjectRepository projectRepository;
    private final ParcoursRepository parcoursRepository;
    private final StageRepository stageRepository;
    private final ObjectMapper objectMapper;

    record PortfolioContent(List<Project> projects, List<ParcoursStep> parcours, List<Stage> stages) {
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) throws IOException {
        PortfolioContent content = read();

        // flush entre suppression et insertion : Hibernate exécute sinon les INSERT avant les DELETE
        // et les slugs uniques entreraient en conflit
        projectRepository.deleteAll();
        projectRepository.flush();
        parcoursRepository.deleteAll();
        parcoursRepository.flush();
        stageRepository.deleteAll();
        stageRepository.flush();

        for (int i = 0; i < content.projects().size(); i++) content.projects().get(i).setPosition(i);
        for (int i = 0; i < content.parcours().size(); i++) content.parcours().get(i).setDisplayOrder(i);
        for (int i = 0; i < content.stages().size(); i++) content.stages().get(i).setPosition(i);

        projectRepository.saveAll(content.projects());
        parcoursRepository.saveAll(content.parcours());
        stageRepository.saveAll(content.stages());

        log.info("Contenu chargé : {} projets, {} étapes de parcours, {} stages",
                content.projects().size(), content.parcours().size(), content.stages().size());
    }

    /** Lecture stricte : un champ ajouté dans data.ts mais inconnu des entités fait échouer le démarrage. */
    PortfolioContent read() throws IOException {
        ObjectMapper strict = objectMapper.copy().enable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
        try (InputStream in = new ClassPathResource(CONTENT_PATH).getInputStream()) {
            return strict.readValue(in, PortfolioContent.class);
        }
    }
}
