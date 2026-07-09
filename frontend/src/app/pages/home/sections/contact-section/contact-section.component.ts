import { Component, input, inject, signal, computed } from '@angular/core';

import { CommonModule } from '@angular/common';

import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { SiteSettings } from '../../../../models';

import { ContactService } from '../../../../core/services/product.service';

import { SnackbarService } from '../../../../core/services/ui.service';



@Component({

  selector: 'app-contact-section',

  standalone: true,

  imports: [CommonModule, ReactiveFormsModule],

  templateUrl: './contact-section.component.html',

  styleUrl: './contact-section.component.scss'

})

export class ContactSectionComponent {

  settings = input<SiteSettings>({});

  private readonly fb = inject(FormBuilder);

  private readonly contactService = inject(ContactService);

  private readonly snackbar = inject(SnackbarService);

  private readonly sanitizer = inject(DomSanitizer);



  submitting = signal(false);

  form = this.fb.group({

    name: ['', Validators.required],

    email: ['', [Validators.required, Validators.email]],

    phone: [''],

    message: ['', [Validators.required, Validators.minLength(10)]]

  });



  mapUrl = computed(() => {

    const embed = this.settings()['google_maps_embed'];

    if (!embed) return null;

    return this.sanitizer.bypassSecurityTrustResourceUrl(embed);

  });



  hasSocial(): boolean {

    const s = this.settings();

    return !!(s['facebook_url'] || s['linkedin_url'] || s['twitter_url'] || s['instagram_url']);

  }



  onSubmit(): void {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;

    }

    this.submitting.set(true);

    this.contactService.submit(this.form.value as any).subscribe({

      next: () => {

        this.snackbar.success('Message sent successfully! We will get back to you soon.');

        this.form.reset();

        this.submitting.set(false);

      },

      error: () => {

        this.snackbar.error('Failed to send message. Please try again.');

        this.submitting.set(false);

      }

    });

  }

}

