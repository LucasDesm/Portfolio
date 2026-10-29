package com.portfolio.api.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "projects")
@Getter @Setter @NoArgsConstructor
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String slug;

    private int tier;
    private String context;
    private String title;
    private String subtitle;

    @Column(length = 2000)
    private String description;

    @Column(length = 6000)
    private String longDescription;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "project_tags", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "tag")
    @OrderColumn(name = "tag_order")
    private List<String> tags = new ArrayList<>();

    private boolean has3D;
    private String linkedParcoursId;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "project_highlights", joinColumns = @JoinColumn(name = "project_id"))
    @OrderColumn(name = "highlight_order")
    private List<Highlight> highlights = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "project_links", joinColumns = @JoinColumn(name = "project_id"))
    @OrderColumn(name = "link_order")
    private List<ResourceLink> links = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "project_chain", joinColumns = @JoinColumn(name = "project_id"))
    @OrderColumn(name = "step_order")
    private List<ChainStep> chain = new ArrayList<>();

    private Boolean chainFeedback;
    private String chainLabel;
    private String cover;

    @Column(length = 2000)
    private String role;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "project_sections", joinColumns = @JoinColumn(name = "project_id"))
    @OrderColumn(name = "section_order")
    private List<ProjectSection> sections = new ArrayList<>();

    @Convert(converter = ResultTablesConverter.class)
    @Column(length = 20000)
    private List<ResultTable> tables = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "project_figures", joinColumns = @JoinColumn(name = "project_id"))
    @OrderColumn(name = "figure_order")
    private List<ProjectFigure> figures = new ArrayList<>();

    /** Ordre d'affichage, identique à celui de data.ts côté frontend */
    @JsonIgnore
    private int position;
}
