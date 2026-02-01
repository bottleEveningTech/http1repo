import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  public isFetching = signal<boolean>(false);
  public error = signal<string>('');
  // places = signal<Place[] | undefined>(undefined);
  places = this.placesService.loadedUserPlaces;
  constructor(private placesService: PlacesService) {

  }
  ngOnInit(): void {
    this.isFetching.set(true);
    const subs = this.placesService.loadUserPlaces().subscribe({
        // next: (resData) => {
        //   this.places.set(resData);
        //   // console.log(response.body?.places);
        //   // console.log(event);
        //   // console.log(resData.places);
        // },
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
