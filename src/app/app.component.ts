import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { } from '@types/googlemaps';
import { MapsAPILoader, MouseEvent } from '@agm/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title: string = 'Maps Grid';
  latitude: number;
  longitude: number;
  searchRadius: number;
  address: string;
  searchControl: FormControl;
  zoom: number = 18;
  AddressModel: any = {
    "latitude": null,
    "longitude": null,
    "addressArray": null,
    "address": null,
    "streetNumber": null,
    "roadName": null,
    "sublocality": null,
    "locality": null,
    "city": null,
    "country": null,
    "postalCode": null,
    "province": null,
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
        this.zoom = 16;
      });
    }
  }

  ngOnInit() {

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
            this.searchRadius = 1000;
            if (this.searchRadius > 0 && this.searchRadius <= 50) {
              this.zoom = 18;
            } else if (this.searchRadius > 500 && this.searchRadius <= 2000) {
              this.zoom = 15;
            }
            else if (this.searchRadius > 2000) {
              this.zoom = 14;
            }

            if (place.address_components.length == 6) {
              this.AddressModel = {
                "latitude": place.geometry.location.lat(),
                "longitude": place.geometry.location.lng(),
                "addressArray": place.address_components,
                "address": place.formatted_address,
                "roadName": place.address_components[0].long_name,
                "sublocality": place.address_components[1].long_name,
                "city": place.address_components[2].long_name,
                "locality": place.address_components[3].long_name,
                "province": place.address_components[4].long_name,
                "country": place.address_components[5].long_name
              };
            } else if (place.address_components.length == 7) {
              this.AddressModel = {
                "latitude": place.geometry.location.lat(),
                "longitude": place.geometry.location.lng(),
                "addressArray": place.address_components,
                "address": place.formatted_address,
                "streetNumber": place.address_components[0].long_name,
                "roadName": place.address_components[1].long_name,
                "sublocality": place.address_components[2].long_name,
                "city": place.address_components[3].long_name,
                "locality": place.address_components[4].long_name,
                "province": place.address_components[5].long_name,
                "country": place.address_components[6].long_name
              };
            }
            else if (place.address_components.length == 8) {
              this.AddressModel = {
                "latitude": place.geometry.location.lat(),
                "longitude": place.geometry.location.lng(),
                "addressArray": place.address_components,
                "address": place.formatted_address,
                "streetNumber": place.address_components[0].long_name,
                "roadName": place.address_components[1].long_name,
                "sublocality": place.address_components[2].long_name,
                "city": place.address_components[3].long_name,
                "locality": place.address_components[4].long_name,
                "province": place.address_components[5].long_name,
                "country": place.address_components[6].long_name,
                "postalCode": place.address_components[7].long_name
              };
            } else {
              this.AddressModel = {
                "latitude": place.geometry.location.lat(),
                "longitude": place.geometry.location.lng(),
                "addressArray": place.address_components,
                "address": place.formatted_address
              }
            }
            console.log(this.AddressModel);
          });
        });
      }
    );
  }
}

