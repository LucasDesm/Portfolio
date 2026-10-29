package com.portfolio.api.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter @Setter @NoArgsConstructor
public class ProjectSection {
    private String title;

    @Column(length = 4000)
    private String body;
}
