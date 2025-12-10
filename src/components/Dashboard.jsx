import React, { useMemo } from 'react';
import { 
  Trophy, LogOut, Copy, Flame, Calendar, Plus, 
  CheckCircle2, Circle, Trash2, Users, Bell, Zap, History, Target, 
  Activity
} from 'lucide-react';

export default function Dashboard({ 
  user, userName, groupCode, 
  completionPercentage, handleLogout, copyGroupCode,
  // New Props for Advanced Features
  streak, showHistory, setShowHistory,
  newGoalText, setNewGoalText, newGoalDate, setNewGoalDate, handleAddGoal,
  myActiveGoals, myCompletedGoals, toggleGoal, deleteGoal,
  groupMembers, othersGoals, handleNudge, toast
}) {
  
  // Helper to check if date is overdue
  const isOverdue = (dateString) => {
    if (!dateString) return false;
    const today = new Date().toISOString().split('T')[0];
    return dateString < today;
  };

  // --- Heatmap Logic ---
  const heatmapData = useMemo(() => {
    const today = new Date();
    const days = [];
    // Generate last ~3 months (84 days = 12 weeks)
    for (let i = 83; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      // Count completions for this specific date
      const count = myCompletedGoals.filter(g => {
        if (!g.completedAt) return false;
        // Handle Firestore Timestamp or JS Date
        const gDate = g.completedAt.seconds 
          ? new Date(g.completedAt.seconds * 1000) 
          : new Date(g.completedAt);
        return gDate.toISOString().split('T')[0] === dateStr;
      }).length;

      days.push({ date: dateStr, count });
    }
    return days;
  }, [myCompletedGoals]);

  // Helper for heatmap color intensity (GitHub Style Green)
  const getIntensityClass = (count) => {
    if (count === 0) return "bg-slate-800"; // Empty (Dark Grey)
    if (count === 1) return "bg-green-900"; // Low
    if (count === 2) return "bg-green-700"; // Medium
    if (count >= 3) return "bg-green-500";  // High (Bright Green)
    return "bg-slate-800";
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-2xl text-white font-medium flex items-center gap-3 animate-bounce-short ${toast.type === 'error' ? 'bg-red-500' : 'bg-slate-900'}`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-lg sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            {/* User Avatar or Default Icon */}
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
          
          <div className="flex items-center gap-6">
             {/* 🔥 STREAK COUNTER */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 text-yellow-300 font-bold text-lg">
                <Flame size={20} className={streak > 0 ? "fill-yellow-300 animate-pulse" : "text-white/50"} />
                {streak} Days
              </div>
              <div className="text-[10px] uppercase tracking-wider text-orange-100 font-semibold">Streak</div>
            </div>

            {/* Progress Percentage */}
            <div className="hidden md:flex flex-col items-end">
              <div className="text-xs font-semibold uppercase tracking-wider text-orange-100">Progress</div>
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
        
        {/* Progress Bar */}
        <div className="h-1 w-full bg-black/10">
          <div 
            className="h-full bg-green-400 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(74,222,128,0.7)]" 
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: My Goals & Trophy Case */}
        <div className="lg:col-span-2 space-y-6">

          {/* 🔥 Consistency Heatmap Card (Updated to Dark/Green) */}
          <div className="bg-[#0d1117] rounded-2xl shadow-lg border border-slate-800 p-5 text-white">
            <div className="flex items-center justify-between mb-3">
               <h2 className="font-bold text-sm text-slate-400 flex items-center gap-2 uppercase tracking-wide">
                 <Activity size={16} /> Consistency Graph
               </h2>
               <span className="text-xs text-slate-500">Last 3 Months</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {heatmapData.map((day, i) => (
                <div 
                  key={i} 
                  title={`${day.date}: ${day.count} completed`}
                  className={`w-3 h-3 md:w-4 md:h-4 rounded-sm ${getIntensityClass(day.count)} transition-all hover:scale-110 cursor-help border border-white/5`}
                ></div>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-3 text-xs text-slate-500 justify-end">
               <span>Less</span>
               <div className="w-3 h-3 bg-slate-800 rounded-sm"></div>
               <div className="w-3 h-3 bg-green-900 rounded-sm"></div>
               <div className="w-3 h-3 bg-green-700 rounded-sm"></div>
               <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
               <span>More</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            
            {/* Toggle Tabs: Active vs History */}
            <div className="flex border-b border-slate-100">
               <button 
                 onClick={() => setShowHistory(false)}
                 className={`flex-1 py-4 font-bold text-sm flex items-center justify-center gap-2 transition ${!showHistory ? 'text-orange-600 border-b-2 border-orange-500 bg-orange-50/50' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 <Target size={18} /> Active Goals
               </button>
               <button 
                 onClick={() => setShowHistory(true)}
                 className={`flex-1 py-4 font-bold text-sm flex items-center justify-center gap-2 transition ${showHistory ? 'text-orange-600 border-b-2 border-orange-500 bg-orange-50/50' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 <History size={18} /> Trophy Case
               </button>
            </div>
            
            {!showHistory ? (
              <>
                {/* 📅 Add Goal Form with Date Picker */}
                <form onSubmit={handleAddGoal} className="p-4 m-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-3 shadow-inner">
                  <input
                    value={newGoalText}
                    onChange={e=>setNewGoalText(e.target.value)}
                    className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-700"
                    placeholder="I will..."
                  />
                  <div className="flex gap-2">
                    <div className="relative">
                       <input 
                         type="date" 
                         value={newGoalDate}
                         onChange={e=>setNewGoalDate(e.target.value)}
                         className="px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-600 text-sm h-full"
                       />
                    </div>
                    <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white px-5 rounded-lg font-bold transition flex items-center shadow-lg shadow-orange-500/30">
                      <Plus size={20}/>
                    </button>
                  </div>
                </form>

                {/* Active List */}
                <div className="px-6 pb-6 space-y-3">
                  {myActiveGoals.length === 0 ? (
                    <div className="text-center py-12 px-4">
                      <p className="text-slate-400">No active goals. Add one above!</p>
                    </div>
                  ) : (
                    myActiveGoals.map(g => (
                      <div key={g.id} className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition group">
                        <button onClick={() => toggleGoal(g)} className="flex-shrink-0 text-slate-300 hover:text-green-500 transition">
                          <Circle size={24} />
                        </button>
                        <div className="flex-1">
                           <span className="font-medium text-lg text-slate-700">{g.text}</span>
                           {g.dueDate && (
                             <div className={`text-xs flex items-center gap-1 mt-1 ${isOverdue(g.dueDate) ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                               <Calendar size={12} /> 
                               {isOverdue(g.dueDate) ? 'Overdue: ' : 'Due: '} {g.dueDate}
                             </div>
                           )}
                        </div>
                        <button onClick={()=>deleteGoal(g.id)} className="text-slate-300 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition"><Trash2 size={18}/></button>
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : (
              /* 🏆 Trophy Case / History List */
              <div className="px-6 py-6 space-y-3">
                 {myCompletedGoals.length === 0 ? (
                    <div className="text-center py-12 px-4">
                      <Trophy className="mx-auto text-slate-300 mb-2" size={48} />
                      <p className="text-slate-400">Your trophy case is empty. Go crush some goals!</p>
                    </div>
                  ) : (
                    myCompletedGoals.map(g => (
                      <div key={g.id} className="flex items-center gap-4 p-4 bg-green-50/50 border border-green-100 rounded-xl opacity-75 hover:opacity-100 transition">
                        <button onClick={() => toggleGoal(g)} className="flex-shrink-0 text-green-500">
                          <CheckCircle2 size={24} />
                        </button>
                        <div className="flex-1">
                           <span className="font-medium text-lg text-slate-500 line-through decoration-slate-300">{g.text}</span>
                        </div>
                        <div className="text-xs text-green-600 font-bold bg-green-100 px-2 py-1 rounded-full">
                           COMPLETED
                        </div>
                      </div>
                    ))
                  )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Squad & Feed */}
        <div className="space-y-6">
           <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="font-bold flex gap-2 mb-4 text-slate-800"><Users className="text-purple-600"/> Squad</h2>
              {groupMembers.map((m, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl mb-2">
                  <div>
                    <div className="font-bold text-slate-700">{m.name}</div>
                    <div className="text-xs text-slate-500">{m.completed} Done • {m.pending} Pending</div>
                  </div>
                  {m.pending > 0 && (
                    <button 
                      onClick={()=>handleNudge(m)} 
                      className="text-xs bg-white border border-slate-200 px-3 py-2 rounded-lg hover:border-orange-300 hover:text-orange-600 font-bold flex gap-1 transition"
                    >
                      <Bell size={12}/> Nudge
                    </button>
                  )}
                </div>
              ))}
           </div>
           
           <div className="bg-slate-900 rounded-2xl shadow-lg p-6 text-white h-[400px] overflow-y-auto custom-scrollbar">
              <h3 className="font-bold mb-4 flex items-center gap-2"><Zap className="text-yellow-400"/> Live Feed</h3>
              {othersGoals.map(g => (
                <div key={g.id} className="text-sm mb-4 border-b border-white/10 pb-3 last:border-0">
                  <div className="flex justify-between items-start mb-1">
                     <span className={`font-bold ${g.completed ? 'text-green-400' : 'text-orange-300'}`}>{g.userName}</span>
                     {g.completed && <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded font-bold">WON</span>}
                  </div>
                  <div className="text-slate-300">
                    {g.completed ? 'completed:' : 'added:'} <span className="italic text-white">"{g.text}"</span>
                  </div>
                </div>
              ))}
           </div>
        </div>

      </main>
    </div>
  );
}