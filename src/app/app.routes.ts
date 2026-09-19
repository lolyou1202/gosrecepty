import { Routes } from '@angular/router'
import { guestGuard } from './core/auth/guest.guard'
import { authGuard } from './core/auth/auth.guard'

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/login/page-login.component')
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/register/page-register.component')
  },
  {
    path: 'recipes',
    loadComponent: () => import('./pages/recipes/page-recipes.component')
  },
  {
    path: 'favorites',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/recipe/recipe.component')
  }
]
