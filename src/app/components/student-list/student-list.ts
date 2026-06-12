import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Student } from '../../Model/Student';
import { StudentService } from '../../services/student';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-list.html',
  styleUrl: './student-list.css'
})
export class StudentListComponent implements OnInit {
  students: Student[] = [];

  constructor(private studentService: StudentService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.studentService.getAll().subscribe(students => {
      this.students = students;
      this.cdr.detectChanges();
    });
  }

  goToDetail(id: number): void {
    this.router.navigate(['/students', id]);
  }

  goToCreate(): void {
    this.router.navigate(['/students/new']);
  }

  delete(id: number, event: Event): void {
    event.stopPropagation();
    this.studentService.delete(id).subscribe(() => this.loadStudents());
  }
}
