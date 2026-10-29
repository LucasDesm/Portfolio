package com.portfolio.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** Corps de POST /api/v1/contact : seuls ces champs sont acceptés (pas d'id ni de date côté client). */
public record ContactRequest(
        @NotBlank @Size(max = 200) String name,
        @NotBlank @Email @Size(max = 320) String email,
        @NotBlank @Size(max = 3000) String message
) {
}
