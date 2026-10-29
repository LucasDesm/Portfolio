package com.portfolio.api.entity;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.List;

// Les lignes d'un tableau sont des listes de listes : JPA ne sait pas les mapper en embeddable,
// on les sérialise donc en JSON dans une seule colonne.
@Converter
public class ResultTablesConverter implements AttributeConverter<List<ResultTable>, String> {

    private static final ObjectMapper MAPPER = new ObjectMapper();
    private static final TypeReference<List<ResultTable>> TYPE = new TypeReference<>() {};

    @Override
    public String convertToDatabaseColumn(List<ResultTable> tables) {
        if (tables == null || tables.isEmpty()) return null;
        try {
            return MAPPER.writeValueAsString(tables);
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Tableaux de résultats non sérialisables", e);
        }
    }

    @Override
    public List<ResultTable> convertToEntityAttribute(String json) {
        if (json == null || json.isBlank()) return List.of();
        try {
            return MAPPER.readValue(json, TYPE);
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Tableaux de résultats illisibles en base", e);
        }
    }
}
