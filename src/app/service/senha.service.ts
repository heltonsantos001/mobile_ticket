import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Senha {
  setor: 'SP' | 'SE' | 'SG';
  numero: number;
}

@Injectable({
  providedIn: 'root'
})
export class SenhaService {
  private contadorSP = 0;
  private contadorSE = 0;
  private contadorSG = 0;

  private _senhas = new BehaviorSubject<Senha[]>([]);
  senhas$ = this._senhas.asObservable();

  private _proximaSenha = new BehaviorSubject<Senha | null>(null);
  proximaSenha$ = this._proximaSenha.asObservable();

  constructor() {
    this.carregarSenhasDoLocalStorage();
  }

  // Salva tudo no LocalStorage
  private salvarSenhasNoLocalStorage() {
    localStorage.setItem('senhas', JSON.stringify(this._senhas.value));
    localStorage.setItem('proximaSenha', JSON.stringify(this._proximaSenha.value));
    localStorage.setItem('contadorSP', this.contadorSP.toString());
    localStorage.setItem('contadorSE', this.contadorSE.toString());
    localStorage.setItem('contadorSG', this.contadorSG.toString());
  }

  // Carrega dados do LocalStorage e garante tipos corretos
  private carregarSenhasDoLocalStorage() {
    const senhas = localStorage.getItem('senhas');
    const proxima = localStorage.getItem('proximaSenha');
    const sp = localStorage.getItem('contadorSP');
    const se = localStorage.getItem('contadorSE');
    const sg = localStorage.getItem('contadorSG');

    // Garante que _senhas seja sempre array
    if (senhas) {
      try {
        const senhasArray = JSON.parse(senhas);
        this._senhas.next(Array.isArray(senhasArray) ? senhasArray : []);
      } catch {
        this._senhas.next([]);
      }
    } else {
      this._senhas.next([]);
    }

    if (proxima) {
      try {
        this._proximaSenha.next(JSON.parse(proxima));
      } catch {
        this._proximaSenha.next(null);
      }
    } else {
      this._proximaSenha.next(null);
    }

    this.contadorSP = sp ? parseInt(sp, 10) : 0;
    this.contadorSE = se ? parseInt(se, 10) : 0;
    this.contadorSG = sg ? parseInt(sg, 10) : 0;
  }

  // Gera nova senha
  gerarSenha(setor: 'SP' | 'SE' | 'SG'): Senha {
    let numero: number;
    switch (setor) {
      case 'SP': this.contadorSP++; numero = this.contadorSP; break;
      case 'SE': this.contadorSE++; numero = this.contadorSE; break;
      case 'SG': this.contadorSG++; numero = this.contadorSG; break;
    }

    const senha: Senha = { setor, numero };
    const senhasAtuais = Array.isArray(this._senhas.value) ? this._senhas.value : [];
    this._senhas.next([...senhasAtuais, senha]);
    this.salvarSenhasNoLocalStorage();
    return senha;
  }

  // Chamar próxima senha (Atendente)
  chamarProxima(): Senha | null {
    const senhasAtuais = Array.isArray(this._senhas.value) ? this._senhas.value : [];
    if (!senhasAtuais.length) return null;

    const proxima = senhasAtuais[0];
    this._senhas.next(senhasAtuais.slice(1));
    this._proximaSenha.next(proxima);
    this.salvarSenhasNoLocalStorage();
    return proxima;
  }

  // Obter a próxima senha sem remover da fila
  getProximaSenha(): Senha | null {
    return this._proximaSenha.value;
  }
}
