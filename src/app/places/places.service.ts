import { inject, Injectable, signal } from '@angular/core';

import { Place } from './place.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private httpClient = inject(HttpClient);

  private userPlaces = signal<Place[]>([]);

  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces() { 
    return this.fetchPlaces('http://localhost:3000/places', 
      'Something went wrong in fetching available places'
    )
  }

  loadUserPlaces() { 
    return this.fetchPlaces('http://localhost:3000/user-places', 
      'Something went wrong in fetching user places'
    ).pipe(tap({
      next: (userPlaces)=> {
        this.userPlaces.set(userPlaces);
      }
    }))
  }

  addPlaceToUserPlaces(placeId: string) { 
     return this.httpClient.put('http://localhost:3000/user-places', {placeId});
  }

  removeUserPlace(place: Place) { }

  private fetchPlaces(url:string, errorMessage:string) {
    return this.httpClient.get<{ places: Place[] }>(url).
      pipe(map((val) => val.places),
        catchError((err, observable) => {
          console.log(err);
          return throwError(() => {
            return new Error(errorMessage)
          });
        }))
  }
}
