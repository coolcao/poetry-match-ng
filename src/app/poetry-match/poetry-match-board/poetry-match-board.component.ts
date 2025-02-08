import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import { timer } from 'rxjs';

import { PoetryMatchStore } from '../poetry-match.store';
import { CharacterCell, PoetryType } from '../poetry-match.types';

@Component({
  selector: 'app-poetry-match-board',
  standalone: false,

  templateUrl: './poetry-match-board.component.html',
  styleUrl: './poetry-match-board.component.css'
})
export class PoetryMatchBoardComponent implements OnInit {

  PoetryType = PoetryType;

  store = inject(PoetryMatchStore);

  poetry = this.store.poetry;
  cells = this.store.cells;
  isCompleted = this.store.isCompleted;

  // 已完成的数量
  finishedCount = 0;
  // 步数
  steps = 0;
  // 已打开的字符
  charIdxs: number[] = [];
  paragraphs: string[] = [];

  ngOnInit(): void {
    this.store.setPoetryName('静夜思');
  }

  clickCell(idx: number) {
    const cell = this.cells()[idx];
    // 已经固定的字符，不用再点击
    if (cell.isPinned) {
      return;
    }
    this.steps++;
    if (cell.isOpened) {
      cell.isOpened = false;
      this.store.updateCell(idx, cell);
      // 从已打开的字符中移除
      this.charIdxs = this.charIdxs.filter(i => i !== idx);
      return;
    }


    cell.isOpened = true;
    this.charIdxs.push(idx);
    this.store.updateCell(idx, cell);

    if (this.charIdxs.length == 5) {
      // 检查是否匹配
      const cs = this.charIdxs.map(idx => this.cells()[idx].character).sort().join();
      const paragraphs = this.poetry()?.paragraphs[this.finishedCount].split('').sort().join();

      if (cs == paragraphs) {
        // 匹配
        this.paragraphs.push(this.poetry()!.paragraphs[this.finishedCount]);
        this.finishedCount++;
        for (const idx of this.charIdxs) {
          this.cells()[idx].isPinned = true;
        }
        this.charIdxs = [];
      } else {
        // 不匹配，延迟关闭
        timer(1000).subscribe(() => {
          this.charIdxs.forEach(idx => {
            this.cells()[idx].isOpened = false;
          });
          this.charIdxs = [];
        });
      }
    }

  }

}
