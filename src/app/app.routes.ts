import { Routes } from '@angular/router'
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component'
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component'
import { guestGuard } from './core/auth/guest.guard'

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        component: AuthLayoutComponent,
        children: [
          {
            path: 'login',
            canActivate: [guestGuard],
            loadComponent: () => import('./pages/login/page-login.component')
          },
          {
            path: 'register',
            canActivate: [guestGuard],
            loadComponent: () =>
              import('./pages/register/page-register.component')
          }
        ]
      },
      {
        path: 'recipes',
        loadComponent: () => import('./pages/recipes/page-recipes.component')
      },
      {
        path: 'favorites',
        canActivate: [authGuard],
        loadComponent: () => import('./pages/recipe/recipe.component')
      },
    ]
  }
]
