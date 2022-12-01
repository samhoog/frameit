import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameComponent } from 'src/components/game/game.component';
import { HomeComponent } from 'src/components/home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'play', component: GameComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
