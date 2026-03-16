import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {

  api = "http://localhost:3000/api/people";

  constructor(private http: HttpClient) {}

  getAll(){
    return this.http.get(this.api);
  }

  create(person:any){
    return this.http.post(this.api, person);
  }

  delete(id:string){
    return this.http.delete(`${this.api}/${id}`);
  }

}