import { Component, inject, signal } from '@angular/core';

import { CommonModule } from '@angular/common';

import { RouterLink, RouterOutlet } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';



@Component({

  selector: 'app-admin-layout',

  standalone: true,

  imports: [CommonModule, RouterLink, RouterOutlet],

  templateUrl: './admin-layout.component.html',

  styleUrl: './admin-layout.component.scss'

})

export class AdminLayoutComponent {

  readonly auth = inject(AuthService);
  readonly theme = inject(ThemeService);
  sidebarOpen = signal(false);



  toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }



  logout(): void { this.auth.logout(); }

}


