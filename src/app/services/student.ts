import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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
  private generationInterval: any = null;
  isGenerating = false;

  private studentsSubject = new BehaviorSubject<Student[]>(this.students);
  students$ = this.studentsSubject.asObservable();

  private firstNames = ['Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Oliver', 'Isabella', 'Elijah', 'Sophia', 'Lucas', 'Mia', 'Mason'];
  private lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Wilson', 'Moore'];

  private emit(): void {
    this.studentsSubject.next([...this.students]);
  }

  private randomStudent(): Student {
    const first = this.firstNames[Math.floor(Math.random() * this.firstNames.length)];
    const last = this.lastNames[Math.floor(Math.random() * this.lastNames.length)];
    const age = Math.floor(Math.random() * 10) + 18;
    const imgIndex = Math.floor(Math.random() * 70) + 1;
    return {
      id: this.nextId++,
      name: `${first} ${last}`,
      age,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@student.com`,
      picture: `https://i.pravatar.cc/150?img=${imgIndex}`
    };
  }

  startGeneration(): void {
    if (this.isGenerating) return;
    this.isGenerating = true;
    this.generationInterval = setInterval(() => {
      for (let i = 0; i < 3; i++) {
        this.students.push(this.randomStudent());
      }
      this.emit();
    }, 1000);
  }

  stopGeneration(): void {
    clearInterval(this.generationInterval);
    this.isGenerating = false;
  }

  getAll(): Student[] {
    return this.students;
  }

  getById(id: number): Student {
    return this.students.find(s => s.id === id)!;
  }

  create(student: Student): Student {
    const newStudent = { ...student, id: this.nextId++ };
    this.students.push(newStudent);
    this.emit();
    return newStudent;
  }

  update(student: Student): void {
    const index = this.students.findIndex(s => s.id === student.id);
    this.students[index] = student;
    this.emit();
  }

  delete(id: number): void {
    this.students = this.students.filter(s => s.id !== id);
    this.emit();
  }
}
