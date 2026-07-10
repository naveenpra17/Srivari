import { Injectable, inject } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SwUpdateService {
  private readonly swUpdate = inject(SwUpdate);
  private readonly platformId = inject(PLATFORM_ID);

  init(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Check for updates on init + every 5 minutes
    this.checkForUpdate();
    setInterval(() => this.checkForUpdate(), 5 * 60 * 1000);

    // Auto-activate when a new version is ready
    this.swUpdate.versionUpdates.subscribe((event) => {
      if (event.type === 'VERSION_READY') {
        console.log('[SW] New version available. Activating...');
        this.activateUpdate();
      }
    });

    // Re-check when user returns to tab
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.checkForUpdate();
      }
    });
  }

  private async checkForUpdate(): Promise<void> {
    try {
      await this.swUpdate.checkForUpdate();
    } catch {
      // Service worker not available (e.g. dev mode, offline)
    }
  }

  private async activateUpdate(): Promise<void> {
    try {
      await this.swUpdate.activateUpdate();
      window.location.reload();
    } catch {
      window.location.reload();
    }
  }
}