import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { MangaService } from '../../core/services/manga.service';
import { ToastController } from '@ionic/angular';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss']
})
export class ProfilePage implements OnInit {
  profileForm: FormGroup;
  libraryCount$ = this.mangaService.getUserLibrary().pipe(
    map((mangas: any[]) => mangas.length)
  );
  selectedImage?: File;

  constructor(
    public auth: AuthService,
    private mangaService: MangaService,
    private fb: FormBuilder,
    private toastCtrl: ToastController
  ) {
    this.profileForm = this.fb.group({
      displayName: ['', [
        Validators.required, 
        Validators.minLength(3),
        Validators.pattern('^[a-zA-Z0-9_-]*$')
      ]],
      email: ['', [
        Validators.required, 
        Validators.email
      ]]
    });
  }

  ngOnInit() {
    this.auth.user$.subscribe(user => {
      if (user) {
        this.profileForm.patchValue({
          displayName: user.displayName || '',
          email: user.email
        });
      }
    });
  }

  async selectImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e: any) => {
      if (e.target?.files?.length) {
        this.selectedImage = e.target.files[0];
        try {
          await this.updateProfile();
          this.selectedImage = undefined;
        } catch (error) {
          console.error('Error updating profile picture:', error);
        }
      }
    };
    
    input.click();
  }

  async updateProfile() {
    if (this.profileForm.valid || this.selectedImage) {
      try {
        await this.auth.updateProfile(this.profileForm.value, this.selectedImage);
        const toast = await this.toastCtrl.create({
          message: 'Profile updated successfully',
          duration: 2000,
          color: 'success'
        });
        await toast.present();
      } catch (error) {
        const toast = await this.toastCtrl.create({
          message: 'Error updating profile',
          duration: 2000,
          color: 'danger'
        });
        await toast.present();
      }
    }
  }

  async logout() {
    await this.auth.logout();
  }
}
