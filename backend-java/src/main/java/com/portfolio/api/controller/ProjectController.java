package com.portfolio.api.controller;

import com.portfolio.api.entity.Project;
import com.portfolio.api.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    public List<Project> getAll() {
        return projectService.findAll();
    }

    @GetMapping("/{slug}")
    public Project getBySlug(@PathVariable String slug) {
        return projectService.findBySlug(slug);
    }
}
