import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, EventEmitter, Input, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

/**
 * 🟦 TextInputWrapper — Modern input field (text/number/password) with full UX & visuals
 */
@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [CommonModule, MatIcon],
  template: `
    <div class="w-full">
      <label *ngIf="label" class="block text-sm font-medium text-gray-700 mb-1">
        {{ label }}
      </label>

      <div class="relative group">
        <input
          class="block w-full h-12 rounded-lg border border-gray-300 bg-white px-4 text-gray-800
                 placeholder:text-gray-400 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500
                 focus:ring-offset-1 transition-all duration-200 outline-none disabled:opacity-60 text-sm sm:text-base"
          [type]="type"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [attr.name]="name"
          [value]="value"
          (input)="onInput($event)"
        />

        <span
          *ngIf="suffixIcon"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-500 transition-colors"
        >
          <mat-icon class="!text-lg">{{ suffixIcon }}</mat-icon>
        </span>
      </div>

      <p *ngIf="hint && !error" class="text-xs text-gray-500 mt-1">{{ hint }}</p>
      <p *ngIf="error" class="text-xs text-red-600 mt-1 font-medium flex items-center gap-1">
        <mat-icon class="!text-sm">error_outline</mat-icon> {{ error }}
      </p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextInputWrapper {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() name?: string;
  @Input() type: 'text' | 'number' | 'password' | 'email' = 'text';
  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();
  @Input() disabled = false;
  @Input() error: string | null = null;
  @Input() hint: string | null = null;
  @Input() suffixIcon?: string;

  onInput(e: Event) {
    const val = (e.target as HTMLInputElement)?.value ?? '';
    this.valueChange.emit(val);
  }
}

/**
 * 🟨 EmailInputWrapper — dedicated email field with icon & UX coherence
 */
@Component({
  selector: 'app-email-input',
  standalone: true,
  imports: [CommonModule, TextInputWrapper],
  template: `
    <app-text-input
      label="{{ label }}"
      [placeholder]="placeholder || 'ex: contact@entreprise.com'"
      [name]="name"
      [value]="value"
      [error]="error"
      [hint]="hint"
      [disabled]="disabled"
      suffixIcon="mail"
      type="email"
      (valueChange)="valueChange.emit($event)"
    >
    </app-text-input>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailInputWrapper {
  @Input() label = 'Email';
  @Input() placeholder = '';
  @Input() name?: string = 'email';
  @Input() value = '';
  @Output() valueChange = new EventEmitter<string>();
  @Input() disabled = false;
  @Input() error: string | null = null;
  @Input() hint: string | null = null;
}

/**
 * 🟩 TextAreaWrapper — polished textarea with responsive design
 */
