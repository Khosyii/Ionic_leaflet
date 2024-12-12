import { Component, OnInit } from '@angular/core';
import * as leaflet from 'leaflet';
import 'leaflet-routing-machine';  // Plugin routing
import 'leaflet-control-geocoder';  // Plugin geocoder
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
import { circle } from 'leaflet';
import {  ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';


declare var L: any;
export type VehicleType = 'gasoline' | 'diesel' | 'motor';

const customIcon = L.icon({
  iconUrl: '/assets/icon/favicon.png',
  shadowUrl: '/assets/icon/favicon.png',
  iconSize: [25, 41], // ukuran icon
  iconAnchor: [12, 41], // titik anchor untuk posisi marker
  popupAnchor: [1, -34], // posisi popup dari icon
  shadowSize: [41, 41]  // ukuran shadow
});

@Component({
  selector: 'app-maps2',
  templateUrl: './maps2.page.html',
  styleUrls: ['./maps2.page.scss'],
})



export class Maps2Page implements OnInit {
  map!: leaflet.Map;
  locationLayerGroup = new leaflet.LayerGroup();
  gpsLoadingEl!: HTMLIonLoadingElement;
  randomMessage: string = '';
  distance: number = 0;
  vehicleType!: VehicleType;
  emissionResult: number | null = null;
  @ViewChild(IonModal)
  modal!: IonModal; // Pastikan ini dideklarasikan dengan benar

  message!: string;

  constructor(private loadingController: LoadingController, private alertController: AlertController, private modalCtrl: ModalController) { }


  ngOnInit() {
  }


  ionViewDidEnter() {
    // Initialize the map
    this.map = leaflet.map('map').setView([-7.798316342921687, 110.35699080287542], 10); // Default to DIY

    // Base map layer - OpenStreetMap
     const openStreetMap = leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    });

    // Base map layer - Google Maps (Satellit view)
    const googleSat = leaflet.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: '&copy; <a href="https://maps.google.com">Google Maps</a>',
    });

    // Base map layer - Esri WorldStreetMap
    const esriWorldStreetMap = leaflet.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ',
    });

    // Menambahkan base map default (OpenStreetMap)
    openStreetMap.addTo(this.map);

    // Menambahkan Layer Control
    const baseMaps = {
      'OpenStreetMap': openStreetMap,
      'satellite view': googleSat,
      'Esri WorldStreetMap': esriWorldStreetMap,
    };
    leaflet.control.layers(baseMaps).addTo(this.map);


    // Add routing control using Leaflet Routing Machine
    const routingControl = leaflet.Routing.control({
      waypoints: [
        leaflet.latLng(-7.767601279498855, 110.37863925231875), // Starting point (UGM)
        leaflet.latLng(-7.773494996707823, 110.3862296369753),  // Destination point (UNY)
      ],
      routeWhileDragging: false,
      geocoder: L.Control.Geocoder.nominatim()  // Optional: Adds a geocoder for location search
    }).addTo(this.map);
  }

  // Geolocation function
  public async locate() {
    this.locationLayerGroup.clearLayers();
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by your browser');
      return;
    }
    await this.presentLoading();
    navigator.geolocation.getCurrentPosition(
      (position) => this.onLocationSuccess(position),
      (error) => this.onLocateError(error),
      { enableHighAccuracy: true }
    );
  }

  private onLocationSuccess(position: GeolocationPosition) {
    const { accuracy, latitude, longitude } = position.coords;
    const latlng: [number, number] = [latitude, longitude];  // Perbaikan tuple
    this.hideLoading();
    this.map.setView(latlng, 18);
    const accuracyValue = accuracy > 1000 ? accuracy / 1000 : accuracy;
    const accuracyUnit = accuracy > 1000 ? 'km' : 'm';
    this.placeLocationMarker(latlng, `Accuracy is ${accuracyValue} ${accuracyUnit}`);
    const locationCircle = circle(latlng, accuracy);
    this.locationLayerGroup.addLayer(locationCircle);
  }

  private async onLocateError(error: GeolocationPositionError) {
    this.hideLoading();
    const alert = await this.alertController.create({
      header: 'GPS error',
      message: error.message,
      buttons: ['OK']
    });
    await alert.present();
  }

  private async presentLoading() {
    this.gpsLoadingEl = await this.loadingController.create({
      message: 'Locating device ...',
    });
    await this.gpsLoadingEl.present();
  }

  private hideLoading() {
    this.gpsLoadingEl.dismiss();
  }

  private placeLocationMarker(latlng: [number, number], message: string) {
    const marker = leaflet.marker(latlng).bindPopup(message).addTo(this.map);
    const locationCircle = leaflet.circle(latlng, { radius: 50 }).addTo(this.map);
    this.locationLayerGroup.addLayer(marker);
    this.locationLayerGroup.addLayer(locationCircle);
  }
//kalkulator emisi co2

  // Data konsumsi bahan bakar dan faktor emisi
  fuelConsumption: Record<VehicleType, number> = {
    gasoline: 2.394e-6,
    diesel: 2.052e-6,
    motor: 1.197e-6
  };

  emissionFactors: Record<VehicleType, number> = {
    gasoline: 69300,
    diesel: 74100,
    motor: 69300
  };

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }

  calculateEmissions() {
    if (this.distance && this.vehicleType) {
      const fuelConsumptionRate = this.fuelConsumption[this.vehicleType];
      const emissionFactor = this.emissionFactors[this.vehicleType];
      this.emissionResult = this.distance * fuelConsumptionRate * emissionFactor; // Calculate emissions

      // Generate a random message for user encouragement
      const randomMessages = [
        "Keep up the good work!",
        "Every step towards reducing emissions counts!",
        "You're making a difference!",
        "Let's aim for a greener future!",
      ];
      this.randomMessage = randomMessages[Math.floor(Math.random() * randomMessages.length)];
    }
  }
  resetCalculator() {
    this.distance = 0;           // Reset jarak
    this.vehicleType = 'gasoline' // Reset jenis kendaraan
    this.emissionResult = null;  // Reset hasil emisi
    this.randomMessage = '';      // Reset pesan himbauan
  }

}





