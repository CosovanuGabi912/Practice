import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, PieController, ArcElement, Tooltip, Legend } from 'chart.js';
import { StudentService } from '../../services/student';
import { Student } from '../../Model/Student';

Chart.register(PieController, ArcElement, Tooltip, Legend);

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './statistics.html',
  styleUrl: './statistics.css'
})
export class StatisticsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('pieCanvas') pieCanvas!: ElementRef<HTMLCanvasElement>;

  students: Student[] = [];
  isGenerating = false;
  private chart: Chart | null = null;
  private pollInterval: any = null;

  constructor(private studentService: StudentService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.pollInterval = setInterval(() => {
      this.loadStudents();
      this.studentService.isGenerating().subscribe(v => {
        this.isGenerating = v;
        this.cdr.detectChanges();
      });
    }, 1000);
  }

  ngAfterViewInit(): void {
    this.buildChart();
    this.loadStudents();
    this.studentService.isGenerating().subscribe(v => {
      this.isGenerating = v;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.pollInterval);
    this.chart?.destroy();
  }

  loadStudents(): void {
    this.studentService.getAll().subscribe(students => {
      this.students = students;
      this.updateChart();
      this.cdr.detectChanges();
    });
  }

  toggleGeneration(): void {
    if (this.isGenerating) {
      this.studentService.stopGeneration().subscribe(v => {
        this.isGenerating = v;
        this.cdr.detectChanges();
      });
    } else {
      this.studentService.startGeneration().subscribe(v => {
        this.isGenerating = v;
        this.cdr.detectChanges();
      });
    }
  }

  private ageGroups(): { label: string; count: number }[] {
    const groups = [
      { label: '18–19', count: 0 },
      { label: '20–21', count: 0 },
      { label: '22–23', count: 0 },
      { label: '24+',   count: 0 },
    ];
    for (const s of this.students) {
      if (s.age <= 19)      groups[0].count++;
      else if (s.age <= 21) groups[1].count++;
      else if (s.age <= 23) groups[2].count++;
      else                  groups[3].count++;
    }
    return groups;
  }

  private buildChart(): void {
    const groups = this.ageGroups();
    this.chart = new Chart(this.pieCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: groups.map(g => g.label),
        datasets: [{
          data: groups.map(g => g.count),
          backgroundColor: ['#319795', '#4299e1', '#ed8936', '#9f7aea'],
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }

  private updateChart(): void {
    if (!this.chart) return;
    const groups = this.ageGroups();
    this.chart.data.datasets[0].data = groups.map(g => g.count);
    this.chart.update('none');
  }
}
