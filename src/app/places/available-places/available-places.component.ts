import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent]
})
export class AvailablePlacesComponent implements OnInit {
  // console.log(event);
  // console.log(resData.places);
  onSelectPlace(place: Place) {
   const selectsub =  this.placesService.addPlaceToUserPlaces(place)
   .subscribe({
      next:(res)=> {
        return console.log(res);
      }
    });
    this.destroyRef.onDestroy(() => {
      selectsub.unsubscribe();
    })
  }
  places = signal<Place[] | undefined>(undefined);
  // private httpClient = inject(HttpClient); way 1
  private destroyRef = inject(DestroyRef);
  public isFetching = signal<boolean>(false);
  public error = signal<string>('');
  constructor(private httpClient: HttpClient, private placesService: PlacesService) {

  }
  ngOnInit(): void {
    this.isFetching.set(true);
    const subs = this.placesService.loadAvailablePlaces()
      .subscribe({
        next: (resData) => {
          this.places.set(resData);
          // console.log(response.body?.places);
          // console.log(event);
          // console.log(resData.places);
        },
        complete: () => {
          this.isFetching.set(false);
        },
        error: (err: Error) => {
          console.log(err);
          this.error.set(err.message);
          // this.error.set("Something went wrong fetching available places. Try again later!");
        }
      });

    this.destroyRef.onDestroy(() => {
      subs.unsubscribe();
    })
  }
}