@Component({
  selector: 'app-textarea',
  standalone: true,
  imports: [CommonModule, MatIcon],
  template: `
    <div class="w-full">
      <label *ngIf="label" class="block text-sm font-medium text-gray-700 mb-1">
        {{ label }}
      </label>

      <textarea
        class="block w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800
               placeholder:text-gray-400 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500
               focus:ring-offset-1 transition-all duration-200 outline-none disabled:opacity-60 text-sm sm:text-base"
        [rows]="rows"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [attr.name]="name"
        (input)="onInput($event)"
        >{{ value }}</textarea
      >

      <p *ngIf="hint && !error" class="text-xs text-gray-500 mt-1">{{ hint }}</p>
      <p *ngIf="error" class="text-xs text-red-600 mt-1 font-medium flex items-center gap-1">
        <mat-icon class="!text-sm">error_outline</mat-icon> {{ error }}
      </p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextAreaWrapper {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() name?: string;
  @Input() rows = 4;
  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();
  @Input() disabled = false;
  @Input() error: string | null = null;
  @Input() hint: string | null = null;

  onInput(e: Event) {
    const val = (e.target as HTMLTextAreaElement)?.value ?? '';
    this.valueChange.emit(val);
  }
}

/**
 * 🟧 CheckboxWrapper — elegant checkbox with accessibility
 */
@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [CommonModule, MatIcon],
  template: `
    <label class="flex items-center gap-2 sm:gap-3 cursor-pointer select-none">
      <input
        type="checkbox"
        class="h-5 w-5 shrink-0 accent-cyan-600 border-gray-300 rounded focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1"
        [checked]="checked"
        [disabled]="disabled"
        (change)="onChange($event)"
      />
      <span class="text-gray-700 text-sm sm:text-base">{{ label }}</span>
    </label>

    <p *ngIf="hint && !error" class="text-xs text-gray-500 mt-1">{{ hint }}</p>
    <p *ngIf="error" class="text-xs text-red-600 mt-1 font-medium flex items-center gap-1">
      <mat-icon class="!text-sm">error_outline</mat-icon> {{ error }}
    </p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxWrapper {
  @Input() label = '';
  @Input() checked = false;
  @Output() checkedChange = new EventEmitter<boolean>();
  @Input() disabled = false;
  @Input() error: string | null = null;
  @Input() hint: string | null = null;

  onChange(e: Event) {
    const checked = (e.target as HTMLInputElement)?.checked ?? false;
    this.checkedChange.emit(checked);
  }
}

/**
 * 🟥 ButtonWrapper — Tailwind/Daisy hybrid with hover, loading, icon & color variants
 */
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, MatIcon],
  template: `
    <button
      class="inline-flex items-center justify-center gap-2 h-12 px-5 rounded-lg font-medium text-sm sm:text-base transition-all
             focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
      [ngClass]="colorClass()"
      [type]="type"
      [disabled]="disabled || loading"
      [class.w-full]="fullWidth"
      (click)="clicked.emit()"
    >
      <span *ngIf="loading" class="loading loading-spinner loading-sm text-white"></span>
      <mat-icon *ngIf="icon && !loading" class="!text-base">{{ icon }}</mat-icon>
      <span *ngIf="!loading"><ng-content></ng-content></span>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonWrapper {
  @Input() color: 'primary' | 'accent' | 'warn' | 'neutral' = 'primary';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() fullWidth = false;
  @Input() icon?: string;
  @Output() clicked = new EventEmitter<void>();

  colorClass(): string {
    switch (this.color) {
      case 'accent':
        return 'bg-pink-600 hover:bg-pink-700 text-white focus:ring-pink-500';
      case 'warn':
        return 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500';
      case 'neutral':
        return 'bg-gray-200 hover:bg-gray-300 text-gray-700 focus:ring-gray-400';
      default:
        return 'bg-cyan-600 hover:bg-cyan-700 text-white focus:ring-cyan-500';
    }
  }
}

/**
 * 🟦 BaseImage — graceful loader & fallback image with Tailwind polish
 */
@Component({
  selector: 'app-base-image',
  standalone: true,
  imports: [CommonModule, MatIcon],
  template: `
    <div class="relative overflow-hidden" [class.rounded-lg]="rounded">
      <img
        *ngIf="!hasError"
        [src]="src"
        [alt]="alt || 'image'"
        class="block w-full h-auto transition-opacity duration-300"
        [class.object-cover]="cover"
        [class.object-contain]="!cover"
        [class.rounded-lg]="rounded"
        (error)="onError()"
        loading="lazy"
      />

      <div
        *ngIf="hasError"
        class="flex items-center justify-center bg-gray-100 text-gray-400"
        [class.rounded-lg]="rounded"
        [style.height.px]="height || 160"
      >
        <mat-icon class="!text-4xl">image_not_supported</mat-icon>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseImage {
  @Input() src = '';
  @Input() alt = '';
  @Input() height?: number;
  @Input() rounded = true;
  @Input() cover = true;
  hasError = false;

  onError() {
    this.hasError = true;
  }
}
