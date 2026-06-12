import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../Model/Student';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private url = 'http://localhost:8080/students';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Student[]> {
    return this.http.get<Student[]>(this.url);
  }

  getById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.url}/${id}`);
  }

  create(student: Student): Observable<Student> {
    return this.http.post<Student>(this.url, student);
  }

  update(student: Student): Observable<Student> {
    return this.http.put<Student>(`${this.url}/${student.id}`, student);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  startGeneration(): Observable<boolean> {
    return this.http.post<boolean>(`${this.url}/generate/start`, {});
  }

  stopGeneration(): Observable<boolean> {
    return this.http.post<boolean>(`${this.url}/generate/stop`, {});
  }

  isGenerating(): Observable<boolean> {
    return this.http.get<boolean>(`${this.url}/generate/status`);
  }
}
