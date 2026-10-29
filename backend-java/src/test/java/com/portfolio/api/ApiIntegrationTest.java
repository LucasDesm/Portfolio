package com.portfolio.api;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.api.repository.ContactRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.io.InputStream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ApiIntegrationTest {

    @Autowired MockMvc mvc;
    @Autowired ObjectMapper mapper;
    @Autowired ContactRepository contactRepository;

    JsonNode content() throws Exception {
        try (InputStream in = new ClassPathResource("content/portfolio.json").getInputStream()) {
            return mapper.readTree(in);
        }
    }

    @Test
    void projectsAreServedInTheSameOrderAsTheFrontend() throws Exception {
        JsonNode expected = content().get("projects");
        mvc.perform(get("/api/v1/projects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(expected.size())))
                .andExpect(jsonPath("$[0].slug").value(expected.get(0).get("slug").asText()))
                .andExpect(jsonPath("$[1].slug").value(expected.get(1).get("slug").asText()));
    }

    @Test
    void projectDetailKeepsRichContent() throws Exception {
        JsonNode austral = content().get("projects").get(0);
        mvc.perform(get("/api/v1/projects/" + austral.get("slug").asText()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.chain", hasSize(austral.get("chain").size())))
                .andExpect(jsonPath("$.sections", hasSize(austral.get("sections").size())))
                .andExpect(jsonPath("$.tables", hasSize(austral.get("tables").size())))
                .andExpect(jsonPath("$.tables[0].rows[0][1]").value(austral.get("tables").get(0).get("rows").get(0).get(1).asText()))
                .andExpect(jsonPath("$.figures", hasSize(austral.get("figures").size())))
                .andExpect(jsonPath("$.position").doesNotExist());
    }

    @Test
    void unknownProjectReturns404() throws Exception {
        mvc.perform(get("/api/v1/projects/inexistant")).andExpect(status().isNotFound());
    }

    @Test
    void parcoursAndStagesFollowContentOrder() throws Exception {
        JsonNode c = content();
        mvc.perform(get("/api/v1/parcours"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(c.get("parcours").size())))
                .andExpect(jsonPath("$[0].id").value(c.get("parcours").get(0).get("id").asText()));
        mvc.perform(get("/api/v1/stages"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].slug").value(c.get("stages").get(0).get("slug").asText()));
    }

    @Test
    void contactMessageIsStored() throws Exception {
        long before = contactRepository.count();
        mvc.perform(post("/api/v1/contact").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Recruteur\",\"email\":\"rh@example.com\",\"message\":\"Bonjour\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.sentAt", notNullValue()));
        assertThat(contactRepository.count()).isEqualTo(before + 1);
    }

    @Test
    void invalidContactIsRejected() throws Exception {
        mvc.perform(post("/api/v1/contact").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"\",\"email\":\"pas-un-email\",\"message\":\"\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void clientCannotOverwriteAnExistingMessage() throws Exception {
        mvc.perform(post("/api/v1/contact").contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"A\",\"email\":\"a@example.com\",\"message\":\"premier\"}"));
        long before = contactRepository.count();
        Long firstId = contactRepository.findAll().get(0).getId();

        mvc.perform(post("/api/v1/contact").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"id\":" + firstId + ",\"name\":\"B\",\"email\":\"b@example.com\",\"message\":\"écrasement\"}"))
                .andExpect(status().isCreated());

        assertThat(contactRepository.count()).isEqualTo(before + 1);
        assertThat(contactRepository.findById(firstId)).get()
                .extracting(m -> m.getMessage()).isNotEqualTo("écrasement");
    }
}
