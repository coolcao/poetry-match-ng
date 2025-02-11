import { Component, computed, effect, inject, linkedSignal, OnInit, signal, Signal } from '@angular/core';
import { timer } from 'rxjs';

import { PoetryMatchStore } from '../poetry-match.store';
import { CharacterCell, PoetryType } from '../poetry-match.types';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-poetry-match-board',
  standalone: false,

  templateUrl: './poetry-match-board.component.html',
  styleUrl: './poetry-match-board.component.css'
})
export class PoetryMatchBoardComponent implements OnInit {

  PoetryType = PoetryType;

  store = inject(PoetryMatchStore);
  route = inject(ActivatedRoute);
  router = inject(Router);

  poetry = this.store.poetry;
  cells = this.store.cells;
  isCompleted = this.store.isCompleted;

  // 步数
  steps = this.store.steps;
  // 已打开的字符
  charIdxs = this.store.charIdxs;
  sortedParagraphs = this.store.sortedParagraphs;
  poetryNames = this.store.poetryNames;

  finishedParagraphs: string[] = [];

  showSuccess = signal(false);

  constructor() {
    effect(() => {
      if (this.isCompleted()) {
        this.showSuccess.set(true);
        timer(3000).subscribe(() => {
          this.showSuccess.set(false);
        });
      }
    });
  }

  ngOnInit(): void {
    const poetryName = this.route.snapshot.queryParams['poetryName'];
    if (!this.poetryNames().includes(poetryName)) {
      console.log('当前诗词暂不支持，请选择其他诗词');
      this.router.navigate(['poetry-match', 'start']);
      return;
    }
    this.store.loadPoetry(poetryName);
    this.finishedParagraphs = this.sortedParagraphs().map(() => '');
  }

  clickCell(idx: number) {
    const cell = this.cells()[idx];
    // 已经固定的字符，不用再点击
    if (cell.isPinned) {
      return;
    }
    this.store.increaseSteps();
    if (cell.isOpened) {
      cell.isOpened = false;
      this.store.updateCell(idx, cell);
      // 从已打开的字符中移除
      this.store.updateCharIdxs(this.charIdxs().filter(i => i !== idx));
      return;
    }


    cell.isOpened = true;
    this.store.addCharIdx(idx);
    this.store.updateCell(idx, cell);

    if (this.charIdxs().length == 5) {
      // 检查是否匹配
      const cs = this.charIdxs().map(idx => this.cells()[idx].character).sort().join('');
      console.log('cs: ', cs);


      for (let i = 0; i < this.sortedParagraphs().length; i++) {
        const sortedParagraph = this.sortedParagraphs()[i];
        console.log('sorted:', sortedParagraph);

        if (cs == sortedParagraph) {
          this.finishedParagraphs[i] = this.poetry()!.paragraphs[i];
          for (const idx of this.charIdxs()) {
            this.cells()[idx].isPinned = true;
          }
          this.store.updateCharIdxs([]);
        } else {
          timer(1000).subscribe(() => {
            this.charIdxs().forEach(idx => {
              this.cells()[idx].isOpened = false;
            });
            this.store.updateCharIdxs([]);
          });
        }
      }
    }

  }

}
