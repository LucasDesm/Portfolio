package com.portfolio.api.service;

import com.portfolio.api.entity.Stage;
import com.portfolio.api.repository.StageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StageService {

    private final StageRepository stageRepository;

    public List<Stage> findAll() {
        return stageRepository.findAllByOrderByPositionAsc();
    }

    public Stage findBySlug(String slug) {
        return stageRepository.findBySlug(slug)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Stage not found: " + slug));
    }
}
