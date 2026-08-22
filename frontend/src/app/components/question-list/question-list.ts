import {
  Component,
  OnChanges,
  Input,
  SimpleChanges,
  inject,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Question } from '../../models/question';
import { QuestionService } from '../../services/question';

@Component({
  selector: 'app-question-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './question-list.html',
  styleUrl: './question-list.css'
})
export class QuestionList implements OnChanges {

  private questionService = inject(QuestionService);
  private router = inject(Router);

  @Input()
  catalogId: number | null = null;

  questions = signal<Question[]>([]);

  ngOnChanges(changes: SimpleChanges): void {

    if (this.catalogId === null) {
      return;
    }

    this.questionService
      .getQuestions(this.catalogId)
      .subscribe(data => {

        const mode = sessionStorage.getItem('mode');
        const type = sessionStorage.getItem('questionType');

        let filtered = data;

        // Nur im Lernmodus nach Fragetyp filtern
        if (mode === 'learn' && type && type !== 'all') {

          filtered = data.filter(q => q.type === type);

        }

        this.questions.set(filtered);

        sessionStorage.setItem(
          'questionOrder',
          JSON.stringify(filtered.map(q => q.id))
        );

        sessionStorage.setItem(
          'totalQuestions',
          String(filtered.length)
        );

        sessionStorage.setItem(
          'points',
          '0'
        );

      });

  }

  openQuestion(questionId: number): void {

    this.router.navigate([
      '/question',
      questionId
    ]);

  }

  goHome(): void {

    this.router.navigate([
      '/'
    ]);

  }

}