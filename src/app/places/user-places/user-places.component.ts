import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { HttpClient } from '@angular/common/http';
import { Place } from '../place.model';
import { catchError, map, throwError } from 'rxjs';

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
  places = signal<Place[] | undefined>(undefined);
  constructor(private httpClient: HttpClient) {

  }
  ngOnInit(): void {
    this.isFetching.set(true);
    const subs = this.httpClient.get<{ places: Place[] }>('http://localhost:3000/user-places').
      pipe(map((val) => val.places),
        catchError((err, observable) => {
          console.log(err);
          return throwError(() => {
            return new Error('Something went wrong in fetching fav places')
          });
        }))
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
