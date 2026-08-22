import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './result.html',
  styleUrl: './result.css'
})
export class ResultComponent {

  points = 0;
  // points = Number(
  //   sessionStorage.getItem('points') ?? '0'
  // );

  totalQuestions = Number(
    sessionStorage.getItem('totalQuestions') ?? '0'
  );
  correctAnswers = 0;

  wrongAnswers = 0;

  // correctAnswers = Number(
  //   sessionStorage.getItem('correctAnswers') ?? '0'
  // );

  // wrongAnswers = Number(
  //   sessionStorage.getItem('wrongAnswers') ?? '0'
  // );

  // skippedAnswers = Number(
  //   sessionStorage.getItem('skippedAnswers') ?? '0'
  // );

  // constructor(
  //   private router: Router
  // ) { }

  // get percentage(): number {

  //   if (this.totalQuestions === 0) {
  //     return 0;
  //   }

  //   return Math.round(
  //     this.points / this.totalQuestions * 100
  //   );

  // }
constructor(
   private router: Router
    ) {

  const answers = JSON.parse(
    sessionStorage.getItem('answers') ?? '{}'
    );

    for (const key in answers) {

    if (!answers[key].checked) {
      continue;
    }

    if (answers[key].correct) {

      this.correctAnswers++;

    } else {

      this.wrongAnswers++;

    }

  }
  this.points = this.correctAnswers;


}
get percentage(): number {

  if (this.totalQuestions === 0) {
    return 0;
  }

  return Math.round(
    this.points / this.totalQuestions * 100
  );

}

  restart(): void {

    sessionStorage.removeItem('points');
    sessionStorage.removeItem('totalQuestions');
    sessionStorage.removeItem('questionOrder');
    sessionStorage.removeItem('mode');
    sessionStorage.removeItem('questionType');
    sessionStorage.removeItem('answers');

    sessionStorage.removeItem('correctAnswers');
    sessionStorage.removeItem('wrongAnswers');
    sessionStorage.removeItem('skippedAnswers');

    this.router.navigate([
      '/'
    ]);

  }

  finish(): void {

    sessionStorage.clear();

    this.router.navigate([
      '/'
    ]);

  }

}