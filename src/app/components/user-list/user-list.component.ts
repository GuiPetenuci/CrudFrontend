import { Component } from '@angular/core';
import { AppService } from '../../services/app.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {

  users: User[] = [];
  displayedColumns: string[] = ['nome', 'sobrenome', 'dataNascimento', 'escolaridade', 'actions'];

  constructor(
    private userService: AppService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loadData();
  }

  loadData() {
    this.userService.getUsers().subscribe(users => this.users = users);
  }

  onAddClick() {
    this.router.navigate(['/add']);
  }

  onEditClick(user: User) {
    this.router.navigate(['/detail', user.id]);
  }

  onDeleteClick(user: User) {
    if(confirm(`Deseja mesmo deletar o usuário ${user.nome.toUpperCase()} ${user.sobrenome.toUpperCase()}?`)) {
      this.userService.deleteUser(user.id!).subscribe(() => {
        this.snackBar.open("Usuário deletado com sucesso!", "", {
          duration: 4000,
        });
        this.loadData();
      });
    }
  }

  getEscolaridade(escolaridade: number) {
    switch (escolaridade) {
      case 0:
        return "Infantil";
      case 1:
        return "Fundamental";
      case 2:
        return "Médio";
      case 3:
        return "Superior";
      default:
        return "";
    }
  }
}
