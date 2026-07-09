import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { HomePageData, SiteSettings } from '../../models';

@Injectable({ providedIn: 'root' })
export class PublicService {
  private readonly api = inject(ApiService);

  getHomePageData() {
    return this.api.get<HomePageData>('/public/home');
  }

  getSettings() {
    return this.api.get<SiteSettings>('/public/settings');
  }
}
