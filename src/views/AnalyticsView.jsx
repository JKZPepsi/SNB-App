import React, { useState, useEffect, useMemo } from 'react';
import { AnalyticsIcon } from '../components/Icons';
import { FloatingChartNav } from '../components/SharedUI';
import { TopPlayersChart, __snbSharedChartState, __snbChartListeners } from '../components/Charts';
import { getGlobalHistory } from '../utils/helpers';

export function AnalyticsView({ globalHistory, playersRaw, tournaments, players, onNavigate }) {
    const [, setTick] = useState(0);

    useEffect(() => {
        const l = () => setTick(t => t + 1);
        __snbChartListeners.add(l);
        return () => __snbChartListeners.delete(l);
    }, []);

    const currentCutoff = typeof __snbSharedChartState !== 'undefined' ? __snbSharedChartState.cutoff : 12;
    const titlePrefix = currentCutoff === 'all' ? 'All-Time' : `Top ${currentCutoff}`;

    return (
        <div className="max-w-[1400px] mx-auto space-y-8 pb-20 relative animate-in fade-in duration-500">
            <FloatingChartNav />

            <header className="mb-6 pl-0 xl:pl-4">
                <h1 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3 drop-shadow-md"><AnalyticsIcon size={32} className="text-gold-500 drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]"/> Global Analytics</h1>
                <p className="text-white/50 mt-2 font-medium">Click or hover on any line or profile picture to isolate their trajectory. Official Rankings only update after Major+ events.</p>
            </header>

            {/* HEAVY MATTE GLASS WRAPPERS */}
            <div id="snb-chart-wrapper-rank" className="bg-white/5 backdrop-blur-2xl p-6 md:p-8 rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] scroll-mt-8">
                <h2 className="text-2xl font-black text-white flex items-center gap-3 mb-8 tracking-tight"><AnalyticsIcon size={24} className="text-white/40"/> {titlePrefix} Rank Progression</h2>
                <TopPlayersChart globalHistory={globalHistory} playersRaw={playersRaw} type="rank" onNavigate={onNavigate} />
            </div>
            
            <div id="snb-chart-wrapper-points" className="bg-white/5 backdrop-blur-2xl p-6 md:p-8 rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] scroll-mt-8">
                <h2 className="text-2xl font-black text-white flex items-center gap-3 mb-8 tracking-tight"><AnalyticsIcon size={24} className="text-white/40"/> {titlePrefix} Points Progression</h2>
                <TopPlayersChart globalHistory={globalHistory} playersRaw={playersRaw} type="points" onNavigate={onNavigate} />
            </div>
        </div>
    );
}