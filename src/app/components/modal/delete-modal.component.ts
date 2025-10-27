import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  EventEmitter,
  Input,
  Output,
  HostListener,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ButtonWrapper } from '../form/wrappers';

@Component({
  selector: 'app-delete-modal',
  standalone: true,
  imports: [CommonModule, MatIconModule, ButtonWrapper],
  template: `
    <div
      *ngIf="open"
      class="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-gray-900/50" (click)="onBackdropClick()"></div>

      <!-- Modal card -->
      <div
        class="relative w-full max-w-md mx-auto rounded-2xl bg-white shadow-xl border border-gray-200"
      >
        <!-- Header -->
        <div class="px-6 pt-6 flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center"
          >
            <mat-icon class="!text-xl">warning</mat-icon>
          </div>
          <h3 class="text-lg font-semibold text-gray-900">{{ title || 'Supprimer l’élément' }}</h3>
        </div>

        <!-- Body -->
        <div class="px-6 py-4">
          <p class="text-sm text-gray-700">
            {{ message || 'Cette action est irréversible. Confirmez la suppression.' }}
          </p>
        </div>

        <!-- Actions -->
        <div class="px-6 pb-6 flex items-center justify-end gap-3">
          <app-button color="neutral" (clicked)="onCancel()">
            {{ cancelText || 'Annuler' }}
          </app-button>
          <button
            type="button"
            class="inline-flex items-center justify-center gap-2 h-12 px-5 rounded-lg font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm bg-red-600 hover:bg-red-700 text-white focus:ring-red-500"
            (click)="onConfirm()"
          >
            <mat-icon class="!text-base">delete_forever</mat-icon>
            <span>{{ confirmText || 'Supprimer' }}</span>
          </button>
        </div>

        <!-- Close button (top-right) -->
        <button
          type="button"
          class="absolute top-3 right-3 p-2 rounded-full text-gray-500 hover:bg-gray-100"
          aria-label="Fermer"
          (click)="onCancel()"
        >
          <mat-icon class="!text-base">close</mat-icon>
        </button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteModalComponent {
  @Input() open = false;
  @Input() title = 'Supprimer l’élément';
  @Input() message = 'Cette action est irréversible. Confirmez la suppression.';
  @Input() confirmText = 'Supprimer';
  @Input() cancelText = 'Annuler';
  @Input() closeOnBackdrop = true;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onBackdropClick(): void {
    if (this.closeOnBackdrop) {
      this.onCancel();
    }
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    this.onCancel();
  }
}
