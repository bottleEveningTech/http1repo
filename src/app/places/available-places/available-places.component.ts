import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent]
})
export class AvailablePlacesComponent implements OnInit{
  places = signal<Place[] | undefined>(undefined);
  // private httpClient = inject(HttpClient); way 1
  private destroyRef = inject(DestroyRef);
  public isFetching = signal<boolean>(false);
  constructor(private httpClient: HttpClient){

  }
  ngOnInit(): void {
    this.isFetching.set(true);
    const subs = this.httpClient.get<{places: Place[]}>('http://localhost:3000/places').
    pipe(map((val) => val.places)).subscribe({
      next: (resData)=> {
        this.places.set(resData);
        // console.log(response.body?.places);
        // console.log(event);
        // console.log(resData.places);
      },
      complete: () => {
        this.isFetching.set(false);
      }
    });

    this.destroyRef.onDestroy(()=> {
      subs.unsubscribe();
    })
  }
}
