import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PoetryMatchBoardComponent } from './poetry-match-board/poetry-match-board.component';
import { PoetryMatchStartPageComponent } from './poetry-start-page/poetry-start-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'start', pathMatch: 'full' },
  { path: 'start', component: PoetryMatchStartPageComponent },
  { path: 'board', component: PoetryMatchBoardComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PoetryMatchRoutingModule { }
