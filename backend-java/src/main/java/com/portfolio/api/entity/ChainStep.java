package com.portfolio.api.entity;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter @Setter @NoArgsConstructor
public class ChainStep {
    private String label;
    private String sublabel;
}
