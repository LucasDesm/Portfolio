package com.portfolio.api.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter @Setter @NoArgsConstructor
public class ProjectFigure {
    private String src;

    @Column(length = 500)
    private String alt;

    @Column(length = 1000)
    private String caption;
}
