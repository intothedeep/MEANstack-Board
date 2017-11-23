import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BoardComponent } from './board/board.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: BoardComponent },
  // { path: 'article/:seq', component: BoardComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
