import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
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
  private chart: Chart | null = null;
  private sub!: Subscription;

  get isGenerating(): boolean {
    return this.studentService.isGenerating;
  }

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.sub = this.studentService.students$.subscribe(students => {
      this.students = students;
      this.updateChart();
    });
  }

  ngAfterViewInit(): void {
    this.buildChart();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.chart?.destroy();
  }

  toggleGeneration(): void {
    if (this.studentService.isGenerating) {
      this.studentService.stopGeneration();
    } else {
      this.studentService.startGeneration();
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
