import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Geolocation } from '@capacitor/geolocation';
import { Store } from '../../models/store.interface';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';

declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class StoreLocatorService {
  constructor(
    private http: HttpClient,
    private firestore: AngularFirestore,
    @Inject('AUTH_SERVICE') private auth: AuthService
  ) {}

  private isGoogleMapsLoaded(): boolean {
    return typeof google !== 'undefined' && 
           typeof google.maps !== 'undefined' && 
           typeof google.maps.places !== 'undefined';
  }

  private waitForGoogleMaps(maxAttempts = 20): Promise<void> {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const checkGoogle = () => {
        attempts++;
        if (this.isGoogleMapsLoaded()) {
          resolve();
        } else if (attempts >= maxAttempts) {
          reject(new Error('Google Maps failed to load'));
        } else {
          setTimeout(checkGoogle, 100);
        }
      };
      checkGoogle();
    });
  }

  async getNearbyStores(): Promise<Store[]> {
    try {
      await this.waitForGoogleMaps();
    } catch (error) {
      throw new Error('Something went wrong. Please refresh the page.');
    }

    const coordinates = await Geolocation.getCurrentPosition();
    const userLocation = new google.maps.LatLng(
      coordinates.coords.latitude,
      coordinates.coords.longitude
    );

    const service = new google.maps.places.PlacesService(
      document.createElement('div')
    );

    const request = {
      location: userLocation,
      radius: 5000,
      type: 'book_store',
      keyword: 'manga store comic book'
    };

    return new Promise((resolve, reject) => {
      service.nearbySearch(request, (results: any[], status: any) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          const stores: Store[] = results.map(place => {
            const storeLocation = new google.maps.LatLng(
              place.geometry.location.lat(),
              place.geometry.location.lng()
            );
            
            const distanceInMeters = google.maps.geometry.spherical.computeDistanceBetween(
              userLocation,
              storeLocation
            );
            
            const distanceInKm = Math.round((distanceInMeters / 1000) * 10) / 10;

            console.log(place.opening_hours);

            return {
              id: place.place_id,
              name: place.name,
              address: place.vicinity,
              distance: distanceInKm,
              openingHours: place.opening_hours?.weekday_text,
              location: {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
              },
              rating: place.rating
            };
          });
          resolve(stores);
        } else {
          reject(new Error('Failed to fetch nearby stores'));
        }
      });
    });
  }
}