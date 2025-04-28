import { HttpStatus } from '@nestjs/common';

export class ResponseEntity<T = unknown> {
  data?: T | null;
  message?: string;
  status?: HttpStatus;
  errors?: { field: string; message: string[] }[];

  constructor({
    message,
    data,
    status,
    errors,
  }: {
    message?: string;
    data?: T;
    status?: HttpStatus;
    errors?: { field: string; message: string[] }[];
  }) {
    this.message = message || 'success';
    this.data = data || null;
    this.status = status;
    this.errors = errors;
  }
}
