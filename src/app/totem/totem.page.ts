import { Component } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SenhaService, Senha } from '../service/senha.service';
import {HeaderComponent} from "../header/header.component";

@Component({
  selector: 'app-totem',
  templateUrl: './totem.page.html',
  styleUrls: ['./totem.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, AsyncPipe, HeaderComponent]
})
export class TotemPage {
  // Observa todas as senhas geradas
  senhas$ = this.senhaService.senhas$;

  constructor(private senhaService: SenhaService) {}

  // Gera uma nova senha
  gerarSenha(setor: 'SP' | 'SE' | 'SG') {
    console.log(setor)
    this.senhaService.gerarSenha(setor);
  }
}
