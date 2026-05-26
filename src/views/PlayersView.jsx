import React, { useState, useEffect, useMemo } from 'react';
import { PlayersIcon, Search, Download, Plus, X, GalleryIcon, ArrowLeft, Edit2, Trophy, AnalyticsIcon, UserCircle, CheckCircle, Shuffle, ChevronLeft, ChevronRight, DynamicTrophy, Star, History } from '../components/Icons';
import { PlayerMedia, CountrySelect, FloatingPlayerNav, PlayerFormIndicator } from '../components/SharedUI';
import { IndividualPlayerChart } from '../components/Charts';
import { getFlag, getCountryName, getTournamentTier, getTournamentPointsAndResult, getGlobalHistory, getSeedText, getOrdinalSuffix } from '../utils/helpers';
import { TOURNAMENT_TIERS, ROUND_NAMES } from '../utils/constants';

export function PlayerProfile({ player, players, playersRaw, onBack, tournaments, db, appId, onNavigate, isAdmin }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [editNationality, setEditNationality] = useState('');
    const [editImages, setEditImages] = useState(['', '', '', '']);
    const [editRetired, setEditRetired] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(null);

    useEffect(() => {
        if (player) {
            setEditName(player.name); setEditNationality(player.nationality || 'UNK');
            const imgs = player.images || [player.imageUrl];
            setEditImages([imgs[0] || '', imgs[1] || '', imgs[2] || '', imgs[3] || '']);
            setEditRetired(!!player.retired);
        }
    }, [player]);

    const handleUpdate = async (e) => {
        e.preventDefault(); setIsSaving(true);
        try {
            if (!player) return;
            const validImages = editImages.map(u => u.trim()).filter(Boolean);
            const pRef = window.fb.doc(db, 'artifacts', appId, 'public', 'data', 'players', player.id);
            await window.fb.updateDoc(pRef, { 
                name: editName.trim(), 
                nationality: editNationality, 
                imageUrl: validImages[0] || '', 
                images: validImages,
                retired: editRetired 
            });
            setIsEditing(false);
        } catch (err) { console.error(err); }
        setIsSaving(false);
    };

    const handleDelete = async () => {
        if (!player) return;
        try { 
            onBack();
            await window.fb.deleteDoc(window.fb.doc(db, 'artifacts', appId, 'public', 'data', 'players', player.id)); 
        } 
        catch (err) { console.error(err); }
    };

    const handleNextImg = (e) => { e.stopPropagation(); setLightboxIndex(prev => (prev === player.images.length - 1 ? 0 : prev + 1)); };
    const handlePrevImg = (e) => { e.stopPropagation(); setLightboxIndex(prev => (prev === 0 ? player.images.length - 1 : prev - 1)); };

    const matchHistory = useMemo(() => {
        if (!player) return [];
        let matches = [];
        tournaments.forEach(t => {
            if (t.status !== 'completed') return;
            
            if (t.format === 'atp_finals' || t.format === 'pro_am') {
                let gm = []; let ko = [];
                try { gm = typeof t.groupMatches === 'string' ? JSON.parse(t.groupMatches) : (t.groupMatches || []); } catch(e){}
                try { ko = typeof t.bracket === 'string' ? JSON.parse(t.bracket) : (t.bracket || []); } catch(e){}
                if (!Array.isArray(gm)) gm = []; if (!Array.isArray(ko)) ko = [];
                
                gm.forEach(m => {
                    if (m && (m.p1 === player.id || m.p2 === player.id) && m.winner) {
                        const oppId = m.p1 === player.id ? m.p2 : m.p1;
                        const oppName = players.find(p => p.id === oppId)?.name || 'Unknown';
                        matches.push({ tournamentId: t.id, tournamentName: t.name, tier: getTournamentTier(t), roundName: 'Group Stage', roundIndex: 0, opponentId: oppId, opponentName: oppName, isWin: m.winner === player.id, type: m.type, date: t.completedAt || t.createdAt });
                    }
                });
                ko.forEach((round, rIdx) => {
                    if (!Array.isArray(round)) return;
                    round.forEach(m => {
                        if (m && (m.p1 === player.id || m.p2 === player.id) && m.winner) {
                            const rName = rIdx === ko.length - 1 ? 'Championship' : (rIdx === ko.length - 2 ? 'Semifinals' : 'Quarterfinals');
                            const oppId = m.p1 === player.id ? m.p2 : m.p1;
                            const oppName = players.find(p => p.id === oppId)?.name || 'Unknown';
                            matches.push({ tournamentId: t.id, tournamentName: t.name, tier: getTournamentTier(t), roundName: rName, roundIndex: rIdx + 1, opponentId: oppId, opponentName: oppName, isWin: m.winner === player.id, type: m.type, date: t.completedAt || t.createdAt });
                        }
                    });
                });
            } else if (t.format === 'nations_league') {
                let gm = []; let ko = [];
                try { gm = typeof t.groupMatches === 'string' ? JSON.parse(t.groupMatches) : (t.groupMatches || []); } catch(e){}
                try { ko = typeof t.bracket === 'string' ? JSON.parse(t.bracket) : (t.bracket || []); } catch(e){}
                
                const processTie = (tie, roundName, roundIndex) => {
                    if (!tie || !tie.matches) return;
                    tie.matches.forEach(m => {
                        if (m && (m.p1 === player.id || m.p2 === player.id || m.p1b === player.id || m.p2b === player.id) && m.winner) {
                            const isDoubles = !!m.p1b;
                            const isMyTeamT1 = m.p1 === player.id || m.p1b === player.id;
                            
                            let oppId = isMyTeamT1 ? m.p2 : m.p1;
                            let oppName = players.find(p => p.id === oppId)?.name || 'Unknown';
                            if (isDoubles) {
                                const opp2Id = isMyTeamT1 ? m.p2b : m.p1b;
                                const opp2Name = players.find(p => p.id === opp2Id)?.name || 'Unknown';
                                oppName = `${oppName} & ${opp2Name}`;
                            }
                            
                            const myTeamId = isMyTeamT1 ? tie.t1?.id : tie.t2?.id;
                            const isWin = m.winner === myTeamId;
                            
                            matches.push({ tournamentId: t.id, tournamentName: t.name, tier: 'nations_league', roundName: `${roundName} (${m.name})`, roundIndex, opponentId: oppId, opponentName: oppName, isWin, type: m.type, date: t.completedAt || t.createdAt });
                        }
                    });
                };
                
                gm.forEach(tie => processTie(tie, 'Group Stage', 0));
                ko.forEach((round, rIdx) => {
                    if (!Array.isArray(round)) return;
                    round.forEach((tie, mIdx) => {
                        const rName = rIdx === ko.length - 1 ? (mIdx === 0 ? 'Bronze Medal Match' : 'Championship') : (rIdx === ko.length - 2 ? 'Semifinals' : 'Quarterfinals');
                        processTie(tie, rName, rIdx + 1);
                    });
                });
            } else {
                let parsedBracket = [];
                try { parsedBracket = typeof t.bracket === 'string' ? JSON.parse(t.bracket) : (t.bracket || []); } catch(e){}
                if (!Array.isArray(parsedBracket)) return;
                
                parsedBracket.forEach((round, rIdx) => {
                    if (!Array.isArray(round)) return;
                    round.forEach(m => {
                        if (m && (m.p1 === player.id || m.p2 === player.id) && m.winner && m.type !== 'bye') {
                            const rOffset = 6 - parsedBracket.length;
                            const oppId = m.p1 === player.id ? m.p2 : m.p1;
                            const oppName = players.find(p => p.id === oppId)?.name || 'Unknown';
                            matches.push({ tournamentId: t.id, tournamentName: t.name, tier: getTournamentTier(t), roundName: ROUND_NAMES[rIdx + rOffset], roundIndex: rIdx + rOffset, opponentId: oppId, opponentName: oppName, isWin: m.winner === player.id, type: m.type, date: t.completedAt || t.createdAt });
                        }
                    })
                });
            }
        });
        return matches.sort((a,b) => {
            if (b.date !== a.date) return (b.date || 0) - (a.date || 0);
            return b.roundIndex - a.roundIndex;
        });
    }, [player?.id, tournaments, players]);

    const h2hStats = useMemo(() => {
        if (!player) return [];
        const stats = {};
        matchHistory.forEach(m => {
            if (!stats[m.opponentId]) {
                const opp = players.find(p => p.id === m.opponentId);
                stats[m.opponentId] = {
                    opponentId: m.opponentId,
                    opponentName: m.opponentName,
                    opponentFlag: opp ? getFlag(opp.nationality) : '🏳️',
                    wins: 0,
                    losses: 0
                };
            }
            if (m.isWin) stats[m.opponentId].wins++;
            else stats[m.opponentId].losses++;
        });
        return Object.values(stats).sort((a,b) => (b.wins + b.losses) - (a.wins + a.losses) || b.wins - a.wins);
    }, [matchHistory, players, player?.id]);

    const achievements = useMemo(() => {
        if (!player) return [];
        const list = [];
        tournaments.forEach(t => {
            if (t.status !== 'completed') return;
            const tTier = getTournamentTier(t);
            if (!['grand_slam', 'major', 'finals', 'nations_league'].includes(tTier)) return;
            
            const res = getTournamentPointsAndResult(player.id, t);
            
            if (res.played) {
                let meets = false;
                if (tTier === 'grand_slam' && ['Winner', 'Finalist', 'Final', 'Semifinalist', 'Semifinals'].includes(res.resultStr)) meets = true;
                if (tTier === 'major' && ['Winner', 'Finalist', 'Final'].includes(res.resultStr)) meets = true;
                if (tTier === 'finals' && ['Winner', 'Finalist', 'Final', 'Semifinalist', 'Semifinals'].includes(res.resultStr)) meets = true;
                if (tTier === 'nations_league' && ['Winner', 'Finalist', 'Third Place'].includes(res.resultStr)) meets = true;
                
                if (meets) {
                    list.push({ tournamentId: t.id, tournamentName: t.name, tier: tTier, result: res.resultStr, date: t.completedAt || t.createdAt, hostCountry: t.hostCountry });
                }
            }
        });
        return list.sort((a,b) => (b.date || 0) - (a.date || 0));
    }, [player?.id, tournaments]);

    const rankingHistory = useMemo(() => {
        if (!player) return [];
        const globalHist = getGlobalHistory(playersRaw, tournaments);
        return globalHist.map(h => {
            const pStanding = h.standings.find(s => s.id === player.id);
            const ach = achievements.find(a => a.tournamentId === h.tournamentId);
            
            const t = tournaments.find(tourn => tourn.id === h.tournamentId);
            const res = t ? getTournamentPointsAndResult(player.id, t) : { played: false, pts: 0 };
            
            return {
                tournamentId: h.tournamentId,
                tournamentName: h.tournamentName,
                tier: h.tier,
                isMajorPlus: h.isMajorPlus,
                date: h.date,
                rank: pStanding ? pStanding.rank : 0,
                points: pStanding ? pStanding.pts : 0,
                totalPoints: pStanding ? pStanding.totalPts : 0,
                careerPoints: pStanding ? pStanding.careerPoints : 0,
                tournamentPoints: res.played ? res.pts : 0,
                played: res.played,
                achievement: ach || null
            };
        }).filter(h => h.rank > 0 && h.tier !== 'nations_league');
    }, [player?.id, playersRaw, tournaments, achievements]);

    if (!player) return null;

    const winningCount = h2hStats.filter(h => h.wins > h.losses).length;
    const losingCount = h2hStats.filter(h => h.losses > h.wins).length;
    const tiedCount = h2hStats.filter(h => h.wins === h.losses).length;

    return (
        <div className="max-w-6xl mx-auto pb-20 relative animate-in fade-in duration-300">
            {!isEditing && <FloatingPlayerNav hasGallery={player.images?.length > 1} />}

            <div className="mb-6 xl:pl-4">
                <button onClick={onBack} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-bold tracking-wide"><ArrowLeft size={16}/> Back to Roster</button>
            </div>

            {isEditing ? (
                <form onSubmit={handleUpdate} className="bg-black/40 backdrop-blur-3xl rounded-3xl p-8 space-y-6 max-w-4xl mx-auto shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-white/10 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <h2 className="text-2xl font-black text-white tracking-tight border-b border-white/10 pb-4">Edit Player Profile</h2>
                    <div className="grid md:grid-cols-2 gap-6 relative z-50">
                        <div>
                            <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Player Name</label>
                            <input type="text" className="w-full bg-white/5 p-3.5 rounded-xl text-white font-bold border border-white/10 focus:border-gold-500/50 focus:bg-white/10 shadow-inner transition-all" value={editName} onChange={e => setEditName(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Nationality</label>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-1 shadow-inner">
                                <CountrySelect value={editNationality} onChange={setEditNationality} />
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex justify-between items-center bg-black/20 p-6 rounded-2xl border border-white/5 shadow-inner">
                        <div>
                            <div className="font-black text-white/90">Player Status</div>
                            <div className="text-xs text-white/50 mt-1 font-medium">Retired players are hidden from tournament bracket generation.</div>
                        </div>
                        <button type="button" onClick={() => setEditRetired(!editRetired)} className={`px-6 py-2.5 rounded-xl font-black tracking-widest uppercase text-xs transition-all border shadow-md ${editRetired ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 shadow-rose-500/10' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-emerald-500/10'}`}>
                            {editRetired ? 'Retired' : 'Active'}
                        </button>
                    </div>

                    <div className="bg-black/20 p-6 rounded-2xl border border-white/5 shadow-inner">
                        <h3 className="font-black text-white/80 mb-5 text-xs uppercase tracking-widest flex items-center gap-2"><GalleryIcon size={16} className="text-gold-400" /> Media Links & Preview</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                            {editImages.map((u, i) => (
                                <div key={i} className="space-y-3">
                                    <input type="text" placeholder={`Image URL ${i+1}`} className="w-full bg-white/5 p-3 rounded-lg text-xs font-medium text-white/90 border border-white/10 focus:border-gold-500/50 shadow-inner transition-colors" value={u} onChange={e => { const ni = [...editImages]; ni[i] = e.target.value; setEditImages(ni); }} />
                                    <div className="w-full aspect-[3/4] bg-black/60 rounded-xl border border-white/10 overflow-hidden flex items-center justify-center shadow-inner relative group">
                                        {u ? <PlayerMedia url={u} className="w-full h-full object-cover group-hover:scale-105 transition-transform" /> : <span className="text-white/20 font-black text-[10px] uppercase tracking-widest">SLOT {i+1}</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-6 border-t border-white/10">
                        <button type="button" onClick={() => setShowDelete(true)} className="text-rose-400 font-bold hover:text-rose-300 transition-colors text-sm px-4">Delete Player</button>
                        <button type="submit" className="bg-gold-500 px-8 py-3.5 rounded-xl text-black font-black tracking-wide hover:bg-gold-400 transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)]">Save Changes</button>
                    </div>
                    {showDelete && (
                        <div className="mt-4 p-5 border border-rose-500/30 bg-rose-500/10 backdrop-blur-md rounded-2xl flex justify-between items-center animate-in fade-in zoom-in duration-200 shadow-inner">
                            <span className="text-rose-400 font-bold text-sm">Are you sure? This cannot be undone.</span>
                            <div className="flex gap-3">
                                <button type="button" onClick={handleDelete} className="bg-rose-500 hover:bg-rose-400 text-white transition-colors px-6 py-2.5 rounded-xl font-bold text-sm shadow-md">Yes, Delete</button>
                                <button type="button" onClick={() => setShowDelete(false)} className="text-white/60 hover:text-white border border-white/20 hover:bg-white/10 px-6 py-2.5 rounded-xl text-sm transition-colors font-bold backdrop-blur-md">Cancel</button>
                            </div>
                        </div>
                    )}
                </form>
            ) : (
                <div className="flex flex-col gap-8 xl:pl-4">
                    
                    {/* --- IMMERSIVE GLASS HERO BANNER --- */}
                    <div id="player-overview" className="relative rounded-[2.5rem] overflow-hidden border border-white/10 bg-black/40 backdrop-blur-3xl shadow-[0_30px_60px_rgba(0,0,0,0.6)] mb-2 scroll-mt-8 group/hero">
                        {/* Blurred Background Element */}
                        <div className="absolute inset-0 z-0 overflow-hidden">
                            <PlayerMedia url={player.images?.[0] || player.imageUrl} className={`w-full h-full object-cover blur-[80px] opacity-40 scale-125 transition-transform duration-1000 ${player.retired ? 'grayscale' : ''}`} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                        </div>

                        {isAdmin && (
                            <button onClick={() => setIsEditing(true)} className="absolute top-6 right-6 bg-white/5 backdrop-blur-md p-3 rounded-xl border border-white/10 hover:border-gold-500/50 transition-colors z-20 shadow-lg text-white/50 hover:text-gold-400">
                                <Edit2 size={18} />
                            </button>
                        )}

                        <div className="relative z-10 px-8 pt-12 pb-10 flex flex-col items-center text-center">
                            <div className="w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden border-[4px] border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.6)] bg-black relative mb-6">
                                <PlayerMedia url={player.images?.[0] || player.imageUrl} className={`w-full h-full object-cover ${player.retired ? 'grayscale opacity-80' : ''}`} />
                            </div>

                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-center justify-center gap-4 mb-3 drop-shadow-lg">
                                {player.name}
                                {player.retired && <span className="text-[10px] px-2.5 py-1 bg-rose-500/30 text-rose-200 border border-rose-500/40 rounded-md uppercase tracking-widest align-middle flex items-center gap-1.5 shadow-sm backdrop-blur-md"><span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span> RETIRED</span>}
                            </h1>
                            
                            <div className="text-xl md:text-2xl text-white/80 font-bold flex items-center gap-3 mb-10 cursor-pointer hover:text-white transition-colors" onClick={() => onNavigate('nations', null, null, player.nationality)}>
                                <span className="text-3xl drop-shadow-md leading-none">{getFlag(player.nationality)}</span> 
                                <span className="tracking-wide">{getCountryName(player.nationality)}</span>
                            </div>

                            {/* Vitals Grid (Glassmorphism) */}
                            <div className="flex flex-wrap justify-center gap-4 w-full max-w-3xl">
                                <div className={`bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-2xl flex-1 min-w-[120px] shadow-xl ${player.retired ? 'opacity-50' : ''}`}>
                                    <div className="text-[10px] text-white/40 uppercase tracking-widest font-black mb-1.5">Rank</div>
                                    <div className="text-3xl font-medium text-white tabular-nums tracking-tighter drop-shadow-sm">{player.retired ? '-' : `#${player.rank}`}</div>
                                </div>
                                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-2xl flex-1 min-w-[120px] shadow-xl relative overflow-hidden group/pts">
                                    <div className="absolute inset-0 bg-gold-500/10 opacity-0 group-hover/pts:opacity-100 transition-opacity"></div>
                                    <div className="text-[10px] text-white/40 uppercase tracking-widest font-black mb-1.5 relative z-10">Points</div>
                                    <div className="text-3xl font-black text-gold-400 tabular-nums tracking-tight relative z-10 drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]">
                                        {player.points.toLocaleString()}
                                        {player.bonusPoints > 0 && <span className="text-emerald-400 text-sm ml-1 font-bold">+{player.bonusPoints}</span>}
                                    </div>
                                </div>
                                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-2xl flex-1 min-w-[120px] shadow-xl">
                                    <div className="text-[10px] text-white/40 uppercase tracking-widest font-black mb-1.5">W-L</div>
                                    <div className="text-3xl font-bold text-white/90 tabular-nums tracking-tight drop-shadow-sm">{player.stats.wins}-{player.stats.losses}</div>
                                </div>
                                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-2xl flex-1 min-w-[120px] shadow-xl">
                                    <div className="text-[10px] text-white/40 uppercase tracking-widest font-black mb-1.5">Played</div>
                                    <div className="text-3xl font-bold text-white/90 tabular-nums tracking-tight drop-shadow-sm">{player.stats.totalPlayed}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- 3-COLUMN GLASS DATA GRID --- */}
                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                        
                        {/* Scoring Tournaments Feed */}
                        <div id="player-tournaments" className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] h-[400px] flex flex-col scroll-mt-8">
                            <div className="p-6 border-b border-white/10 shrink-0 bg-black/20 rounded-t-3xl">
                                <h2 className="text-xl font-black text-white flex items-center gap-3 tracking-tight"><Star size={20} className="text-gold-500"/> Scoring Tournaments</h2>
                            </div>
                            <div className="overflow-y-auto flex-1 custom-scrollbar p-3">
                                <div className="space-y-2">
                                    {/* Filter out nations_league before mapping the feed */}
                                    {player.recentTournaments.filter(t => t.tier !== 'nations_league').map((t, i) => {
                                        const tierConf = TOURNAMENT_TIERS[t.tier || 'major'];
                                        return (
                                            <div key={i} onClick={() => onNavigate('tournaments', null, t.tournamentId)} className="p-4 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-white/10 border border-transparent hover:border-white/5 transition-all group shadow-sm">
                                                <div className="min-w-0 pr-4">
                                                    <div className="flex items-center gap-2 mb-1.5">
                                                        <span className={`text-[9px] uppercase font-black tracking-widest px-2 py-0.5 rounded shadow-sm ${tierConf?.bg || 'bg-white/10'} ${tierConf?.color || 'text-white/60'}`}>{tierConf?.name || 'Tournament'}</span>
                                                        <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">{t.result}</span>
                                                    </div>
                                                    <div className="font-bold text-sm text-white/90 truncate group-hover:text-white transition-colors">{t.tournamentName} <span className="text-white/30 text-[10px] uppercase ml-1 font-bold">({getOrdinalSuffix(t.playedNumber)})</span></div>
                                                </div>
                                                <div className="font-black text-lg text-gold-400 tabular-nums shrink-0">+{t.points}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Vertical Match Timeline */}
                        <div id="player-matches" className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] h-[400px] flex flex-col scroll-mt-8">
                            <div className="p-6 border-b border-white/10 shrink-0 bg-black/20 rounded-t-3xl">
                                <h2 className="text-xl font-black text-white flex items-center gap-3 tracking-tight"><History size={20} className="text-emerald-400"/> Match History</h2>
                            </div>
                            <div className="overflow-y-auto flex-1 custom-scrollbar p-3">
                                <div className="space-y-2">
                                    {matchHistory.map((m, i) => {
                                        const tierConf = TOURNAMENT_TIERS[m.tier];
                                        return (
                                            <div key={i} onClick={() => onNavigate('tournaments', null, m.tournamentId)} className="relative p-4 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-white/10 border border-transparent hover:border-white/5 transition-all group overflow-hidden shadow-sm">
                                                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${m.isWin ? 'bg-emerald-500/80' : 'bg-rose-500/80'}`}></div>
                                                <div className="min-w-0 pr-3 pl-3">
                                                    <div className="flex items-center gap-2 mb-1.5">
                                                        <span className={`text-[9px] uppercase font-black tracking-widest ${tierConf?.color || 'text-white/40'}`}>{tierConf?.name || 'Event'}</span>
                                                        <span className="text-white/20 text-[9px]">•</span>
                                                        <span className="text-[9px] font-bold text-white/50">{m.roundName}</span>
                                                    </div>
                                                    <div className="font-bold text-sm text-white/80 truncate mb-1.5">{m.tournamentName}</div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <span className={`font-black ${m.isWin ? 'text-emerald-400' : 'text-rose-400'}`}>{m.isWin ? 'W' : 'L'}</span>
                                                        <span className="text-white/30 text-xs font-bold">vs</span>
                                                        <span className="text-white/90 font-bold truncate">{m.opponentName}</span>
                                                    </div>
                                                </div>
                                                <div className="shrink-0 flex flex-col items-end gap-2">
                                                    <span className={`text-[9px] px-2 py-1 rounded uppercase font-black tracking-widest shadow-sm ${m.type === 'lopsided' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-white/10 text-white/60 border border-white/20'}`}>{m.type === 'lopsided' ? 'Lop' : 'Close'}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {matchHistory.length === 0 && <div className="p-6 text-center text-white/40 text-sm font-medium">No matches recorded.</div>}
                                </div>
                            </div>
                        </div>

                        {/* Head-to-Head List */}
                        <div id="player-h2h" className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] h-[400px] flex flex-col md:col-span-2 xl:col-span-1 scroll-mt-8">
                            <div className="p-6 border-b border-white/10 shrink-0 flex justify-between items-center bg-black/20 rounded-t-3xl">
                                <h2 className="text-xl font-black text-white flex items-center gap-3 tracking-tight"><PlayersIcon size={20} className="text-sky-400"/> Head-to-Head</h2>
                                <div className="text-[10px] text-white/50 uppercase font-black tracking-widest bg-white/10 px-2.5 py-1 rounded-md border border-white/10 shadow-inner">
                                    <span className="text-emerald-400">{winningCount}</span> - <span className="text-rose-400">{losingCount}</span> - <span className="text-white/60">{tiedCount}</span>
                                </div>
                            </div>
                            <div className="overflow-y-auto flex-1 custom-scrollbar p-3">
                                <div className="space-y-2">
                                    {h2hStats.length === 0 ? (
                                        <div className="p-6 text-center text-white/40 text-sm font-medium">No match records yet.</div>
                                    ) : (
                                        h2hStats.map(h => {
                                            const isPos = h.wins > h.losses;
                                            const isNeg = h.losses > h.wins;
                                            const color = isPos ? 'text-emerald-400' : (isNeg ? 'text-rose-400' : 'text-white/40');
                                            return (
                                                <div key={h.opponentId} onClick={() => onNavigate('players', h.opponentId)} className="p-4 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-white/10 border border-transparent hover:border-white/5 transition-all group shadow-sm">
                                                    <div className="flex items-center gap-3 min-w-0 pr-4">
                                                        <span className="text-xl drop-shadow-md shrink-0">{h.opponentFlag}</span>
                                                        <span className="font-bold text-sm text-white/80 truncate group-hover:text-white transition-colors">{h.opponentName}</span>
                                                    </div>
                                                    <div className={`font-black tabular-nums text-base shrink-0 ${color}`}>
                                                        {h.wins} - {h.losses}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Full-Width Interactive Grid Gallery */}
                    {player.images?.length > 1 && (
                        <div id="player-gallery" className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] scroll-mt-8">
                            <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3 tracking-tight"><GalleryIcon size={24} className="text-white/50"/> Media Gallery</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                                {player.images.map((img, i) => {
                                    if (!img) return null;
                                    return (
                                    <div key={i} onClick={() => setLightboxIndex(i)} className="w-full aspect-[3/4] cursor-pointer rounded-2xl overflow-hidden bg-black/40 shadow-lg border border-white/10 relative group">
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors z-10 duration-300"></div>
                                        <PlayerMedia url={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Lightbox Modal */}
                    {lightboxIndex !== null && (
                        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-3xl flex items-center justify-center animate-in fade-in duration-200" onClick={() => setLightboxIndex(null)}>
                            <button className="absolute top-6 right-6 text-white/50 hover:text-white bg-white/10 p-4 rounded-full backdrop-blur-md transition-colors z-50 hover:bg-white/20" onClick={(e) => { e.stopPropagation(); setLightboxIndex(null); }}>
                                <X size={24} />
                            </button>
                            
                            <button className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 text-white/50 hover:text-white bg-white/10 p-4 rounded-full backdrop-blur-md transition-all z-50 hover:scale-110 hover:bg-white/20" onClick={handlePrevImg}>
                                <ChevronLeft size={32} />
                            </button>
                            
                            {/* THE SPLIT LOGIC FIX */}
                            {(() => {
                                const url = player.images[lightboxIndex];
                                const cleanUrl = url ? url.split('?')[0].split('#')[0] : '';
                                
                                const isVideo = url && (
                                    url.includes('tiktok.com') || 
                                    url.includes('youtube.com') || 
                                    url.includes('youtu.be') || 
                                    cleanUrl.match(/\.(mp4|webm|ogg)$/i) ||
                                    // NEW: Catches sneaky Reddit links that hide the mp4 request in the tracking junk!
                                    url.includes('format=mp4') 
                                );

                                return isVideo ? (
                                    // VIDEO: Gets a strict 9:16 vertical box
                                    <div className="h-[85vh] aspect-[9/16] max-w-[90vw] rounded-2xl overflow-hidden border border-white/10 bg-black shadow-[0_0_100px_rgba(0,0,0,0.8)]" onClick={e => e.stopPropagation()}>
                                        <PlayerMedia url={url} className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    // IMAGE: Raw <img> natively shrink-wraps!
                                    <img 
                                        src={url} 
                                        onClick={e => e.stopPropagation()}
                                        referrerPolicy="no-referrer"
                                        className="h-[85vh] w-auto max-w-[90vw] object-contain rounded-2xl border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] bg-black" 
                                    />
                                );
                            })()}
                            
                            <button className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 text-white/50 hover:text-white bg-white/10 p-4 rounded-full backdrop-blur-md transition-all z-50 hover:scale-110 hover:bg-white/20" onClick={handleNextImg}>
                                <ChevronRight size={32} />
                            </button>

                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 font-black tracking-widest text-sm bg-white/10 px-8 py-3 rounded-full backdrop-blur-md border border-white/10 shadow-lg">
                                {lightboxIndex + 1} / {player.images.filter(Boolean).length}
                            </div>
                        </div>
                    )}

                    {/* Glowing Trophy Cabinet */}
                    <div id="player-achievements" className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] scroll-mt-8">
                        <h2 className="text-2xl font-black text-white flex items-center gap-3 mb-8 tracking-tight"><Trophy size={24} className="text-gold-500"/> Trophy Cabinet</h2>
                        {achievements.length === 0 ? (
                            <p className="text-white/40 text-sm font-medium italic text-center py-8">No major hardware collected yet. Reaching Semifinals in Grand Slams/Internationals, or Finals in Majors will unlock achievements here.</p>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                {achievements.map((ach, i) => (
                                    <div key={i} onClick={() => onNavigate('tournaments', null, ach.tournamentId)} className="relative bg-black/20 border border-white/5 p-6 rounded-3xl flex flex-col items-center text-center cursor-pointer transition-all duration-300 group hover:-translate-y-2 hover:bg-white/10 shadow-inner">
                                        {/* Ambient Hover Glow behind Trophy */}
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none rounded-full" style={{ background: `radial-gradient(circle, ${TOURNAMENT_TIERS[ach.tier]?.hex || '#d4af37'}30 0%, transparent 70%)` }}></div>
                                        
                                        <DynamicTrophy tier={ach.tier} result={ach.result} country={ach.hostCountry} size={64} className="mb-5 transition-transform duration-500 group-hover:scale-110 drop-shadow-xl relative z-10" />
                                        
                                        <span className={`text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-md mb-3 relative z-10 shadow-sm ${TOURNAMENT_TIERS[ach.tier]?.bg || 'bg-white/10'} ${TOURNAMENT_TIERS[ach.tier]?.color || 'text-white/60'}`}>{TOURNAMENT_TIERS[ach.tier].name}</span>
                                        <div className="font-black text-white text-base group-hover:text-white transition-colors relative z-10">{ach.result}</div>
                                        <div className="text-xs text-white/50 mt-1.5 relative z-10 font-bold px-2">{ach.tournamentName}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Charts Wrapper */}
                    <div id="player-charts" className="space-y-8 scroll-mt-8">
                        <div className="bg-white/5 backdrop-blur-2xl p-8 rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                            <h2 className="text-2xl font-black text-white flex items-center gap-3 mb-8 tracking-tight"><AnalyticsIcon size={24} className="text-gold-500"/> Career Ranking Trajectory</h2>
                            <IndividualPlayerChart history={rankingHistory} type="rank" filterPlayed={false} totalPlayersCount={players.length} isRetired={player.retired} />
                        </div>
                        
                        <div className="bg-white/5 backdrop-blur-2xl p-8 rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                            <h2 className="text-2xl font-black text-white flex items-center gap-3 mb-3 tracking-tight"><AnalyticsIcon size={24} className="text-gold-500"/> Rolling 20-Tournament Points</h2>
                            <p className="text-white/50 text-xs font-medium mb-8 max-w-4xl leading-relaxed">
                                The solid line shows total rolling points for events attended. The blue dotted line shows the exact points earned at each specific event. Minor events (Pro/Challenger) do not consume the 20-tournament limit and are marked with smaller silver dots.
                            </p>
                            <IndividualPlayerChart history={rankingHistory} type="points" filterPlayed={true} totalPlayersCount={players.length} isRetired={player.retired} />
                        </div>
                        
                        <div className="bg-white/5 backdrop-blur-2xl p-8 rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                            <h2 className="text-2xl font-black text-white flex items-center gap-3 mb-8 tracking-tight"><AnalyticsIcon size={24} className="text-gold-500"/> Career Points Accumulation</h2>
                            <IndividualPlayerChart history={rankingHistory} type="careerPoints" filterPlayed={true} totalPlayersCount={players.length} isRetired={player.retired} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export function PlayersView({ players, onSelectPlayer, db, appId, isAdmin }) {
    const [newPlayerName, setNewPlayerName] = useState('');
    const [newPlayerNationality, setNewPlayerNationality] = useState('');
    const [newPlayerImages, setNewPlayerImages] = useState(['', '', '', '']);
    const [isAdding, setIsAdding] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const displayedPlayers = useMemo(() => {
        let filtered = [...players]; 
        
        if (searchQuery.trim()) {
            filtered = filtered.filter(p => 
                (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (p.nationality || '').toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        
        return filtered.sort((a, b) => {
            if (a.retired !== b.retired) return a.retired ? 1 : -1;
            return (a.name || '').localeCompare(b.name || '');
        });
    }, [players, searchQuery]);

    const handleAddPlayer = async (e) => {
        e.preventDefault(); if (!newPlayerName.trim()) return;
        setIsAdding(true);
        try {
            const validImages = newPlayerImages.map(url => url.trim()).filter(Boolean);
            const playersRef = window.fb.collection(db, 'artifacts', appId, 'public', 'data', 'players');
            await window.fb.addDoc(playersRef, { 
                name: newPlayerName.trim(), 
                nationality: newPlayerNationality || 'UNK', 
                imageUrl: validImages[0] || '', 
                images: validImages, 
                createdAt: Date.now(),
                retired: false
            });
            setNewPlayerName(''); setNewPlayerNationality(''); setNewPlayerImages(['', '', '', '']); setShowAddForm(false);
        } catch (err) { console.error(err); }
        setIsAdding(false);
    };

    const exportToCSV = () => {
        const headers = ['Rank', 'Name', 'Nationality', 'Status', 'Official Points', 'Bonus Points', 'Wins', 'Losses'];
        const rows = players.map(p => [
            p.retired ? '-' : p.rank,
            `"${p.name}"`,
            p.nationality || 'UNK',
            p.retired ? 'Retired' : 'Active',
            p.points || 0,
            p.bonusPoints || 0,
            p.stats?.wins || 0,
            p.stats?.losses || 0
        ]);
        const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "snb_tour_players_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="max-w-[1400px] mx-auto space-y-8 pb-20">
            {/* GLASS COMMAND CENTER */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-3xl p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-20">
                <div>
                    <h1 className="text-3xl font-bold text-white shrink-0 flex items-center gap-3 drop-shadow-md">
                        <PlayersIcon size={32} className="text-gold-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]"/> Player Roster
                    </h1>
                    <p className="text-white/60 mt-1.5 text-sm font-medium tracking-wide">Complete directory of all registered competitors.</p>
                </div>
                
                <div className="flex flex-col md:flex-row gap-3 w-full lg:w-auto">
                    <div className="relative w-full md:w-64 group">
                        <input 
                            type="text" 
                            placeholder="Search players..." 
                            className="bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 pl-10 text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 focus:bg-black/40 w-full transition-all duration-300 backdrop-blur-md shadow-inner"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-gold-400 transition-colors" />
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <button onClick={exportToCSV} className="flex-1 md:flex-none bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 whitespace-nowrap transition-all duration-300 text-white/80 hover:text-white font-medium backdrop-blur-md shadow-sm">
                            <Download size={16}/> Export
                        </button>
                        {isAdmin && (
                            <button onClick={() => setShowAddForm(!showAddForm)} className="flex-1 md:flex-none bg-gold-500/20 hover:bg-gold-500/30 border border-gold-500/30 px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 whitespace-nowrap transition-all duration-300 text-gold-300 font-bold backdrop-blur-md shadow-[0_0_15px_rgba(234,179,8,0.15)] hover:shadow-[0_0_25px_rgba(234,179,8,0.3)]">
                                {showAddForm ? <X size={20}/> : <Plus size={20}/>} {showAddForm ? 'Cancel' : 'Add Player'}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* GLASS ADD PLAYER FORM */}
            {showAddForm && (
                <div className="relative z-10 -mt-4">
                    <form onSubmit={handleAddPlayer} className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl space-y-6 shadow-[0_20px_40px_rgb(0,0,0,0.3)] animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="grid md:grid-cols-2 gap-5 relative z-50">
                            <input type="text" placeholder="Player Name..." required className="bg-black/20 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 focus:bg-black/40 transition-all duration-300 shadow-inner backdrop-blur-md" value={newPlayerName} onChange={e => setNewPlayerName(e.target.value)} />
                            <div className="bg-black/20 border border-white/10 rounded-xl p-1 shadow-inner backdrop-blur-md">
                                <CountrySelect value={newPlayerNationality} onChange={setNewPlayerNationality} />
                            </div>
                        </div>
                        
                        <div className="bg-black/20 p-5 rounded-2xl border border-white/10 shadow-inner backdrop-blur-md">
                            <h3 className="font-bold text-white/80 mb-5 text-sm uppercase tracking-widest flex items-center gap-2">
                                <GalleryIcon size={16} className="text-gold-400"/> Media Links & Preview
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                                {[0,1,2,3].map(i => (
                                    <div key={i} className="space-y-3">
                                        <input type="text" placeholder={`Link or Embed Code ${i+1}`} className="w-full bg-white/5 p-2.5 rounded-lg text-xs text-white placeholder-white/40 border border-white/10 focus:border-gold-500/50 transition-all duration-300" value={newPlayerImages[i]} onChange={e => { const ni = [...newPlayerImages]; ni[i] = e.target.value; setNewPlayerImages(ni); }} />
                                        <div className="w-full aspect-[3/4] bg-black/40 rounded-xl border border-white/10 overflow-hidden flex items-center justify-center shadow-inner relative">
                                            {newPlayerImages[i] ? <PlayerMedia url={newPlayerImages[i]} className="w-full h-full object-cover" /> : <span className="text-white/20 font-bold text-[10px] uppercase tracking-widest">SLOT {i+1}</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button type="submit" disabled={isAdding} className="bg-gold-500/80 hover:bg-gold-400 border border-gold-400/50 px-8 py-3 rounded-xl font-bold text-royal-950 transition-all duration-300 disabled:opacity-50 shadow-[0_0_20px_rgba(234,179,8,0.3)] backdrop-blur-md">
                                {isAdding ? 'Saving...' : 'Save Profile'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {displayedPlayers.map((p, index) => {
                    const showRetiredDivider = p.retired && (index === 0 || !displayedPlayers[index - 1].retired);
                    
                    return (
                        <React.Fragment key={p.id}>
                            {/* GLASS HALL OF FAME DIVIDER */}
                            {showRetiredDivider && (
                                <div className="col-span-full mt-10 mb-6 flex items-center gap-4 px-4">
                                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                                    <div className="bg-white/5 backdrop-blur-md border border-white/10 px-5 py-2 rounded-full text-white/70 text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg">
                                        <Trophy size={14} className="text-royal-400" /> Alumni
                                    </div>
                                    <div className="h-px flex-1 bg-gradient-to-l from-transparent via-white/20 to-transparent"></div>
                                </div>
                            )}
                            
                            {/* VISION-OS GLASS PLAYER CARD */}
                            <div 
                                onClick={() => onSelectPlayer(p.id)} 
                                className={`group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer bg-black/40 border border-white/10 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:border-white/20 ${p.retired ? 'grayscale opacity-75 hover:grayscale-[0.2] hover:opacity-100' : ''}`}
                            >
                                {/* Background Image */}
                                <div className="absolute inset-0 bg-black/20">
                                    <PlayerMedia url={p.imageUrl || (p.images ? p.images[0] : '')} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                                </div>
                                
                                {/* Top Badges (Frosted Pills) */}
                                <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
                                    {!p.retired && (
                                        <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-white font-black text-xs shadow-lg flex items-center gap-1">
                                            <span className="text-white/60 font-normal">#</span>{p.rank}
                                        </div>
                                    )}
                                    {p.retired && (
                                        <div className="bg-[#be123c]/40 backdrop-blur-md text-white px-2.5 py-1 rounded-full border border-[#be123c]/50 text-[9px] uppercase tracking-widest font-bold shadow-lg">
                                            Retired
                                        </div>
                                    )}
                                </div>

                                {/* Bottom Glass Information Pane */}
                                <div className="absolute bottom-2 left-2 right-2 p-3.5 bg-black/50 backdrop-blur-xl border border-white/10 rounded-xl transition-all duration-500 shadow-lg transform translate-y-0 group-hover:-translate-y-1">
                                    <h3 className="text-lg font-black text-white leading-tight mb-1 group-hover:text-gold-400 transition-colors drop-shadow-md truncate">
                                        {p.name}
                                    </h3>
                                    <div className="flex items-center gap-2 text-white/70 mb-3">
                                        <span className="text-base drop-shadow-sm leading-none">{getFlag(p.nationality)}</span>
                                        <span className="font-bold tracking-widest uppercase text-[9px] truncate">{getCountryName(p.nationality)}</span>
                                    </div>

                                    {/* Stat Grid with ultra-thin divider */}
                                    <div className="grid grid-cols-2 gap-2 border-t border-white/10 pt-2.5">
                                        <div>
                                            <div className="text-[8px] text-white/50 uppercase tracking-widest font-bold mb-0.5">Points</div>
                                            <div className="text-sm font-black text-white truncate group-hover:text-gold-400 transition-colors">
                                                {p.points.toLocaleString()}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-[8px] text-white/50 uppercase tracking-widest font-bold mb-0.5">W-L</div>
                                            <div className="text-sm font-black text-white tabular-nums">{p.stats.wins}-{p.stats.losses}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>
                    );
                })}
                {displayedPlayers.length === 0 && (
                    <div className="col-span-full text-center py-20 border border-white/10 rounded-3xl bg-white/5 backdrop-blur-sm">
                        <Search className="w-12 h-12 text-white/20 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">No players found</h3>
                        <p className="text-white/50 text-sm">Try adjusting your search query.</p>
                    </div>
                )}
            </div>
        </div>
    );
}