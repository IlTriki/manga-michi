import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage {
  constructor(
    public auth: AuthService,
    private alertCtrl: AlertController
  ) {}

  async loginUser() {
    const alert = await this.alertCtrl.create({
      header: 'Login',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'Email'
        },
        {
          name: 'password',
          type: 'password',
          placeholder: 'Password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Login',
          handler: (data) => {
            this.auth.login(data.email, data.password);
          }
        }
      ]
    });
    await alert.present();
  }

  async signupUser() {
    const alert = await this.alertCtrl.create({
      header: 'Sign Up',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'Email'
        },
        {
          name: 'password',
          type: 'password',
          placeholder: 'Password'
        },
        {
          name: 'displayName',
          type: 'text',
          placeholder: 'Username'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Sign Up',
          handler: (data) => {
            this.auth.signup(data.email, data.password, data.displayName);
          }
        }
      ]
    });
    await alert.present();
  }
}
