import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home';
import { CatalogComponent } from './pages/catalog/catalog';
import { QuestionComponent } from './pages/question/question';
import { ResultComponent } from './pages/result/result';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'catalog/:id',
    component: CatalogComponent
  },
  {
    path: 'question/:id',
    component: QuestionComponent
  },
  {
    path: 'result',
    component: ResultComponent
  }
];