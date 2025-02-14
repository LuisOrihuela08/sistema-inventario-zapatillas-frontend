import { Routes } from '@angular/router';

export const routes: Routes = [

    {
        path: 'login',
        loadComponent: () => import('./login/login-form/login-form.component').then(m =>m.LoginFormComponent)
    },
    {
        path: 'register',
        loadComponent: () => import('./login/login-register/login-register.component').then(m => m.LoginRegisterComponent)
    },
    {
        path: '',
        redirectTo: 'login',  // 🔹 Redirige a login por defecto
        pathMatch: 'full'
    },
    {
        path: '',
        loadComponent: () => import('./shared/components/layout/layout.component').then(m => m.LayoutComponent),
        children: [
            
            {
                path: 'dashboard',
                loadComponent: () => import('./business/dashboard/dashboard.component').then(m => m.DashboardComponent)
            },
            {
                path: 'inventario',
                loadComponent: () => import('./business/inventario/inventario.component').then(m => m.InventarioComponent),
            },
            {
                path: 'zapatillas',
                loadComponent: () => import('./business/zapatillas/zapatillas.component').then(m => m.ZapatillasComponent)
            },
            {
                path: 'usuarios',
                loadComponent: () => import('./business/usuarios/usuarios.component').then(m => m.UsuariosComponent)
            },
            {
                path: 'perfil',
                loadComponent: () => import('./business/perfil/perfil.component').then(m => m.PerfilComponent)
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: '**',
                redirectTo: 'dashboard'
            }
        ]
    }
    
];
