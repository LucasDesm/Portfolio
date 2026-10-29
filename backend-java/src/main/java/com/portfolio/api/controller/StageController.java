package com.portfolio.api.controller;

import com.portfolio.api.entity.Stage;
import com.portfolio.api.service.StageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/stages")
@RequiredArgsConstructor
public class StageController {

    private final StageService stageService;

    @GetMapping
    public List<Stage> getAll() {
        return stageService.findAll();
    }

    @GetMapping("/{slug}")
    public Stage getBySlug(@PathVariable String slug) {
        return stageService.findBySlug(slug);
    }
}
