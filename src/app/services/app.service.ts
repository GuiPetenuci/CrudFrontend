import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private httpClient: HttpClient) {}

  public API_URL = "https://localhost:7138"

  getUsers() {
    return this.httpClient.get<User[]>(`${this.API_URL}/usuarios`).pipe(
      map((res:User[])=>{
        res.forEach(x=>x.dataNascimento = new Date(x.dataNascimento))
        return res;
      }))
  }

  getUser(id: string) {
    return this.httpClient.get<User>(`${this.API_URL}/usuarios/${id}`)
  }

  addUser(user: User) {
    return this.httpClient.post(
      `${this.API_URL}/usuarios`, user)
  }

  updateUser(userId: string, user: User) {
    return this.httpClient.put(
      `${this.API_URL}/usuarios/${userId}`, user)
  }

  deleteUser(id: string) {
    return this.httpClient.delete(
      `${this.API_URL}/usuarios/${id}`)
  }

}
