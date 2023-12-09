import { Component, OnInit } from '@angular/core';
import { AppService } from '../../services/app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../models/user.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';

interface UserForm {
  nome: FormControl<string | undefined>;
  sobrenome: FormControl<string | undefined>;
  email: FormControl<string | undefined>;
  dataNascimento: FormControl<Date | null>;
  escolaridade: FormControl<number | undefined>;
}

interface Escolaridade {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent implements OnInit{

  idUser: string | null = "";
  title: string = "Cadastro de usuário";
  user: User | null = null;
  userForm!: FormGroup<UserForm>;
  escolaridadeList: Escolaridade[] = [
    {value: 0, viewValue: 'Infantil'},
    {value: 1, viewValue: 'Fundamental'},
    {value: 2, viewValue: 'Médio'},
    {value: 3, viewValue: 'Superior'},
  ];
  
  constructor(
    private userService: AppService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    this.idUser = this.route.snapshot.paramMap.get('id');

    this.userForm = new FormGroup({
      nome: new FormControl(this.user?.nome, { nonNullable: true, validators: [Validators.required] }),
      sobrenome: new FormControl(this.user?.sobrenome, { nonNullable: true, validators: [Validators.required] }),
      email: new FormControl(this.user?.email, { nonNullable: true, validators: [Validators.required, Validators.email] }),
      dataNascimento: new FormControl(new Date(), {nonNullable: false, validators: [Validators.required] }),
      escolaridade: new FormControl(this.user?.escolaridade, { nonNullable: true, validators: [Validators.required] })
    })

    if (this.idUser) {
      this.title = "Alterar usuário"
      this.loadData(this.idUser);
    }    
  }

  loadData(id: string | null) {
    this.userService.getUser(id!).subscribe(user => {
      this.user = user

      this.userForm.patchValue({
        nome: this.user?.nome,
        sobrenome: this.user?.sobrenome,
        email: this.user?.email,
        dataNascimento: this.user?.dataNascimento,
        escolaridade: this.user?.escolaridade
      })

      this.userForm.controls.escolaridade.setValue(this.user.escolaridade, {onlySelf: true});
    });
  }

  onSubmit() {
    console.log('onSubmit:', this.userForm.controls);

    if (this.userForm.valid) {
      const userModel: User = {
        id: null,
        nome: this.userForm.controls.nome.value!,
        sobrenome: this.userForm.controls.sobrenome.value!,
        email: this.userForm.controls.email.value!,
        dataNascimento: this.userForm.controls.dataNascimento.value!,
        escolaridade: this.userForm.controls.escolaridade.value!,
      }

      if (this.idUser)
        this.userService.updateUser(this.idUser, userModel).subscribe(() => {
          this.snackBar.open("Usuário alterado com sucesso!", "", {
            duration: 4000,
          });
          this.router.navigate(['']);
        });
       else 
        this.userService.addUser(userModel).subscribe(() => {
          this.snackBar.open("Usuário adicionado com sucesso!", "", {
            duration: 4000,
          });
          this.router.navigate(['']);
        });
    }
  }

  onCancel() {
    this.router.navigate(['']);
  }
}
