import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './pages/home/home.component';
import { PrestamosComponent } from './pages/prestamos/prestamos.component';
import { LibrosComponent } from './pages/libros/libros.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: 'home', component: HomeComponent },
            { path: 'prestamos', component: PrestamosComponent },
            { path: 'libros', component: LibrosComponent},
            { path: 'usuarios', component: UsuariosComponent},
            { path: 'home', redirectTo: 'home', pathMatch: 'full'},
            
        ]
    }];
