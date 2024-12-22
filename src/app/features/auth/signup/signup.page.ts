import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss']
})
export class SignupPage {
  signupForm: FormGroup;
  authError: string = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      displayName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      // regex to validate password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, two numbers, and one special character
      password: ['', [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/)
      ]]
    });
  }

  get password() {
    return this.signupForm.get('password');
  }

  get displayName() {
    return this.signupForm.get('displayName');
  }

  get email() {
    return this.signupForm.get('email');
  }

  get passwordControl() {
    return this.signupForm.get('password');
  }

  /**
   * Handles the signup form submission
   * Validates the form and attempts to create a new user account
   */
  async onSubmit() {
    if (this.signupForm.valid) {
      try {
        const { email, password, displayName } = this.signupForm.value;
        await this.auth.signup(email, password, displayName);
        this.router.navigate(['/home']);
      } catch (error: any) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            this.authError = 'An account already exists with this email address';
            break;
          case 'auth/invalid-email':
            this.authError = 'Please enter a valid email address';
            break;
          case 'auth/operation-not-allowed':
            this.authError = 'Email/password accounts are not enabled. Please contact support';
            break;
          case 'auth/weak-password':
            this.authError = 'Please choose a stronger password';
            break;
          case 'auth/network-request-failed':
            this.authError = 'Network error. Please check your connection';
            break;
          default:
            this.authError = 'Failed to create account. Please try again';
        }
      }
    }
  }

  checkLength(value: string): boolean {
    return value?.length >= 8;
  }

  checkUpperCase(value: string): boolean {
    return /[A-Z]/.test(value || '');
  }

  checkLowerCase(value: string): boolean {
    return /[a-z]/.test(value || '');
  }

  checkTwoNumbers(value: string): boolean {
    return /.*\d.*\d/.test(value || '');
  }

  checkSpecialChar(value: string): boolean {
    return /[!@#$%^&*.]/.test(value || '');
  }
}