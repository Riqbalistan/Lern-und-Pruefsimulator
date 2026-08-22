import { Component, inject, signal, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Question } from '../../models/question';
import { QuestionService } from '../../services/question';

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './question.html',
  styleUrl: './question.css'
})
export class QuestionComponent implements OnDestroy{

  private questionService = inject(QuestionService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  question = signal<Question | null>(null);

  selectedAnswers = signal<number[]>([]);
  // Zeitlimit
  timeLeft = signal(0);

  timeLimitEnabled = false;
  private timer?: ReturnType<typeof setInterval>;
  fillInAnswer = signal('');

  checked = signal(false);
  isCorrect = signal(false);
  showHint = signal(false);

  questionOrder: number[] = [];

  currentIndex = -1;

  constructor() {

    const order = sessionStorage.getItem('questionOrder');

    if (order) {
      this.questionOrder = JSON.parse(order);
    }

    this.route.paramMap.subscribe(params => {

      const id = Number(params.get('id'));

      this.currentIndex = this.questionOrder.indexOf(id);

      this.loadQuestion(id);

    });

  }

  loadQuestion(id: number): void {

    this.checked.set(false);
    this.isCorrect.set(false);
    this.showHint.set(false);

    this.selectedAnswers.set([]);
    this.fillInAnswer.set('');

    this.questionService.getQuestion(id).subscribe(q => {

      this.question.set(q);

      this.restoreAnswer(id);
      this.initializeTimer();

    });

  }

  private saveCurrentAnswer(): void {

    const q = this.question();

    if (!q) {
      return;
    }

    const answers = JSON.parse(
      sessionStorage.getItem('answers') ?? '{}'
    );


    answers[q.id] = {

    selectedAnswers: [...this.selectedAnswers()],

    fillInAnswer: this.fillInAnswer(),

    checked: answers[q.id]?.checked ?? false,

    correct: answers[q.id]?.correct ?? false

  };
    sessionStorage.setItem(
      'answers',
      JSON.stringify(answers)
    );

  }

  private restoreAnswer(questionId: number): void {

    const answers = JSON.parse(
      sessionStorage.getItem('answers') ?? '{}'
    );

    const answer = answers[questionId];

    if (!answer) {
      return;
    }

    this.selectedAnswers.set(
      answer.selectedAnswers ?? []
    );

    this.fillInAnswer.set(
      answer.fillInAnswer ?? ''
    );

    this.checked.set(
      answer.checked ?? false
    );

    this.isCorrect.set(
      answer.correct ?? false
    );

  }

  toggleAnswer(answerId: number, checked: boolean): void {

    if (this.checked()) {
      return;
    }

    const current = [...this.selectedAnswers()];

    if (checked) {

      if (!current.includes(answerId)) {
        current.push(answerId);
      }

    } else {

      const index = current.indexOf(answerId);

      if (index >= 0) {
        current.splice(index, 1);
      }

    }

    this.selectedAnswers.set(current);

  }

  selectSingle(answerId: number): void {

    if (this.checked()) {
      return;
    }

    this.selectedAnswers.set([answerId]);

  }

  isSelected(answerId: number): boolean {

    return this.selectedAnswers().includes(answerId);

  }

  requiredAnswers(): number {

    const q = this.question();

    if (!q) {
      return 0;
    }

    return q.answers
      .filter(a => a.isCorrect)
      .length;

  }

  currentQuestionNumber(): number {

    return this.currentIndex + 1;

  }

  canCheckAnswer(): boolean {

    const q = this.question();

    if (!q) {
      return false;
    }

    if (q.type === 'fi') {
      return this.fillInAnswer().trim().length > 0;
    }

    if (q.type === 'sc') {
      return this.selectedAnswers().length === 1;
    }

    if (q.type === 'mc') {
      return this.selectedAnswers().length === this.requiredAnswers();
    }

    return false;

  }
    checkAnswer(): void {

    const q = this.question();

    if (!q) {
      return;
    }

    if (this.checked()) {
      return;
    }

    let correct = false;

    if (q.type === 'fi') {

      const input = this.fillInAnswer()
        .trim()
        .toLowerCase();

      correct = q.answers.some(a =>
        a.isCorrect &&
        a.answerText
          .trim()
          .toLowerCase() === input
      );

    } else {

      const correctIds = q.answers
        .filter(a => a.isCorrect)
        .map(a => a.id)
        .sort((a, b) => a - b);

      const selectedIds = [...this.selectedAnswers()]
        .sort((a, b) => a - b);

      correct =
        JSON.stringify(correctIds) ===
        JSON.stringify(selectedIds);

    }

    this.checked.set(true);
    this.isCorrect.set(correct);
    this.saveCurrentAnswer();

    const answers = JSON.parse(
      sessionStorage.getItem('answers') ?? '{}'
    );

    answers[q.id] = {

      selectedAnswers: [...this.selectedAnswers()],

      fillInAnswer: this.fillInAnswer(),

      checked: true,

      correct: correct

    };

    sessionStorage.setItem(
      'answers',
      JSON.stringify(answers)
    );

  }

  previousQuestion(): void {

    this.saveCurrentAnswer();

    if (this.currentIndex <= 0) {
      return;
    }

    const previousId =
      this.questionOrder[
        this.currentIndex - 1
      ];

    this.router.navigate([
      '/question',
      previousId
    ]);

  }

  nextQuestion(): void {

    const mode =
      sessionStorage.getItem('mode');

    // Lernmodus
    if (mode === 'learn') {

      if (!this.checked() && this.canCheckAnswer()) {

        this.checkAnswer();

      } else {

        this.saveCurrentAnswer();

      }

    }

    // Prüfungsmodus
    else {

      this.saveCurrentAnswer();

    }

    if (this.currentIndex >= this.questionOrder.length - 1) {

      if (this.timer) {

        clearInterval(this.timer);

        this.timer = undefined;

      }

      sessionStorage.removeItem('timeLeft');
      sessionStorage.removeItem('timeLimitEnabled');
      sessionStorage.removeItem('timeLimitMinutes');

      this.router.navigate([
        '/result'
      ]);

      return;

    }

    const nextId =
      this.questionOrder[this.currentIndex + 1];

    this.router.navigate([
      '/question',
      nextId
    ]);

  }
  goToCatalog(): void {

    if (this.timer) {

      clearInterval(this.timer);

      this.timer = undefined;

    }

    sessionStorage.removeItem('timeLeft');

    sessionStorage.removeItem('timeLimitEnabled');

    sessionStorage.removeItem('timeLimitMinutes');

    const q = this.question();

    if (!q) {
      return;
    }

    this.router.navigate([
      '/catalog',
      q.catalogId
    ]);

  }

  goToHome(): void {

    if (this.timer) {

      clearInterval(this.timer);

      this.timer = undefined;

    }

    sessionStorage.removeItem('timeLeft');

    sessionStorage.removeItem('timeLimitEnabled');

    sessionStorage.removeItem('timeLimitMinutes');

    this.router.navigate([
      '/'
    ]);

  }

  toggleHint(): void {

    this.showHint.update(value => !value);

  }
  private initializeTimer(): void {

    if (this.timer) {
      return;
    }
    const mode = sessionStorage.getItem('mode');
    if (mode !== 'exam') {
      return;
    }

    this.timeLimitEnabled =
      sessionStorage.getItem('timeLimitEnabled') === 'true';
    

    if (!this.timeLimitEnabled) {
      return;
    }

    const savedTime = sessionStorage.getItem('timeLeft');

    if (savedTime) {

      this.timeLeft.set(Number(savedTime));

    } else {

      const minutes = Number(
      sessionStorage.getItem('timeLimitMinutes') ?? '90'
      );

      this.timeLeft.set(minutes * 60);

    }
    this.timer = setInterval(() => {

      const remaining = this.timeLeft() - 1;

      this.timeLeft.set(remaining);

      sessionStorage.setItem(
        'timeLeft',
        String(remaining)
      );

      if (remaining <= 0) {

        if (this.timer) {

          clearInterval(this.timer);

          this.timer = undefined;

        }

        sessionStorage.removeItem('timeLeft');
        sessionStorage.removeItem('timeLimitEnabled');
        sessionStorage.removeItem('timeLimitMinutes');

        alert('Die Bearbeitungszeit ist abgelaufen.');

        this.router.navigate([
          '/result'
        ]);

      }

    }, 1000);

  }
  formattedTime(): string {

    const minutes = Math.floor(this.timeLeft() / 60);

    const seconds = this.timeLeft() % 60;

    return (
      minutes.toString().padStart(2, '0') +
      ':' +
      seconds.toString().padStart(2, '0')
    );

  }
  ngOnDestroy(): void {

    if (this.timer) {

      clearInterval(this.timer);
      this.timer = undefined;

    }

  }
  isLearnMode(): boolean {

    return sessionStorage.getItem('mode') === 'learn';

  }

}