import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'maps2',
    pathMatch: 'full'
  },
  {
    path: 'maps2',
    loadChildren: () => import('./maps2/maps2.module').then( m => m.Maps2PageModule)
  },
  {
    path: 'carbon-calculator',
    loadChildren: () => import('./carbon-calculator/carbon-calculator.module').then( m => m.CarbonCalculatorPageModule)
  },
  // {
  //   path: '',
  //   redirectTo: 'home',
  //   pathMatch: 'full'
  // },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
