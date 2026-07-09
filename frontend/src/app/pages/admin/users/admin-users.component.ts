import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { AuthService } from '../../../core/services/auth.service';
import { SnackbarService } from '../../../core/services/ui.service';
import { AdminUser } from '../../../models';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-users.component.html',
  styleUrl: '../admin-shared.scss'
})
export class AdminUsersComponent implements OnInit {
  private readonly admin = inject(AdminService);
  readonly auth = inject(AuthService);
  private readonly snackbar = inject(SnackbarService);
  private readonly fb = inject(FormBuilder);

  users = signal<AdminUser[]>([]);
  roles = signal<string[]>([]);
  loading = signal(true);
  saving = signal(false);
  showModal = signal(false);
  editingId = signal<number | null>(null);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: [''],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    phone: [''],
    active: [true],
    roles: [[] as string[]]
  });

  ngOnInit(): void {
    this.load();
    this.admin.getRoles().subscribe(res => this.roles.set(res.data));
  }

  load(): void {
    this.loading.set(true);
    this.admin.getUsers().subscribe({
      next: (res) => { this.users.set(res.data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  openCreate(): void {
    this.editingId.set(null);
    this.form.reset({ active: true, roles: [] });
    this.form.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.showModal.set(true);
  }

  openEdit(user: AdminUser): void {
    this.editingId.set(user.id);
    this.form.patchValue({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone ?? '',
      active: user.active,
      roles: [...user.roles]
    });
    this.form.get('password')?.clearValidators();
    this.form.get('password')?.updateValueAndValidity();
    this.showModal.set(true);
  }

  closeModal(): void { this.showModal.set(false); }

  toggleRole(role: string): void {
    const current = [...(this.form.get('roles')?.value ?? [])];
    const idx = current.indexOf(role);
    if (idx >= 0) current.splice(idx, 1);
    else current.push(role);
    this.form.patchValue({ roles: current });
  }

  isRoleSelected(role: string): boolean {
    return (this.form.get('roles')?.value ?? []).includes(role);
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving.set(true);
    const id = this.editingId();
    const data = this.form.value as any;
    const req = id ? this.admin.updateUser(id, data) : this.admin.createUser(data);
    req.subscribe({
      next: () => {
        this.snackbar.success(id ? 'User updated' : 'User created');
        this.closeModal();
        this.load();
        this.saving.set(false);
      },
      error: (err) => {
        this.snackbar.error(err?.error?.message || 'Failed to save user');
        this.saving.set(false);
      }
    });
  }

  deleteUser(user: AdminUser): void {
    if (!confirm(`Delete user "${user.email}"?`)) return;
    this.admin.deleteUser(user.id).subscribe({
      next: () => { this.snackbar.success('User deleted'); this.load(); },
      error: (err) => this.snackbar.error(err?.error?.message || 'Failed to delete')
    });
  }
}
