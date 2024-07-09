import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
  passwordMatch = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
      confirmPassword: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    });

    // Watch for changes in confirmPassword field to validate password matching
    this.registerForm.get('confirmPassword')?.valueChanges.subscribe(() => {
      this.validatePassword();
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.apiService.register(this.registerForm.value).subscribe(
        response => {
          console.log('API response:', response);
          if (response.status_code === 200) {
            this.successMessage = 'User registered successfully. Redirecting to login...';
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
          } else {
            this.errorMessage = response.message || 'Registration failed. Please try again.';
          }
        },
        error => {
          this.errorMessage = 'Error during registration: ' + error.message;
          console.error('Error during registration:', error);
        }
      );
    } else {
      this.errorMessage = 'Please fill in the form correctly.';
    }
  }

  validatePassword() {
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirmPassword')?.value;
    if (password && confirmPassword && password === confirmPassword) {
      this.registerForm.get('confirmPassword')?.setErrors(null);
    } else {
      this.registerForm.get('confirmPassword')?.setErrors({ mismatch: true });
    }
  }
}
