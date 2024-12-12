import { Component } from '@angular/core';

@Component({
  selector: 'app-carbon-calculator',
  templateUrl: './carbon-calculator.page.html',
  styleUrls: ['./carbon-calculator.page.scss'],
})
export class CarbonCalculatorPage {
  distance: number = 0; // Jarak dalam kilometer
  vehicleType: string = ''; // Jenis kendaraan
  carbonEmission: number | null = null; // Hasil perhitungan emisi

  // Nilai rata-rata emisi per km (dalam kg CO2/km) untuk setiap jenis kendaraan
  emissionRates: { [key: string]: number } = {
    car: 0.12, // Mobil rata-rata menghasilkan 0.12 kg CO2/km
    motorcycle: 0.09, // Motor menghasilkan 0.09 kg CO2/km
    bus: 0.05, // Bus menghasilkan 0.05 kg CO2/km
    bicycle: 0, // Sepeda tidak menghasilkan emisi karbon
    walking: 0, // Jalan kaki tidak menghasilkan emisi karbon
  };

  // Fungsi untuk menghitung emisi karbon
  calculateCarbon() {
    if (this.vehicleType && this.distance > 0) {
      const emissionRate = this.emissionRates[this.vehicleType] || 0;
      this.carbonEmission = this.distance * emissionRate;
    } else {
      this.carbonEmission = null; // Set ke null jika input tidak valid
    }
  }
}
