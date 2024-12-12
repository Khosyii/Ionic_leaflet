import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarbonCalculatorPage } from './carbon-calculator.page';

describe('CarbonCalculatorPage', () => {
  let component: CarbonCalculatorPage;
  let fixture: ComponentFixture<CarbonCalculatorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CarbonCalculatorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
