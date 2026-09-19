import { Routes } from '@angular/router'
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component'
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component'
import { guestGuard } from './core/auth/guest.guard'

export const routes: Routes = [
          {
            path: 'login',
            loadComponent: () => import('./pages/login/page-login.component')
          },
          {
            path: 'register',
            loadComponent: () =>
              import('./pages/register/page-register.component')
          }
        ]
      },
]
