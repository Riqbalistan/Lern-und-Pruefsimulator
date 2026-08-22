import { Answer } from './answer';

export interface Question {
  id: number;
  type: string;
  questionText: string;
  hint: string;
 catalogId: number;
  answers: Answer[];
}