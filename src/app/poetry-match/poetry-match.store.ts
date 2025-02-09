import { computed, Injectable, linkedSignal, Signal, signal, WritableSignal } from "@angular/core";

import { getPoetryList } from './poetry-match.dataset';
import { CharacterCell } from "./poetry-match.types";

@Injectable({
  providedIn: 'root'
})
export class PoetryMatchStore {

  private _poetryName = signal('');
  private _poetryList = signal(getPoetryList());
  private _steps = signal(0);
  // 已打开的字符，每完成一句诗就重置一次
  private _charIdxs: WritableSignal<number[]> = signal([]);

  readonly poetryName = this._poetryName.asReadonly();
  readonly poetry = computed(() => {
    return this._poetryList().find(poetry => poetry.title === this.poetryName());
  });
  readonly steps = this._steps.asReadonly();
  readonly charIdxs = this._charIdxs.asReadonly();
  readonly poetryList = this._poetryList.asReadonly();

  readonly poetryNames = computed(() => {
    return this._poetryList().map(poetry => poetry.title);
  });

  // 诗句中每句的句子，按字符排序，用于比较打开的字符是否匹配
  readonly sortedParagraphs = computed(() => {
    if (this.poetry() && this.poetry()!.paragraphs) {
      return this.poetry()!.paragraphs.map(p => p.split('').sort().join(''));
    }
    return [];
  });


  readonly cells: WritableSignal<CharacterCell[]> = linkedSignal(() => {
    if (!this.poetry()) {
      return [];
    }
    return this.poetry()!.characters.map(c => ({
      character: c,
      isOpened: false,
    }))
  });
  readonly isCompleted = computed(() => {
    if (!this.poetry()) {
      return false;
    }
    return this.cells().every(cell => cell.isPinned);
  });

  loadPoetry(name: string) {
    this.setPoetryName(name);
    this.resetSteps();
    this.updateCharIdxs([]);
    this.cells().forEach(cell => {
      cell.isOpened = false;
      cell.isPinned = false;
    });
  }

  updateCell(idx: number, cell: CharacterCell) {
    const cells = [...this.cells()];
    cells[idx] = { ...cell };
    this.cells.set(cells);
  }

  setPoetryName(name: string) {
    this._poetryName.set(name);
  }

  increaseSteps() {
    this._steps.update(v => v + 1);
  }

  resetSteps() {
    this._steps.set(0);
  }

  updateCharIdxs(idxs: number[]) {
    this._charIdxs.set([...idxs]);
  }
  addCharIdx(idx: number) {
    this._charIdxs.update(v => [...v, idx]);
  }


}
