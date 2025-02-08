import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PoetryMatchBoardComponent } from './poetry-match-board/poetry-match-board.component';

const routes: Routes = [
  { path: '', component: PoetryMatchBoardComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PoetryMatchRoutingModule { }
