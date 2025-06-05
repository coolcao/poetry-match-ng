import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { timer } from 'rxjs';

import { PoetryMatchStore } from '../poetry-match.store';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-poetry-match-board',
  standalone: false,

  templateUrl: './poetry-match-board.component.html',
  styleUrl: './poetry-match-board.component.css'
})
export class PoetryMatchBoardComponent implements OnInit {

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
  minLen = this.store.minLen;
  maxLen = this.store.maxLen;

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
    this.store.setPoetryName(poetryName);
    this.store.resetState();
    console.log(this.poetry());


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

    // 如果打开的字符数在minLen和maxLen之间，检查是否匹配
    if (this.charIdxs().length < this.minLen() || this.charIdxs().length > this.maxLen()) {
      return;
    }


    // 检查是否匹配
    const cs = this.charIdxs().map(idx => this.cells()[idx].character).sort().join('');

    for (let i = 0; i < this.sortedParagraphs().length; i++) {
      const sortedParagraph = this.sortedParagraphs()[i];
      if (sortedParagraph.length !== cs.length) {
        continue;
      }

      if (cs == sortedParagraph) {
        this.finishedParagraphs[i] = this.poetry()!.paragraphs[i];
        for (const idx of this.charIdxs()) {
          this.cells()[idx].isPinned = true;
        }
        this.store.updateCharIdxs([]);
      } else if (this.charIdxs().length >= this.maxLen()) {
        // 如果长度已达到maxLen，清空已打开的字符
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
