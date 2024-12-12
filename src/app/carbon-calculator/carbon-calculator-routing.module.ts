import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CarbonCalculatorPage } from './carbon-calculator.page';

const routes: Routes = [
  {
    path: '',
    component: CarbonCalculatorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CarbonCalculatorPageRoutingModule {}
