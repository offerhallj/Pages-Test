import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { count } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
  encapsulation: ViewEncapsulation.None
})

export class MapComponent {
    public svgContent: string = "";
    public isInitialized: boolean = false;
    public countryIsValid: boolean = true;

    public countryName: string = "Select a country to begin";
    public countryRegion: string = "";
    public countryIncome: string = "";
    public countryCapital: string = "";
    public countryISO2Code: string = "";
    public countryLatitude: string = "";
    public countryLongitude: string = "";

    public constructor(private http: HttpClient) {
        this.http.get('../assets/world-map.svg', {responseType: 'text'}).subscribe(data => {
            document.querySelector('#svg-container')!.innerHTML = `<div>${data}</div>`;
            
            let paths = document.querySelectorAll<SVGPathElement>("path");
            for(let i = 0; i < paths.length; i++) {
                paths[i].addEventListener("mouseenter", (event) => this.onMouseOver(event));
                paths[i].addEventListener("mouseleave", (event) => this.onMouseExit(event));
            }
        });
    }

    public onMouseOver(event: Event): void {
        let country = event.target as SVGPathElement;
        country.classList.add("highlight");
        this.getCountryData(country);
        this.isInitialized = true;
    }

    public onMouseExit(event: Event): void {
        let country = event.target as SVGPathElement;
        country.classList.remove("highlight");
    }

    private async getCountryData(svgElement: SVGPathElement) {
        this.countryName = "" + svgElement.getAttribute('name');
        
        let apiURL = `https://api.worldbank.org/V2/country/${svgElement.getAttribute('id')}?format=json`;
        let response = await fetch(apiURL);
        
        if (response.ok) {
            let info = await response.json();
            if (info.length <= 1) { this.invalidCountry(); return; }

            this.countryIsValid = true;
            let countryData = Object.create(info[1][0])
            this.countryCapital = countryData.capitalCity;
            this.countryISO2Code = countryData.iso2Code;
            this.countryRegion = countryData.region.value;
            this.countryIncome = countryData.incomeLevel.value;
            this.countryLatitude = countryData.latitude;
            this.countryLongitude = countryData.longitude;
        }        
    }

    private invalidCountry(): void {
        console.log("This country could not be found");
        this.countryIsValid = false;

        this.countryCapital = "--";
        this.countryISO2Code = "--";
        this.countryRegion = "--";
        this.countryIncome = "--";
        this.countryLatitude = "--";
        this.countryLongitude = "--";
    }
}
