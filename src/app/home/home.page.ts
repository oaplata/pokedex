import { Component } from '@angular/core';
import { PokeapiService } from '../pokeapi.service';
import { LoadingController } from '@ionic/angular';

interface Pokemon {
  name: string;
  id: number;
  url: string;
  img: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public pokemons: Pokemon[] = [];
  loading: HTMLIonLoadingElement;

  constructor( private pokeapi: PokeapiService, private loadingController: LoadingController ) {}

  private async getAll() {
    this.loading = await this.loadingController.create();
    await this.loading.present();
    this.pokeapi.getAll()
      .subscribe((data: { count: number, next: string, previous: string, results: { name: string, url: string }[] }) => {
        if (data.results) {
          this.pokemons = data.results.map(p => {
            const id = Number(new URL(p.url).pathname.split('/').reverse()[1]);
            return {
              ...p,
              id,
              img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
            };
          });
        }
        this.loading.dismiss();
      });
  }

  ionViewDidEnter() {
    this.getAll();
  }

}
