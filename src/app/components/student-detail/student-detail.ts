
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../../services/student';
import { Student } from '../../Model/Student';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-detail.html',
  styleUrl: './student-detail.css'
})
export class StudentDetailComponent implements OnInit {
  student: Student = { id: 0, name: '', age: 0, email: '', picture: '' };
  isNew = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id === 'new') {
      this.isNew = true;
    } else {
      this.student = this.studentService.getById(Number(id));
    }
  }

  save(): void {
    if (this.isNew) {
      this.studentService.create(this.student);
    } else {
      this.studentService.update(this.student);
    }
    this.router.navigate(['/students']);
  }

  cancel(): void {
    this.router.navigate(['/students']);
  }
}
