import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Geolocation } from '@capacitor/geolocation';
import { Store } from '../../models/store.interface';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';

declare const google: any;

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
      service.nearbySearch(request, async (results: any[], status: any) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          try {
            const detailedStores = await Promise.all(
              results.map(async (place) => {
                const details = await this.getPlaceDetails(service, place.place_id);
                const storeLocation = new google.maps.LatLng(
                  place.geometry.location.lat(),
                  place.geometry.location.lng()
                );
                
                const distanceInMeters = google.maps.geometry.spherical.computeDistanceBetween(
                  userLocation,
                  storeLocation
                );
                
                const distanceInKm = Math.round((distanceInMeters / 1000) * 10) / 10;

                return {
                  id: place.place_id,
                  name: place.name,
                  address: place.vicinity,
                  distance: distanceInKm,
                  openingHours: details.opening_hours?.weekday_text || [],
                  isOpen: details.opening_hours?.isOpen || false,
                  location: {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng()
                  },
                  rating: place.rating
                };
              })
            );
            resolve(detailedStores);
          } catch (error) {
            reject(new Error('Failed to fetch store details'));
          }
        } else {
          reject(new Error('Failed to fetch nearby stores'));
        }
      });
    });
  }

  private formatOpeningHours(weekdayText: string[]): string[] {
    if (!weekdayText?.length) return [];
    
    const hoursMap = new Map<string, string[]>();
    
    weekdayText.forEach(text => {
      const [day, hours] = text.split(': ');
      
      // Find existing entry with same hours or create new array
      const existingDays = hoursMap.get(hours) || [];
      existingDays.push(day);
      hoursMap.set(hours, existingDays);
    });
    
    // Convert map back to formatted strings
    return Array.from(hoursMap.entries()).map(([hours, days]) => {
      if (days.length === 1) {
        return `${days[0]}: ${hours}`;
      }
      
      if (days.length === 2) {
        return `${days[0]} & ${days[1]}: ${hours}`;
      }
      
      return `${days[0]} - ${days[days.length - 1]}: ${hours}`;
    });
  }

  private getPlaceDetails(service: any, placeId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      service.getDetails(
        {
          placeId: placeId,
          fields: ['opening_hours']
        },
        (place: any, status: any) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            // Format the opening hours before resolving
            const formattedHours = this.formatOpeningHours(place.opening_hours?.weekday_text);
            resolve({
              ...place,
              opening_hours: {
                ...place.opening_hours,
                weekday_text: formattedHours,
                isOpen: place.opening_hours?.isOpen() || false
              }
            });
          } else {
            reject(new Error('Failed to fetch place details'));
          }
        }
      );
    });
  }
}