import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokeapiService } from '../pokeapi.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage {

  public name: string = '';
  public id: number;
  public img: string = '';
  public hp: number;
  public speed: number;
  public attack: number;
  public defense: number;
  public specialAttack: number;
  public specialDefense: number;
  public types: [] = [];
  public description: string = '';
  public height: string = '';
  public weight: string = '';
  public eggGroups: [] = [];
  public genderRatioMale: number;
  public generRatioFemale: number;
  public evs: string = '';
  public hatchSteps: number;
  public abilities: [] = [];
  public catchRate: number;
  loading: HTMLIonLoadingElement;

  constructor(private router: ActivatedRoute, private pokeapi: PokeapiService, private loadingController: LoadingController) { }

  ionViewDidEnter() {
    this.router.paramMap.subscribe(async param => {
      const id = param.get('id');
      this.id = Number(id);
      if (id) {
        this.loading = await this.loadingController.create();
        await this.loading.present();
        this.getPokemon(id);
      }
    });
  }

  private getPokemon(id) {
    this.pokeapi.getOne(id)
      .subscribe((data: any) => {
        this.name = data.name;
        this.img = data.sprites.front_default;
        data.stats.map(stat => {
          switch (stat.stat.name) {
            case 'speed':
              this.speed = stat.base_stat;
              break;
            case 'special-defense':
              this.specialDefense = stat.base_stat;
              break;
            case 'special-attack':
              this.specialAttack = stat.base_stat;
              break;
            case 'attack':
              this.attack = stat.base_stat;
              break;
            case 'defense':
              this.defense = stat.base_stat;
              break;
            case 'hp':
              this.hp = stat.base_stat;
              break;
          }
        });

        this.height = (data.height * 10 / 100).toFixed(2);
        this.weight = (data.weight * 0.1).toFixed(2);

        this.types = data.types.map(type => type.type.name);
        this.abilities = data.abilities.map(ability => ability.ability.name);
        this.getPokemonSpecies(id);
      });
  }

  private getPokemonSpecies(id) {
    this.pokeapi.getSpecies(id)
      .subscribe((data: any) => {
        data.flavor_text_entries.some(flavor => {
          if (flavor.language.name === 'es') {
            this.description = flavor.flavor_text;
          }
        });
        const genderRate = data.gender_rate;

        this.generRatioFemale = 12.5 * genderRate;
        this.genderRatioMale = 12.5 * (8 - genderRate);
        this.catchRate = Math.round((100 / 255) * data.capture_rate);
        this.eggGroups = data.egg_groups.map(eggGroup => eggGroup.name);

        this.hatchSteps = 255 * (data.hatch_counter + 1);
        this.loading.dismiss();
        console.log(this);
      });
  }

}
