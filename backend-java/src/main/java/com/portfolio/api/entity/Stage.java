package com.portfolio.api.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "stages")
@Getter @Setter @NoArgsConstructor
public class Stage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String slug;

    private String company;
    private String role;
    private String context;
    private String period;
    private String duration;
    private String location;

    @Column(length = 2000)
    private String description;

    @Column(length = 6000)
    private String longDescription;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "stage_missions", joinColumns = @JoinColumn(name = "stage_id"))
    @Column(name = "mission", length = 500)
    @OrderColumn(name = "mission_order")
    private List<String> missions = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "stage_tags", joinColumns = @JoinColumn(name = "stage_id"))
    @Column(name = "tag")
    @OrderColumn(name = "tag_order")
    private List<String> tags = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "stage_highlights", joinColumns = @JoinColumn(name = "stage_id"))
    @OrderColumn(name = "highlight_order")
    private List<Highlight> highlights = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "stage_links", joinColumns = @JoinColumn(name = "stage_id"))
    @OrderColumn(name = "link_order")
    private List<ResourceLink> links = new ArrayList<>();

    private boolean upcoming;
}
