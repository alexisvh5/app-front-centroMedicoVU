import { Routes } from '@angular/router';

export const routes: Routes = [
    {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./features/home/pages/listar-sectores/listar-sectores').then(c => c.ListarSectores)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login/login').then(c => c.Login)
  },
  {
    path: 'mantenimiento',
    loadComponent: () =>
      import('./features/mantenimiento/pages/mantenimiento-admin/mantenimiento-admin').then(c => c.MantenimientoAdmin)
  }
];
