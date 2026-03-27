import React, { useMemo } from 'react';
import { NationsIcon, AnalyticsIcon, Trophy, ArrowLeft, PlayersIcon, DynamicTrophy } from '../components/Icons';
import { FloatingNationNav } from '../components/SharedUI';
import { TopNationsChart, NationPointsChart } from '../components/Charts';
import { PlayerDataGrid } from '../components/PlayerDataGrid';
import { getGlobalHistory, getTournamentTier, getFlag, getCountryName, attachDiffsAndForm } from '../utils/helpers';
import { TOURNAMENT_TIERS } from '../utils/constants';

function NationAchievements({ code, players, tournaments, onNavigate }) {
    const { nationalTitles, playerTitles } = React.useMemo(() => {
        const nTitles = [];
        const pTitles = [];
        
        if (!tournaments || !tournaments.length) return { nationalTitles: nTitles, playerTitles: pTitles };

        tournaments.forEach(t => {
            if (t.status !== 'completed' || !t.bracket) return;
            const tTier = getTournamentTier(t);

            // --- EXTRACT NATIONAL TEAM HONORS ---
            if (tTier === 'nations_league') {
                let b = []; try { b = typeof t.bracket === 'string' ? JSON.parse(t.bracket) : t.bracket; } catch(e){}
                let tms = []; try { tms = typeof t.teams === 'string' ? JSON.parse(t.teams) : t.teams; } catch(e){}
                
                const finalTie = b[2]?.[1];
                const thirdTie = b[2]?.[0];
                
                // Helper to check if the current nation's code is part of the team's flags
                const getTeamIfInvolved = (teamId) => {
                    if (!teamId) return null;
                    const team = tms.find(tm => tm.id === teamId);
                    if (team && team.flags && team.flags.includes(code)) return team;
                    return null;
                };

                // Check for Winner and Finalist (1st & 2nd)
                if (finalTie?.winner) {
                    const firstPlaceId = finalTie.winner;
                    const secondPlaceId = finalTie.t1?.id === firstPlaceId ? finalTie.t2?.id : finalTie.t1?.id;
                    
                    const firstTeam = getTeamIfInvolved(firstPlaceId);
                    if (firstTeam) nTitles.push({ tournament: t, result: 'Winner', teamName: firstTeam.name });

                    const secondTeam = getTeamIfInvolved(secondPlaceId);
                    if (secondTeam) nTitles.push({ tournament: t, result: 'Finalist', teamName: secondTeam.name });
                }
                
                // Check for Third Place
                if (thirdTie?.winner) {
                    const thirdTeam = getTeamIfInvolved(thirdTie.winner);
                    if (thirdTeam) nTitles.push({ tournament: t, result: 'Third Place', teamName: thirdTeam.name });
                }

            // --- EXTRACT INDIVIDUAL PLAYER TITLES ---
            } else if (['grand_slam', 'major', 'finals'].includes(tTier)) {
                let b = []; try { b = typeof t.bracket === 'string' ? JSON.parse(t.bracket) : t.bracket; } catch(e){}
                const finalMatch = b[b.length - 1]?.[0];
                if (finalMatch?.winner) {
                    const winner = players.find(p => p.id === finalMatch.winner);
                    if (winner && (winner.nationality || 'UNK') === code) {
                        pTitles.push({ tournament: t, result: 'Winner', playerName: winner.name });
                    }
                }
            }
        });

        // Sort: Winners first, then by date descending
        const sorter = (a, b) => {
            if (a.result === 'Winner' && b.result !== 'Winner') return -1;
            if (b.result === 'Winner' && a.result !== 'Winner') return 1;
            return (b.tournament.completedAt || 0) - (a.tournament.completedAt || 0);
        };

        return { 
            nationalTitles: nTitles.sort(sorter), 
            playerTitles: pTitles.sort(sorter) 
        };
    }, [tournaments, players, code]);

    // If the nation has absolutely no titles, we don't render the section
    if (nationalTitles.length === 0 && playerTitles.length === 0) return null;

    // Helper function to render a sleek, uniform achievement card for both types
    const renderCard = (ach, nameLabel) => {
        const isWinner = ach.result === 'Winner';
        const isSilver = ach.result === 'Finalist';
        const tTier = getTournamentTier(ach.tournament);
        
        // Dynamic badge styling based on placement
        const badgeColor = isWinner ? 'bg-gold-500/20 text-gold-500 border-gold-500/30' : 
                           isSilver ? 'bg-slate-300/20 text-slate-300 border-slate-300/30' : 
                           'bg-[#cd7f32]/20 text-[#cd7f32] border-[#cd7f32]/30';

        return (
            <div key={ach.tournament.id + ach.result} onClick={() => onNavigate('tournaments', null, ach.tournament.id)} className="bg-[#0a0a0a] border border-white/5 hover:border-white/20 rounded-2xl p-5 flex flex-col items-center text-center transition-all hover:-translate-y-1 hover:shadow-xl cursor-pointer group shadow-inner">
                {/* Background Glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none rounded-full" style={{ background: `radial-gradient(circle, ${TOURNAMENT_TIERS[tTier]?.hex || '#d4af37'}20 0%, transparent 70%)` }}></div>
                
                {/* The Trophy/Medal */}
                <div className="h-24 flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-110 drop-shadow-xl relative z-10">
                    <DynamicTrophy tier={tTier} result={ach.result} country={ach.tournament.hostCountry} size={64} />
                </div>
                
                {/* Tournament Tier Badge */}
                <div className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border mb-3 relative z-10 shadow-sm ${badgeColor}`}>
                    {tTier === 'nations_league' ? 'Nations League' : TOURNAMENT_TIERS[tTier]?.name || 'Major'}
                </div>
                
                <h3 className="text-xl font-black text-white tracking-tight mb-1 relative z-10">{ach.result}</h3>
                
                {/* Winner Name (Team or Player) */}
                <div className="font-bold text-white/80 text-sm mb-2 relative z-10 truncate w-full px-2" title={nameLabel}>{nameLabel}</div>
                
                <div className="text-[11px] text-white/40 font-bold tracking-wide uppercase relative z-10 truncate w-full px-2">{ach.tournament.name}</div>
            </div>
        );
    };

    return (
        <div id="nation-trophies" className="bg-white/5 backdrop-blur-2xl p-6 md:p-8 rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] scroll-mt-8 mt-8">
            
            {/* --- SECTION 1: NATIONAL TEAM HONORS --- */}
            {nationalTitles.length > 0 && (
                <div className={playerTitles.length > 0 ? "mb-12" : ""}>
                    <div className="flex items-center gap-4 mb-8">
                        <h2 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight">
                            <Trophy size={24} className="text-gold-500"/> National Team Honors
                        </h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent"></div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {nationalTitles.map((ach) => renderCard(ach, ach.teamName))}
                    </div>
                </div>
            )}

            {/* --- SECTION 2: INDIVIDUAL PLAYER TITLES --- */}
            {playerTitles.length > 0 && (
                <div>
                    <div className="flex items-center gap-4 mb-8">
                        <h2 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight">
                            <Trophy size={24} className="text-sky-400"/> Individual Major Titles
                        </h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent"></div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {playerTitles.map((ach) => renderCard(ach, ach.playerName))}
                    </div>
                </div>
            )}
            
        </div>
    );
}

export function NationProfile({ code, players, onBack, onNavigate, playersRaw, tournaments }) {
    const { processedPlayers, stats } = useMemo(() => {
        const natPlayers = players.filter(p => (p.nationality || 'UNK') === code);
        const globalHist = getGlobalHistory(playersRaw, tournaments);
        
        let activeList = natPlayers.filter(p => !p.retired).sort((a,b) => b.points - a.points || b.totalPoints - a.totalPoints);
        activeList.forEach((p, idx) => p.nationalRank = idx + 1);
        
        const listWithDiffs = attachDiffsAndForm(natPlayers, globalHist);

        let points = 0, bonusPoints = 0, wins = 0, losses = 0, titles = 0;
        activeList.forEach(p => {
            points += (p.points || 0); bonusPoints += (p.bonusPoints || 0);
            wins += (p.stats?.wins || 0); losses += (p.stats?.losses || 0);
        });
        
        tournaments.forEach(t => {
            if (t.status === 'completed' && t.bracket) {
                const tTier = getTournamentTier(t);
                if (['grand_slam', 'major', 'finals'].includes(tTier)) {
                    let b = []; try { b = typeof t.bracket === 'string' ? JSON.parse(t.bracket) : t.bracket; } catch(e){}
                    const finalMatch = b[b.length - 1]?.[0];
                    if (finalMatch?.winner) {
                        const winner = players.find(p => p.id === finalMatch.winner);
                        if (winner && (winner.nationality || 'UNK') === code) titles++;
                    }
                }
            }
        });

        const finalPlayers = listWithDiffs.map(p => {
            if (!p.retired) return p;
            let peakRank = 9999, peakPoints = 0;
            globalHist.forEach(h => {
                const s = h.standings?.find(st => st.id === p.id);
                if (s && s.rank > 0 && s.rank < peakRank) peakRank = s.rank;
                if (s && s.pts > peakPoints) peakPoints = s.pts;
            });
            return { ...p, peakRank: peakRank === 9999 ? '-' : peakRank, peakPoints: peakPoints || p.points };
        });

        return { 
            processedPlayers: finalPlayers, 
            stats: { points, bonusPoints, wins, losses, titles, activeCount: activeList.length, retiredCount: natPlayers.length - activeList.length }
        };
    }, [players, code, playersRaw, tournaments]);

    return (
        <div className="max-w-7xl mx-auto pb-20 relative flex gap-8 items-start animate-in fade-in duration-300">
            <FloatingNationNav />
            <div className="flex-1 min-w-0 xl:pl-4 space-y-8">
                <button onClick={onBack} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-bold tracking-wide"><ArrowLeft size={16}/> Back to Nations</button>
                
                <div id="nation-overview" className="bg-white/5 backdrop-blur-3xl rounded-[2.5rem] p-8 md:p-10 border border-white/10 flex flex-col md:flex-row gap-8 md:gap-12 relative shadow-[0_20px_60px_rgba(0,0,0,0.5)] items-center md:items-start scroll-mt-8 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="text-8xl md:text-9xl drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)] hover:scale-110 transition-transform duration-500 cursor-default">{getFlag(code)}</div>
                    <div className="flex-1 text-center md:text-left w-full">
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight drop-shadow-md">{getCountryName(code)}</h1>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            <div className="bg-black/20 border border-white/5 p-4 rounded-2xl text-center min-w-[110px] shadow-inner">
                                <div className="text-white/40 font-bold uppercase text-[10px] tracking-widest mb-1.5">Players</div>
                                <div className="text-2xl font-black text-white">{stats.activeCount} <span className="text-xs font-bold text-white/30 block -mt-0.5">+{stats.retiredCount} Ret.</span></div>
                            </div>
                            <div className="bg-black/20 border border-white/5 p-4 rounded-2xl text-center min-w-[110px] shadow-inner">
                                <div className="text-white/40 font-bold uppercase text-[10px] tracking-widest mb-1.5">Active Pts</div>
                                <div className="text-2xl font-black text-gold-400 drop-shadow-[0_0_8px_rgba(212,175,55,0.3)]">{stats.points.toLocaleString()} {stats.bonusPoints > 0 && <span className="text-emerald-400 text-sm ml-1 font-bold">+{stats.bonusPoints}</span>}</div>
                            </div>
                            <div className="bg-black/20 border border-white/5 p-4 rounded-2xl text-center min-w-[110px] shadow-inner">
                                <div className="text-white/40 font-bold uppercase text-[10px] tracking-widest mb-1.5">Major Titles</div>
                                <div className="text-2xl font-black text-sky-400">{stats.titles}</div>
                            </div>
                            <div className="bg-black/20 border border-white/5 p-4 rounded-2xl text-center min-w-[110px] shadow-inner">
                                <div className="text-white/40 font-bold uppercase text-[10px] tracking-widest mb-1.5">Active W-L</div>
                                <div className="text-2xl font-black text-white tabular-nums">{stats.wins}-{stats.losses}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <NationPointsChart code={code} globalHistory={getGlobalHistory(playersRaw, tournaments)} playersRaw={playersRaw} onNavigate={onNavigate} />

                <div id="nation-roster" className="scroll-mt-8 space-y-6">
                    <h2 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight"><PlayersIcon size={24} className="text-gold-500"/> National Roster</h2>
                    <PlayerDataGrid 
                        players={processedPlayers} 
                        tournaments={tournaments} 
                        onSelectPlayer={(id) => onNavigate('players', id)}
                        onNavigate={onNavigate}
                        rankKey="nationalRank"
                        showNationality={false}
                    />
                </div>
                <NationAchievements code={code} players={players} tournaments={tournaments} onNavigate={onNavigate} />
            </div>
        </div>
    );
}

export function NationsView({ players, playersRaw, tournaments, onNavigate }) {
    const safePlayers = playersRaw || players || [];
    const globalHistory = useMemo(() => getGlobalHistory(safePlayers, tournaments), [safePlayers, tournaments]);
    
    const nationStats = useMemo(() => {
        const stats = {};
        
        players.forEach(p => {
            const code = p.nationality || 'UNK';
            if (!stats[code]) stats[code] = { code, players: 0, activePlayers: 0, points: 0, titles: 0 };
            stats[code].players++;
            if (!p.retired) {
                stats[code].activePlayers++;
                stats[code].points += (p.points || 0);
            }
        });

        tournaments.forEach(t => {
            if (t.status === 'completed' && t.bracket) {
                const tTier = getTournamentTier(t);
                if (['grand_slam', 'major', 'finals'].includes(tTier)) {
                    let b = []; try { b = typeof t.bracket === 'string' ? JSON.parse(t.bracket) : t.bracket; } catch(e){}
                    const finalMatch = b[b.length - 1]?.[0];
                    if (finalMatch?.winner) {
                        const winner = players.find(p => p.id === finalMatch.winner);
                        if (winner && stats[winner.nationality || 'UNK']) stats[winner.nationality || 'UNK'].titles++;
                    }
                } else if (tTier === 'nations_league') {
                    let b = []; try { b = typeof t.bracket === 'string' ? JSON.parse(t.bracket) : t.bracket; } catch(e){}
                    const finalTie = b[2]?.[1];
                    if (finalTie?.winner) {
                        let tms = []; try { tms = typeof t.teams === 'string' ? JSON.parse(t.teams) : t.teams; } catch(e){}
                        const winningTeam = tms.find(team => team.id === finalTie.winner);
                        if (winningTeam && stats[winningTeam.flag]) stats[winningTeam.flag].titles++;
                    }
                }
            }
        });

        return Object.values(stats).sort((a, b) => b.points - a.points || b.activePlayers - a.activePlayers);
    }, [players, tournaments]);

    return (
        <div className="max-w-[1400px] mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
            <header className="mb-6 pl-0 xl:pl-4">
                <h1 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3 drop-shadow-md"><NationsIcon size={32} className="text-sky-400 drop-shadow-[0_0_10px_rgba(56,189,248,0.4)]"/> Global Nations</h1>
                <p className="text-white/50 mt-2 font-medium">The arms race for international dominance. Only active players contribute to the current National Points total.</p>
            </header>

            <div className="bg-white/5 backdrop-blur-2xl p-6 md:p-8 rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] mb-8">
                <h2 className="text-2xl font-black text-white flex items-center gap-3 mb-8 tracking-tight"><AnalyticsIcon size={24} className="text-white/40"/> Top Nations Trajectory</h2>
                <TopNationsChart globalHistory={globalHistory} playersRaw={safePlayers} onNavigate={onNavigate} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-2 xl:px-4">
                {nationStats.map((nat, idx) => (
                    <div key={nat.code} onClick={() => onNavigate('nations', null, null, nat.code)} className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 hover:bg-white/10 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group shadow-lg hover:shadow-[0_15px_40px_rgba(0,0,0,0.4)] relative overflow-hidden">
                        <div className="absolute -right-6 -bottom-6 text-9xl opacity-[0.03] group-hover:opacity-10 transition-opacity pointer-events-none drop-shadow-md">
                            {getFlag(nat.code)}
                        </div>
                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <div className="flex items-center gap-4">
                                <span className="text-4xl drop-shadow-md group-hover:scale-110 transition-transform duration-300">{getFlag(nat.code)}</span>
                                <div>
                                    <h3 className="text-xl font-black text-white leading-tight tracking-tight group-hover:text-sky-400 transition-colors">{getCountryName(nat.code)}</h3>
                                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{nat.code}</span>
                                </div>
                            </div>
                            <div className="bg-black/40 px-3 py-1.5 rounded-xl border border-white/5 shadow-inner">
                                <span className="text-gold-500 font-black text-lg">#{idx + 1}</span>
                            </div>
                        </div>
                        <div className="space-y-2 relative z-10">
                            <div className="flex justify-between items-center bg-black/20 p-3 rounded-xl border border-white/5 shadow-inner">
                                <span className="text-white/50 text-[11px] uppercase tracking-widest font-bold">Active Pts</span>
                                <span className="text-gold-400 font-black text-base drop-shadow-sm">{nat.points.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center bg-black/20 p-3 rounded-xl border border-white/5 shadow-inner">
                                <span className="text-white/50 text-[11px] uppercase tracking-widest font-bold">Active Roster</span>
                                <span className="text-white font-black text-base">{nat.activePlayers} <span className="text-white/30 text-xs font-bold">/ {nat.players}</span></span>
                            </div>
                            <div className="flex justify-between items-center bg-black/20 p-3 rounded-xl border border-white/5 shadow-inner">
                                <span className="text-white/50 text-[11px] uppercase tracking-widest font-bold">Major Titles</span>
                                <span className="text-white font-black text-base">{nat.titles}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}