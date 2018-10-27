import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { } from 'googlemaps';
import { MapsAPILoader, MouseEvent } from '@agm/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title: string = 'Maps Grid';
  public latitude: number;
  public longitude: number;
  public address: string;
  public searchControl: FormControl;
  public zoom: number;
  AddressModel: any = {
    "latitude": null,
    "longitude": null,
    "addressArray": null,
    "address": null,
    "city": null,
    "country": null,
    "postalCode": null,
    "province": null
  };

  @ViewChild("search")
  public searchElementRef: ElementRef;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) { }

  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 20;
      });
    }
  }

  ngOnInit() {
    //create search FormControl
    this.searchControl = new FormControl();

    //set current position
    this.setCurrentPosition();

    this.mapsAPILoader.load().then(
      () => {
        let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, { types: ["address"] });

        autocomplete.addListener("place_changed", () => {
          this.ngZone.run(() => {
            let place: google.maps.places.PlaceResult = autocomplete.getPlace();
            if (place.geometry === undefined || place.geometry === null) {
              return;
            }
            this.latitude = place.geometry.location.lat();
            this.longitude = place.geometry.location.lng();
            this.zoom = 20;
            this.address = "Select Point";

            this.AddressModel = {
              "latitude": place.geometry.location.lat(),
              "longitude": place.geometry.location.lng(),
              "addressArray": place.address_components,
              "address": place.formatted_address,
              // "city": this.retriveAddressComponents('locality'),
              // "country": this.retriveAddressComponents('country'),
              // "postalCode": this.retriveAddressComponents('postal_code'),
              // "province": this.retriveAddressComponents('administrative_area_level_1')
            };
            console.log(this.AddressModel);
          });
        });
      }
    );
  }
}

