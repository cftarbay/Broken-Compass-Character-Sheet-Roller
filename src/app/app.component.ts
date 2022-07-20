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
  customTagNames: string[] = ["",""]
  character!: Character;
  notes: string = "";

  baseDicepool: number = 0;
  dicepool: number = 0;
  advantage: number = 0;
  disadvantage: number = 0;
  beingRolled: string = "";
  successType: string = "";
  newSuccessType: string = "";

  results: string[] = [];
  rerollResults: string[] = [];
  allOrNothingResults: string[] = [];
  counts: number[] = [0,0,0,0,0,0];

  rerollEligible: boolean = false;
  expertiseEligible: boolean = false;
  allOrNothingEligible: boolean = false;

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
      this.customTagNames[i] = "";
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
      alert("Please select two tags for your character before saving");
      return;
    }
    localStorage.setItem("character", JSON.stringify(this.character));
    localStorage.setItem("customTagNames", JSON.stringify(this.customTagNames));
    localStorage.setItem("notes", JSON.stringify(this.notes))
    alert("Your character has been saved successfully")
  }

  load(){
    if(localStorage.getItem("character")){
      this.character = JSON.parse(localStorage.getItem("character")!);
      this.customTagNames = JSON.parse(localStorage.getItem("customTagNames")!);
      this.notes = JSON.parse(localStorage.getItem("notes")!);
      for(let i=0; i<this.character.tags.length; i++){
        this.tags[i] = this.character.tags[i];
      }
    }
  }

  clear(){
    if(confirm("Do you really want to clear the sheet?")){
      localStorage.clear();
      this.initCharacter();
      this.tags = ["",""]
      this.customTagNames = ["",""]
      this.notes = "";
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
    this.beingRolled = "";
    this.successType = "";
    this.expertiseEligible = false;
    this.rerollEligible = false;
    this.counts = [0,0,0,0,0,0];
    this.rerollResults = [];
    this.allOrNothingEligible = false;
    this.newSuccessType = "";
    this.allOrNothingResults = [];
  }

  roll(){
    this.results = [];
    this.rerollResults = [];
    this.allOrNothingEligible = false;
    this.allOrNothingResults = [];
    this.newSuccessType = "";
    let res = this.service.rollDice(this.dicepool);
    for(let i=0; i<res.length; i++){
      this.results.push("assets/img/"+res[i]+".jpg");
    }
    this.calculateSuccess(res);    
  }

  calculateSuccess(res: number[]){
    let counts = [0,0,0,0,0,0];
    res.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });
    this.counts = counts;
    if(this.counts.filter(x => x>4).length>0)
      this.successType = "Impossible Success!"
    else if(this.counts.filter(x => x>3).length>0)
      this.successType = "Extreme Success!"
    else if(this.counts.filter(x => x>2).length>0)
      this.successType = "Critical Success!"
    else if(this.counts.filter(x => x>1).length>0)
      this.successType = "Basic Success!"
    else
      this.successType = "No Success"
    this.expertiseEligible = this.counts.filter(x => x===1).length>0;
    this.rerollEligible = this.counts.filter(x => x===1).length>0 && this.counts.filter(x => x>1).length>0;
  }

  reroll(){
    let rerollCount = 0;
    for(let i=this.counts.length-1; i>=0; i--){
      if(this.counts[i]===1){
        for(let j=this.results.length-1; j>=0; j--){
          if(this.results[j].includes(i+"")){
            this.results.splice(j,1);
            rerollCount++;
          }
        }
      }
    }
    this.rerollResults = [];
    let res = this.service.rollDice(rerollCount);
    for(let i=0; i<res.length; i++){
      this.rerollResults.push("assets/img/"+res[i]+".jpg");
    }
    this.successType = "";
    this.rerollEligible = false;
    this.expertiseEligible = false;

    let newResultsString = this.results.concat(this.rerollResults);
    let newResults: number[] = [];
    newResultsString.forEach(str => {newResults.push(parseInt(str.substring(11,12)))})
    newResults.sort();
    let newCounts = [0,0,0,0,0,0];
    newResults.forEach(function (x) { newCounts[x] = (newCounts[x] || 0) + 1; });

    let newSuccess: boolean = false;
    for(let i=0; i<newCounts.length; i++){
      if(newCounts[i]!==1 && newCounts[i]>this.counts[i]){
        newSuccess = true;
      }
    }

    if(newCounts.filter(x => x>4).length>0 && newSuccess)
      this.newSuccessType = "New Success - Impossible Success!"
    else if(newCounts.filter(x => x>3).length>0 && newSuccess)
      this.newSuccessType = "New Success - Extreme Success!"
    else if(newCounts.filter(x => x>2).length>0 && newSuccess)
      this.newSuccessType = "New Success - Critical Success!"
    else if(newCounts.filter(x => x>1).length>0 && newSuccess)
      this.newSuccessType = "New Success - Basic Success!"
    else
      this.newSuccessType = "No New Success"

    this.allOrNothingEligible = newCounts.filter(x => x===1).length>0 && newSuccess;
  }

  allOrNothing(){
    this.allOrNothingEligible = false;

    let newResultsString = this.results.concat(this.rerollResults);
    let newResults: number[] = [];
    newResultsString.forEach(str => {newResults.push(parseInt(str.substring(11,12)))})
    newResults.sort();
    let newCounts = [0,0,0,0,0,0];
    newResults.forEach(function (x) { newCounts[x] = (newCounts[x] || 0) + 1; });

    let rerollCount = 0;
    for(let i=newCounts.length-1; i>=0; i--){
      if(newCounts[i]===1){
        for(let j=this.rerollResults.length-1; j>=0; j--){
          if(this.rerollResults[j].includes(i+"")){
            this.rerollResults.splice(j,1);
            rerollCount++;
          }
        }
      }
    }

    this.allOrNothingResults = [];
    this.newSuccessType = "";
    let res = this.service.rollDice(rerollCount);
    for(let i=0; i<res.length; i++){
      this.allOrNothingResults.push("assets/img/"+res[i]+".jpg");
    }

  }

  recalculatePool(){
    this.dicepool = this.baseDicepool + this.advantage - this.disadvantage;
    if(this.dicepool>9)
      this.dicepool = 9;
  }

}
