import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Tag } from "./classes/tag";

@Injectable({
  providedIn: 'root',
})
export class AppService {

    constructor(private httpClient: HttpClient)  { }

    getTag(tagName: string) {
        return this.httpClient.get<Tag>("assets/tags/"+tagName+".json");
    }

    rollDice(n: number): number[]{
      let res: number[] = [];
      for(let i=0; i<n; i++){
        res.push(Math.floor(Math.random() * 6) + 1);
      }
      res.sort();
      return res;
    }
}