import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { QuestionList } from '../../components/question-list/question-list';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [QuestionList],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css'
})
export class CatalogComponent {

  private route = inject(ActivatedRoute);

  catalogId =
    Number(this.route.snapshot.paramMap.get('id'));

}