import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SenhaService, Senha } from '../service/senha.service';
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-totem',
  templateUrl: './totem.page.html',
  styleUrls: ['./totem.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, HeaderComponent]
})
export class TotemPage {
  // Observable de senhas tipado
  senhas$ = this.senhaService.senhas$ as import('rxjs').Observable<Senha[]>;

  constructor(private senhaService: SenhaService) {}

  gerarSenha(setor: 'SP' | 'SE' | 'SG') {
    this.senhaService.gerarSenha(setor);
  }
}
