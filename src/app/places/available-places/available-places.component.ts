import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';

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
  constructor(private httpClient: HttpClient){

  }
  ngOnInit(): void {
    const subs = this.httpClient.get<{places: Place[]}>('http://localhost:3000/places',
      {observe: 'response'}                                     //config object
    ).subscribe({
      next: (response)=> {
        console.log(response.body?.places);
        console.log(response);
        // console.log(resData.places);
      }
    });

    this.destroyRef.onDestroy(()=> {
      subs.unsubscribe();
    })
  }
}
