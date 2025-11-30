import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SenhaService, Senha } from '../service/senha.service';
import { HeaderComponent } from "../header/header.component";
import { Observable } from 'rxjs';

@Component({
  selector: 'app-atendente',
  templateUrl: './atendente.page.html',
  styleUrls: ['./atendente.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, HeaderComponent]
})
export class AtendentePage {
  // Tipando corretamente os observables
  senhas$: Observable<Senha[]> = this.senhaService.senhas$;
  proximaSenha$: Observable<Senha | null> = this.senhaService.proximaSenha$;

  constructor(private senhaService: SenhaService) {}

  chamarProxima() {
    this.senhaService.chamarProxima();
  }
}
