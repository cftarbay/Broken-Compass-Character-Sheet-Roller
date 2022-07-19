import { Skill } from "./skill";

export class Field{
    name!: string;
    value: number = 2;
    skillsList!: Skill[];

    constructor(n: string, val?: number, skills?: Skill[]){
        this.name = n;
        this.value = val ?? 2;
        this.skillsList = skills ?? [];
    }
}

