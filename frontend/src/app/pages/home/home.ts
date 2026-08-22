import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { CatalogList } from '../../components/catalog-list/catalog-list';
import { QuestionService } from '../../services/question';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CatalogList
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {

  private router = inject(Router);
  private questionService = inject(QuestionService);

  // Modus
  mode = signal<'learn' | 'exam'>('learn');

  // Fragetyp
  questionType = signal<'all' | 'mc' | 'sc' | 'fi'>('all');

  selectedCatalogId = signal<number | null>(null);

  // Zeitlimit
  timeLimitEnabled = signal(true);

  timeLimitMinutes = signal(90);

  onCatalogSelected(id: number): void {

    this.selectedCatalogId.set(id);

  }
  startSelectedCatalog(): void {

    const id = this.selectedCatalogId();

    if (id === null) {
      return;
    }

    this.onSimulatorStarted(id);

  }

  onSimulatorStarted(id: number): void {

    sessionStorage.removeItem('timeLeft');
    sessionStorage.setItem(
      'mode',
      this.mode()
    );

    sessionStorage.setItem(
      'questionType',
      this.questionType()
    );
    sessionStorage.setItem(
      'timeLimitEnabled',
      String(this.timeLimitEnabled())
    );

    sessionStorage.setItem(
      'timeLimitMinutes',
      String(this.timeLimitMinutes())
    );
    this.questionService
      .getQuestions(id)
      .subscribe(questions => {

        if (questions.length === 0) {
          return;
        }

        sessionStorage.setItem(
          'questionOrder',
          JSON.stringify(
            questions.map(q => q.id)
          )
        );

        sessionStorage.setItem(
          'totalQuestions',
          String(questions.length)
        );

        sessionStorage.setItem(
          'points',
          '0'
        );
        sessionStorage.setItem(
          'answers',
          '{}'
        );
        sessionStorage.setItem(
          'correctAnswers',
          '0'
        );

        sessionStorage.setItem(
          'wrongAnswers',
          '0'
        );

        this.router.navigate([
          '/question',
          questions[0].id
        ]);

      });

  }

}