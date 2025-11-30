import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'totem',
    loadComponent: () => import('./totem/totem.page').then( m => m.TotemPage)
  },
  {
    path: 'atendente',
    loadComponent: () => import('./atendente/atendente.page').then( m => m.AtendentePage)
  },
];
