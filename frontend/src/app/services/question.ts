import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Question } from '../models/question';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:5110/api/questions';

  constructor() { }

  getQuestions(catalogId: number): Observable<Question[]> {

    return this.http.get<Question[]>(
      `http://localhost:5110/api/catalogs/${catalogId}/questions`
    );

  }

  getQuestion(id: number): Observable<Question> {

    return this.http.get<Question>(
      `${this.apiUrl}/${id}`
    );

  }

}