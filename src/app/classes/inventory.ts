import { SimpleItem } from "./simpleitem";

export class Inventory{
    pockets: SimpleItem[] = [{name: ""},{name: ""},{name: ""},{name: ""}];
    bag: SimpleItem[] = [{name: ""},{name: ""},{name: ""},{name: ""}];
    backpack: SimpleItem[] = [{name: ""},{name: ""},{name: ""},{name: ""},{name: ""}];
    experience: SimpleItem[] = [{name: ""}];
    expertise: SimpleItem[] = [{name: ""}];
}