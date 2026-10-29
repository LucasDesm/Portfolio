package com.portfolio.api.entity;

import java.util.List;

/** Tableau de résultats d'un projet, stocké en JSON (voir ResultTablesConverter). */
public record ResultTable(String title, List<String> columns, List<List<String>> rows, String caption) {
}
