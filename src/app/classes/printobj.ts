import { Character } from "./character";
import { Inventory } from "./inventory";

export class PrintObj{
    character!: Character;
    customTagNames!: string[];
    notes!: string;
    inventory!: Inventory;

    constructor(c: Character, tags: string[], notes: string, i: Inventory){
        this.character = c;
        this.customTagNames = tags;
        this.notes = notes;
        this.inventory = i;
    }
}