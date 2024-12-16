# MangaMichi 📚

MangaMichi is a modern manga collection manager built with Ionic and Angular. Keep track of your manga library, discover new titles, and find nearby manga stores!

## 🌟 Features

- **Personal Library Management**
  - Add and remove manga from your collection
  - View detailed manga information
  - Track your reading progress

- **Manga Discovery**
  - Search through an extensive manga database
  - View detailed information including synopsis, authors, and tags
  - Powered by the MangaDex API

- **Store Locator**
  - Find manga stores near you
  - View store details including distance, ratings, and opening hours
  - Get directions via Google Maps integration

- **User Profile**
  - Customizable user profile
  - Library statistics
  - Secure authentication via Firebase

## 🚀 Tech Stack

- Angular 18
- Ionic Framework 8
- Firebase Authentication & Firestore
- Capacitor 6
- MangaDex API
- Google Maps & Places API

## 📱 Platform Support

- iOS 14+
- Android (API level specified in build.gradle)
- Web (PWA)

## 🛠️ Getting Started

### Prerequisites

- Node.js (LTS version)
- Ionic CLI
- Angular CLI
- Firebase account
- Google Maps API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/IlTriki/manga-michi.git
cd manga-michi
```

2. Install dependencies:
```bash
npm install
```

3. Create environment files:
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
    projectId: "YOUR_FIREBASE_PROJECT_ID",
    storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET",
    messagingSenderId: "YOUR_FIREBASE_MESSAGING_SENDER_ID",
    appId: "YOUR_FIREBASE_APP_ID"
  },
  googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY',
  googleMapsApi: 'https://maps.googleapis.com/maps/api',
  mangaDexApi: 'https://api.mangadex.org'
};

// src/environments/environment.prod.ts
export const environment = {
  production: true,
firebaseConfig: {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
    projectId: "YOUR_FIREBASE_PROJECT_ID",
    storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET",
    messagingSenderId: "YOUR_FIREBASE_MESSAGING_SENDER_ID",
    appId: "YOUR_FIREBASE_APP_ID"
  },
  googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY',
  googleMapsApi: 'https://maps.googleapis.com/maps/api',
  mangaDexApi: 'https://api.mangadex.org'
};
```

4. Run the development server:
```bash
npm start
```

### Building for Mobile

#### iOS
```bash
ionic cap add ios
ionic cap sync
ionic cap open ios
```

#### Android
```bash
ionic cap add android
ionic cap sync
ionic cap open android
```

## 📄 API Documentation

### MangaDex API
The application uses the MangaDex API for manga data. Key endpoints:

- Search manga
- Get manga details
- Get cover art

### Google Maps API
Used for store location services:

- Places API for finding nearby stores
- Directions API for navigation
- Geolocation for user position

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Triki Osama - [Github](https://github.com/IlTriki)

## 🙏 Acknowledgments

- MangaDex API for manga data
- Google Maps Platform for location services