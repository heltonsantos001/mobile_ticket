import { Component } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SenhaService, Senha } from '../service/senha.service';
import {HeaderComponent} from "../header/header.component";

@Component({
  selector: 'app-atendente',
  templateUrl: './atendente.page.html',
  styleUrls: ['./atendente.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, AsyncPipe, HeaderComponent]
})
export class AtendentePage {
  senhas$ = this.senhaService.senhas$;
  proximaSenha$ = this.senhaService.proximaSenha$;

  constructor(private senhaService: SenhaService) {}

  chamarProxima() {
    this.senhaService.chamarProxima();
  }
}
