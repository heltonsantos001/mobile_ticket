import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';



export interface Senha {
  setor: 'SP' | 'SE' | 'SG';
  numero: string; // agora será string no formato SIGLA-YYMMDD-NUM
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

  private ordemChamada: ('SP' | 'SE' | 'SG')[] = ['SP', 'SE', 'SG'];
  private indiceOrdem = 0;

  constructor() {
    this.carregarSenhasDoLocalStorage();
  }

  private salvarSenhasNoLocalStorage() {
    localStorage.setItem('senhas', JSON.stringify(this._senhas.value));
    localStorage.setItem('proximaSenha', JSON.stringify(this._proximaSenha.value));
    localStorage.setItem('contadorSP', this.contadorSP.toString());
    localStorage.setItem('contadorSE', this.contadorSE.toString());
    localStorage.setItem('contadorSG', this.contadorSG.toString());
    localStorage.setItem('indiceOrdem', this.indiceOrdem.toString());
  }

  private carregarSenhasDoLocalStorage() {
    const senhas = localStorage.getItem('senhas');
    const proxima = localStorage.getItem('proximaSenha');
    const sp = localStorage.getItem('contadorSP');
    const se = localStorage.getItem('contadorSE');
    const sg = localStorage.getItem('contadorSG');
    const indice = localStorage.getItem('indiceOrdem');

    this._senhas.next(senhas ? JSON.parse(senhas) : []);
    this._proximaSenha.next(proxima ? JSON.parse(proxima) : null);
    this.contadorSP = sp ? parseInt(sp, 10) : 0;
    this.contadorSE = se ? parseInt(se, 10) : 0;
    this.contadorSG = sg ? parseInt(sg, 10) : 0;
    this.indiceOrdem = indice ? parseInt(indice, 10) : 0;
  }

  // Gera nova senha no formato SIGLA-YYMMDD-NUM
  gerarSenha(setor: 'SP' | 'SE' | 'SG'): Senha {
    let numeroSetor: number;
    switch (setor) {
      case 'SP': this.contadorSP++; numeroSetor = this.contadorSP; break;
      case 'SE': this.contadorSE++; numeroSetor = this.contadorSE; break;
      case 'SG': this.contadorSG++; numeroSetor = this.contadorSG; break;
    }

    const hoje = new Date();
    const yy = hoje.getFullYear().toString().slice(-2); // últimos 2 dígitos do ano
    const mm = String(hoje.getMonth() + 1).padStart(2, '0'); // mês 2 dígitos
    const dd = String(hoje.getDate()).padStart(2, '0'); // dia 2 dígitos

    const numeroFormatado = `${setor}-${yy}${mm}${dd}-${numeroSetor.toString().padStart(3, '0')}`;

    const senha: Senha = { setor, numero: numeroFormatado };
    const senhasAtuais = Array.isArray(this._senhas.value) ? this._senhas.value : [];
    this._senhas.next([...senhasAtuais, senha]);
    this.salvarSenhasNoLocalStorage();
    return senha;
  }

  chamarProxima(): Senha | null {
    const senhasAtuais = Array.isArray(this._senhas.value) ? this._senhas.value : [];
    if (!senhasAtuais.length) return null;

    let tentativa = 0;
    let proxima: Senha | undefined;

    while (tentativa < this.ordemChamada.length && !proxima) {
      const tipoAtual = this.ordemChamada[this.indiceOrdem];
      proxima = senhasAtuais.find(s => s.setor === tipoAtual);

      if (!proxima) {
        this.indiceOrdem = (this.indiceOrdem + 1) % this.ordemChamada.length;
        tentativa++;
      }
    }

    if (!proxima) return null;

    const novasSenhas = senhasAtuais.filter(s => s !== proxima);
    this._senhas.next(novasSenhas);
    this._proximaSenha.next(proxima);

    this.indiceOrdem = (this.indiceOrdem + 1) % this.ordemChamada.length;

    this.salvarSenhasNoLocalStorage();
    return proxima;
  }

  getProximaSenha(): Senha | null {
    return this._proximaSenha.value;
  }
}
