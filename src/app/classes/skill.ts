export class Skill{
    name!: string;
    value: number = 1;

    constructor(n: string, val?: number){
        this.name = n;
        this.value = val ?? 1;
    }
}