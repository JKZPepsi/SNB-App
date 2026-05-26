import React, { useState, useMemo } from 'react';
import { Trophy } from './Icons';
import { PlayerMedia, Tooltip, PlayerFormIndicator } from './SharedUI';
import { getFlag } from '../utils/helpers';

export function PlayerDataGrid({ players, tournaments, onSelectPlayer, onNavigate, rankKey = 'currentRank', showNationality = true }) {
    const [sortConfig, setSortConfig] = useState({ key: rankKey, direction: 'asc' });

    const handleSort = (key) => {
        if (sortConfig.key === key) {
            setSortConfig({ key, direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' });
        } else {
            setSortConfig({ key, direction: ['currentRank', 'nationalRank', 'name', 'nationality'].includes(key) ? 'asc' : 'desc' });
        }
    };

    const SortIcon = ({ column }) => {
        if (sortConfig.key !== column) return null;
        return <span className="text-gold-400 inline-block w-3 text-center ml-1 text-[10px]">{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>;
    };

    const sortedPlayers = useMemo(() => {
        return [...players].sort((a, b) => {
            let valA = a[sortConfig.key], valB = b[sortConfig.key];
            
            if (sortConfig.key === 'diff') { valA = a.diff; valB = b.diff; }
            if (sortConfig.key === 'name') { valA = a.name.toLowerCase(); valB = b.name.toLowerCase(); }
            if (sortConfig.key === 'nationality') { valA = (a.nationality||'').toLowerCase(); valB = (b.nationality||'').toLowerCase(); }
            if (sortConfig.key === 'recent') { valA = a.recentTournaments?.[0]?.result || ''; valB = b.recentTournaments?.[0]?.result || ''; }
            if (sortConfig.key === 'played') { valA = a.stats?.totalPlayed || 0; valB = b.stats?.totalPlayed || 0; }
            if (sortConfig.key === 'wl') { 
                valA = a.stats?.totalPlayed > 0 ? a.stats.wins / a.stats.totalPlayed : 0; 
                valB = b.stats?.totalPlayed > 0 ? b.stats.wins / b.stats.totalPlayed : 0; 
            }
            
            if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
            if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [players, sortConfig]);

    const active = sortedPlayers.filter(p => !p.retired);
    const retired = sortedPlayers.filter(p => p.retired);

    const getRecentAbbr = (result) => {
        const map = {
            'Winner': 'W', 'Finalist': 'F', 'Final': 'F',
            'Semifinalist': 'SF', 'Semifinals': 'SF',
            'Quarterfinalist': 'QF', 'Quarterfinals': 'QF',
            'Round of 16': 'R16',
            'Round of 32': 'R32', 
            'Round of 64': 'R64',
            'Round of 128': 'R128',
            'Round Robin': 'RR', 'Group Stage': 'RR', 
            'Third Place': '3rd', 'Fourth Place': '4th',
            'Qualifier': 'Q', 'Q-R1': 'QR1', 'Q-R2': 'QR2', 'Q-R3': 'QR3', 'Q-R4': 'QR4'
        };
        return map[result] || result || '-';
    };

    return (
        <div className="bg-white/5 backdrop-blur-2xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-white/10 relative z-30">
            <div className="overflow-x-auto custom-scrollbar pt-[100px] -mt-[100px] pointer-events-none">                
                <table className="w-full text-left border-collapse whitespace-nowrap min-w-[900px] table-fixed pointer-events-auto">
                    <thead>
                        <tr className="bg-black/40 text-white/50 text-[10px] font-bold uppercase tracking-widest select-none border-b border-white/10 backdrop-blur-md rounded-t-3xl">
                            <th className="py-4 px-2 w-20 text-center cursor-pointer hover:text-white transition-colors group first:rounded-tl-3xl" onClick={() => handleSort(rankKey)}>
                                {rankKey === 'nationalRank' ? 'Nat Rank' : 'Rank'} <SortIcon column={rankKey}/>
                            </th>
                            
                            {rankKey === 'nationalRank' && (
                                <th className="py-4 px-2 w-20 text-center cursor-pointer hover:text-white transition-colors group" onClick={() => handleSort('currentRank')}>
                                    Global <SortIcon column="currentRank"/>
                                </th>
                            )}

                            <th className={`py-4 px-2 text-left cursor-pointer hover:text-white transition-colors group ${showNationality ? 'w-[280px]' : 'w-[320px]'}`} onClick={() => handleSort('name')}>
                                Player <SortIcon column="name"/>
                            </th>
                            {showNationality && (
                                <th className="py-4 px-2 w-24 text-center cursor-pointer hover:text-white transition-colors group" onClick={() => handleSort('nationality')}>
                                    Nat <SortIcon column="nationality"/>
                                </th>
                            )}
                            <th className="py-4 px-2 w-28 text-center cursor-pointer hover:text-white transition-colors group" onClick={() => handleSort('points')}>
                                Points <SortIcon column="points"/>
                            </th>
                            <th className="py-4 px-2 w-32 text-center cursor-pointer hover:text-white transition-colors group" onClick={() => handleSort('diff')}>
                                Net Change <SortIcon column="diff"/>
                            </th>
                            <th className="py-4 px-2 w-24 text-center cursor-pointer hover:text-white transition-colors group">
                                Form
                            </th>
                            <th className="py-4 px-2 w-24 text-center cursor-pointer hover:text-white transition-colors group" onClick={() => handleSort('wl')}>
                                W-L <SortIcon column="wl"/>
                            </th>
                            <th className="py-4 px-4 text-center w-48 cursor-pointer hover:text-white transition-colors group last:rounded-tr-3xl" onClick={() => handleSort('recent')}>
                                Recent <SortIcon column="recent"/>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.05]">
                        {active.map((player) => {
                            // PRIORITIZE THE NEW IMAGES ARRAY OVER THE DEAD IMAGEURL
                            const imgUrl = (player.images && player.images.length > 0 && player.images[0]) ? player.images[0] : player.imageUrl;
                            
                            const scoringTournaments = player.recentTournaments?.filter(t => t.tier !== 'nations_league') || [];
                            const recent = scoringTournaments[0];
                            
                            let recentDisplay = <span className="text-white/20">-</span>;
                            
                            if (recent) {
                                const recentT = tournaments.find(t => t.id === recent.tournamentId);
                                const rFlag = recentT ? getFlag(recentT.hostCountry) : '';
                                
                                recentDisplay = (
                                    <div className="flex items-center justify-center gap-2 text-sm cursor-pointer group/recent" 
                                         onClick={(e) => { e.stopPropagation(); window.dispatchEvent(new PopStateEvent('popstate', { state: { tab: 'tournaments', tournamentId: recent.tournamentId } })); }}>
                                        <span className="font-bold text-white/90 w-6 text-right group-hover/recent:text-gold-400 transition-colors">{getRecentAbbr(recent.result)}</span>
                                        <span className="text-white/20 font-black">-</span>
                                        {rFlag && <span className="text-sm leading-none drop-shadow-md">{rFlag}</span>}
                                        <span className="truncate max-w-[100px] text-white/70 font-medium group-hover/recent:text-white group-hover/recent:underline">{recent.tournamentName}</span>
                                    </div>
                                );
                            }

                            const trueGained = player.gainedPoints || 0;
                            const rawDropped = player.droppedPoints || 0;

                            return (
                                // FIX: Added 'relative hover:z-50' so the active row and its tooltip ALWAYS render on top!
                                <tr key={player.id} onClick={() => onSelectPlayer(player.id)} className="hover:bg-white/5 transition-all duration-200 cursor-pointer group relative hover:z-50">
                                    
                                    <td className="py-3 px-2 text-center">
                                        <span className="text-2xl font-medium tabular-nums text-white/80 group-hover:text-white transition-colors tracking-tight">{player[rankKey]}</span>
                                    </td>

                                    {rankKey === 'nationalRank' && (
                                        <td className="py-3 px-2 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <span className="text-[8px] text-white/40 uppercase tracking-widest font-bold mb-0.5">Global</span>
                                                <span className="text-sm font-bold tabular-nums text-white/50 group-hover:text-white/80 transition-colors tracking-tight">#{player.currentRank || '-'}</span>
                                            </div>
                                        </td>
                                    )}
                                    
                                    <td className="py-3 px-2 text-left">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full overflow-hidden bg-black/40 shrink-0 shadow-[0_4px_10px_rgba(0,0,0,0.5)] group-hover:shadow-[0_4px_15px_rgba(255,255,255,0.2)] transition-all">
                                                {/* INJECTED URL FIX HERE */}
                                                <PlayerMedia url={imgUrl} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex flex-col justify-center min-w-0">
                                                <div className="font-black text-base text-white/90 truncate group-hover:text-gold-400 transition-colors tracking-tight">
                                                    {player.name}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    {showNationality && (
                                        <td className="py-3 px-2 text-center">
                                            <div className="flex flex-col items-center justify-center group-hover:scale-110 transition-transform">
                                                <span className="text-2xl drop-shadow-md leading-none">{getFlag(player.nationality)}</span>
                                                <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1">{player.nationality}</span>
                                            </div>
                                        </td>
                                    )}
                                    
                                    <td className="py-3 px-2 text-center">
                                        <span className="text-lg font-black tabular-nums text-gold-400 drop-shadow-[0_0_8px_rgba(212,175,55,0.4)] tracking-tight">{player.points.toLocaleString()}</span>
                                    </td>
                                    
                                    <td className="py-3 px-2 text-center">
                                        <Tooltip content={
                                            <div className="min-w-[160px] text-sm">
                                                <div className="flex justify-between items-center text-emerald-400 font-bold mb-1.5">
                                                    <span className="text-xs uppercase tracking-widest text-emerald-400/70">Gained</span>
                                                    <span>+{trueGained}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-rose-400 font-bold border-b border-white/10 pb-1.5 mb-1.5">
                                                    <span className="text-xs uppercase tracking-widest text-rose-400/70">Dropped</span>
                                                    <span>-{rawDropped}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-white font-black">
                                                    <span className="text-xs uppercase tracking-widest text-white/50">Net</span>
                                                    <span>{player.diff > 0 ? '+' : ''}{player.diff || 0}</span>
                                                </div>
                                            </div>
                                        }>
                                            <span className={`text-sm font-black tabular-nums border-b border-dashed ${player.diff > 0 ? 'text-emerald-400 border-emerald-400/30 hover:border-emerald-400' : player.diff < 0 ? 'text-rose-400 border-rose-400/30 hover:border-rose-400' : 'text-white/30 border-white/10 hover:border-white/30'} transition-colors cursor-help`}>
                                                {player.diff > 0 ? '+' : ''}{player.diff || '-'}
                                            </span>
                                        </Tooltip>
                                    </td>

                                    <td className="py-3 px-2">
                                        <PlayerFormIndicator matches={player.recentMatches} />
                                    </td>

                                    <td className="py-3 px-2 text-center text-white/70 font-bold text-sm tabular-nums group-hover:text-white transition-colors">
                                        {player.stats?.wins || 0} - {player.stats?.losses || 0}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        {recentDisplay}
                                    </td>
                                </tr>
                            );
                        })}

                        {retired.length > 0 && (
                            <>
                                <tr className="bg-black/60 border-t border-white/20 backdrop-blur-xl">
                                    <td colSpan={showNationality ? "8" : (rankKey === 'nationalRank' ? "8" : "7")} className="p-4 text-center">
                                        <div className="inline-flex items-center gap-4 opacity-80">
                                            <div className="h-px w-24 bg-white/20"></div>
                                            <span className="text-white/60 font-black uppercase tracking-widest text-[10px] flex items-center gap-2">
                                                <Trophy size={14} className="text-white/40" /> SNB Tour Alumni
                                            </span>
                                            <div className="h-px w-24 bg-white/20"></div>
                                        </div>
                                    </td>
                                </tr>
                                {retired.map((player) => {
                                    // PRIORITIZE THE NEW IMAGES ARRAY FOR RETIRED PLAYERS TOO
                                    const imgUrl = (player.images && player.images.length > 0 && player.images[0]) ? player.images[0] : player.imageUrl;

                                    return (
                                        <tr key={player.id} onClick={() => onSelectPlayer(player.id)} className="hover:bg-white/[0.03] transition-all duration-300 cursor-pointer group opacity-50 grayscale hover:grayscale-0 hover:opacity-100">
                                            <td className="py-3 px-2 text-center text-3xl font-medium text-white/30 tabular-nums">-</td>
                                            
                                            {rankKey === 'nationalRank' && (
                                                <td className="py-3 px-2 text-center text-3xl font-medium text-white/30 tabular-nums">-</td>
                                            )}
                                            
                                            <td className="py-3 px-2 text-left">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full overflow-hidden bg-black shrink-0 shadow-sm relative">
                                                        {/* INJECTED URL FIX HERE */}
                                                        <PlayerMedia url={imgUrl} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="font-bold text-base text-white/70 truncate flex items-center gap-2 group-hover:text-white transition-colors">
                                                        {player.name}
                                                        <span className="text-[8px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded uppercase tracking-widest border border-rose-500/30">Ret</span>
                                                    </div>
                                                </div>
                                            </td>

                                            {showNationality && (
                                                <td className="py-3 px-2 text-center">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <span className="text-2xl drop-shadow-sm leading-none">{getFlag(player.nationality)}</span>
                                                        <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1">{player.nationality}</span>
                                                    </div>
                                                </td>
                                            )}
                                            
                                            <td className="py-3 px-2 text-center">
                                                <div className="text-[8px] text-white/30 uppercase tracking-widest font-black mb-0.5">Peak Pts</div>
                                                <span className="text-lg font-medium text-white/50 tabular-nums">{player.peakPoints?.toLocaleString() || '-'}</span>
                                            </td>
                                            
                                            <td className="py-3 px-2 text-center text-white/20">-</td>
                                            <td className="py-3 px-2 text-center text-white/20">-</td>
                                            <td className="py-3 px-2 text-center text-white/40 font-medium text-sm tabular-nums">{player.stats?.wins || 0} - {player.stats?.losses || 0}</td>
                                            <td className="py-3 px-4 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <span className="text-[8px] text-white/30 uppercase tracking-widest font-black mb-0.5">Peak Rank</span>
                                                    <span className="text-white/50 font-bold text-sm">#{player.peakRank || '-'}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}