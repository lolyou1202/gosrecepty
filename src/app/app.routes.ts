import { Routes } from '@angular/router'
import { MainLayoutComponent } from './shared/ui/main-layout/main-layout.component'
import { AuthLayoutComponent } from './features/auth/ui/auth-layout/auth-layout.component'
import { guestGuard } from './core/auth/guest.guard'
import { authGuard } from './core/auth/auth.guard'

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
        loadChildren: () => import('./features/recipes/recipes.routes')
      },
      {
        path: 'favorites',
        canActivate: [authGuard],
        loadComponent: () => import('./pages/recipe/recipe.component')
      },
      {
        path: 'demo',
        loadComponent: () => import('./pages/demo/page-demo.component'),
        children: [
          {
            path: 'base-input',
            loadComponent: () =>
              import('./pages/register/page-register.component')
          }
        ]
      }
    ]
  }
]
