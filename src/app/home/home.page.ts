import { Component } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SenhaService } from '../service/senha.service';
import {HeaderComponent} from "../header/header.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, HeaderComponent]
})
export class HomePage {
  senhas$ = this.senhaService.senhas$;
  proximaSenha$ = this.senhaService.proximaSenha$;

  constructor(private senhaService: SenhaService) {}
}
