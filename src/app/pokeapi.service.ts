import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PokeapiService {

  constructor( private http: HttpClient ) { }

  getAll() {
    return this.http.get('https://pokeapi.co/api/v2/pokemon?limit=150');
  }

  getOne(id: string) {
    return this.http.get('https://pokeapi.co/api/v2/pokemon/' + id);
  }

  getSpecies(id: string) {
    return this.http.get('https://pokeapi.co/api/v2/pokemon-species/' + id);
  }
}
