package com.practice.Practice_backend;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/students")
public class StudentController {

    private final StudentService service;

    public StudentController(StudentService service) {
        this.service = service;
    }

    @GetMapping
    public List<Student> getAll() { return service.getAll(); }

    @GetMapping("/{id}")
    public Student getById(@PathVariable Long id) { return service.getById(id); }

    @PostMapping
    public Student create(@RequestBody Student student) {
        student.setId(null);
        return service.create(student);
    }

    @PutMapping("/{id}")
    public Student update(@PathVariable Long id, @RequestBody Student student) { return service.update(id, student); }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { service.delete(id); }

    @PostMapping("/generate/start")
    public boolean startGeneration() { service.startGeneration(); return service.isGenerating(); }

    @PostMapping("/generate/stop")
    public boolean stopGeneration() { service.stopGeneration(); return service.isGenerating(); }

    @GetMapping("/generate/status")
    public boolean generationStatus() { return service.isGenerating(); }
}