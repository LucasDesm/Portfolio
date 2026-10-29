package com.portfolio.api.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "parcours_steps")
@Getter @Setter @NoArgsConstructor
public class ParcoursStep {

    @Id
    private String id;

    private String type;
    private String period;
    private String title;
    private String institution;
    private String location;

    @Column(length = 2000)
    private String description;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "parcours_tags", joinColumns = @JoinColumn(name = "step_id"))
    @Column(name = "tag")
    @OrderColumn(name = "tag_order")
    private List<String> tags = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "parcours_projects", joinColumns = @JoinColumn(name = "step_id"))
    @Column(name = "project_slug")
    @OrderColumn(name = "project_order")
    private List<String> projects = new ArrayList<>();

    private boolean done;
    @JsonIgnore
    private int displayOrder;
}
