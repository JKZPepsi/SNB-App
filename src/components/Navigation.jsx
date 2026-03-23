import React from 'react';
import { SnbLogo, Plus, TournamentsIcon, PlayersIcon, NationsIcon, AnalyticsIcon } from './Icons';

export function Sidebar({ activeTab, navigateTo, selectedTournamentId }) {
    return (
        <nav className="w-64 bg-[#030303] border-r border-white/10 flex flex-col hidden md:flex shrink-0">
            {/* Main title hover */}
            <div 
                onClick={() => navigateTo('dashboard')} 
                className="px-6 py-6 border-b border-white/10 flex items-center gap-3 text-xl font-black text-white cursor-pointer hover:bg-white/[0.05] hover:text-gold-400 transition-all select-none"
            >
                <SnbLogo size={28} className="text-gold-500 shrink-0"/>
                <span className="truncate tracking-tight">SNB Tour</span>
            </div>

            {/* FIX: Centered the Create Event button with equal padding top and bottom */}
            <div className="px-5 py-6 border-b border-white/10 flex justify-center items-center">
                <button 
                    onClick={() => navigateTo('create_tournament')} 
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-bold rounded-xl transition-all shadow-md ${
                        activeTab === 'create_tournament' 
                        ? 'bg-gold-400 text-black shadow-[0_0_15px_rgba(212,175,55,0.3)]' 
                        : 'bg-white text-black hover:bg-gray-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                    }`}
                >
                    <Plus size={18}/> Create Event
                </button>
            </div>

            {/* FIX: Reordered tabs: Players -> Tournaments -> Nations */}
            <div className="flex-1 py-4 space-y-1 overflow-y-auto">
                <button onClick={() => navigateTo('players')} className={`w-full flex items-center gap-3 px-6 py-3.5 font-medium transition-colors ${activeTab === 'players' ? 'bg-white/[0.05] text-gold-500 border-r-4 border-gold-500' : 'text-white/50 hover:bg-white/[0.02] hover:text-white'}`}>
                    <PlayersIcon size={20}/>Players
                </button>
                <button onClick={() => navigateTo('tournaments')} className={`w-full flex items-center gap-3 px-6 py-3.5 font-medium transition-colors ${(activeTab === 'tournaments' && !selectedTournamentId) ? 'bg-white/[0.05] text-gold-500 border-r-4 border-gold-500' : 'text-white/50 hover:bg-white/[0.02] hover:text-white'}`}>
                    <TournamentsIcon size={20}/>Tournaments
                </button>
                <button onClick={() => navigateTo('nations')} className={`w-full flex items-center gap-3 px-6 py-3.5 font-medium transition-colors ${activeTab === 'nations' ? 'bg-white/[0.05] text-gold-500 border-r-4 border-gold-500' : 'text-white/50 hover:bg-white/[0.02] hover:text-white'}`}>
                    <NationsIcon size={20}/>Nations
                </button>
                <button onClick={() => navigateTo('analytics')} className={`w-full flex items-center gap-3 px-6 py-3.5 font-medium transition-colors ${activeTab === 'analytics' ? 'bg-white/[0.05] text-gold-500 border-r-4 border-gold-500' : 'text-white/50 hover:bg-white/[0.02] hover:text-white'}`}>
                    <AnalyticsIcon size={20}/>Analytics
                </button>
            </div>
        </nav>
    );
}

export function MobileNav({ activeTab, navigateTo, selectedTournamentId }) {
    return (
        <div className="md:hidden bg-[#030303] p-4 flex justify-between items-center border-b border-white/10 overflow-x-auto shrink-0 z-50">
            <div onClick={() => navigateTo('dashboard')} className="flex items-center gap-2 font-bold text-gold-500 mr-4 cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-[0_0_10px_rgba(212,175,55,0.3)] shrink-0">
                    <SnbLogo size={16} className="text-black"/>
                </div>
                <span className="text-white text-lg tracking-tight">SNB Tour</span>
            </div>
            
            {/* FIX: Reordered mobile tabs to match sidebar */}
            <div className="flex gap-3 items-center">
                <button onClick={() => navigateTo('create_tournament')} className={`p-2 rounded-lg transition-colors ${activeTab === 'create_tournament' ? 'bg-gold-400 text-black' : 'bg-white text-black hover:bg-gray-200'}`}><Plus size={18}/></button>
                <div className="w-px h-6 bg-white/10 mx-1"></div>
                <button onClick={() => navigateTo('players')} className={activeTab === 'players' ? 'text-gold-500' : 'text-white/40'}><PlayersIcon size={20}/></button>
                <button onClick={() => navigateTo('tournaments')} className={(activeTab === 'tournaments' && !selectedTournamentId) ? 'text-gold-500' : 'text-white/40'}><TournamentsIcon size={20}/></button>
                <button onClick={() => navigateTo('nations')} className={activeTab === 'nations' ? 'text-gold-500' : 'text-white/40'}><NationsIcon size={20}/></button>
                <button onClick={() => navigateTo('analytics')} className={activeTab === 'analytics' ? 'text-gold-500' : 'text-white/40'}><AnalyticsIcon size={20}/></button>
            </div>
        </div>
    );
}