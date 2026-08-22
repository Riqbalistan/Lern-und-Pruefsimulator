// import { Component, signal } from '@angular/core';

// import { CatalogList } from './components/catalog-list/catalog-list';
// import { QuestionList } from './components/question-list/question-list';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';


// @Component({
//   selector: 'app-root',
//   imports: [
//     CatalogList,
//     QuestionList
//   ],
//   templateUrl: './app.html',
//   styleUrl: './app.css'
// })
// export class App {

//   selectedCatalogId = signal<number | null>(null);

//   onCatalogSelected(id: number): void {

//     console.log("Katalog gewählt:", id);

//     this.selectedCatalogId.set(id);
//   }
// }
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

}