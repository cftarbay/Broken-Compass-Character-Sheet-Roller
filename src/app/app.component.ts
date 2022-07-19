import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms'
import * as tagListJson from '../assets/tags.json';

import { Character } from './classes/character';
import { AppService } from './app.service';
import { Tag } from './classes/tag';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'broken-compass-web';

  tagsList: any = (tagListJson as any).default;

  tags: string[] = ["",""]
  character!: Character;

  baseDicepool: number = 0;
  dicepool: number = 0;
  advantage: number = 0;
  disadvantage: number = 0;
  beingRolled: string = "";

  results: string[] = [];

  constructor(private service : AppService,
    private ref: ChangeDetectorRef){
    this.initCharacter();
    this.load();
  }

  initCharacter(){
    this.character = new Character();
  }

  chooseTag(tag: string, i: number){
    //if there is a previous tag present, remove its attributes
    if(this.character.tags[i] && this.character.tags[i] != tag){
      this.service.getTag(this.character.tags[i]).subscribe((tagData: Tag) =>{
        this.decrementFields(tagData.fields);
        this.decrementSkills(tagData.skills);
        this.character.expertise = this.character.expertise?.filter(ex => tagData.expertise != ex);
      })
    }
    if(tag){
      this.service.getTag(tag).subscribe((tagData: Tag) =>{
          this.incrementFields(tagData.fields);
          this.incrementSkills(tagData.skills);
          if(!this.character.expertise.includes(tagData.expertise))
            this.character.expertise.push(tagData.expertise);
      })
    }
    this.character.tags[i] = tag;
  }

  incrementFields(names: string[]){
    for(let f of this.character.fields){
      if(f.name === names[0]){
        if(f.value === 3)
          this.incrementFields(names.slice(1))
        else          
          f.value++;
      }
    }
  }

  //todo make sure to decrement in order if tags match
  decrementFields(names: string[]){
    for(let f of this.character.fields){
      if(f.name === names[0]){
        if(f.value != 3)
          this.decrementFields(names.slice(1))
        else          
          f.value--;
      }
    }
  }

  incrementSkills(skills: string[]){
    for(let f of this.character.fields){
      for(let s of f.skillsList){
        if(skills.includes(s.name))
          s.value++;
      }
    }
  }

  decrementSkills(skills: string[]){
    for(let f of this.character.fields){
      for(let s of f.skillsList){
        if(skills.includes(s.name))
          s.value--;
      }
    }
  }

  //todo fix, not working
  checkField(val: number, i: number){
    if(val>3)
      this.character.fields[i].value = 3;
    if(val<2)
      this.character.fields[i].value = 2;
    this.ref.detectChanges();
  }

  checkSkill(val: number, i: number, j: number){
    console.log(val)
    if(val>3)
      this.character.fields[i].skillsList[j].value = 3;
    if(val<1)
      this.character.fields[i].skillsList[j].value = 1;
    this.ref.detectChanges();
  }

  save(){
    if(!this.character.tags[0] || !this.character.tags[1]){
      alert("must have 2 tags selected to save");
      return;
    }
    localStorage.setItem("character", JSON.stringify(this.character));
  }

  load(){
    if(localStorage.getItem("character")){
      this.character = JSON.parse(localStorage.getItem("character")!);
    }
  }

  clear(){
    if(confirm("really clear?")){
      localStorage.clear();
      this.initCharacter();
    }
  }

  addExpertise(){
    if(this.character.expertise.length<6)
      this.character.expertise.push("");
  }

  removeExpertise(i: number){
    this.character.expertise.splice(i,1);
  }

  addFeeling(){
    if(this.character.customGood.length<3){
      this.character.customGood.push({name:"", value:false});
      this.character.customBad.push({name:"", value:false});
    }
  }

  removeFeeling(i: number){
    this.character.customGood.splice(i,1);
    this.character.customBad.splice(i,1);
  }

  removeItem(i: number){
    this.character.gear.splice(i,1);
  }

  addItem(){
    if(this.character.gear.length<6)
      this.character.gear.push({name: "", description: "", advantage: 0, skill: ""});
  }

  removeMag(i: number){
    this.character.mags.splice(i,1);
  }

  addMag(){
    if(this.character.mags.length<4)
      this.character.mags.push({name: "", pockets: 0, bag: 0, backpack: 0});
  }

  removeExp(i: number){
    this.character.experience.splice(i,1);
  }

  addExp(){
    if(this.character.experience.length<10)
      this.character.experience.push("");
  }

  calculateDicepool(i: number,j: number){
    this.baseDicepool = this.character.fields[i].value + this.character.fields[i].skillsList[j].value;
    this.beingRolled = this.character.fields[i].skillsList[j].name;
    if(this.character.good[i].value && this.dicepool<9)
      this.advantage++;
    if(this.character.bad[i].value && this.disadvantage<2)
      this.disadvantage++;
    this.recalculatePool();
  }

  cancelRoll(){
    this.baseDicepool = 0;
    this.dicepool = 0;
    this.advantage = 0;
    this.disadvantage = 0;
    this.results = [];
    this.beingRolled = ""
  }

  roll(){
    this.results = [];
    let res = this.service.rollDice(this.dicepool);
    for(let i=0; i<res.length; i++){
      this.results.push("/assets/img/"+res[i]+".jpg");
    }
  }

  recalculatePool(){
    this.dicepool = this.baseDicepool + this.advantage - this.disadvantage;
    if(this.dicepool>9)
      this.dicepool = 9;
  }

}
