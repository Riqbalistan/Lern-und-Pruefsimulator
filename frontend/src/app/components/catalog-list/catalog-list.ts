
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { Catalog } from '../../models/catalog';
import { CatalogService } from '../../services/catalog';

@Component({
  selector: 'app-catalog-list',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './catalog-list.html',
  styleUrl: './catalog-list.css'
})
export class CatalogList implements OnInit {

  private catalogService = inject(CatalogService);

  catalogs = signal<Catalog[]>([]);
  
  @Input()
  selectedCatalogId: number | null = null;

  @Output()
  catalogSelected = new EventEmitter<number>();

  ngOnInit(): void {

    this.catalogService
      .getCatalogs()
      .subscribe(data => {

        this.catalogs.set(data);

      });

  }

  selectCatalog(id: number): void {

    this.catalogSelected.emit(id);

  }

}