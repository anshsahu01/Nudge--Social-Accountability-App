import React, { useState, useEffect, useMemo } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  signInWithCustomToken
} from 'firebase/auth';
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query
} from 'firebase/firestore';
import {
  Zap,
  Mail,
  ArrowRight,
  Loader2,
  Lock,
  Chrome
} from 'lucide-react';

// --- 1. CONFIGURATION ---
// Import from firebase config file
import { auth, db } from './config/firebase';
import Dashboard from './components/Dashboard';

const appId = import.meta.env.VITE_APP_ID || 'goalbuddies-app';

// --- 2. HELPERS ---
const generateGroupCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

const copyToClipboard = (text, onSuccess, onError) => {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(onSuccess).catch(onError);
  } else {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      onSuccess();
    } catch (err) { onError(); }
  }
};

// --- 3. AUTH COMPONENT ---
const AuthScreen = () => {
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
      else if (err.code === 'auth/email-already-in-use') setError("Email already registered.");
      else if (err.code === 'auth/weak-password') setError("Password too weak.");
      else setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden p-8">
        <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 text-orange-600 mb-3"><Zap size={24} /></div>
            <h2 className="text-2xl font-bold text-slate-800">{isLogin ? "Welcome Back" : "Join the Squad"}</h2>
        </div>
        <button onClick={handleGoogle} disabled={loading} className="w-full bg-white border border-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 transition mb-6 disabled:opacity-50">
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Chrome size={20} className="text-blue-500" />} Continue with Google
        </button>
        <div className="relative mb-6"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400">Or using email</span></div></div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative"><Mail className="absolute left-3 top-3.5 text-slate-400" size={18} /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition" required /></div>
          <div className="relative"><Lock className="absolute left-3 top-3.5 text-slate-400" size={18} /><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition" required /></div>
          {error && <p className="text-red-500 text-xs text-center">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-70 text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-500/30 transition">{loading ? "Processing..." : (isLogin ? "Sign In" : "Create Account")}</button>
        </form>
        <div className="mt-6 text-center text-sm"><button onClick={() => setIsLogin(!isLogin)} className="text-orange-600 font-bold hover:underline">{isLogin ? "Need an account? Sign Up" : "Have an account? Log In"}</button></div>
      </div>
    </div>
  );
};

