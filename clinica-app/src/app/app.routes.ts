import { Routes } from '@angular/router';
import { authGuard } from './features/auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login/login').then(c => c.Login)
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/home/pages/listar-sectores/listar-sectores').then(c => c.ListarSectores)
  },
  {
    path: 'mantenimiento',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/mantenimiento/pages/mantenimiento-admin/mantenimiento-admin').then(c => c.MantenimientoAdmin)
  }
];
