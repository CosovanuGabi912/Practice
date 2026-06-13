package com.practice.Practice_backend;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

@Service
public class StudentService {

    private final StudentRepository repository;

    private volatile boolean generating = false;

    private final String[] firstNames =
            {"Emma","Liam","Olivia","Noah","Ava","Oliver","Isabella","Elijah","Sophia","Lucas","Mia","Mason"};
    private final String[] lastNames  =
            {"Smith","Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Wilson","Moore"};

    public StudentService(StudentRepository repository) {
        this.repository = repository;
        if (repository.count() == 0) {
            repository.saveAll(List.of(
                    new Student("Alice Johnson", 20, "alice@example.com", "https://i.pravatar.cc/150?img=1"),
                    new Student("Bob Smith",     22, "bob@example.com",   "https://i.pravatar.cc/150?img=2"),
                    new Student("Carol White",   21, "carol@example.com", "https://i.pravatar.cc/150?img=3")
            ));
        }
    }

    @Scheduled(fixedRate = 1000)
    @Transactional
    public void generateStudents() {
        if (!generating) return;
        Random rnd = new Random();
        for (int i = 0; i < 3; i++) {
            String first = firstNames[rnd.nextInt(firstNames.length)];
            String last  = lastNames[rnd.nextInt(lastNames.length)];
            int age      = 18 + rnd.nextInt(10);
            int img      = 1 + rnd.nextInt(70);
            repository.save(new Student(
                    first + " " + last,
                    age,
                    first.toLowerCase() + "." + last.toLowerCase() + "@student.com",
                    "https://i.pravatar.cc/150?img=" + img
            ));
        }
    }

    public List<Student> getAll() { return repository.findAll(); }

    public Student getById(Long id) { return repository.findById(id).orElseThrow(); }

    public Student create(Student student) { return repository.save(student); }

    public Student update(Long id, Student data) {
        Student s = getById(id);
        s.setName(data.getName());
        s.setAge(data.getAge());
        s.setEmail(data.getEmail());
        s.setPicture(data.getPicture());
        return repository.save(s);
    }

    public void delete(Long id) { repository.deleteById(id); }

    public boolean isGenerating() { return generating; }

    public void startGeneration() { generating = true; }

    public void stopGeneration() { generating = false; }
}
