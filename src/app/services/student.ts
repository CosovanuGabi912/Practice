import { Injectable } from '@angular/core';
import { Student } from '../Model/Student';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private students: Student[] = [
    { id: 1, name: 'Alice Johnson', age: 20, email: 'alice@example.com', picture: 'https://i.pravatar.cc/150?img=1' },
    { id: 2, name: 'Bob Smith', age: 22, email: 'bob@example.com', picture: 'https://i.pravatar.cc/150?img=2' },
    { id: 3, name: 'Carol White', age: 21, email: 'carol@example.com', picture: 'https://i.pravatar.cc/150?img=3' },
  ];

  private nextId = 4;

  getAll(): Student[] {
    return this.students;
  }

  getById(id: number): Student {
    return this.students.find(s => s.id === id)!;
  }

  create(student: Student): Student {
    const newStudent = { ...student, id: this.nextId++ };
    this.students.push(newStudent);
    return newStudent;
  }

  update(student: Student): void {
    const index = this.students.findIndex(s => s.id === student.id);
    this.students[index] = student;
  }

  delete(id: number): void {
    this.students = this.students.filter(s => s.id !== id);
  }
}
