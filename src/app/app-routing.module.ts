import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'poetry-match', pathMatch: 'full' },
  { path: 'poetry-match', loadChildren: () => import('./poetry-match/poetry-match.module').then(m => m.PoetryMatchModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
