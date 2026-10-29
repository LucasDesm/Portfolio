package com.portfolio.api.dto;

import java.time.LocalDateTime;

public record ContactResponse(Long id, LocalDateTime sentAt) {
}