// --- 4. ONBOARDING COMPONENT ---
const Onboarding = ({ userName, setUserName, groupCode, setGroupCode, isCreating, setIsCreating, handleAction }) => {
  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans flex flex-col md:flex-row">
      <div className="md:w-1/2 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 p-8 flex flex-col justify-between text-white relative overflow-hidden">
        <div className="z-10">
          <div className="flex items-center gap-2 mb-6"><div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm"><Zap size={24} className="text-yellow-300" /></div><span className="font-bold text-xl tracking-tight">GoalBuddy</span></div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">Turn your <br/><span className="text-yellow-300">Ambition</span> into <br/><span className="text-white">Action.</span></h1>
        </div>
      </div>
      <div className="md:w-1/2 p-8 md:p-12 flex items-center justify-center bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button onClick={() => setIsCreating(true)} className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${isCreating ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>Create Group</button>
            <button onClick={() => setIsCreating(false)} className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${!isCreating ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>Join Group</button>
          </div>
          <div className="space-y-4">
            <div><label className="block text-sm font-bold text-slate-700 mb-2">Display Name</label><input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition" placeholder="Nickname"/></div>
            {!isCreating && <div className="animate-fade-in-up"><label className="block text-sm font-bold text-slate-700 mb-2">Group Code</label><input type="text" value={groupCode} onChange={(e) => setGroupCode(e.target.value.toUpperCase())} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition font-mono tracking-widest uppercase" placeholder="XYZ123" maxLength={6} /></div>}
          </div>
          <button onClick={handleAction} className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-slate-900/20 flex items-center justify-center gap-2 transition transform hover:scale-[1.02]">{isCreating ? 'Launch New Group' : 'Join Your Team'} <ArrowRight size={20} /></button>
        </div>
      </div>
    </div>
  );
};

// --- 6. MAIN APP ---
export default function GoalBuddy() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [groupCode, setGroupCode] = useState('');
  const [isCreating, setIsCreating] = useState(true);
  const [view, setView] = useState('auth'); 
  const [goals, setGoals] = useState([]);
  const [newGoalText, setNewGoalText] = useState('');
  const [newGoalDate, setNewGoalDate] = useState(''); 
  const [showHistory, setShowHistory] = useState(false); 
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const initAuth = async () => { if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) { try { await signInWithCustomToken(auth, __initial_auth_token); } catch(e) {} } };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        const g = localStorage.getItem('gb_groupCode');
        const n = localStorage.getItem('gb_userName');
        if (u.displayName) setUserName(u.displayName);
        else if (n) setUserName(n);
        if (g) { setGroupCode(g); setView('dashboard'); } else { setView('onboarding'); }
      } else { setView('auth'); }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || view !== 'dashboard' || !groupCode) return;
    const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'goals')); 
    const unsub = onSnapshot(q, (s) => {
        const data = s.docs.map(d => ({ id: d.id, ...d.data() })).filter(g => g.groupCode === groupCode)
          .sort((a, b) => {
             if (a.completed === b.completed) {
                if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
                return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
             }
             return a.completed ? 1 : -1;
          });
        setGoals(data);
    });
    return () => unsub();
  }, [user, view, groupCode]);

  const showToast = (message, type = 'success') => { setToast({ message, type }); setTimeout(() => setToast(null), 3000); };
  
  const handleCreateOrJoin = () => {
    let code = groupCode;
    if (isCreating) { code = generateGroupCode(); setGroupCode(code); }
    if (!userName.trim() || (!isCreating && !code.trim())) { showToast("Check details", "error"); return; }
    localStorage.setItem('gb_userName', userName); localStorage.setItem('gb_groupCode', code);
    setGroupCode(code); setView('dashboard');
  };

  const handleLogout = () => { if(window.confirm("Log out?")) { signOut(auth); localStorage.removeItem('gb_groupCode'); setGoals([]); setView('auth'); } };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'goals'), {
        text: newGoalText, dueDate: newGoalDate, completed: false, userId: user.uid, userName: userName, userEmail: user.email || '', groupCode: groupCode, createdAt: serverTimestamp(), completedAt: null
      });
      setNewGoalText(''); setNewGoalDate(''); showToast("Goal set!");
    } catch(err) { showToast("Failed", "error"); }
  };

  const toggleGoal = async (g) => { try { const c = !g.completed; await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'goals', g.id), { completed: c, completedAt: c ? serverTimestamp() : null }); if (c) showToast("Goal crushed!"); } catch(e){} };
  const deleteGoal = async (id) => { if(!window.confirm("Delete?")) return; try { await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'goals', id)); } catch(e){} };
  const handleNudge = (m) => { if (!m.email) return showToast("No email linked", "error"); window.open(`mailto:${m.email}?subject=Wake up! Goals pending&body=Hey ${m.name}, you have pending goals in our group.`); };

  const myActiveGoals = useMemo(() => goals.filter(g => g.userId === user?.uid && !g.completed), [goals, user]);
  const myCompletedGoals = useMemo(() => goals.filter(g => g.userId === user?.uid && g.completed), [goals, user]);
  const othersGoals = useMemo(() => goals.filter(g => g.userId !== user?.uid), [goals, user]);
  
  const streak = useMemo(() => {
    if (myCompletedGoals.length === 0) return 0;
    const uniqueDates = [...new Set(myCompletedGoals.map(g => g.completedAt ? new Date(g.completedAt.seconds * 1000).toDateString() : null).filter(d=>d))].sort((a,b) => new Date(b) - new Date(a));
    const today = new Date().toDateString();
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    if (!uniqueDates.includes(today) && !uniqueDates.includes(yesterday.toDateString())) return 0;
    return uniqueDates.length; 
  }, [myCompletedGoals]);

  const groupMembers = useMemo(() => {
    const m = {}; othersGoals.forEach(g => { if (!m[g.userId]) m[g.userId] = { name: g.userName, email: g.userEmail, pending: 0, completed: 0 }; g.completed ? m[g.userId].completed++ : m[g.userId].pending++; }); return Object.values(m);
  }, [othersGoals]);
  const completionPercentage = useMemo(() => { const t = myActiveGoals.length + myCompletedGoals.length; return t === 0 ? 0 : Math.round((myCompletedGoals.length / t) * 100); }, [myActiveGoals, myCompletedGoals]);

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-orange-500 w-8 h-8"/></div>;
  if (view === 'auth') return <AuthScreen />;
  if (view === 'onboarding') return <Onboarding userName={userName} setUserName={setUserName} groupCode={groupCode} setGroupCode={setGroupCode} isCreating={isCreating} setIsCreating={setIsCreating} handleAction={handleCreateOrJoin} />;

  return <Dashboard user={user} userName={userName} groupCode={groupCode} completionPercentage={completionPercentage} handleLogout={handleLogout} copyGroupCode={() => copyToClipboard(groupCode, () => showToast("Copied!"), () => showToast("Error"))} streak={streak} showHistory={showHistory} setShowHistory={setShowHistory} newGoalText={newGoalText} setNewGoalText={setNewGoalText} newGoalDate={newGoalDate} setNewGoalDate={setNewGoalDate} handleAddGoal={handleAddGoal} myActiveGoals={myActiveGoals} myCompletedGoals={myCompletedGoals} toggleGoal={toggleGoal} deleteGoal={deleteGoal} groupMembers={groupMembers} othersGoals={othersGoals} handleNudge={handleNudge} toast={toast} />;
}







































