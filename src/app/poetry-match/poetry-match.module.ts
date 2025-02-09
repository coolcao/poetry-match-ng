import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PoetryMatchRoutingModule } from './poetry-match-routing.module';
import { PoetryMatchBoardComponent } from './poetry-match-board/poetry-match-board.component';
import { PoetryMatchStartPageComponent } from './poetry-start-page/poetry-start-page.component';


@NgModule({
  declarations: [
    PoetryMatchBoardComponent,
    PoetryMatchStartPageComponent,
  ],
  imports: [
    CommonModule,
    PoetryMatchRoutingModule,
    FormsModule,
  ]
})
export class PoetryMatchModule { }
