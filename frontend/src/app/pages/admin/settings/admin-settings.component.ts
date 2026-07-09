import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { SnackbarService } from '../../../core/services/ui.service';
import { ChatWidgetService } from '../../../core/chat/chat-widget.service';
import { Setting } from '../../../models';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-settings.component.html',
  styleUrl: '../admin-shared.scss'
})
export class AdminSettingsComponent implements OnInit {
  private readonly admin = inject(AdminService);
  private readonly snackbar = inject(SnackbarService);
  private readonly chat = inject(ChatWidgetService);
  private readonly fb = inject(FormBuilder);

  settings = signal<Setting[]>([]);
  loading = signal(true);
  saving = signal(false);
  form!: FormGroup;

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.admin.getSettings().subscribe({
      next: (res) => {
        this.settings.set(res.data);
        const group: Record<string, string> = {};
        res.data.forEach(s => { group[s.settingKey] = s.settingValue ?? ''; });
        this.form = this.fb.group(group);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  save(): void {
    this.saving.set(true);
    this.admin.updateSettings(this.form.value).subscribe({
      next: () => {
        this.snackbar.success('Settings saved');
        this.chat.loadSettings();
        this.saving.set(false);
      },
      error: () => { this.snackbar.error('Failed to save settings'); this.saving.set(false); }
    });
  }

  labelFor(key: string): string {
    return key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  isTextarea(key: string): boolean {
    return key.startsWith('about_')
      || key === 'google_maps_embed'
      || key.startsWith('whatsapp_message_');
  }
}
