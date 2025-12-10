import React, { useState } from 'react';
import { initializeApp } from 'firebase/app'; // Added import
import { 
  getAuth, // Added import
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider 
} from 'firebase/auth';
// import { auth } from '../config/firebase'; // Removed to prevent import error in preview
import { Zap, Mail, Lock, ArrowRight, Loader2, Chrome } from 'lucide-react';

// --- Firebase Init (Self-contained for Preview) ---
// In VS Code, you can move this back to a config file.
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {
  // Placeholder for local development if variable is missing
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // App.jsx will handle the redirect via onAuthStateChanged
    } catch (err) {
      console.error(err);
      setError("Google sign-in failed. Please try again.");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setLoading(false);
      if (err.code === 'auth/invalid-email') setError("Invalid email address.");
      else if (err.code === 'auth/wrong-password') setError("Incorrect password.");
      else if (err.code === 'auth/email-already-in-use') setError("Email already used.");
      else if (err.code === 'auth/weak-password') setError("Password too weak (6+ chars).");
      else setError("Authentication failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden p-8">
        <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 text-orange-600 mb-3">
              <Zap size={24} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">
              {isLogin ? "Welcome Back" : "Join the Squad"}
            </h2>
            <p className="text-slate-500 text-sm">
              {isLogin ? "Continue your streak." : "Start achieving your goals today."}
            </p>
        </div>

        <button 
          onClick={handleGoogle}
          disabled={loading}
          className="w-full bg-white border border-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 transition mb-6 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Chrome size={20} className="text-blue-500" />}
          Continue with Google
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400">Or using email</span></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
            <input 
              type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address"
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
            <input 
              type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              required
            />
          </div>

          {error && <p className="text-red-500 text-xs text-center">{error}</p>}

          <button 
            type="submit" disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-70 text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-500/30 transition flex items-center justify-center gap-2"
          >
            {loading ? "Processing..." : (isLogin ? "Sign In" : "Create Account")} 
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-slate-500">{isLogin ? "Don't have an account? " : "Already have an account? "}</span>
          <button onClick={() => setIsLogin(!isLogin)} className="text-orange-600 font-bold hover:underline">
            {isLogin ? "Sign Up" : "Log In"}
          </button>
        </div>
      </div>
    </div>
  );
}