import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CarbonCalculatorPageRoutingModule } from './carbon-calculator-routing.module';

import { CarbonCalculatorPage } from './carbon-calculator.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CarbonCalculatorPageRoutingModule
  ],
  declarations: [CarbonCalculatorPage]
})
export class CarbonCalculatorPageModule {}
