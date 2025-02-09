import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PoetryMatchStore } from '../poetry-match.store';

@Component({
  selector: 'app-poetry-start-page',
  standalone: false,

  templateUrl: './poetry-start-page.component.html',
  styleUrl: './poetry-start-page.component.css'
})
export class PoetryMatchStartPageComponent implements OnInit {

  store = inject(PoetryMatchStore);
  router = inject(Router);

  poetryList = this.store.poetryList;

  showHelp = false;

  ngOnInit(): void {
  }

  startGame(poetryName: string) {
    this.router.navigate(['poetry-match', 'board'], { queryParams: { poetryName } });
  }

}
