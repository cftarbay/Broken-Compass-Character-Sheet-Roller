import { Feeling } from "./feeling";
import { Field } from "./field";
import { Item } from "./item";
import { Luck } from "./luck";
import { Mag } from "./mag";
import { Skill } from "./skill";

export class Character {
 name: string = "";
 tags: string[] = ["",""];

 heritage?: string = "";
 homeland?: string = "";
 workplace?: string = "";
 words?: string = "";

 fields: Field[] = [
    new Field("Action", 2, [new Skill("Fight"), new Skill("Leadership"), new Skill("Stunt")]),
    new Field("Guts", 2, [new Skill("Cool"), new Skill("Drive"), new Skill("Shoot")]),
    new Field("Knowledge", 2, [new Skill("Culture"), new Skill("First Aid"), new Skill("Tech")]),
    new Field("Society", 2, [new Skill("Charm"), new Skill("Eloquence"), new Skill("Observation")]),
    new Field("Wild", 2, [new Skill("Scout"), new Skill("Survival"), new Skill("Tough")]),
    new Field("Crime", 2, [new Skill("Alert"), new Skill("Dexterity"), new Skill("Stealth")])
 ];

 luck: Luck[] = [{value: false}, {value: false}, {value: false}, {value: false}, {value: false}, {value: false}, {value: false}, {value: false}, {value: false}, {value: false}];
 luckcoin: number = 1;

 good: Feeling[] = [
   {name: "Powerful", value: false},
   {name: "Daring", value: false},
   {name: "Focused", value: false},
   {name: "Confident", value: false},
   {name: "Fierce", value: false},
   {name: "Untouchable", value: false},
 ]
 bad: Feeling[] = [
   {name: "Bleeding", value: false},
   {name: "Shocked", value: false},
   {name: "Dizzy", value: false},
   {name: "Embarrassed", value: false},
   {name: "Broken", value: false},
   {name: "Scared", value: false},
 ]

 customGood: Feeling[] = [
   {name: "", value: false}
 ];
 customBad: Feeling[] = [
   {name: "", value: false}
 ];

 expertise: string[] = [""];

 gear: Item[] = [
   {name: "", description: "", advantage: 0, skill: ""}
 ]
 pockets: string[] = ["","","",""];
 bag: string[] = ["","","",""];
 backpack: string[] = ["","","","",""];

 experience: string[] = [""];

 mags: Mag[] = [
  {name: "", pockets: 0, bag: 0, backpack: 0}
 ]

}