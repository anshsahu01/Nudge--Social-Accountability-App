# 🎯 NUDGE - Accountability Platform

A modern goal-tracking and accountability platform built with React, Firebase, and Vite. Team up with friends, set goals, track progress, and keep each other accountable!

## ✨ Features

- 🔐 **Authentication** - Email/Password and Google Sign-in
- 👥 **Group System** - Create or join accountability groups with unique codes
- ✅ **Goal Management** - Add, complete, and delete goals with due dates
- 📊 **Progress Tracking** - Visual progress bars and completion percentages
- 🔥 **Streak Counter** - Track your daily goal completion streak
- 📈 **Consistency Heatmap** - GitHub-style activity visualization (last 3 months)
- 🏆 **Trophy Case** - View your completed goals
- 🔔 **Nudge System** - Send reminder emails to team members via Gmail
- 📱 **Responsive Design** - Beautiful UI that works on all devices
- ⚡ **Real-time Sync** - Live updates across all group members

## 🚀 Tech Stack

- **Frontend:** React 18 + Vite
- **Styling:** TailwindCSS
- **Backend:** Firebase (Auth + Firestore)
- **Icons:** Lucide React
- **Hosting:** Firebase Hosting (optional)

## 📋 Prerequisites

- Node.js 16+ and npm/pnpm
- Firebase project with Authentication and Firestore enabled

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/goalbuddies.git
cd goalbuddies/Goal-Buddies
```

2. **Install dependencies**
```bash
npm install
# or
pnpm install
```

3. **Set up environment variables**

Copy `.env.example` to `.env` and fill in your Firebase credentials:

```bash
cp .env.example .env
```

Get your Firebase config from [Firebase Console](https://console.firebase.google.com/):
- Go to Project Settings > General
- Scroll down to "Your apps" section
- Copy the config values

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_APP_ID=goalbuddies-app
```

4. **Configure Firebase**

Enable these Firebase services:
- **Authentication:** Enable Email/Password and Google Sign-in
- **Firestore Database:** Create database in production mode
- **Firestore Rules:** Update rules for production (see below)

5. **Start development server**
```bash
npm run dev
```

Visit `http://localhost:5173`

## 🔒 Firestore Security Rules

Update your Firestore rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /artifacts/{appId}/public/data/goals/{goalId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null &&
                      request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null &&
                              resource.data.userId == request.auth.uid;
    }
  }
}
```

## 📦 Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

## 🚢 Deployment

### Deploy to Firebase Hosting

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase:
```bash
firebase init hosting
```

4. Deploy:
```bash
npm run build
firebase deploy
```

### Deploy to Vercel/Netlify

Simply connect your GitHub repository and these platforms will auto-deploy on push.

## 🎮 Usage

1. **Sign Up/Login** - Create an account or sign in with Google
2. **Create/Join Group** - Start a new accountability group or join existing one
3. **Add Goals** - Set your daily/weekly goals with optional due dates
4. **Track Progress** - Complete goals and watch your streak grow
5. **Stay Accountable** - See your team's activity and nudge slacking members

## 📁 Project Structure

```
Goal-Buddies/
├── src/
│   ├── components/
│   │   └── Dashboard.jsx       # Main dashboard component
│   ├── config/
│   │   └── firebase.js         # Firebase configuration
│   ├── App.jsx                 # Main app component
│   ├── main.jsx               # Entry point
│   └── index.css              # Global styles
├── public/                     # Static assets
├── .env                       # Environment variables (gitignored)
├── .env.example              # Environment template
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- UI inspiration from modern SaaS applications
- Built with ❤️ using React and Firebase

---

**Made with 🔥 by Ansh Sahu**
** Dm on x - https://x.com/_anshsahu1 for any queries and suggestions
