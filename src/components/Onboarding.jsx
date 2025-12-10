import React from 'react';
import { Trophy, LogOut, Copy } from 'lucide-react';

export default function Dashboard({ 
  user, userName, groupCode, 
  completionPercentage, 
  handleLogout, copyGroupCode,
  children 
}) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-lg sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            {/* Show Profile Pic if available (Google), else Trophy */}
            {user?.photoURL ? (
              <img 
                src={user.photoURL} 
                alt={userName} 
                className="w-12 h-12 rounded-full border-2 border-white/30 shadow-sm object-cover"
              />
            ) : (
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <Trophy size={24} className="text-yellow-300" />
              </div>
            )}
            
            <div>
              <h1 className="font-bold text-xl leading-none flex items-center gap-2">
                Team Dashboard 
                <span 
                  className="text-xs font-mono bg-white/20 px-2 py-1 rounded text-white/90 cursor-pointer hover:bg-white/30 transition flex items-center gap-1" 
                  onClick={copyGroupCode} 
                  title="Click to copy"
                >
                  #{groupCode} <Copy size={10} />
                </span>
              </h1>
              <p className="text-xs text-orange-100 opacity-90">Welcome back, {userName}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <div className="text-xs font-semibold uppercase tracking-wider text-orange-100">My Progress</div>
              <div className="text-lg font-bold">{completionPercentage}%</div>
            </div>
            <button 
              onClick={handleLogout}
              className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition backdrop-blur-sm"
              title="Sign Out"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
        
        {/* Progress Bar Loader */}
        <div className="h-1 w-full bg-black/10">
          <div 
            className="h-full bg-green-400 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(74,222,128,0.7)]" 
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {children}
      </main>
    </div>
  );
}