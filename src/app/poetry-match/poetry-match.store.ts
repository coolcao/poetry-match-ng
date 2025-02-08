import { computed, Injectable, linkedSignal, Signal, signal, WritableSignal } from "@angular/core";

import { getPoetryList } from './poetry-match.dataset';
import { CharacterCell } from "./poetry-match.types";

@Injectable({
  providedIn: 'root'
})
export class PoetryMatchStore {

  private _poetryName = signal('');
  private _poetryList = signal(getPoetryList());

  readonly poetryName = this._poetryName.asReadonly();
  readonly poetry = computed(() => {
    return this._poetryList().find(poetry => poetry.title === this.poetryName());
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

  updateCell(idx: number, cell: CharacterCell) {
    const cells = [...this.cells()];
    cells[idx] = { ...cell };
    this.cells.set(cells);
  }

  setPoetryName(name: string) {
    this._poetryName.set(name);
  }


}
