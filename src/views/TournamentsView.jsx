import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Plus, X, TournamentsIcon, Settings, ArrowLeft, Trophy, Shuffle, NationsIcon, DynamicTrophy, History, UserCircle, CheckCircle, Shield } from '../components/Icons';
import { GlassDropdown, GlassTabs, CountrySelect, PlayerMedia, TierBadge } from '../components/SharedUI';
import { getFlag, getCountryName, getTournamentTier, getDrawSize, getSeedText, generateKnockoutDraw, generateATPFinalsDraw, generateProAmDraw, generateNationsDraw, calcGroupStandings, generateQualifyingDraw } from '../utils/helpers';
import { TOURNAMENT_TIERS, ROUND_NAMES } from '../utils/constants';

export function ResolveMatchModal({ resolvingMatch, setResolvingMatch, submitResult, handleRandomize, players, allTournaments = [], tournament, tierConf, onNavigate }) {
    const [p1ImgIdx, setP1ImgIdx] = useState(0);
    const [p2ImgIdx, setP2ImgIdx] = useState(0);

    useEffect(() => { if (resolvingMatch) { setP1ImgIdx(0); setP2ImgIdx(0); } }, [resolvingMatch]);

    if (!resolvingMatch) return null;

    const getPlayer = (id) => players.find(p => p.id === id) || { name: 'TBD', rank: '-', points: 0, nationality: 'UNK' };
    const getImages = (p) => (p && p.images && p.images.length > 0) ? p.images : (p && p.imageUrl ? [p.imageUrl] : []);

    const matchH2H = (() => {
        if (!resolvingMatch || !resolvingMatch.p1 || !resolvingMatch.p2) return { p1Wins: 0, p2Wins: 0, total: 0 };
        let p1Wins = 0, p2Wins = 0, total = 0;
        
        allTournaments.forEach(t => {
            let mList = []; 
            
            // Parse all possible match locations safely
            let gm = []; try { gm = typeof t.groupMatches === 'string' ? JSON.parse(t.groupMatches) : (t.groupMatches || []); } catch(e){}
            let ko = []; try { ko = typeof t.bracket === 'string' ? JSON.parse(t.bracket) : (t.bracket || []); } catch(e){}
            let q = [];  try { q  = typeof t.bracket_q === 'string' ? JSON.parse(t.bracket_q) : (t.bracket_q || []); } catch(e){}
            
            // UNIVERSAL SCOOP: Throw every match from this tournament into one giant list!
            if (Array.isArray(gm)) mList.push(...gm);
            if (Array.isArray(ko)) mList.push(...ko.flat());
            if (Array.isArray(q))  mList.push(...q.flat());
            
            mList.forEach(m => {
                if (m && m.winner && m.type !== 'bye' && ((m.p1 === resolvingMatch.p1 && m.p2 === resolvingMatch.p2) || (m.p1 === resolvingMatch.p2 && m.p2 === resolvingMatch.p1))) {
                    total++; 
                    if (m.winner === resolvingMatch.p1) p1Wins++; 
                    else if (m.winner === resolvingMatch.p2) p2Wins++;
                }
            });
        });
        return { p1Wins, p2Wins, total };
    })();

    const IconDom = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>;
    const IconClose = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
            <div className="w-full max-w-5xl bg-white/10 backdrop-blur-3xl rounded-[2.5rem] border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between px-8 py-5 border-b border-white/10 bg-black/20">
                    <div className="flex items-center gap-6">
                        <div>
                            <h2 className="text-2xl font-black text-white tracking-tight drop-shadow-sm">Resolve Match</h2>
                            <p className="text-white/60 text-[10px] mt-1 font-bold uppercase tracking-widest">{tournament.name}</p>
                        </div>
                        <div className="hidden md:block border-l border-white/10 pl-6">
                            {matchH2H.total > 0 ? (
                                <div className="bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-[11px] font-bold text-white/70 shadow-inner flex items-center gap-2 backdrop-blur-md">
                                    H2H: 
                                    <span className="text-white">{getPlayer(resolvingMatch.p1).name}</span> 
                                    <span className="px-2.5 py-0.5 rounded text-black font-black" style={{ backgroundColor: tierConf?.hex || '#d4af37' }}>{matchH2H.p1Wins}-{matchH2H.p2Wins}</span> 
                                    <span className="text-white">{getPlayer(resolvingMatch.p2).name}</span>
                                </div>
                            ) : (
                                <div className="bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-[10px] font-bold text-white/50 uppercase tracking-widest shadow-inner backdrop-blur-md">
                                    First Career Meeting
                                </div>
                            )}
                        </div>
                    </div>
                    <button onClick={() => setResolvingMatch(null)} className="w-10 h-10 bg-white/5 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors text-white border border-white/10 backdrop-blur-md">
                        <X size={20} />
                    </button>
                </div>

                <div className="relative flex flex-col md:flex-row p-6 md:p-10 gap-8 md:gap-16 justify-center items-stretch bg-gradient-to-b from-transparent to-black/40">
                    <div className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none hidden md:flex">
                        <div className="w-16 h-16 bg-black/60 border border-white/10 rounded-full flex items-center justify-center font-black text-white/40 text-2xl shadow-[0_0_40px_rgba(0,0,0,0.6)] backdrop-blur-xl">VS</div>
                    </div>

                    {[resolvingMatch.p1, resolvingMatch.p2].map((pid, idx) => {
                        const p = getPlayer(pid);
                        const imgs = getImages(p);
                        const iIdx = idx === 0 ? p1ImgIdx : p2ImgIdx;
                        const setIIdx = idx === 0 ? setP1ImgIdx : setP2ImgIdx;
                        const seed = typeof getSeedText === 'function' ? getSeedText(tournament, pid) : null;

                        return (
                            <div key={idx} className="flex-1 w-full max-w-[340px] flex flex-col relative z-10">
                                {/* FIX: Added "isolate" and removed the absolute z-10 wrapper from the inner content */}
                                <div className="w-full aspect-[3/4] rounded-[2rem] overflow-hidden border-[3px] border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.4)] relative group bg-black/40 flex items-center justify-center mb-5 shrink-0 isolate" style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}>
                                    
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none -z-10"></div>

                                    {imgs[iIdx] ? (
                                        <>
                                            <PlayerMedia url={imgs[iIdx]} className="w-full h-full object-cover" />
                                            {/* THE INVISIBLE SHIELD: Blocks the iframe from stealing mouse events so you can click the arrows! */}
                                            <div className="absolute inset-0 z-10"></div>
                                        </>
                                    ) : (
                                        <span className="text-white/40 font-bold text-xl relative z-10">TBD</span>
                                    )}

                                    {imgs.length > 1 && (
                                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                                            <button onClick={(e) => { e.stopPropagation(); setIIdx(prev => (prev === 0 ? imgs.length-1 : prev-1)); }} className="w-10 h-10 bg-black/40 hover:bg-black/80 border border-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-md shadow-lg transition-all hover:scale-110 pointer-events-auto">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                                            </button>
                                            <button onClick={(e) => { e.stopPropagation(); setIIdx(prev => (prev === imgs.length-1 ? 0 : prev+1)); }} className="w-10 h-10 bg-black/40 hover:bg-black/80 border border-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-md shadow-lg transition-all hover:scale-110 pointer-events-auto">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col items-center w-full mb-6">
                                    <div 
                                        onClick={() => { onNavigate('players', pid); }}
                                        className="flex items-center justify-center gap-2.5 drop-shadow-md text-center flex-wrap cursor-pointer group mb-3"
                                    >
                                        <span className="text-3xl leading-none group-hover:scale-110 transition-transform">{getFlag(p.nationality)}</span>
                                        <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight group-hover:text-gold-400 group-hover:underline decoration-gold-400/50 underline-offset-4 transition-all">{p.name}</h3>
                                        {seed && <span className="bg-gold-500/20 text-gold-400 border border-gold-500/30 px-2 py-0.5 rounded text-xs font-black shadow-sm group-hover:bg-gold-500/30 transition-colors shrink-0">{seed}</span>}
                                    </div>
                                    
                                    <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-5 py-2 rounded-full shadow-inner backdrop-blur-md">
                                        <span className="text-[11px] font-bold text-white/50 uppercase tracking-widest flex items-center gap-1.5">
                                            Rank <span className="text-white text-sm font-black">#{p.rank}</span>
                                        </span>
                                        <div className="w-1 h-1 rounded-full bg-white/20"></div>
                                        <span className="text-[11px] font-bold text-gold-400 uppercase tracking-widest flex items-center gap-1.5">
                                            <span className="text-gold-300 text-sm font-black">{(p.points || 0).toLocaleString()}</span> pts
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-3 w-full mt-auto shrink-0">
                                    <button onClick={() => submitResult(pid, 'close')} className="flex-[3] bg-white/90 hover:bg-white text-black py-3 rounded-xl font-black text-sm transition-all active:scale-[0.98] shadow-md hover:shadow-lg flex justify-center items-center gap-2">
                                        <IconClose/> Win Match
                                    </button>
                                    <button onClick={() => submitResult(pid, 'lopsided')} className="flex-[1] bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 text-white/60 hover:text-white py-3 rounded-xl font-bold text-sm transition-all active:scale-[0.98] flex flex-col justify-center items-center gap-1 shadow-sm group">
                                        <IconDom/>
                                        <span className="text-[8px] uppercase tracking-widest opacity-80 group-hover:opacity-100">Dominant</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="border-t border-white/10">
                    <button onClick={handleRandomize} className="w-full bg-gold-500 hover:bg-gold-400 text-black py-4 font-black text-sm uppercase tracking-widest transition-colors flex justify-center items-center gap-2 shadow-inner">
                        <Shuffle size={18} strokeWidth={3}/> Auto-Resolve (Coin Toss)
                    </button>
                </div>
            </div>
        </div>
    );
}

export function CreateTournamentView({ players, onBack, onSuccess, db, appId, editingId, tournaments }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [hostCountry, setHostCountry] = useState('USA');
    const [location, setLocation] = useState(''); 
    const [tier, setTier] = useState('challenger');
    const [size, setSize] = useState(16);
    
    const [selectedWildcards, setSelectedWildcards] = useState([]);
    const [withdrawnIds, setWithdrawnIds] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [wcSearch, setWcSearch] = useState('');
    const [autoSearch, setAutoSearch] = useState('');
    const [withdrawnSearch, setWithdrawnSearch] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [showDelete, setShowDelete] = useState(false);
    
    const getPlayer = (id) => players.find(p => p.id === id) || { name: 'TBD', rank: '-', nationality: 'UNK', imageUrl: '' };
    
    // --- NATIONS LEAGUE STATE ---
    const [teams, setTeams] = useState(Array(16).fill(null).map((_,i) => ({ id: `team-${i}`, name: `Entry ${i+1}`, flags: [], players: [null,null,null,null] })));
    const [editingTeamIdx, setEditingTeamIdx] = useState(null);
    const [pickingSlot, setPickingSlot] = useState(null);
    const [rosterSearch, setRosterSearch] = useState('');

    useEffect(() => {
        if (!editingId && tier === 'nations_league' && players.length >= 4) {
            setTeams(prev => {
                const isPristine = prev.every(t => t.name.startsWith('Entry ') && t.flags.length === 0);
                if (!isPristine) return prev;
                
                const active = players.filter(p => !p.retired).sort((a,b) => a.rank - b.rank);
                const byNat = {};
                active.forEach(p => { if(!byNat[p.nationality]) byNat[p.nationality] = []; byNat[p.nationality].push(p); });
                const valid = Object.entries(byNat).filter(([k,v]) => v.length >= 4).sort((a,b) => a[1][0].rank - b[1][0].rank).slice(0, 4);
                
                const newTeams = [...prev];
                valid.forEach((nat, i) => {
                    newTeams[i] = { id: `team-${i}`, name: getCountryName(nat[0]), flags: [nat[0]], players: nat[1].slice(0,4).map(p=>p.id) };
                });
                return newTeams;
            });
        }
    }, [tier, players, editingId]);

    const getUsedPlayerIds = () => teams.flatMap(t => t.players).filter(Boolean);
    
    const handleAddFlagToTeam = (code) => {
        if (!code) return;
        const newT = [...teams]; 
        const team = { ...newT[editingTeamIdx] }; // FIX: Deep Clone!
        if (!team.flags.includes(code)) {
            team.flags = [...team.flags, code];
            const natPlayers = players.filter(p => p.nationality === code && !p.retired && !getUsedPlayerIds().includes(p.id)).sort((a,b) => a.rank - b.rank);
            let pIdx = 0;
            team.players = [...team.players];
            for (let i=0; i<4; i++) {
                if (!team.players[i] && pIdx < natPlayers.length) { team.players[i] = natPlayers[pIdx].id; pIdx++; }
            }
            if (team.flags.length === 1 && team.name.startsWith('Entry ')) team.name = getCountryName(code);
            else if (team.flags.length > 1 && team.name === getCountryName(team.flags[0])) team.name = `${getCountryName(team.flags[0])} Co-op`;
        }
        newT[editingTeamIdx] = team;
        setTeams(newT);
    };

    const handleRemoveFlagFromTeam = (code) => {
        const newT = [...teams]; 
        const team = { ...newT[editingTeamIdx] }; // FIX: Deep Clone prevents UI freezing!
        team.flags = team.flags.filter(f => f !== code);
        team.players = [...team.players].map(pid => {
            if (!pid) return null;
            return getPlayer(pid).nationality === code ? null : pid;
        });
        if (team.flags.length === 0) team.name = `Entry ${editingTeamIdx + 1}`;
        else if (team.flags.length === 1) team.name = getCountryName(team.flags[0]);
        
        newT[editingTeamIdx] = team;
        setTeams(newT);
    };

    const activeAvailablePlayers = players.filter(p => {
        if (p.retired) return false;
        if (editingTeamIdx !== null && teams[editingTeamIdx].flags.length > 0 && !teams[editingTeamIdx].flags.includes(p.nationality)) return false;
        if (getUsedPlayerIds().includes(p.id) && (!pickingSlot || teams[pickingSlot.teamIdx].players[pickingSlot.slotIdx] !== p.id)) return false;
        return true;
    }).sort((a,b) => a.rank - b.rank);
    
    const searchedAvailablePlayers = activeAvailablePlayers.filter(p => p.name.toLowerCase().includes(rosterSearch.toLowerCase()) || (p.nationality||'').toLowerCase().includes(rosterSearch.toLowerCase()));
    
    const allActiveNationCodes = Array.from(new Set(players.filter(p => !p.retired).map(p => p.nationality))).filter(Boolean);
    const allUsedFlags = teams.flatMap(t => t.flags);
    const unselectedNationCodes = allActiveNationCodes.filter(code => !allUsedFlags.includes(code));
                
    useEffect(() => {
        if (editingId && tournaments) {
            const tToEdit = tournaments.find(t => t.id === editingId);
            if (tToEdit) {
                setName(tToEdit.name);
                setDescription(tToEdit.description || '');
                setHostCountry(tToEdit.hostCountry || 'USA');
                setLocation(tToEdit.location || '');
                setTier(tToEdit.tier || 'challenger');
            }
        }
    }, [editingId, tournaments]);

    const tierConf = TOURNAMENT_TIERS[tier];
    
    const allowedSizes = useMemo(() => {
        if (tier === 'grand_slam') return [128];
        if (tier === 'pro_am') return [32];
        if (tier === 'challenger_elite') return [16, 32];
        if (tier === 'finals') return [8];
        if (tier === 'nations_league') return [16];
        if (tier === 'major') return [64, 128];
        if (tier === 'challenger') return [8, 16, 32, 64, 128];
        if (tier === 'pro') return [16, 32, 64, 128];
        
        return [16, 32, 64, 128]; 
    }, [tier]);

    // Force Qualifiers ONLY for Grand Slams (Removes the manual toggle)
    const useQualifiers = tier === 'grand_slam';

    useEffect(() => { 
        if (!editingId && !allowedSizes.includes(size)) setSize(allowedSizes[0]);
        if (!editingId) { setSelectedWildcards([]); setWithdrawnIds([]); setErrorMsg(''); }
    }, [tier, allowedSizes, size, editingId]);

    let sizeMultiplier = 1.0;
    // Grand Slams and Finals are exempt from scaling!
    if (tier !== 'finals' && tier !== 'grand_slam') {
        if (size === 8) sizeMultiplier = 0.6;           
        else if (size === 16) sizeMultiplier = 0.8;    
        else if (size === 32) sizeMultiplier = 1.0;     
        else if (size === 64) sizeMultiplier = 1.2;    
        else if (size === 128) sizeMultiplier = 1.4;    
    }
    
    const expectedWinnerPoints = Math.round(tierConf.points.WINNER * sizeMultiplier);
        
    const activePlayers = players.filter(p => !p.retired);

    const eligiblePlayers = [...activePlayers]
        .filter(p => p.rank > tierConf.excludeTop && !withdrawnIds.includes(p.id))
        .sort((a, b) => a.rank - b.rank);
    
    let reqWc = tierConf.wcCount?.[size] || 0;
    if (tier === 'challenger') {
        reqWc = size; 
    }

    const reqQ = useQualifiers ? 16 : 0;
    const reqAuto = Math.max(0, size - reqWc - reqQ);
    
    const autoQualifiers = eligiblePlayers.slice(0, reqAuto);
    const remainingPlayers = eligiblePlayers.slice(reqAuto); // WC and Q players come from here!
    
    // Safety check ensuring we have enough players for the main draw
    const hasEnoughPlayers = activePlayers.length >= size + tierConf.excludeTop;

    const withdrawnPlayers = [...activePlayers]
        .filter(p => withdrawnIds.includes(p.id))
        .sort((a, b) => a.rank - b.rank);
    
    const toggleWildcard = (id) => {
        if (selectedWildcards.includes(id)) setSelectedWildcards(selectedWildcards.filter(wId => wId !== id));
        else if (selectedWildcards.length < reqWc) setSelectedWildcards([...selectedWildcards, id]);
    };

    const toggleWithdraw = (id) => {
        if (withdrawnIds.includes(id)) setWithdrawnIds(withdrawnIds.filter(wId => wId !== id));
        else {
            setWithdrawnIds([...withdrawnIds, id]);
            if (selectedWildcards.includes(id)) setSelectedWildcards(selectedWildcards.filter(wId => wId !== id));
        }
    };
    
    const withdrawTopN = (count) => {
        // Drops the top 'count' players from whatever is currently left in the pool
        const topSeeds = remainingPlayers.slice(0, count).map(p => p.id);
        setWithdrawnIds(prev => [...new Set([...prev, ...topSeeds])]);
        setSelectedWildcards(prev => prev.filter(id => !topSeeds.includes(id)));
    };
    
    const selectRandomWildcards = () => {
        const needed = reqWc - selectedWildcards.length;
        if (needed <= 0) return;
        const availableIds = remainingPlayers.map(p => p.id).filter(id => !selectedWildcards.includes(id));
        const shuffled = [...availableIds];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        setSelectedWildcards([...selectedWildcards, ...shuffled.slice(0, needed)]);
    };

    const filteredRemaining = remainingPlayers.filter(p => p.name.toLowerCase().includes(wcSearch.toLowerCase()) || (p.nationality || '').toLowerCase().includes(wcSearch.toLowerCase()));
    const filteredAuto = autoQualifiers.filter(p => p.name.toLowerCase().includes(autoSearch.toLowerCase()) || (p.nationality || '').toLowerCase().includes(autoSearch.toLowerCase()));
    const filteredWithdrawn = withdrawnPlayers.filter(p => p.name.toLowerCase().includes(withdrawnSearch.toLowerCase()) || (p.nationality || '').toLowerCase().includes(withdrawnSearch.toLowerCase()));

    const handleCreateOrUpdate = async () => {
        setErrorMsg('');
        if (!name.trim()) { setErrorMsg("Please enter a tournament name."); return; }
        
        setIsGenerating(true);
        try {
            const tRef = editingId ? window.fb.doc(db, 'artifacts', appId, 'public', 'data', 'tournaments', editingId) : window.fb.collection(db, 'artifacts', appId, 'public', 'data', 'tournaments');
            
            if (editingId) {
                await window.fb.updateDoc(tRef, { name: name.trim(), description: description.trim(), hostCountry, location: location.trim(), tier });
                onSuccess(editingId);
            } else {
                let bracket; let format = 'elimination'; let groupMatches = null; let groups = null; let extraData = {}; let selectedPlayerIds = [];

                if (tier === 'nations_league') {
                    const isTeamsValid = teams.length === 16 && teams.every(t => t.name.trim() !== '' && t.players.every(p => p !== null));
                    if (!isTeamsValid) { setErrorMsg("All 16 teams must be fully configured with exactly 4 players."); setIsGenerating(false); return; }
                    
                    const nationsData = generateNationsDraw(teams);
                    bracket = nationsData.knockout; format = nationsData.format; groupMatches = nationsData.groupMatches; groups = nationsData.groups;
                    extraData = { teams: nationsData.teams };
                    selectedPlayerIds = teams.flatMap(t => t.players);
                } else {
                    if (autoQualifiers.length + selectedWildcards.length + reqQ !== size) { setErrorMsg(`You must exactly select ${size} total participants.`); setIsGenerating(false); return; }
                    
                    const selectedMain = [...autoQualifiers, ...remainingPlayers.filter(p => selectedWildcards.includes(p.id))].sort((a,b) => a.rank - b.rank);
                    selectedPlayerIds = selectedMain.map(p => p.id);
                    
                    // 1. Create dummy "TBD" slots for the Qualifiers in the Main Draw
                    const paddedMain = [...selectedMain];
                    for(let i=0; i<reqQ; i++) {
                        paddedMain.push({ id: `Q_SLOT_${i}`, isQualifier: true, rank: 'Q' });
                    }
                    
                    if (tier === 'finals') {
                        const finalsData = generateATPFinalsDraw(paddedMain);
                        bracket = finalsData.knockout; format = finalsData.format; groupMatches = finalsData.groupMatches; groups = finalsData.groups;
                    } else if (tier === 'pro_am' || tier === 'challenger_elite') {
                        const proAmData = generateProAmDraw(paddedMain);
                        
                        // FOOLPROOF EXTRACTION: Grab the bracket whether it's named 'knockout' or 'bracket'
                        const rawBracket = proAmData.knockout || proAmData.bracket || [];
                        const rawGroups = proAmData.groupMatches || [];
                        
                        // Ensure they are strictly strings before Firebase sees them!
                        bracket = typeof rawBracket === 'string' ? rawBracket : JSON.stringify(rawBracket);
                        groupMatches = typeof rawGroups === 'string' ? rawGroups : JSON.stringify(rawGroups);
                        
                        format = proAmData.format; 
                        groups = proAmData.groups;
                    } else {
                        bracket = JSON.stringify(generateKnockoutDraw(paddedMain, size));
                    }

                    // 2. Generate the separate Qualifying Bracket if toggled!
                    if (useQualifiers) {
                        const qPlayers = remainingPlayers.filter(p => !selectedWildcards.includes(p.id));
                        extraData.hasQualifiers = true;
                        extraData.bracket_q = JSON.stringify(generateQualifyingDraw(qPlayers, 16));
                    }
                }

                const docRef = await window.fb.addDoc(tRef, { 
                    name: name.trim(), description: description.trim(), hostCountry, location: location.trim(), tier, status: 'active', createdAt: Date.now(), 
                    selectedPlayers: selectedPlayerIds, 
                    format, bracket, ...(groupMatches ? { groupMatches, groups } : {}), ...extraData
                });
                onSuccess(docRef.id);
            }
        } catch (err) { console.error(err); setErrorMsg(editingId ? "Failed to update tournament." : "Failed to generate the tournament."); }
        setIsGenerating(false);
    };

    const handleDeleteTournament = async () => {
        if (!editingId) return;
        try {
            await window.fb.deleteDoc(window.fb.doc(db, 'artifacts', appId, 'public', 'data', 'tournaments', editingId));
            onBack();
        } catch(e) { console.error(e); }
    };

    const autoMapQuery = `${name} ${getCountryName(hostCountry)}`.trim();
    const mapQuery = location.trim() || autoMapQuery;

    return (
        <div className="h-full flex flex-col pb-20 relative max-w-6xl mx-auto w-full pt-8">
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#020617]">
                <iframe 
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=k&z=15&ie=UTF8&iwloc=near&output=embed`} 
                    className="w-[130%] h-[130%] -translate-x-[15%] -translate-y-[15%] opacity-50 saturate-[1.2] absolute left-0 top-0 transition-all duration-[3000ms] pointer-events-none" 
                    frameBorder="0" 
                    loading="lazy" 
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/80 via-[#020617]/60 to-[#020617]/95 z-10"></div>
            </div>

            <div className="relative z-20 px-4 xl:px-0">
                <button onClick={onBack} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-medium mb-6 drop-shadow-md"><ArrowLeft size={16}/> Back to Tournaments</button>
                
                <div className="bg-white/5 backdrop-blur-3xl p-6 md:p-10 rounded-[2rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                    <h1 className="text-3xl md:text-4xl font-black text-white mb-8 drop-shadow-lg tracking-tight">{editingId ? "Edit Tournament" : "Create Event"}</h1>

                    <div className="grid md:grid-cols-2 gap-8 mb-8 border-b border-white/10 pb-10">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-white/50 uppercase tracking-widest mb-2.5">Tournament Name</label>
                                <input type="text" className="w-full h-12 bg-black/20 border border-white/10 text-white px-4 py-3.5 rounded-xl focus:outline-none focus:border-gold-500/50 focus:bg-black/40 transition-all shadow-inner backdrop-blur-md font-bold text-lg placeholder-white/20" placeholder="e.g. Paris Masters 2026..." value={name} onChange={e => setName(e.target.value)} />
                            </div>
                            <div className="relative z-[60]">
                                <label className="block text-[10px] font-black text-white/50 uppercase tracking-widest mb-2.5">Host Country</label>
                                <div className="bg-black/20 border border-white/10 rounded-xl p-1 shadow-inner backdrop-blur-md">
                                    <CountrySelect value={hostCountry} onChange={setHostCountry} players={players} />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-white/50 uppercase tracking-widest mb-2.5 flex items-center gap-2">
                                    City / Map Location
                                    {mapQuery && !location.trim() && <span className="text-emerald-400 normal-case tracking-normal font-medium text-xs bg-emerald-500/10 px-2 py-0.5 rounded flex items-center gap-1 border border-emerald-500/20"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>Live Auto-Detect</span>}
                                    {location.trim() && <span className="text-sky-400 normal-case tracking-normal font-medium text-xs bg-sky-500/10 px-2 py-0.5 rounded flex items-center gap-1 border border-sky-500/20">Manual Override</span>}
                                </label>
                                <input type="text" className="w-full h-12 bg-black/20 border border-white/10 text-white px-4 py-3.5 rounded-xl focus:outline-none focus:border-gold-500/50 focus:bg-black/40 transition-all shadow-inner backdrop-blur-md placeholder-white/30 text-sm" placeholder={autoMapQuery ? `Auto-Search: ${autoMapQuery}` : "Override map location..."} value={location} onChange={e => setLocation(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-white/50 uppercase tracking-widest mb-2.5">Description (Optional)</label>
                                <textarea className="w-full bg-black/20 border border-white/10 text-white/90 px-4 py-3.5 rounded-xl focus:outline-none focus:border-gold-500/50 focus:bg-black/40 transition-all custom-scrollbar shadow-inner backdrop-blur-md placeholder-white/20 text-sm" placeholder="Enter tournament narrative here..." value={description} onChange={e => setDescription(e.target.value)} rows="2"></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-10 mb-8 relative z-10">
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-white/50 uppercase tracking-widest mb-3">Event Tier</label>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(TOURNAMENT_TIERS).filter(([k]) => k !== 'nations_league').map(([k, conf]) => (
                                        <button 
                                            key={k} 
                                            type="button"
                                            onClick={() => setTier(k)} 
                                            className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all ${
                                                tier === k 
                                                ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.4)] scale-[1.02]' 
                                                : 'bg-black/40 text-white/60 border border-white/10 hover:bg-black/60 hover:text-white backdrop-blur-md'
                                            }`}
                                        >
                                            {conf.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-4 pt-3 border-t border-white/10 w-fit">
                                <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Special Events</span>
                                <button 
                                    type="button"
                                    onClick={() => setTier('nations_league')} 
                                    className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all border ${
                                        tier === 'nations_league' 
                                        ? 'bg-slate-100 text-black shadow-[0_0_20px_rgba(248,250,252,0.4)] border-white scale-[1.02]' 
                                        : 'bg-slate-100/10 text-slate-100 border-slate-100/30 hover:bg-slate-100/20 backdrop-blur-md'
                                    }`}
                                >
                                    SNB Nations League
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-white/50 uppercase tracking-widest mb-3">Draw Size</label>

                            <div className="flex items-center bg-black/40 border border-white/10 rounded-full p-1 w-fit backdrop-blur-md">
                                {[8, 16, 32, 64, 128].map(s => {
                                    const isAllowed = allowedSizes.includes(s);
                                    const isSelected = size === s;
                                    return (
                                        <button 
                                            key={s} 
                                            disabled={!!editingId || !isAllowed} 
                                            onClick={() => setSize(s)} 
                                            className={`px-6 py-2.5 rounded-full text-sm font-black transition-all ${
                                                isSelected 
                                                ? 'bg-gold-500 text-black shadow-sm scale-[1.02]' 
                                                : isAllowed 
                                                    ? 'text-white/60 hover:text-white hover:bg-white/10' 
                                                    : 'text-white/20 cursor-not-allowed hidden sm:block'
                                            }`}
                                        >
                                            {s}
                                        </button>
                                    );
                                })}
                                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-3 mr-4">Players</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mb-10 bg-white/5 p-5 rounded-2xl border border-white/10 shadow-inner backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-2"><span className={`font-bold drop-shadow-md`} style={{ color: tierConf.hex }}>{tierConf.name} Configuration:</span></div>
                        <ul className="space-y-1.5 list-disc pl-4 text-xs font-medium text-white/70">
                            <li>Champion receives <strong className="text-white">{expectedWinnerPoints.toLocaleString()} points</strong>.</li>
                            <li>{tierConf.excludeTop > 0 ? `Top ${tierConf.excludeTop} globally ranked players are excluded from entry.` : (tier === 'finals' ? 'Exclusive Round Robin format for the Top 8 globally ranked players.' : 'Open Entry. Selection strictly based on global rank.')}</li>
                            {tier === 'grand_slam' && <li><strong className="text-indigo-400">16 slots</strong> are automatically reserved for the Qualifying Bracket.</li>}
                            {reqWc > 0 && <li>Draw reserves <strong className="text-gold-400">{reqWc} Wildcard/Participant slots</strong> for manual entry.</li>}
                        </ul>
                    </div>

                    {!editingId && (
                        <>
                            {tier === 'nations_league' ? (
                                <div className="border-t border-white/10 pt-10">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                                        <div>
                                            <h3 className="font-black text-white text-xl tracking-tight drop-shadow-md flex items-center gap-3"><NationsIcon size={24} className="text-rose-400"/> National Rosters</h3>
                                            <p className="text-white/50 text-xs font-medium mt-1">Configure 16 Entries. The Top 4 eligible Nations have been auto-qualified.</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {teams.map((t, i) => {
                                            const isComplete = t.name.trim() !== '' && t.players.every(p => p !== null);
                                            return (
                                                <div key={i} onClick={() => setEditingTeamIdx(i)} className={`bg-black/40 border rounded-2xl p-4 cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group ${isComplete ? 'border-white/10 hover:border-white/30' : 'border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.1)]'}`}>
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex items-center gap-2 min-w-0 pr-2">
                                                            <span className="text-2xl drop-shadow-md shrink-0 flex gap-0.5">
                                                                {t.flags.length > 0 ? t.flags.map(f => getFlag(f)).join('') : <div className="w-8 h-6 bg-white/5 rounded-md border border-white/10 flex items-center justify-center shadow-inner"><div className="w-3 h-px bg-white/20"></div></div>}
                                                            </span>
                                                            <h4 className="font-bold text-white truncate text-sm group-hover:text-rose-400 transition-colors">{t.name}</h4>
                                                        </div>
                                                        {!isComplete && <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0"></div>}
                                                    </div>
                                                    <div className="grid grid-cols-4 gap-1.5">
                                                        {t.players.map((pid, j) => {
                                                            const p = pid ? getPlayer(pid) : null;
                                                            const hasImg = p && (p.images?.[0] || p.imageUrl);
                                                            return pid ? (
                                                                hasImg ? (
                                                                    <img key={j} referrerPolicy="no-referrer" src={p.images?.[0] || p.imageUrl} className="w-full aspect-square rounded-full object-cover border border-white/20 shadow-sm" title={p.name} />
                                                                ) : (
                                                                    <div key={j} className="w-full aspect-square rounded-full border border-white/20 bg-black/60 flex items-center justify-center shadow-sm" title={p.name}>
                                                                        <UserCircle size={16} className="text-white/60" />
                                                                    </div>
                                                                )
                                                            ) : (
                                                                <div key={j} className="w-full aspect-square rounded-full border border-dashed border-white/20 bg-white/5 flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity">
                                                                    <Plus size={12} className="text-white/30" />
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {!hasEnoughPlayers && (
                                        <div className="bg-[#be123c]/20 border border-[#be123c]/40 text-[#fb7185] p-5 rounded-2xl flex items-center justify-center gap-3 mb-8 shadow-lg backdrop-blur-md">
                                            <Shield className="w-6 h-6 shrink-0" />
                                            <span className="font-bold text-sm">Not enough eligible players to generate this draw. Need {size + tierConf.excludeTop}, but only have {activePlayers.length}.</span>
                                        </div>
                                    )}

                                    <div className={`grid ${reqAuto > 0 ? 'md:grid-cols-2' : 'grid-cols-1'} gap-8 border-t border-white/10 pt-10`}>
                                        {reqAuto > 0 && (
                                            <div className="flex flex-col h-[400px]">
                                                <div className="flex justify-between items-center mb-4 shrink-0">
                                                    <h3 className="font-black text-white text-lg tracking-tight drop-shadow-md">Auto Qualifiers <span className="text-white/40 text-xs ml-1.5 font-bold uppercase tracking-widest">(Top {reqAuto})</span></h3>
                                                </div>
                                                <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-2 flex-1 flex flex-col border border-white/10 min-h-0 shadow-inner">
                                                    <div className="relative mb-2 shrink-0 z-10">
                                                        <input type="text" placeholder="Search qualifiers to withdraw..." className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 pl-9 rounded-xl text-sm focus:outline-none focus:border-gold-500/50 transition-colors shadow-inner placeholder-white/30" value={autoSearch} onChange={e => setAutoSearch(e.target.value)} />
                                                        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                                                    </div>
                                                    <div className="overflow-y-auto space-y-1 pr-1 flex-1 custom-scrollbar relative z-0">
                                                        {filteredAuto.map(p => (
                                                            <div key={p.id} onClick={() => toggleWithdraw(p.id)} className="p-2 opacity-90 hover:opacity-100 text-sm flex items-center justify-between text-white/70 cursor-pointer hover:bg-[#be123c]/20 rounded-xl transition-colors group border border-transparent hover:border-[#be123c]/30">
                                                                <span className="flex items-center">
                                                                    <span className="font-mono text-white/30 mr-2 w-5 text-[10px] font-bold">#{p.rank}</span> 
                                                                    <img referrerPolicy="no-referrer" src={p.images?.[0] || p.imageUrl || "https://via.placeholder.com/40"} className="w-6 h-6 rounded-full object-cover border border-white/20 shrink-0 mr-2" />
                                                                    <span className="mr-2 drop-shadow-sm text-base">{getFlag(p.nationality)}</span> 
                                                                    <span className="font-bold truncate max-w-[150px] group-hover:text-white transition-colors mr-2">{p.name}</span>
                                                                </span>
                                                                <div className="flex items-center gap-3">
                                                                    <span className="text-[9px] font-bold text-gold-400 bg-gold-500/10 px-2 py-0.5 rounded-md border border-gold-500/20 whitespace-nowrap">{(p.points || 0).toLocaleString()} pts</span>
                                                                    <X size={14} className="text-[#fb7185] opacity-0 group-hover:opacity-100 transition-opacity" />
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex flex-col h-[400px]">
                                            <div className="flex justify-between items-center mb-4 shrink-0">
                                                <h3 className="font-black text-white text-lg tracking-tight drop-shadow-md">{reqAuto === 0 ? 'Participants' : (reqWc === 0 ? 'Alternates' : 'Wildcards')}</h3>
                                                <div className="flex gap-2 items-center flex-wrap justify-end">
                                                    {reqAuto === 0 && remainingPlayers.length > 0 && (
                                                        <>
                                                            {remainingPlayers.length > 10 && (
                                                                <button onClick={() => withdrawTopN(10)} className="text-[9px] uppercase tracking-wider font-bold bg-white/10 text-white/70 hover:bg-[#be123c]/30 hover:text-white px-2.5 py-1.5 rounded-lg transition-colors border border-white/10 hover:border-[#be123c]/50 backdrop-blur-md">Drop Top 10</button>
                                                            )}
                                                            <button onClick={() => withdrawTopN(Math.max(1, Math.floor(remainingPlayers.length / 2)))} className="text-[9px] uppercase tracking-wider font-black bg-[#be123c]/20 text-[#fb7185] hover:bg-[#be123c] hover:text-white px-2.5 py-1.5 rounded-lg transition-colors border border-[#be123c]/40 backdrop-blur-md shadow-sm">Drop Top Half</button>
                                                        </>
                                                    )}
                                                    {selectedWildcards.length < reqWc && reqWc > 0 && (
                                                        <button onClick={selectRandomWildcards} className="text-[10px] flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition-colors border border-white/20 font-bold shadow-sm backdrop-blur-md">
                                                            <Shuffle size={12} /> Auto-Fill
                                                        </button>
                                                    )}
                                                    <span className={`text-[11px] px-3 py-1.5 rounded-lg font-black tracking-widest border shadow-sm backdrop-blur-md ${selectedWildcards.length === reqWc ? 'bg-[#059669]/20 text-[#34d399] border-[#059669]/40' : 'bg-gold-500/20 text-gold-400 border-gold-500/30'}`}>
                                                        {selectedWildcards.length} / {reqWc}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-2 flex-1 flex flex-col border border-white/10 min-h-0 shadow-inner">
                                                <div className="relative mb-2 shrink-0 z-10">
                                                    <input type="text" placeholder="Search..." className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 pl-9 rounded-xl text-sm focus:outline-none focus:border-gold-500/50 transition-colors shadow-inner placeholder-white/30" value={wcSearch} onChange={e => setWcSearch(e.target.value)} />
                                                    <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                                                </div>
                                                <div className="overflow-y-auto space-y-1 pr-1 flex-1 custom-scrollbar relative z-0">
                                                    {filteredRemaining.map(p => { 
                                                        const isS = selectedWildcards.includes(p.id); 
                                                        const isDisabled = reqWc === 0 || (!isS && selectedWildcards.length >= reqWc);
                                                        return (
                                                            <div key={p.id} onClick={() => !isDisabled && toggleWildcard(p.id)} className={`p-2 rounded-xl ${reqWc > 0 ? 'cursor-pointer' : 'cursor-default'} flex justify-between items-center text-sm transition-all duration-300 group ${isS ? 'bg-gold-500/20 border border-gold-500/40 text-white shadow-md backdrop-blur-md' : (isDisabled && reqWc > 0) ? 'opacity-30 cursor-not-allowed border border-transparent' : 'hover:bg-white/10 text-white/70 border border-transparent hover:text-white'}`}>
                                                                <span className="flex items-center">
                                                                    <span className={`font-mono text-[10px] mr-2 w-5 font-bold ${isS ? 'text-gold-400' : 'text-white/30'}`}>#{p.rank}</span> 
                                                                    <img src={p.images?.[0] || p.imageUrl || "https://via.placeholder.com/40"} className="w-6 h-6 rounded-full object-cover border border-white/20 shrink-0 mr-2" />
                                                                    <span className="mr-2 drop-shadow-sm text-base">{getFlag(p.nationality)}</span> 
                                                                    <span className={`truncate max-w-[120px] mr-2 ${isS ? 'font-black' : 'font-bold'}`}>{p.name}</span>
                                                                </span>
                                                                <div className="flex items-center gap-3">
                                                                    <span className="text-[9px] font-bold text-gold-400 bg-gold-500/10 px-2 py-0.5 rounded-md border border-gold-500/20 whitespace-nowrap shadow-inner">{(p.points || 0).toLocaleString()} pts</span>
                                                                    {isS && <CheckCircle size={16} className="text-gold-400 drop-shadow-sm" />}
                                                                    {reqWc > 0 && !isS && !isDisabled && <X size={14} className="text-[#fb7185] opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110" onClick={(e) => { e.stopPropagation(); toggleWithdraw(p.id); }} />}
                                                                </div>
                                                            </div>
                                                        ) 
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {withdrawnPlayers.length > 0 && (
                                        <div className="mt-8 flex flex-col h-[200px]">
                                            <div className="flex justify-between items-end mb-4 shrink-0 border-t border-white/10 pt-6">
                                                <h3 className="font-black text-white/40 text-[11px] uppercase tracking-widest">Withdrawn / Skipped</h3>
                                                <span className="text-[10px] text-white/60 font-bold uppercase tracking-widest bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">{withdrawnPlayers.length} Players</span>
                                            </div>
                                            <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-2 flex-1 flex flex-col border border-white/10 min-h-0 shadow-inner">
                                                <div className="relative mb-2 shrink-0 z-10">
                                                    <input type="text" placeholder="Search withdrawn players to restore..." className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 pl-9 rounded-xl text-sm focus:outline-none focus:border-gold-500/50 transition-colors shadow-inner placeholder-white/30" value={withdrawnSearch} onChange={e => setWithdrawnSearch(e.target.value)} />
                                                    <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                                                </div>
                                                <div className="overflow-y-auto space-y-1 pr-1 flex-1 custom-scrollbar relative z-0">
                                                    {filteredWithdrawn.map(p => (
                                                        <div key={p.id} onClick={() => toggleWithdraw(p.id)} className="p-2 text-sm flex items-center justify-between text-white/40 cursor-pointer hover:bg-[#059669]/20 hover:text-white rounded-xl transition-colors group border border-transparent hover:border-[#059669]/30">
                                                            <span className="flex items-center line-through group-hover:no-underline decoration-white/20">
                                                                <span className="font-mono mr-2 w-5 text-[10px] font-bold">#{p.rank}</span> 
                                                                <img referrerPolicy="no-referrer" src={p.images?.[0] || p.imageUrl || "https://via.placeholder.com/40"} className="w-6 h-6 rounded-full object-cover border border-white/20 shrink-0 mr-2 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                                                                <span className="mr-2 drop-shadow-sm grayscale group-hover:grayscale-0 opacity-50 group-hover:opacity-100 transition-all text-base">{getFlag(p.nationality)}</span> 
                                                                <span className="font-bold">{p.name}</span>
                                                            </span>
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-[9px] font-bold text-gold-400 bg-gold-500/10 px-2 py-0.5 rounded-md border border-gold-500/20 whitespace-nowrap opacity-50 group-hover:opacity-100">{(p.points || 0).toLocaleString()} pts</span>
                                                                <Plus size={14} className="text-[#34d399] opacity-0 group-hover:opacity-100 transition-opacity" />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    )}
                    
                    {/* --- TEAM EDIT MODAL --- */}
                    {editingTeamIdx !== null && (
                        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
                            <div className="bg-royal-950 border border-white/10 rounded-3xl p-6 md:p-8 w-full max-w-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative flex flex-col h-[85vh] md:h-auto max-h-[800px]">
                                <button onClick={() => { setEditingTeamIdx(null); setPickingSlot(null); }} className="absolute top-6 right-6 text-white/40 hover:text-white bg-white/5 p-2 rounded-full transition-colors z-20"><X size={20}/></button>
                                
                                <h2 className="text-2xl font-black text-white mb-6">Edit Roster</h2>
                                
                                <div className="flex flex-col md:flex-row gap-4 mb-8 shrink-0">
                                    <div className="flex-1">
                                        <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Team Name</label>
                                        <input type="text" className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-rose-500/50 shadow-inner" 
                                               value={teams[editingTeamIdx].name} 
                                               onChange={e => { const newT = [...teams]; newT[editingTeamIdx].name = e.target.value; setTeams(newT); }} />
                                    </div>
                                    <div className="w-full md:w-auto min-w-[250px]">
                                        <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Team Nations (Add to unlock players)</label>
                                        <div className="flex flex-wrap gap-2 items-center bg-black/40 border border-white/10 rounded-xl p-1.5 min-h-[48px]">
                                            {teams[editingTeamIdx].flags.map(f => (
                                                <div key={f} className="flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded-lg border border-white/20 shadow-sm">
                                                    <span className="text-base drop-shadow-md leading-none">{getFlag(f)}</span>
                                                    <span className="text-xs font-bold text-white/90">{f}</span>
                                                    <button 
                                                        type="button" 
                                                        className="text-rose-400 cursor-pointer hover:text-rose-300 transition-colors ml-1 p-0.5 rounded-md hover:bg-rose-500/20" 
                                                        onClick={(e) => { 
                                                            e.preventDefault(); 
                                                            e.stopPropagation(); 
                                                            handleRemoveFlagFromTeam(f); 
                                                        }}
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                            <div className="relative z-50 flex-1 min-w-[140px]">
                                                <CountrySelect value="" onChange={handleAddFlagToTeam} allowedCodes={unselectedNationCodes} players={players} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6 shrink-0 relative z-10">
                                    {[0,1,2,3].map(slotIdx => {
                                        const pId = teams[editingTeamIdx].players[slotIdx];
                                        const p = getPlayer(pId);
                                        const isSelecting = pickingSlot?.slotIdx === slotIdx;
                                        return (
                                            <div key={slotIdx} onClick={() => setPickingSlot({ teamIdx: editingTeamIdx, slotIdx })} 
                                                 className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${isSelecting ? 'bg-rose-500/20 border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.2)]' : 'bg-black/40 border-white/10 hover:bg-white/10'}`}>
                                                <div className={`w-10 h-10 rounded-full border shrink-0 overflow-hidden bg-black/50 flex items-center justify-center ${pId ? 'border-white/20' : 'border-dashed border-white/20'}`}>
                                                    {pId ? <img referrerPolicy="no-referrer" src={p.images?.[0] || p.imageUrl || "https://via.placeholder.com/40"} className="w-full h-full object-cover" /> : <Plus size={16} className="text-white/20" />}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="text-[9px] uppercase tracking-widest font-black text-white/40 mb-0.5">Slot {slotIdx + 1} {slotIdx < 2 ? '(Singles)' : '(Doubles)'}</div>
                                                    <div className={`font-bold truncate text-sm ${pId ? 'text-white' : 'text-white/20'}`}>{pId ? p.name : 'Select Player'}</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {pickingSlot && (
                                    <div className="flex-1 flex flex-col bg-black/30 border border-white/10 rounded-2xl p-2 min-h-0 relative z-0">
                                        <div className="relative mb-2 shrink-0">
                                            <input type="text" placeholder="Search filtered players..." className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 pl-9 rounded-xl text-sm focus:outline-none focus:border-rose-500/50 transition-colors shadow-inner" value={rosterSearch} onChange={e => setRosterSearch(e.target.value)} />
                                            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                                        </div>
                                        {teams[editingTeamIdx].flags.length === 0 && (
                                            <div className="text-center text-rose-400/80 text-xs font-bold py-6">Add a Team Nation flag above to unlock players.</div>
                                        )}
                                        <div className="overflow-y-auto space-y-1 pr-1 flex-1 custom-scrollbar">
                                            {searchedAvailablePlayers.map(p => {
                                                const isCurrentlyInThisSlot = teams[pickingSlot.teamIdx].players[pickingSlot.slotIdx] === p.id;
                                                return (
                                                    <div key={p.id} onClick={() => {
                                                        const newT = [...teams];
                                                        newT[pickingSlot.teamIdx].players[pickingSlot.slotIdx] = isCurrentlyInThisSlot ? null : p.id;
                                                        setTeams(newT);
                                                        setPickingSlot(null);
                                                        setRosterSearch('');
                                                    }} className={`p-2.5 rounded-xl cursor-pointer flex items-center justify-between transition-all border shadow-sm ${isCurrentlyInThisSlot ? 'bg-rose-500/20 border-rose-500/40 text-white backdrop-blur-md' : 'hover:bg-white/10 text-white/70 border-white/5 hover:text-white bg-black/40'}`}>
                                                        <span className="flex items-center min-w-0 pr-2">
                                                            <span className="font-mono text-white/40 mr-3 w-6 text-xs font-bold text-right">#{p.rank}</span> 
                                                            <img referrerPolicy="no-referrer" src={p.images?.[0] || p.imageUrl || "https://via.placeholder.com/40"} className="w-8 h-8 rounded-full object-cover border border-white/20 shrink-0 mr-3 shadow-sm" />
                                                            <span className="mr-3 drop-shadow-sm text-xl">{getFlag(p.nationality)}</span> 
                                                            <span className="font-bold truncate text-base">{p.name}</span>
                                                        </span>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-[10px] font-bold text-gold-400 bg-gold-500/10 px-3 py-1 rounded-md border border-gold-500/20 whitespace-nowrap shadow-inner">{(p.points || 0).toLocaleString()} pts</span>
                                                            {isCurrentlyInThisSlot && <CheckCircle size={18} className="text-rose-400 shrink-0 drop-shadow-md" />}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                                
                                <div className="mt-6 flex justify-end shrink-0 relative z-20">
                                    <button type="button" onClick={() => { setEditingTeamIdx(null); setPickingSlot(null); }} className="bg-white hover:bg-gray-200 text-black px-8 py-3 rounded-xl font-black transition-colors shadow-md">Done</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {errorMsg && <div className="mt-10 text-[#fb7185] text-sm font-bold text-center w-full bg-[#be123c]/20 p-5 rounded-2xl border border-[#be123c]/40 shadow-lg backdrop-blur-md">{errorMsg}</div>}
                    
                    <div className="mt-10 pt-10 border-t border-white/10 flex justify-between items-center">
                        <div>
                            {editingId && (
                                showDelete ? (
                                    <div className="flex items-center gap-2 bg-[#be123c]/20 border border-[#be123c]/50 p-2 rounded-xl backdrop-blur-xl">
                                        <span className="text-[#fb7185] text-[10px] font-black uppercase tracking-widest px-2">Delete?</span>
                                        <button onClick={handleDeleteTournament} className="bg-[#be123c] hover:bg-[#9f1239] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">Confirm</button>
                                        <button onClick={() => setShowDelete(false)} className="text-white/70 hover:text-white text-xs px-2 font-medium">Cancel</button>
                                    </div>
                                ) : (
                                    <button onClick={() => setShowDelete(true)} className="flex items-center gap-2 text-[#fb7185] hover:text-[#f43f5e] text-xs font-bold bg-white/5 backdrop-blur-xl px-4 py-2.5 rounded-xl border border-white/10 transition-colors shadow-sm hover:bg-white/10">
                                        <Trophy size={14} className="opacity-0 hidden"/> Delete Event
                                    </button>
                                )
                            )}
                        </div>

                        <button onClick={handleCreateOrUpdate} disabled={isGenerating || (!editingId && (!hasEnoughPlayers || selectedWildcards.length !== reqWc)) || !name.trim()} className="bg-gradient-to-r from-gold-600 to-gold-400 text-black px-12 py-4 rounded-full font-black text-lg flex items-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-[0_10px_30px_rgba(212,175,55,0.3)] hover:shadow-[0_15px_40px_rgba(212,175,55,0.5)] hover:-translate-y-1 active:scale-[0.98] active:translate-y-0">
                            {editingId ? <Settings size={20}/> : <Plus size={20} fill="currentColor"/>} 
                            {isGenerating ? 'Processing...' : (editingId ? 'Update Tournament' : 'Generate Draw')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function TournamentBracket({ tournament, allTournaments = [], players, onBack, db, appId, onNavigate , isAdmin }) {
    const [viewMode, setViewMode] = useState(tournament.status === 'completed' ? 'info' : 'bracket');
    const [resolvingMatch, setResolvingMatch] = useState(null);
    const [activeTab, setActiveTab] = useState('all');
    const scrollContainerRef = useRef(null);
    const [masterView, setMasterView] = useState('main'); 

    // --- SETTINGS STATES ---
    const [showSettings, setShowSettings] = useState(false);
    const [editName, setEditName] = useState('');
    const [editLocation, setEditLocation] = useState('');
    const [editCountry, setEditCountry] = useState('');
    const [editDesc, setEditDesc] = useState('');
    const [showDelete, setShowDelete] = useState(false);
    const [expandedDesc, setExpandedDesc] = useState(false);

    const getPlayer = (id) => players.find(p => p.id === id) || { name: 'TBD', rank: '-', nationality: 'UNK' };
    
    let parsedMain = [];
    try { parsedMain = typeof tournament.bracket === 'string' ? JSON.parse(tournament.bracket) : tournament.bracket; } catch(e){}
    if (!Array.isArray(parsedMain)) parsedMain = [];

    let parsedQ = [];
    if (tournament.hasQualifiers) {
        try { parsedQ = typeof tournament.bracket_q === 'string' ? JSON.parse(tournament.bracket_q) : tournament.bracket_q; } catch(e){}
    }

    const activeBracket = masterView === 'main' ? parsedMain : parsedQ;
    const totalRounds = activeBracket.length;
    const drawSize = activeBracket[0]?.length * 2 || 32;
    const rOffset = 6 - totalRounds; 
    
    const rawTier = tournament.tier || getTournamentTier(tournament);
    const tierConf = TOURNAMENT_TIERS[rawTier] || { name: String(rawTier).replace('_', ' '), hex: '#94a3b8', bg: 'bg-slate-500/20', color: 'text-slate-300' };

    const tStats = { total: 0, close: 0, dom: 0, luck: 0 };
    let champion = null, finalist = null, semi1 = null, semi2 = null;

    if (activeBracket.length > 0) {
        activeBracket.flat().forEach(m => {
            if (m && m.winner && m.type !== 'bye') {
                tStats.total++;
                if (m.type === 'close') tStats.close++;
                else if (m.type === 'lopsided') tStats.dom++;
                else if (m.type === 'random') tStats.luck++;
            }
        });

        const fIdx = totalRounds - 1; const sfIdx = totalRounds - 2;
        if (fIdx >= 0 && activeBracket[fIdx] && activeBracket[fIdx][0]) {
            const fMatch = activeBracket[fIdx][0];
            if (fMatch.winner) { champion = fMatch.winner; finalist = fMatch.p1 === fMatch.winner ? fMatch.p2 : fMatch.p1; }
        }
        if (sfIdx >= 0 && activeBracket[sfIdx] && activeBracket[sfIdx].length >= 2) {
            const s1 = activeBracket[sfIdx][0]; const s2 = activeBracket[sfIdx][1];
            if (s1 && s1.winner) semi1 = s1.p1 === s1.winner ? s1.p2 : s1.p1;
            if (s2 && s2.winner) semi2 = s2.p1 === s2.winner ? s2.p2 : s2.p1;
        }
    }

    const IconDom = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>;
    const IconClose = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>;

    const tabs = useMemo(() => {
        // FIX: Force a single, clean tab if we are viewing Qualifiers!
        if (masterView === 'qualifiers') return [{ id: 'all', label: 'Full Qualifying Draw' }];
        
        if (drawSize <= 16) return [{ id: 'all', label: 'Full Draw' }];
        const navTabs = [{ id: 'all', label: 'Full Draw' }];
        if (drawSize === 128) {
            navTabs.push(
                { id: 's1', label: 'Sec 1' }, { id: 's2', label: 'Sec 2' },
                { id: 's3', label: 'Sec 3' }, { id: 's4', label: 'Sec 4' },
                { id: 's5', label: 'Sec 5' }, { id: 's6', label: 'Sec 6' },
                { id: 's7', label: 'Sec 7' }, { id: 's8', label: 'Sec 8' },
                { id: 'final16', label: 'Final 16' }
            );
        }
        else if (drawSize === 64) navTabs.push({ id: 'q1', label: 'Quarter 1' }, { id: 'q2', label: 'Quarter 2' }, { id: 'q3', label: 'Quarter 3' }, { id: 'q4', label: 'Quarter 4' }, { id: 'final8', label: 'Final 8' });
        else if (drawSize === 32) navTabs.push({ id: 'top', label: 'Top Half' }, { id: 'bottom', label: 'Bottom Half' }, { id: 'final8', label: 'Final 8' });
        return navTabs;
    }, [drawSize, masterView]);

    useEffect(() => { if (!tabs.find(t => t.id === activeTab)) setActiveTab(tabs[0].id); }, [tabs, activeTab]);

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        setTimeout(() => { if (scrollContainerRef.current) scrollContainerRef.current.scrollTo({ top: 0, left: 0, behavior: 'smooth' }); }, 50);
    };

    const shouldShowMatch = (tab, r, m, len) => {
        if (tab === 'all') return true;
        if (tab === 'final8') return r >= totalRounds - 3;
        if (tab === 'final16') return r >= totalRounds - 4; // R16, QF, SF, F
        if (tab.startsWith('q')) {
            if (r >= totalRounds - 2) return false;
            const qMap = { 'q1': 0, 'q2': 1, 'q3': 2, 'q4': 3 };
            return m >= qMap[tab] * (len / 4) && m < (qMap[tab] + 1) * (len / 4);
        }
        if (tab.startsWith('s')) {
            if (r >= totalRounds - 3) return false; // Hide R16+
            const sMap = { 's1': 0, 's2': 1, 's3': 2, 's4': 3, 's5': 4, 's6': 5, 's7': 6, 's8': 7 };
            return m >= sMap[tab] * (len / 8) && m < (sMap[tab] + 1) * (len / 8);
        }
        if (tab === 'top' || tab === 'bottom') {
            if (r >= totalRounds - 1) return false;
            const h = tab === 'top' ? 0 : 1;
            return m >= h * (len / 2) && m < (h + 1) * (len / 2);
        }
        return true;
    };

    const handleMatchClick = (rIdx, mIdx, match) => { 
        if (tournament.status === 'completed' || !match || !match.p1 || !match.p2 || match.winner || match.type === 'bye') return; 
        setResolvingMatch({ roundIndex: rIdx, matchIndex: mIdx, ...match, bracketType: masterView }); 
    };

    const submitResult = async (winnerId, type) => {
        const bType = resolvingMatch.bracketType || 'main';
        let mainB = JSON.parse(JSON.stringify(parsedMain));
        let qB = JSON.parse(JSON.stringify(parsedQ));
        let targetB = bType === 'main' ? mainB : qB;

        const { roundIndex: rIdx, matchIndex: mIdx } = resolvingMatch;
        targetB[rIdx][mIdx].winner = winnerId; 
        targetB[rIdx][mIdx].type = type;

        if (rIdx < targetB.length - 1) { 
            const nRIdx = rIdx + 1; const nMIdx = Math.floor(mIdx / 2); 
            if (mIdx % 2 === 0) targetB[nRIdx][nMIdx].p1 = winnerId; else targetB[nRIdx][nMIdx].p2 = winnerId; 
        } else if (bType === 'qualifiers') {
            // MAGIC: Q-Bracket Final Round Won! Inject into Main Draw.
            for (let i = 0; i < mainB[0].length; i++) {
                if (mainB[0][i].p1 && String(mainB[0][i].p1).startsWith('Q_SLOT_')) { mainB[0][i].p1 = winnerId; break; }
                if (mainB[0][i].p2 && String(mainB[0][i].p2).startsWith('Q_SLOT_')) { mainB[0][i].p2 = winnerId; break; }
            }
        }

        const tRef = window.fb.doc(db, 'artifacts', appId, 'public', 'data', 'tournaments', tournament.id);
        let updates = {};
        
        if (bType === 'main') {
            updates.bracket = JSON.stringify(mainB);
            if (rIdx === mainB.length - 1) { updates.status = 'completed'; updates.completedAt = Date.now(); }
        } else {
            updates.bracket_q = JSON.stringify(qB);
            updates.bracket = JSON.stringify(mainB); // Save the newly injected player!
        }

        await window.fb.updateDoc(tRef, updates);
        setResolvingMatch(null);
    };

    const handleRandomize = () => {
        const winnerId = Math.random() < 0.5 ? resolvingMatch.p1 : resolvingMatch.p2;
        submitResult(winnerId, 'random');
    };

    const handleSaveSettings = async (e) => {
        e.preventDefault();
        try {
            const tRef = window.fb.doc(db, 'artifacts', appId, 'public', 'data', 'tournaments', tournament.id);
            await window.fb.updateDoc(tRef, {
                name: editName.trim(),
                location: editLocation.trim(),
                hostCountry: editCountry,
                description: editDesc.trim()
            });
            setShowSettings(false);
        } catch (err) { console.error(err); }
    };

    const handleDelete = async () => {
        try { onBack(); await window.fb.deleteDoc(window.fb.doc(db, 'artifacts', appId, 'public', 'data', 'tournaments', tournament.id)); } catch(e) { console.error(e); }
    };

    const renderMatchParticipant = (match, pId, isTop, rIdx) => {
        const p = getPlayer(pId);
        const isBye = match.type === 'bye'; 
        const isTBD = pId == null || String(pId).startsWith('Q_SLOT');
        const isWinner = !isTBD && match.winner === pId && !isBye;
        const isLoser = !isTBD && match.winner != null && match.winner !== pId && !isBye;
        
        return (
            <div className={`relative px-2.5 py-1.5 flex items-center justify-between transition-colors h-[30px] ${isTop ? 'border-b border-white/[0.05]' : ''} ${isWinner ? 'bg-white/[0.08]' : 'bg-transparent'}`}>
                {isWinner && <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r shadow-[0_0_8px_rgba(255,255,255,0.8)]" style={{ backgroundColor: tierConf.hex }}></div>}
                
                <div className={`flex items-center gap-2 overflow-hidden w-full pr-2 transition-all duration-300 ${isLoser ? 'opacity-30 grayscale' : ''}`}>
                    {/* NEW: Clean display for BYE slots */}
                    {isTBD && isBye ? (
                        <span className="text-[10px] font-black text-white/20 tracking-widest uppercase ml-6">N/A</span>
                    ) : isTBD ? (
                        <><div className="w-4 h-4 rounded-full border border-white/10 bg-white/5 shrink-0 flex items-center justify-center"></div><span className="text-[9px] font-bold text-white/30 tracking-widest uppercase">TBD</span></>
                    ) : (
                        <>
                            <img referrerPolicy="no-referrer" src={p.images?.[0] || p.imageUrl || "https://via.placeholder.com/40"} loading="lazy" decoding="async" className={`w-4 h-4 rounded-full object-cover shrink-0 shadow-sm border ${isWinner ? 'border-white/40' : 'border-white/10'}`} />
                            <div className="flex flex-col min-w-0 justify-center">
                                <span onClick={tournament.status === 'completed' ? (e) => { e.stopPropagation(); onNavigate('players', pId); } : undefined} className={`text-[11px] flex items-center truncate ${isWinner ? 'text-white font-black drop-shadow-md' : 'text-white/70 font-bold'} ${tournament.status === 'completed' ? 'hover:underline cursor-pointer hover:text-gold-400' : ''}`}>
                                    <span className="text-xs drop-shadow-sm">{getFlag(p.nationality)}</span><span className="text-[8px] uppercase tracking-widest text-white/50 font-bold ml-1">{p.nationality}</span><span className="ml-1.5 truncate tracking-wide">{p.name}</span>
                                    {getSeedText(tournament, pId) && <span className="text-[8px] text-white/40 font-mono ml-1.5 shrink-0">{getSeedText(tournament, pId)}</span>}
                                </span>
                            </div>
                        </>
                    )}
                </div>
                {isWinner && (
                    <div className="flex items-center gap-1 ml-1 shrink-0">
                        {/* THE GREEN 'Q' BADGE (Side-by-side with result) */}
                        {masterView === 'qualifiers' && rIdx === totalRounds - 1 && (
                            <span className="text-[8px] font-black text-emerald-950 bg-emerald-400 px-1.5 py-0.5 rounded-sm shadow-[0_0_10px_rgba(52,211,153,0.4)] flex items-center">
                                Q
                            </span>
                        )}
                        {/* THE STANDARD RESULT BADGE */}
                        <span className="text-[8px] font-black text-black px-1.5 py-0.5 rounded-sm shadow-[0_0_10px_rgba(255,255,255,0.2)] flex items-center gap-1" style={{ backgroundColor: tierConf.hex }}>
                            {match.type === 'random' ? <><Shuffle size={8} strokeWidth={3}/> LUCK</> : match.type === 'lopsided' ? <><IconDom/> DOM</> : <><IconClose/> CLS</>}
                        </span>
                    </div>
                )}
                {/* Clean up the BYE display */}
                {isBye && <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest shrink-0 mr-1">BYE</span>}
            </div>
        );
    };

    const renderCompactRow = (pId, role, isChamp = false) => {
        if (!pId) return null;
        const p = getPlayer(pId);
        return (
            <div onClick={() => onNavigate('players', pId)} className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all hover:scale-[1.02] ${isChamp ? 'bg-gradient-to-r from-gold-500/20 to-white/5 border border-gold-500/40 shadow-md' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}>
                <div className="flex items-center gap-2.5">
                    <div className={`shrink-0 rounded-full ${isChamp ? 'border border-gold-400 p-0.5' : 'border border-white/20'}`}>
                        <img src={p.images?.[0] || p.imageUrl || "https://via.placeholder.com/40"} className={`object-cover rounded-full ${isChamp ? 'w-8 h-8' : 'w-7 h-7'}`} />
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                            <span className="text-sm drop-shadow-sm">{getFlag(p.nationality)}</span>
                            <h3 className={`font-black text-white truncate max-w-[140px] ${isChamp ? 'text-sm text-gold-400' : 'text-xs'}`}>{p.name}</h3>
                        </div>
                    </div>
                </div>
                <div className="pl-2 shrink-0 flex items-center gap-2">
                    {getSeedText(tournament, pId) && <span className="text-[8px] text-white/40 font-mono">{getSeedText(tournament, pId)}</span>}
                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${isChamp ? 'bg-gold-500 text-black' : role === 'Finalist' ? 'bg-slate-300 text-black' : 'bg-[#cd7f32] text-black'}`}>{role}</span>
                </div>
            </div>
        );
    };

    const mapQuery = tournament.location || `${tournament.name} ${getCountryName(tournament.hostCountry)}`;
    const finalMatch = activeBracket[totalRounds - 1] ? activeBracket[totalRounds - 1][0] : null;
    const showHeaderTrophy = !!finalMatch;

    return (
        <div className="h-full flex flex-col pb-20 relative max-w-[1600px] mx-auto w-full">
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#020617]">
                <iframe 
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=k&z=15&ie=UTF8&iwloc=near&output=embed`} 
                    className="w-[130%] h-[130%] -translate-x-[15%] -translate-y-[15%] opacity-50 saturate-[1.2] absolute left-0 top-0 transition-all duration-[3000ms] pointer-events-none" 
                    frameBorder="0" 
                    loading="lazy" 
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/50 via-[#020617]/10 to-[#020617]/90 z-10"></div>
            </div>

            <div className="flex justify-between items-start md:items-center mb-6 shrink-0 relative z-20 pt-4 px-4 xl:px-0">
                <div className="flex-1 min-w-0 mr-4">
                    <button onClick={onBack} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-3 text-sm font-medium drop-shadow-md">
                        <ArrowLeft className="w-4 h-4" /> Back to Tournaments
                    </button>
                    
                    <h1 
                        className="text-3xl md:text-4xl font-black text-white flex items-center gap-3 flex-wrap drop-shadow-lg cursor-pointer group"
                        onClick={() => setViewMode(v => v === 'bracket' ? 'info' : 'bracket')}
                    >
                        {['grand_slam', 'finals', 'major'].includes(getTournamentTier(tournament)) && (
                            <DynamicTrophy tier={getTournamentTier(tournament)} result="Winner" country={tournament.hostCountry} size={56} className="drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] shrink-0 group-hover:scale-110 transition-transform" />
                        )}
                        
                        <span className="text-4xl shrink-0" title={getCountryName(tournament.hostCountry || 'USA')}>{getFlag(tournament.hostCountry || 'USA')}</span>
                        <span className="truncate tracking-tight group-hover:text-gold-400 transition-colors">{tournament.name}</span>
                        
                        <span className="bg-white/10 text-white/80 px-3 py-1.5 rounded-lg text-[10px] font-black flex items-center gap-2 group-hover:bg-white/20 transition-all shadow-inner border border-white/10 uppercase tracking-widest shrink-0 ml-2">
                            {viewMode === 'bracket' ? (
                                <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg> Summary</>
                            ) : (
                                <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg> Bracket</>
                            )}
                        </span>
                        
                        {tournament.status === 'completed' && <span className="bg-[#059669]/20 text-[#059669] text-xs px-3 py-1.5 rounded-lg shrink-0 font-black tracking-widest uppercase border border-[#059669]/40 shadow-sm backdrop-blur-sm ml-auto">Completed</span>}
                    </h1>
                </div>

                <div className="shrink-0 mt-4 md:mt-0">
                    {isAdmin && (
                        <button onClick={() => setShowSettings(true)} className="w-12 h-12 flex items-center justify-center text-white/60 hover:text-white bg-white/5 hover:bg-white/20 backdrop-blur-xl rounded-2xl border border-white/10 transition-all hover:scale-105 shadow-sm group">
                            <Settings size={22} className="group-hover:rotate-90 transition-transform duration-500" />
                        </button>
                    )}
                </div>
            </div>

            {showSettings && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSettings(false)}></div>
                    <div className="bg-black/60 backdrop-blur-3xl border border-white/10 p-8 rounded-3xl w-full max-w-2xl relative z-10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                            <h2 className="text-2xl font-black text-white flex items-center gap-3"><Settings className="text-gold-400"/> Event Settings</h2>
                            <button onClick={() => setShowSettings(false)} className="text-white/40 hover:text-white bg-white/5 p-2 rounded-full transition-colors"><X size={20}/></button>
                        </div>
                        
                        <form onSubmit={handleSaveSettings} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Tournament Name</label>
                                <input type="text" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:border-gold-500/50 shadow-inner transition-colors" value={editName} onChange={e => setEditName(e.target.value)} />
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Location / City (For Map)</label>
                                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-gold-500/50 shadow-inner transition-colors" value={editLocation} onChange={e => setEditLocation(e.target.value)} placeholder="e.g. Palm Beach, Florida" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Host Country (Flag)</label>
                                    <div className="bg-white/5 border border-white/10 rounded-xl p-1 shadow-inner relative z-50">
                                        <CountrySelect value={editCountry} onChange={setEditCountry} />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Storyline / Description</label>
                                <textarea className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-gold-500/50 shadow-inner transition-colors h-24 custom-scrollbar resize-none" value={editDesc} onChange={e => setEditDesc(e.target.value)} placeholder="Enter tournament narrative here..."></textarea>
                            </div>
                            
                            <div className="flex justify-end pt-4">
                                <button type="submit" className="bg-gold-500 hover:bg-gold-400 text-black px-8 py-3.5 rounded-xl font-black tracking-wide transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)]">Save & Update Map</button>
                            </div>
                        </form>

                        <div className="mt-8 pt-6 border-t border-white/10">
                            {!showDelete ? (
                                <button type="button" onClick={() => setShowDelete(true)} className="text-rose-400 font-bold hover:text-rose-300 transition-colors text-xs flex items-center gap-2 uppercase tracking-widest"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg> Delete Tournament</button>
                            ) : (
                                <div className="p-4 border border-rose-500/30 bg-rose-500/10 rounded-2xl flex justify-between items-center animate-in fade-in zoom-in duration-200">
                                    <span className="text-rose-400 font-bold text-sm">Delete forever?</span>
                                    <div className="flex gap-2">
                                        <button type="button" onClick={handleDelete} className="bg-rose-500 hover:bg-rose-400 text-white transition-colors px-4 py-2 rounded-lg font-bold text-sm shadow-md">Confirm</button>
                                        <button type="button" onClick={() => setShowDelete(false)} className="text-white/60 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm transition-colors font-bold">Cancel</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {viewMode === 'info' ? (
                <div className="px-4 xl:px-0 relative z-20">
                    <div className="w-full max-w-lg bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-2xl animate-in slide-in-from-top-4 fade-in duration-500">
                        
                        {tournament.description && (
                            <div className="mb-5 pb-4 border-b border-white/10">
                                <p 
                                    onClick={() => setExpandedDesc(!expandedDesc)} 
                                    className={`text-white/70 text-xs font-medium leading-relaxed transition-all cursor-pointer ${expandedDesc ? '' : 'line-clamp-2'}`}
                                    title="Click to expand/collapse"
                                >
                                    {tournament.description}
                                </p>
                                {tournament.description.length > 100 && (
                                    <button onClick={() => setExpandedDesc(!expandedDesc)} className="text-[9px] font-black uppercase tracking-widest text-gold-400 mt-2 hover:text-gold-300 transition-colors">
                                        {expandedDesc ? 'Show Less' : 'Read More'}
                                    </button>
                                )}
                            </div>
                        )}

                        {(champion || finalist || semi1 || semi2) && (
                            <div className="space-y-2 mb-4">
                                {renderCompactRow(champion, 'Champion', true)}
                                {renderCompactRow(finalist, 'Finalist')}
                                <div className="grid grid-cols-2 gap-2">
                                    {renderCompactRow(semi1, 'SF')}
                                    {renderCompactRow(semi2, 'SF')}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between items-center bg-white/5 border border-white/10 p-2.5 rounded-xl">
                            <div className="text-center px-2"><div className="text-white/40 text-[8px] font-black uppercase tracking-widest">Matches</div><div className="text-white font-bold text-xs">{tStats.total}</div></div>
                            <div className="w-px h-6 bg-white/10"></div>
                            <div className="text-center px-2"><div className="text-[#34d399]/60 text-[8px] font-black uppercase tracking-widest">Close</div><div className="text-[#34d399] font-bold text-xs">{tStats.close}</div></div>
                            <div className="w-px h-6 bg-white/10"></div>
                            <div className="text-center px-2"><div className="text-[#60a5fa]/60 text-[8px] font-black uppercase tracking-widest">Dominant</div><div className="text-[#60a5fa] font-bold text-xs">{tStats.dom}</div></div>
                            <div className="w-px h-6 bg-white/10"></div>
                            <div className="text-center px-2"><div className="text-[#a78bfa]/60 text-[8px] font-black uppercase tracking-widest">Auto</div><div className="text-[#a78bfa] font-bold text-xs">{tStats.luck}</div></div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="relative w-full flex-1 flex flex-col">
                    {/* COMBINED HORIZONTAL NAVIGATION BAR */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 relative z-20 px-4 xl:px-0 gap-4">
                        {/* Child Tabs (Left Side) */}
                        <div className="flex-1 w-full overflow-x-auto custom-scrollbar pb-2 md:pb-0">
                            {tabs.length > 1 && (
                                <GlassTabs tabs={tabs} activeTab={activeTab} onChange={handleTabChange} activeColor={masterView === 'qualifiers' ? '#6366f1' : tierConf.hex} />
                            )}
                        </div>

                        {/* Master Toggle (Right Side) */}
                        {tournament.hasQualifiers && (
                            <div className="shrink-0 bg-black/40 backdrop-blur-xl p-1.5 rounded-2xl border border-white/10 flex gap-1 shadow-lg ml-auto">
                                <button onClick={() => { setMasterView('main'); setActiveTab('all'); }} className={`px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${masterView === 'main' ? 'bg-white text-black shadow-md' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>Main Draw</button>
                                <button onClick={() => { setMasterView('qualifiers'); setActiveTab('all'); }} className={`px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${masterView === 'qualifiers' ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'text-indigo-400/50 hover:text-indigo-300 hover:bg-indigo-500/10'}`}>Qualifiers</button>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 bg-white/5 backdrop-blur-2xl rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.6)] relative overflow-hidden border border-white/10 flex flex-col z-20 mx-4 xl:mx-0 animate-in fade-in zoom-in-95 duration-300">
                        <div className="flex-1 overflow-auto custom-scrollbar relative z-10 flex flex-col" ref={scrollContainerRef}>
                            
                            <div className="flex min-w-max sticky top-0 z-40 bg-black/50 backdrop-blur-3xl border-b border-white/10 py-3 px-8 shadow-xl">
                                {activeBracket.map((round, rIdx) => {
                                    if (!round.some((_, mIdx) => shouldShowMatch(activeTab, rIdx, mIdx, round.length))) return null;
                                    const isFinalRound = rIdx === totalRounds - 1;
                                    
                                    const roundName = rIdx === 2 ? 'Final' : (rIdx === 1 ? 'Semifinals' : 'Quarterfinals');
                                        const showHeaderTrophy = isFinalRound && round[0] && tournament.format === 'atp_finals';
                                        
                                        return (
                                            <div key={`header-${rIdx}`} className="w-56 shrink-0 mr-12 text-center flex flex-col items-center justify-end min-h-[40px]">
                                                {showHeaderTrophy && <DynamicTrophy tier="finals" result="Winner" country={tournament.hostCountry} size={40} className="mb-2 drop-shadow-2xl opacity-90" />}
                                                <div className="flex items-center justify-center gap-2 text-white font-black uppercase tracking-widest text-[11px] drop-shadow-md" style={{ color: isFinalRound ? tierConf.hex : undefined }}>
                                                    {isFinalRound && !showHeaderTrophy && <Trophy className="w-3 h-3 inline-block opacity-90 drop-shadow-md" style={{ color: tierConf.hex }} />}
                                                    {roundName}
                                                </div>
                                            </div>
                                        );
                                })}
                            </div>

                            <div className="flex min-w-max items-stretch relative z-10 px-8 pb-10 pt-6 flex-1 h-max">
                                {activeBracket.map((round, rIdx) => {
                                    if (!round.some((_, mIdx) => shouldShowMatch(activeTab, rIdx, mIdx, round.length))) return null;
                                    
                                    const hasNextRoundVisible = (() => {
                                        if (rIdx === totalRounds - 1) return false; 
                                        if (activeTab.startsWith('q') && rIdx === totalRounds - 3) return false; 
                                        if (activeTab.startsWith('s') && rIdx === totalRounds - 4) return false; 
                                        if ((activeTab === 'top' || activeTab === 'bottom') && rIdx === totalRounds - 2) return false; 
                                        return true;
                                    })();

                                    return (
                                        <div key={`col-${rIdx}`} className="flex flex-col w-56 shrink-0 mr-12 py-1 justify-around h-max min-h-full">
                                            {round.map((match, mIdx) => {
                                                if (!shouldShowMatch(activeTab, rIdx, mIdx, round.length)) return null;
                                                if (!match) return null;
                                                // Validate that both IDs exist and are NOT empty Q_SLOTs waiting for injection
                                                const p1Valid = match.p1 && !String(match.p1).startsWith('Q_SLOT');
                                                const p2Valid = match.p2 && !String(match.p2).startsWith('Q_SLOT');
                                                const isReady = p1Valid && p2Valid && !match.winner && tournament.status !== 'completed' && match.type !== 'bye';
                                                const isFirstVisibleRoundInTab = (activeTab === 'top' || activeTab === 'bottom' || activeTab === 'final16' || activeTab === 'final8' || activeTab.startsWith('q') || activeTab.startsWith('s')) 
                                                    ? !shouldShowMatch(activeTab, rIdx - 1, mIdx * 2, round.length * 2) : rIdx === 0;

                                                return (
                                                    <div key={match.id} className="relative flex flex-col justify-center py-2" style={{ flex: 1, minHeight: '80px' }}>
                                                        <div onClick={() => handleMatchClick(rIdx, mIdx, match)} 
                                                             className={`relative z-20 rounded-xl transition-all duration-300 overflow-hidden flex flex-col border ${
                                                                 isReady 
                                                                 ? 'cursor-pointer hover:scale-105 z-30 bg-white/[0.15] shadow-[0_8px_30px_rgba(0,0,0,0.5)] border-white/40 backdrop-blur-xl' 
                                                                 : match.winner 
                                                                    ? 'bg-black/50 border-white/10 shadow-md backdrop-blur-md' 
                                                                    : 'bg-black/20 border-white/[0.05] opacity-70 backdrop-blur-sm'
                                                             }`}
                                                             style={{ borderColor: isReady ? tierConf.hex : undefined, boxShadow: isReady ? `0 0 20px ${tierConf.hex}40` : undefined }}>
                                                            {renderMatchParticipant(match, match.p1, true, rIdx)}
                                                            <div className="h-px w-full bg-white/10"></div>
                                                            {renderMatchParticipant(match, match.p2, false, rIdx)}
                                                        </div>
                                                        
                                                        {rIdx > 0 && <div className="absolute -left-[24px] top-1/2 w-[24px] h-[2px] bg-white/30 z-10 shadow-md"></div>}
                                                        {hasNextRoundVisible && <div className="absolute -right-[24px] top-1/2 w-[24px] h-[2px] bg-white/30 z-10 shadow-md"></div>}
                                                        {hasNextRoundVisible && mIdx % 2 === 0 && <div className="absolute -right-[24px] top-1/2 w-[2px] bg-white/30 z-10 shadow-md" style={{ height: '100%' }}></div>}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <ResolveMatchModal resolvingMatch={resolvingMatch} setResolvingMatch={setResolvingMatch} submitResult={submitResult} handleRandomize={handleRandomize} players={players} allTournaments={allTournaments} tournament={tournament} tierConf={tierConf} onNavigate={onNavigate} />
        </div>
    );
}

export function SNBInternationalsBracket({ tournament, allTournaments = [], players, onBack, db, appId, onNavigate, isAdmin }) {
    const [viewMode, setViewMode] = useState(tournament.status === 'completed' ? 'info' : 'bracket');
    const [resolvingMatch, setResolvingMatch] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams(); // <-- ROUTER HOOK 
    
    const [showSettings, setShowSettings] = useState(false);
    const [editName, setEditName] = useState('');
    const [editLocation, setEditLocation] = useState('');
    const [editCountry, setEditCountry] = useState('');
    const [editDesc, setEditDesc] = useState('');
    const [showDelete, setShowDelete] = useState(false);
    const [expandedDesc, setExpandedDesc] = useState(false);

    useEffect(() => {
        if (tournament && showSettings) {
            setEditName(tournament.name || ''); setEditLocation(tournament.location || ''); setEditCountry(tournament.hostCountry || ''); setEditDesc(tournament.description || ''); setShowDelete(false);
        }
    }, [tournament, showSettings]);

    const getPlayer = (id) => players.find(p => p.id === id) || { name: 'TBD', rank: '-', nationality: 'UNK' };

    let groupMatches = []; let knockout = [[],[]];
    if (typeof tournament.groupMatches === 'string') { try { groupMatches = JSON.parse(tournament.groupMatches); } catch(e){} } else { groupMatches = tournament.groupMatches || []; }
    if (!Array.isArray(groupMatches)) groupMatches = [];
    if (typeof tournament.bracket === 'string') { try { knockout = JSON.parse(tournament.bracket); } catch(e){} } else { knockout = tournament.bracket || [[],[]]; }
    if (!Array.isArray(knockout) || knockout.length < 2) knockout = [[],[]];

    const standingsA = useMemo(() => calcGroupStandings('A', groupMatches), [groupMatches]);
    const standingsB = useMemo(() => calcGroupStandings('B', groupMatches), [groupMatches]);
    const standingsC = useMemo(() => calcGroupStandings('C', groupMatches), [groupMatches]);
    const standingsD = useMemo(() => calcGroupStandings('D', groupMatches), [groupMatches]);
    
    // NEW: Groups E-H
    const standingsE = useMemo(() => calcGroupStandings('E', groupMatches), [groupMatches]);
    const standingsF = useMemo(() => calcGroupStandings('F', groupMatches), [groupMatches]);
    const standingsG = useMemo(() => calcGroupStandings('G', groupMatches), [groupMatches]);
    const standingsH = useMemo(() => calcGroupStandings('H', groupMatches), [groupMatches]);

    // UPDATE Expected Matches: 8 groups * 6 matches = 48 matches total
    const expectedMatches = tournament.format === 'pro_am' || tournament.format === 'challenger_elite' ? 48 : 12;

    const isGroupStageComplete = useMemo(() => { return groupMatches.length === expectedMatches && groupMatches.every(m => m && m.winner); }, [groupMatches, expectedMatches]);

    const tStats = { total: 0, close: 0, dom: 0, luck: 0 };
    let champion = null, finalist = null, semi1 = null, semi2 = null;

    [...groupMatches, ...(knockout.flat())].forEach(m => {
        if (m && m.winner && m.type !== 'bye') {
            tStats.total++;
            if (m.type === 'close') tStats.close++; else if (m.type === 'lopsided') tStats.dom++; else if (m.type === 'random') tStats.luck++;
        }
    });

    const totalRounds = knockout.length;
    if (totalRounds > 0 && knockout[totalRounds - 1] && knockout[totalRounds - 1][0] && knockout[totalRounds - 1][0].winner) {
        const fMatch = knockout[totalRounds - 1][0];
        champion = fMatch.winner; finalist = fMatch.p1 === fMatch.winner ? fMatch.p2 : fMatch.p1;
    }
    if (totalRounds > 1 && knockout[totalRounds - 2] && knockout[totalRounds - 2].length >= 2) {
        const s1 = knockout[totalRounds - 2][0]; const s2 = knockout[totalRounds - 2][1];
        if (s1 && s1.winner) semi1 = s1.p1 === s1.winner ? s1.p2 : s1.p1;
        if (s2 && s2.winner) semi2 = s2.p1 === s2.winner ? s2.p2 : s2.p1;
    }

    // --- NEW: URL-DRIVEN MATCH STATE ---
    const urlMatchId = searchParams.get('match');

    useEffect(() => {
        if (!urlMatchId) { setResolvingMatch(null); return; }
        
        let foundMatch = null; let mType = null; let mIndex = null; let rIndex = null;
        
        groupMatches.forEach((m, idx) => { if (m && m.id === urlMatchId) { foundMatch = m; mType = 'group'; mIndex = idx; } });
        if (!foundMatch) {
            knockout.forEach((round, rIdx) => {
                if (!Array.isArray(round)) return;
                round.forEach((m, idx) => { if (m && m.id === urlMatchId) { foundMatch = m; mType = 'knockout'; mIndex = idx; rIndex = rIdx; } });
            });
        }
        
        if (foundMatch && !foundMatch.winner) {
            setResolvingMatch({ matchType: mType, matchIndex: mIndex, roundIndex: rIndex, ...foundMatch });
        } else {
            setSearchParams({}); // Close modal if URL is invalid or match is already won
        }
    }, [urlMatchId, tournament.id]); 

    // Update click handler to change URL instead of local state
    const handleMatchClick = (type, mIdx, match, rIdx = null) => {
        if (tournament.status === 'completed' || !match || !match.p1 || !match.p2 || match.winner) return;
        setSearchParams({ match: match.id }); 
    };

    const submitResult = async (winnerId, winType) => {
        const newT = JSON.parse(JSON.stringify(tournament));
        const { matchType, matchIndex, roundIndex: rIdx } = resolvingMatch;

        let parsedGM = []; let parsedKO = [[], []];
        try { parsedGM = typeof newT.groupMatches === 'string' ? JSON.parse(newT.groupMatches) : newT.groupMatches; } catch(e){}
        try { parsedKO = typeof newT.bracket === 'string' ? JSON.parse(newT.bracket) : newT.bracket; } catch(e){}

        if (matchType === 'group') {
            parsedGM[matchIndex].winner = winnerId; parsedGM[matchIndex].type = winType;
            
            // SMART CHECK: Determine exactly which groups are 100% finished
            const isGroupDone = (groupId) => {
                const matches = parsedGM.filter(m => m && m.group === groupId);
                return matches.length > 0 && matches.every(m => m.winner);
            };

            const sA = calcGroupStandings('A', parsedGM); const aDone = isGroupDone('A');
            const sB = calcGroupStandings('B', parsedGM); const bDone = isGroupDone('B');
            const sC = calcGroupStandings('C', parsedGM); const cDone = isGroupDone('C');
            const sD = calcGroupStandings('D', parsedGM); const dDone = isGroupDone('D');

            if (tournament.format === 'pro_am' || tournament.format === 'challenger_elite') {
                
                // BULLETPROOF AUTO-DETECT INJECTION LOGIC
                if (parsedKO[0]?.length === 8) {
                    // 32-Player Draw -> Round of 16 Starts
                    const sE = calcGroupStandings('E', parsedGM); const eDone = isGroupDone('E');
                    const sF = calcGroupStandings('F', parsedGM); const fDone = isGroupDone('F');
                    const sG = calcGroupStandings('G', parsedGM); const gDone = isGroupDone('G');
                    const sH = calcGroupStandings('H', parsedGM); const hDone = isGroupDone('H');
                    
                    if(aDone) { parsedKO[0][0].p1 = sA[0]?.id; parsedKO[0][4].p2 = sA[1]?.id; }
                    if(bDone) { parsedKO[0][0].p2 = sB[1]?.id; parsedKO[0][4].p1 = sB[0]?.id; }
                    if(cDone) { parsedKO[0][1].p1 = sC[0]?.id; parsedKO[0][5].p2 = sC[1]?.id; }
                    if(dDone) { parsedKO[0][1].p2 = sD[1]?.id; parsedKO[0][5].p1 = sD[0]?.id; }
                    if(eDone) { parsedKO[0][2].p1 = sE[0]?.id; parsedKO[0][6].p2 = sE[1]?.id; }
                    if(fDone) { parsedKO[0][2].p2 = sF[1]?.id; parsedKO[0][6].p1 = sF[0]?.id; }
                    if(gDone) { parsedKO[0][3].p1 = sG[0]?.id; parsedKO[0][7].p2 = sG[1]?.id; }
                    if(hDone) { parsedKO[0][3].p2 = sH[1]?.id; parsedKO[0][7].p1 = sH[0]?.id; }
                } 
                else if (parsedKO[0]?.length === 4) {
                    // NEW 16-Player Draw -> Quarterfinals Starts
                    if(aDone) { parsedKO[0][0].p1 = sA[0]?.id; parsedKO[0][2].p2 = sA[1]?.id; }
                    if(bDone) { parsedKO[0][0].p2 = sB[1]?.id; parsedKO[0][2].p1 = sB[0]?.id; }
                    if(cDone) { parsedKO[0][1].p1 = sC[0]?.id; parsedKO[0][3].p2 = sC[1]?.id; }
                    if(dDone) { parsedKO[0][1].p2 = sD[1]?.id; parsedKO[0][3].p1 = sD[0]?.id; }
                } 
                else if (parsedKO[0]?.length === 2) {
                    // OLD LEGACY 16-Player Draw -> Semifinals Starts
                    if(aDone) parsedKO[0][0].p1 = sA[0]?.id;
                    if(cDone) parsedKO[0][0].p2 = sC[0]?.id;
                    if(bDone) parsedKO[0][1].p1 = sB[0]?.id;
                    if(dDone) parsedKO[0][1].p2 = sD[0]?.id;
                }
            } else {
                // ATP Finals (8 Players) -> Semifinals Starts
                if(aDone) { parsedKO[0][0].p1 = sA[0]?.id; parsedKO[0][1].p2 = sA[1]?.id; }
                if(bDone) { parsedKO[0][0].p2 = sB[1]?.id; parsedKO[0][1].p1 = sB[0]?.id; }
            }
        } else if (matchType === 'knockout') {
            parsedKO[rIdx][matchIndex].winner = winnerId; parsedKO[rIdx][matchIndex].type = winType;
            if (rIdx < parsedKO.length - 1) {
                const nRIdx = rIdx + 1; const nMIdx = Math.floor(matchIndex / 2);
                if (matchIndex % 2 === 0) parsedKO[nRIdx][nMIdx].p1 = winnerId; else parsedKO[nRIdx][nMIdx].p2 = winnerId;
            } else {
                newT.status = 'completed'; newT.completedAt = Date.now();
            }
        }
        
        newT.groupMatches = JSON.stringify(parsedGM); newT.bracket = JSON.stringify(parsedKO);
        await window.fb.updateDoc(window.fb.doc(db, 'artifacts', appId, 'public', 'data', 'tournaments', tournament.id), newT);
        setResolvingMatch(null);
    };

    const handleRandomize = () => { const winnerId = Math.random() < 0.5 ? resolvingMatch.p1 : resolvingMatch.p2; submitResult(winnerId, 'random'); };
    
    const handleSaveSettings = async (e) => {
        e.preventDefault();
        try {
            const tRef = window.fb.doc(db, 'artifacts', appId, 'public', 'data', 'tournaments', tournament.id);
            await window.fb.updateDoc(tRef, { name: editName.trim(), location: editLocation.trim(), hostCountry: editCountry, description: editDesc.trim() });
            setShowSettings(false);
        } catch (err) { console.error(err); }
    };

    const handleDelete = async () => { try { onBack(); await window.fb.deleteDoc(window.fb.doc(db, 'artifacts', appId, 'public', 'data', 'tournaments', tournament.id)); } catch(e) { console.error(e); } };

    const rawTier = getTournamentTier(tournament);
    const tierConf = TOURNAMENT_TIERS[rawTier] || TOURNAMENT_TIERS['pro_am'];
    
    const IconDom = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>;
    const IconClose = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>;

    const renderMatchParticipant = (match, pId, isTop) => {
        const p = getPlayer(pId); 
        const isBye = match.type === 'bye'; 
        const isTBD = pId == null;
        const isWinner = !isTBD && match.winner === pId && !isBye; 
        const isLoser = !isTBD && match.winner != null && match.winner !== pId && !isBye;
        
        return (
            <div className={`relative px-2.5 py-1.5 flex items-center justify-between transition-colors h-[30px] ${isTop ? 'border-b border-white/[0.05]' : ''} ${isWinner ? 'bg-white/[0.08]' : 'bg-transparent'}`}>
                {isWinner && <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r shadow-[0_0_8px_rgba(255,255,255,0.8)]" style={{ backgroundColor: tierConf.hex }}></div>}
                <div className={`flex items-center gap-2 overflow-hidden w-full pr-2 transition-all duration-300 ${isLoser ? 'opacity-30 grayscale' : ''}`}>
                    {isTBD ? ( <><div className="w-4 h-4 rounded-full border border-white/10 bg-white/5 shrink-0 flex items-center justify-center"></div><span className="text-[9px] font-bold text-white/30 tracking-widest uppercase">TBD</span></> ) : (
                        <>
                            {/* HOTLINK FIX KEPT HERE */}
                            <img referrerPolicy="no-referrer" src={p.images?.[0] || p.imageUrl || "https://via.placeholder.com/40"} loading="lazy" decoding="async" className={`w-4 h-4 rounded-full object-cover shrink-0 shadow-sm border ${isWinner ? 'border-white/40' : 'border-white/10'}`} />
                            <div className="flex flex-col min-w-0 justify-center">
                                <span onClick={tournament.status === 'completed' ? (e) => { e.stopPropagation(); onNavigate('players', pId); } : undefined} className={`text-[11px] flex items-center truncate ${isWinner ? 'text-white font-black drop-shadow-md' : 'text-white/70 font-bold'} ${tournament.status === 'completed' ? 'hover:underline cursor-pointer hover:text-gold-400' : ''}`}>
                                    <span className="text-xs drop-shadow-sm">{getFlag(p.nationality)}</span><span className="text-[8px] uppercase tracking-widest text-white/50 font-bold ml-1">{p.nationality}</span><span className="ml-1.5 truncate tracking-wide">{p.name}</span>
                                    {getSeedText(tournament, pId) && <span className="text-[8px] text-white/40 font-mono ml-1.5 shrink-0">{getSeedText(tournament, pId)}</span>}
                                </span>
                            </div>
                        </>
                    )}
                </div>
                {isWinner && (
                    <div className="flex items-center gap-1 ml-1 shrink-0">
                        <span className="text-[8px] font-black text-black px-1.5 py-0.5 rounded-sm shadow-[0_0_10px_rgba(255,255,255,0.2)] flex items-center gap-1" style={{ backgroundColor: tierConf.hex }}>
                            {match.type === 'random' ? <><Shuffle size={8} strokeWidth={3}/> LUCK</> : match.type === 'lopsided' ? <><IconDom/> DOM</> : <><IconClose/> CLS</>}
                        </span>
                    </div>
                )}
                {isBye && <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest shrink-0 mr-1">BYE</span>}
            </div>
        );
    };

    const renderCompactRow = (pId, role, isChamp = false) => {
        if (!pId) return null; const p = getPlayer(pId);
        return (
            <div onClick={() => onNavigate('players', pId)} className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all hover:scale-[1.02] ${isChamp ? 'bg-gradient-to-r from-gold-500/20 to-white/5 border border-gold-500/40 shadow-md' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}>
                <div className="flex items-center gap-2.5">
                    <div className={`shrink-0 rounded-full ${isChamp ? 'border border-gold-400 p-0.5' : 'border border-white/20'}`}>
                        <img src={p.images?.[0] || p.imageUrl || "https://via.placeholder.com/40"} className={`object-cover rounded-full ${isChamp ? 'w-8 h-8' : 'w-7 h-7'}`} />
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="text-sm drop-shadow-sm">{getFlag(p.nationality)}</span>
                        <h3 className={`font-black text-white truncate max-w-[140px] ${isChamp ? 'text-sm text-gold-400' : 'text-xs'}`}>{p.name}</h3>
                    </div>
                </div>
                <div className="pl-2 shrink-0 flex items-center gap-2">
                    {getSeedText(tournament, pId) && <span className="text-[8px] text-white/40 font-mono">{getSeedText(tournament, pId)}</span>}
                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${isChamp ? 'bg-gold-500 text-black' : role === 'Finalist' ? 'bg-slate-300 text-black' : 'bg-[#cd7f32] text-black'}`}>{role}</span>
                </div>
            </div>
        );
    };

    const getPlayerGroupForm = (playerId, matches) => {
        const pMatches = matches.filter(m => m && (m.p1 === playerId || m.p2 === playerId));
        return pMatches.map(m => {
            if (!m.winner) return null;
            return m.winner === playerId ? 'W' : 'L';
        });
    };

    const renderStandingsTable = (groupName, standings) => {
        // NEW: Check if THIS specific group is done, so it highlights instantly!
        const groupMatchesForThisGroup = groupMatches.filter(m => m && m.group === groupName);
        const isThisGroupComplete = groupMatchesForThisGroup.length > 0 && groupMatchesForThisGroup.every(m => m.winner);

        return (
            <div className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.4)] w-full flex flex-col shrink-0">
                <div className="bg-black/40 px-4 py-2 border-b border-white/10 font-black text-white flex justify-between items-center tracking-wide">
                    <span className="text-base">Group {groupName}</span>
                    {isThisGroupComplete && <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-md uppercase tracking-widest border border-emerald-500/30">Final</span>}
                </div>
                <div className="p-2 pb-3">
                    <table className="w-full text-left text-[11px]">
                        <thead className="text-white/50 text-[8px] uppercase tracking-widest border-b border-white/5">
                            <tr>
                                <th className="px-2 py-1.5 font-bold">Player</th>
                                <th className="px-2 py-1.5 text-center font-bold">W-L</th>
                                <th className="px-2 py-1.5 text-center font-bold">TB</th>
                                <th className="px-2 py-1.5 text-center font-bold">Form</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-white font-medium">
                            {standings.map((s, idx) => {
                                const p = getPlayer(s.id); 
                                const isAdvancing = isThisGroupComplete && idx < 2; // HIGHLIGHTS INSTANTLY
                                const rawForm = getPlayerGroupForm(s.id, groupMatches);
                                const paddedForm = [...rawForm, ...Array(Math.max(0, 3 - rawForm.length)).fill(null)].slice(0, 3);

                                return (
                                    <tr key={s.id} className={`transition-colors ${isAdvancing ? 'bg-emerald-500/10 rounded-lg' : 'hover:bg-white/5'}`}>
                                        {/* ... [Keep all the exact same <td> data rendering you currently have inside this map] ... */}
                                        <td className="px-2 py-2 flex items-center gap-1.5">
                                            <span className={`w-4 h-4 flex items-center justify-center rounded-full text-[8px] font-black shadow-sm shrink-0 ${isAdvancing ? 'bg-emerald-500 text-black shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'bg-white/10 text-white/80 border border-white/10'}`}>{idx+1}</span>
                                            <span onClick={tournament.status === 'completed' ? (e) => { e.stopPropagation(); onNavigate('players', s.id); } : undefined} className={`truncate flex items-center min-w-0 ${tournament.status === 'completed' ? 'cursor-pointer hover:text-gold-400 hover:underline' : ''}`}>
                                                <span className="text-sm drop-shadow-sm mr-1.5 shrink-0">{getFlag(p.nationality)}</span>
                                                <span className="font-bold text-xs truncate tracking-tight">{p.name}</span>
                                            </span>
                                        </td>
                                        <td className="px-2 py-2 text-center font-bold tabular-nums text-xs">{s.wins}-{s.losses}</td>
                                        <td className={`px-2 py-2 text-center font-bold tabular-nums text-xs ${s.tiebreaker > 0 ? 'text-emerald-400' : s.tiebreaker < 0 ? 'text-rose-400' : 'text-white/40'}`}>{s.tiebreaker > 0 ? `+${s.tiebreaker}` : s.tiebreaker}</td>
                                        <td className="px-2 py-2">
                                            <div className="flex items-center justify-center gap-1">
                                                {paddedForm.map((res, i) => (
                                                    <div key={i} title={res === 'W' ? 'Win' : res === 'L' ? 'Loss' : 'Unplayed'} 
                                                         className={`w-1.5 h-1.5 rounded-full shadow-inner ${res === 'W' ? 'bg-emerald-500' : res === 'L' ? 'bg-rose-500' : 'bg-white/10'}`} />
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const renderMatchGroup = (groupName) => {
        const matches = groupMatches.filter(m => m && m.group === groupName);
        return (
            <div className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.4)] flex flex-col h-full">
                <div className="bg-black/40 px-5 py-3.5 border-b border-white/10 flex items-center justify-between">
                    <h3 className="font-black text-white/70 text-[11px] uppercase tracking-widest">Group {groupName} Schedule</h3>
                </div>
                <div className="p-3 flex flex-col gap-2 flex-1 justify-around">
                    {matches.map(match => {
                        const mIdx = groupMatches.findIndex(m => m && m.id === match.id);
                        const isReady = !match.winner;
                        return (
                            <div key={match.id} onClick={() => handleMatchClick('group', mIdx, match)} 
                                 className={`rounded-2xl transition-all duration-300 overflow-hidden shadow-sm border ${isReady ? 'hover:-translate-y-0.5 hover:shadow-md cursor-pointer z-20 bg-white/10 border-white/30' : 'bg-black/40 border-white/5 opacity-80'}`} 
                                 style={{ borderColor: isReady ? tierConf.hex : undefined, boxShadow: isReady ? `0 4px 15px ${tierConf.hex}20` : undefined }}>
                                <div className="flex flex-col">
                                    {renderMatchParticipant(match, match.p1, true)}
                                    <div className="h-px w-full bg-white/5"></div>
                                    {renderMatchParticipant(match, match.p2, false)}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const mapQuery = tournament.location || `${tournament.name} ${getCountryName(tournament.hostCountry)}`;
    
    // Calculate a strict height floor based on the first round's match count. This prevents CSS collapse!
    const baseKnockoutHeight = Math.max(400, (knockout[0]?.length || 1) * 110);

    return (
        <div className="min-h-full flex flex-col pb-20 relative max-w-[1600px] mx-auto w-full">
            
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#020617]">
                <iframe 
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=k&z=15&ie=UTF8&iwloc=near&output=embed`} 
                    className="w-[130%] h-[130%] -translate-x-[15%] -translate-y-[15%] opacity-50 saturate-[1.2] absolute left-0 top-0 transition-all duration-[3000ms] pointer-events-none" 
                    frameBorder="0" 
                    loading="lazy" 
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/50 via-[#020617]/10 to-[#020617]/90 z-10"></div>
            </div>

            <div className="flex justify-between items-start md:items-center mb-6 shrink-0 relative z-20 pt-4 px-4 xl:px-0">
                <div className="flex-1 min-w-0 mr-4">
                    <button onClick={onBack} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-3 text-sm font-medium drop-shadow-md">
                        <ArrowLeft className="w-4 h-4" /> Back to Tournaments
                    </button>
                    <h1 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3 flex-wrap drop-shadow-lg cursor-pointer group" onClick={() => setViewMode(v => v === 'bracket' ? 'info' : 'bracket')}>
                        {/* THE TROPHY FIX: Only show in header if it's NOT a Pro-Am */}
                        {['grand_slam', 'finals', 'major'].includes(rawTier) && tournament.format !== 'pro_am' && (
                            <DynamicTrophy tier={rawTier} result="Winner" country={tournament.hostCountry} size={56} className="drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] shrink-0 group-hover:scale-110 transition-transform" />
                        )}
                        <span className="text-4xl shrink-0" title={getCountryName(tournament.hostCountry || 'USA')}>{getFlag(tournament.hostCountry || 'USA')}</span>
                        <span className="truncate tracking-tight group-hover:text-gold-400 transition-colors">{tournament.name}</span>
                        <span className="bg-white/10 text-white/80 px-3 py-1.5 rounded-lg text-[10px] font-black flex items-center gap-2 group-hover:bg-white/20 transition-all shadow-inner border border-white/10 uppercase tracking-widest shrink-0 ml-2">
                            {viewMode === 'bracket' ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg> Summary</> : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg> Bracket</>}
                        </span>
                        {tournament.status === 'completed' && <span className="bg-[#059669]/20 text-[#059669] text-xs px-3 py-1.5 rounded-lg shrink-0 font-black tracking-widest uppercase border border-[#059669]/40 shadow-sm backdrop-blur-sm ml-auto">Completed</span>}
                    </h1>
                </div>
                <div className="shrink-0 mt-4 md:mt-0">
                    {isAdmin && (
                        <button onClick={() => setShowSettings(true)} className="w-12 h-12 flex items-center justify-center text-white/60 hover:text-white bg-white/5 hover:bg-white/20 backdrop-blur-xl rounded-2xl border border-white/10 transition-all hover:scale-105 shadow-sm group">
                            <Settings size={22} className="group-hover:rotate-90 transition-transform duration-500" />
                        </button>
                    )}
                </div>
            </div>

            {showSettings && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSettings(false)}></div>
                    <div className="bg-black/60 backdrop-blur-3xl border border-white/10 p-8 rounded-3xl w-full max-w-2xl relative z-10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                            <h2 className="text-2xl font-black text-white flex items-center gap-3"><Settings className="text-gold-400"/> Event Settings</h2>
                            <button onClick={() => setShowSettings(false)} className="text-white/40 hover:text-white bg-white/5 p-2 rounded-full transition-colors"><X size={20}/></button>
                        </div>
                        <form onSubmit={handleSaveSettings} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Tournament Name</label>
                                <input type="text" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:border-gold-500/50 shadow-inner transition-colors" value={editName} onChange={e => setEditName(e.target.value)} />
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Location / City (For Map)</label>
                                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-gold-500/50 shadow-inner transition-colors" value={editLocation} onChange={e => setEditLocation(e.target.value)} placeholder="e.g. Palm Beach, Florida" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Host Country (Flag)</label>
                                    <div className="bg-white/5 border border-white/10 rounded-xl p-1 shadow-inner relative z-50">
                                        <CountrySelect value={editCountry} onChange={setEditCountry} players={players} />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Storyline / Description</label>
                                <textarea className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-gold-500/50 shadow-inner transition-colors h-24 custom-scrollbar resize-none" value={editDesc} onChange={e => setEditDesc(e.target.value)} placeholder="Enter tournament narrative here..."></textarea>
                            </div>
                            <div className="flex justify-end pt-4">
                                <button type="submit" className="bg-gold-500 hover:bg-gold-400 text-black px-8 py-3.5 rounded-xl font-black tracking-wide transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)]">Save & Update Map</button>
                            </div>
                        </form>
                        <div className="mt-8 pt-6 border-t border-white/10">
                            {!showDelete ? (
                                <button type="button" onClick={() => setShowDelete(true)} className="text-rose-400 font-bold hover:text-rose-300 transition-colors text-xs flex items-center gap-2 uppercase tracking-widest"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg> Delete Tournament</button>
                            ) : (
                                <div className="p-4 border border-rose-500/30 bg-rose-500/10 rounded-2xl flex justify-between items-center animate-in fade-in zoom-in duration-200">
                                    <span className="text-rose-400 font-bold text-sm">Delete forever?</span>
                                    <div className="flex gap-2">
                                        <button type="button" onClick={handleDelete} className="bg-rose-500 hover:bg-rose-400 text-white transition-colors px-4 py-2 rounded-lg font-bold text-sm shadow-md">Confirm</button>
                                        <button type="button" onClick={() => setShowDelete(false)} className="text-white/60 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm transition-colors font-bold">Cancel</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {viewMode === 'info' ? (
                <div className="px-4 xl:px-0 relative z-20">
                    <div className="w-full max-w-lg bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-2xl animate-in slide-in-from-top-4 fade-in duration-500">
                        {tournament.description && (
                            <div className="mb-5 pb-4 border-b border-white/10">
                                <p onClick={() => setExpandedDesc(!expandedDesc)} className={`text-white/70 text-xs font-medium leading-relaxed transition-all cursor-pointer ${expandedDesc ? '' : 'line-clamp-2'}`} title="Click to expand/collapse">
                                    {tournament.description}
                                </p>
                                {tournament.description.length > 100 && (
                                    <button onClick={() => setExpandedDesc(!expandedDesc)} className="text-[9px] font-black uppercase tracking-widest text-gold-400 mt-2 hover:text-gold-300 transition-colors">
                                        {expandedDesc ? 'Show Less' : 'Read More'}
                                    </button>
                                )}
                            </div>
                        )}

                        {(champion || finalist || semi1 || semi2) && (
                            <div className="space-y-2 mb-4">
                                {renderCompactRow(champion, 'Champion', true)}
                                {renderCompactRow(finalist, 'Finalist')}
                                <div className="grid grid-cols-2 gap-2">
                                    {renderCompactRow(semi1, 'SF')}
                                    {renderCompactRow(semi2, 'SF')}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between items-center bg-white/5 border border-white/10 p-2.5 rounded-xl">
                            <div className="text-center px-2"><div className="text-white/40 text-[8px] font-black uppercase tracking-widest">Matches</div><div className="text-white font-bold text-xs">{tStats.total}</div></div>
                            <div className="w-px h-6 bg-white/10"></div>
                            <div className="text-center px-2"><div className="text-[#34d399]/60 text-[8px] font-black uppercase tracking-widest">Close</div><div className="text-[#34d399] font-bold text-xs">{tStats.close}</div></div>
                            <div className="w-px h-6 bg-white/10"></div>
                            <div className="text-center px-2"><div className="text-[#60a5fa]/60 text-[8px] font-black uppercase tracking-widest">Dominant</div><div className="text-[#60a5fa] font-bold text-xs">{tStats.dom}</div></div>
                            <div className="w-px h-6 bg-white/10"></div>
                            <div className="text-center px-2"><div className="text-[#a78bfa]/60 text-[8px] font-black uppercase tracking-widest">Auto</div><div className="text-[#a78bfa] font-bold text-xs">{tStats.luck}</div></div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col relative z-20 animate-in fade-in zoom-in-95 duration-300">
                    
                    {/* --- THE UNIVERSAL DYNAMIC GROUP STAGE LAYOUT --- */}
                    {(() => {
                        // Dynamically check which groups actually have matches!
                        const groupsToRender = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].filter(g => 
                            groupMatches.some(m => m && m.group === g)
                        );
                        
                        const standingsMap = {
                            A: standingsA, B: standingsB, C: standingsC, D: standingsD,
                            E: standingsE, F: standingsF, G: standingsG, H: standingsH
                        };

                        return (
                            <div className={`grid md:grid-cols-2 ${groupsToRender.length >= 4 ? 'xl:grid-cols-4' : ''} gap-6 px-4 xl:px-0 mb-6 shrink-0`}>
                                {groupsToRender.map(g => (
                                    <div key={g} className="flex flex-col gap-6">
                                        {renderStandingsTable(g, standingsMap[g])}
                                        {renderMatchGroup(g)}
                                    </div>
                                ))}
                            </div>
                        );
                    })()}

                    {/* Knockout Stage - WITH FORCED HEIGHT MATHEMATICS */}
                    <div className="flex-1 flex flex-col px-4 xl:px-0">
                        <div className="flex items-center gap-4 mb-4">
                            <h2 className="text-xl font-black text-white tracking-tight drop-shadow-md">Knockout Stage</h2>
                            <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent"></div>
                        </div>
                        
                        <div className="flex-1 bg-white/5 backdrop-blur-2xl rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.6)] relative overflow-hidden border border-white/10 flex flex-col z-20 mb-6">
                            <div className="flex-1 overflow-auto custom-scrollbar relative z-10 flex flex-col">
                                
                                <div className="flex min-w-max sticky top-0 z-40 bg-black/50 backdrop-blur-3xl border-b border-white/10 py-3 px-8 shadow-xl">
                                    {knockout.map((round, rIdx) => {
                                        if (!Array.isArray(round)) return null;
                                        const isFinalRound = rIdx === totalRounds - 1;
                                        
                                        // DYNAMIC ROUND NAMES (Works for both 16 and 32 player sizes!)
                                        let roundName = 'Round of 16';
                                        if (isFinalRound) roundName = 'Final';
                                        else if (rIdx === totalRounds - 2) roundName = 'Semifinals';
                                        else if (rIdx === totalRounds - 3) roundName = 'Quarterfinals';
                                        
                                        // ONLY SHOW HEADER TROPHY IF ATP FINALS
                                        const showHeaderTrophy = isFinalRound && round[0] && tournament.format === 'atp_finals';
                                        
                                        return (
                                            <div key={`header-${rIdx}`} className="w-56 shrink-0 mr-12 text-center flex flex-col items-center justify-end min-h-[40px]">
                                                {showHeaderTrophy && <DynamicTrophy tier="finals" result="Winner" country={tournament.hostCountry} size={40} className="mb-2 drop-shadow-2xl opacity-90" />}
                                                <div className="flex items-center justify-center gap-2 text-white font-black uppercase tracking-widest text-[11px] drop-shadow-md" style={{ color: isFinalRound ? tierConf.hex : undefined }}>
                                                    {isFinalRound && !showHeaderTrophy && <Trophy className="w-3 h-3 inline-block opacity-90 drop-shadow-md" style={{ color: tierConf.hex }} />}
                                                    {roundName}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="flex min-w-max items-stretch relative z-10 px-8 pb-10 pt-6 flex-1" style={{ minHeight: `${baseKnockoutHeight}px` }}>
                                    {knockout.map((round, rIdx) => {
                                        if (!Array.isArray(round)) return null;
                                        const hasNextRoundVisible = rIdx < totalRounds - 1;
                                        
                                        return (
                                        <div key={`col-${rIdx}`} className="flex flex-col w-56 shrink-0 mr-12 py-1">
                                            {round.map((match, mIdx) => {
                                                if (!match) return <div key={`empty-${mIdx}`} style={{ flex: 1 }}></div>;
                                                const isReady = match.p1 && match.p2 && !match.winner && tournament.status !== 'completed';
                                                
                                                return (
                                                    <div key={match.id} className="relative flex flex-col justify-center" style={{ flex: 1, minHeight: '80px' }}>
                                                        <div onClick={() => handleMatchClick('knockout', mIdx, match, rIdx)} 
                                                             className={`relative z-20 rounded-xl transition-all duration-300 overflow-hidden flex flex-col border ${
                                                                 isReady ? 'cursor-pointer hover:scale-105 z-30 bg-white/[0.15] shadow-[0_8px_30px_rgba(0,0,0,0.5)] border-white/40 backdrop-blur-xl' : match.winner ? 'bg-black/50 border-white/10 shadow-md backdrop-blur-md' : 'bg-black/20 border-white/[0.05] opacity-70 backdrop-blur-sm'
                                                             }`} style={{ borderColor: isReady ? tierConf.hex : undefined, boxShadow: isReady ? `0 0 20px ${tierConf.hex}40` : undefined }}>
                                                                {renderMatchParticipant(match, match.p1, true)}
                                                                <div className="h-px w-full bg-white/10"></div>
                                                                {renderMatchParticipant(match, match.p2, false)}
                                                        </div>
                                                        
                                                        {rIdx > 0 && <div className="absolute -left-[24px] top-1/2 w-[24px] h-[2px] bg-white/30 z-10 shadow-md"></div>}
                                                        {hasNextRoundVisible && <div className="absolute -right-[24px] top-1/2 w-[24px] h-[2px] bg-white/30 z-10 shadow-md"></div>}
                                                        {hasNextRoundVisible && mIdx % 2 === 0 && <div className="absolute -right-[24px] top-1/2 w-[2px] bg-white/30 z-10 shadow-md" style={{ height: '100%' }}></div>}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <ResolveMatchModal resolvingMatch={resolvingMatch} setResolvingMatch={() => setSearchParams({})} submitResult={submitResult} handleRandomize={handleRandomize} players={players} allTournaments={allTournaments} tournament={tournament} tierConf={tierConf} onNavigate={onNavigate} />
        </div>
    );
}

export function SNBNationsBracket({ tournament, allTournaments = [], players, onBack, db, appId, onNavigate, isAdmin }) {
    const [viewMode, setViewMode] = useState(tournament.status === 'completed' ? 'info' : 'bracket');
    const [resolvingTie, setResolvingTie] = useState(null); 
    const [localMatches, setLocalMatches] = useState([]); 
    const [resolvingSubMatch, setResolvingSubMatch] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams(); 
    
    const [showSettings, setShowSettings] = useState(false);
    const [editName, setEditName] = useState('');
    const [editLocation, setEditLocation] = useState('');
    const [editCountry, setEditCountry] = useState('');
    const [editDesc, setEditDesc] = useState('');
    const [showDelete, setShowDelete] = useState(false);
    const [expandedDesc, setExpandedDesc] = useState(false);
    const [showAllNations, setShowAllNations] = useState(false);

    useEffect(() => {
        if (tournament && showSettings) {
            setEditName(tournament.name || ''); setEditLocation(tournament.location || ''); setEditCountry(tournament.hostCountry || ''); setEditDesc(tournament.description || ''); setShowDelete(false);
        }
    }, [tournament, showSettings]);

    let teams = []; try { teams = typeof tournament.teams === 'string' ? JSON.parse(tournament.teams) : (tournament.teams || []); } catch(e){}
    let groupMatches = []; try { groupMatches = typeof tournament.groupMatches === 'string' ? JSON.parse(tournament.groupMatches) : (tournament.groupMatches || []); } catch(e){}
    let knockout = [[],[],[]]; try { knockout = typeof tournament.bracket === 'string' ? JSON.parse(tournament.bracket) : (tournament.bracket || [[],[],[]]); } catch(e){}
    
    const getPlayer = (id) => players.find(p => p.id === id) || { name: 'TBD', rank: '-', nationality: 'UNK' };
    const getTeam = (id) => teams.find(t => t.id === id) || { name: 'TBD', flags: ['UNK'], players: [] };

    const calcNationStandings = (groupId, customMatches = groupMatches) => {
        const scores = {};
        const gTeams = teams.filter(t => tournament.groups[groupId].includes(t.id));
        gTeams.forEach(t => scores[t.id] = { id: t.id, wins: 0, losses: 0, matchWins: 0 });
        
        customMatches.filter(m => m && m.group === groupId).forEach(tie => {
            if (tie.winner) {
                const loser = tie.winner === tie.t1.id ? tie.t2.id : tie.t1.id;
                if (scores[tie.winner]) scores[tie.winner].wins++;
                if (scores[loser]) scores[loser].losses++;
                
                let t1w = 0, t2w = 0;
                tie.matches.forEach(m => { if (m.winner === tie.t1.id) t1w++; else if (m.winner === tie.t2.id) t2w++; });
                if (scores[tie.t1.id]) scores[tie.t1.id].matchWins += t1w;
                if (scores[tie.t2.id]) scores[tie.t2.id].matchWins += t2w;
            }
        });

        return Object.values(scores).sort((a,b) => {
            if (a.wins !== b.wins) return b.wins - a.wins;
            if (a.matchWins !== b.matchWins) return b.matchWins - a.matchWins;
            const h2h = customMatches.find(m => m && m.winner && ((m.t1.id === a.id && m.t2.id === b.id) || (m.t1.id === b.id && m.t2.id === a.id)));
            if (h2h && h2h.winner) {
                return h2h.winner === a.id ? -1 : 1;
            }
            return 0; 
        });
    };

    const standingsA = useMemo(() => calcNationStandings('A'), [groupMatches, teams]);
    const standingsB = useMemo(() => calcNationStandings('B'), [groupMatches, teams]);
    const standingsC = useMemo(() => calcNationStandings('C'), [groupMatches, teams]);
    const standingsD = useMemo(() => calcNationStandings('D'), [groupMatches, teams]);

    const isGroupStageComplete = useMemo(() => groupMatches.length === 24 && groupMatches.every(m => m && m.winner), [groupMatches]);

    const urlTieId = searchParams.get('tie');

    useEffect(() => {
        if (!urlTieId) { setResolvingTie(null); return; }
        
        let foundTie = null; let mType = null; let mIndex = null; let rIndex = null;
        
        groupMatches.forEach((tie, idx) => { if (tie && tie.id === urlTieId) { foundTie = tie; mType = 'group'; mIndex = idx; } });
        if (!foundTie) {
            knockout.forEach((round, rIdx) => {
                if (!Array.isArray(round)) return;
                round.forEach((tie, idx) => { if (tie && tie.id === urlTieId) { foundTie = tie; mType = 'knockout'; mIndex = idx; rIndex = rIdx; } });
            });
        }
        
        if (foundTie) {
            setResolvingTie({ matchType: mType, matchIndex: mIndex, roundIndex: rIndex, ...foundTie });
            setLocalMatches(JSON.parse(JSON.stringify(foundTie.matches)));
        } else {
            setSearchParams({}); 
        }

    }, [urlTieId, tournament.id]);

    const openResolveModal = (type, mIdx, tie, rIdx = null) => {
        if (!tie || !tie.t1 || !tie.t2) return; 
        setSearchParams({ tie: tie.id }); 
    };

    const handleSubMatchResolved = async (winnerPlayerId, type) => {
        if (!resolvingSubMatch) return;
        const winningTeamId = (winnerPlayerId === resolvingSubMatch.p1) ? resolvingTie.t1.id : resolvingTie.t2.id;
        
        const newM = [...localMatches];
        newM[resolvingSubMatch.mIdx].winner = winningTeamId;
        newM[resolvingSubMatch.mIdx].type = type;
        setLocalMatches(newM);
        setResolvingSubMatch(null); 

        const newT = JSON.parse(JSON.stringify(tournament));
        const { matchType, matchIndex, roundIndex: rIdx } = resolvingTie;
        let parsedGM = []; let parsedKO = [[], [], []];
        try { parsedGM = typeof newT.groupMatches === 'string' ? JSON.parse(newT.groupMatches) : newT.groupMatches; } catch(e){}
        try { parsedKO = typeof newT.bracket === 'string' ? JSON.parse(newT.bracket) : newT.bracket; } catch(e){}

        if (matchType === 'group') parsedGM[matchIndex].matches = newM;
        else if (matchType === 'knockout') parsedKO[rIdx][matchIndex].matches = newM;

        newT.groupMatches = JSON.stringify(parsedGM); newT.bracket = JSON.stringify(parsedKO);
        await window.fb.updateDoc(window.fb.doc(db, 'artifacts', appId, 'public', 'data', 'tournaments', tournament.id), newT);
    };

    const handleRandomizeSubMatch = () => {
        const winnerPlayerId = Math.random() < 0.5 ? resolvingSubMatch.p1 : resolvingSubMatch.p2;
        handleSubMatchResolved(winnerPlayerId, 'random');
    };

    const populateTieMatches = (targetTie) => {
        if (targetTie.t1 && targetTie.t2) {
            const t1 = targetTie.t1.players;
            const t2 = targetTie.t2.players;
            targetTie.matches[0].p1 = t1[3]; targetTie.matches[0].p2 = t2[3]; 
            targetTie.matches[1].p1 = t1[2]; targetTie.matches[1].p2 = t2[2]; 
            targetTie.matches[2].p1 = t1[1]; targetTie.matches[2].p2 = t2[1]; 
            targetTie.matches[3].p1 = t1[0]; targetTie.matches[3].p2 = t2[0]; 
            targetTie.matches[4].p1 = t1[0]; targetTie.matches[4].p2 = t2[0]; 
            if (targetTie.matches.length > 5) {
                targetTie.matches[4].p1 = t1[3]; targetTie.matches[4].p2 = t2[2]; 
                targetTie.matches[5].p1 = t1[2]; targetTie.matches[5].p2 = t2[3]; 
                targetTie.matches[6].p1 = t1[1]; targetTie.matches[6].p2 = t2[0]; 
                targetTie.matches[7].p1 = t1[0]; targetTie.matches[7].p2 = t2[1]; 
                targetTie.matches[8].p1 = t1[0]; targetTie.matches[8].p2 = t2[0]; 
            }
        }
    };

    const getOverallTieType = (matches, tieWinnerId) => {
        const wins = matches.filter(m => m.winner === tieWinnerId);
        let close = 0, dom = 0, luck = 0;
        wins.forEach(m => {
            if (m.type === 'close') close++;
            else if (m.type === 'lopsided') dom++;
            else if (m.type === 'random') luck++;
        });
        if (dom >= close && dom >= luck) return 'lopsided';
        if (luck > close && luck > dom) return 'random';
        return 'close';
    };

    const submitTieResult = async () => {
        const isKnockout = localMatches.length === 9;
        const mainMatchesTotal = isKnockout ? 8 : 4;
        let t1w = 0; let t2w = 0;
        
        localMatches.forEach(m => {
            if (m.winner === resolvingTie.t1.id) t1w++;
            else if (m.winner === resolvingTie.t2.id) t2w++;
        });

        const mainMatchesPlayed = localMatches.slice(0, mainMatchesTotal).filter(m => m.winner).length;
        const allMainMatchesFinished = mainMatchesPlayed === mainMatchesTotal;
        const isTied = t1w === t2w;

        const canSubmit = (allMainMatchesFinished && !isTied) || (allMainMatchesFinished && isTied && localMatches[mainMatchesTotal].winner);
        if (!canSubmit) return;
        
        const tieWinnerId = t1w > t2w ? resolvingTie.t1.id : resolvingTie.t2.id;
        const score = `${Math.max(t1w, t2w)}-${Math.min(t1w, t2w)}`;
        const tieType = getOverallTieType(localMatches, tieWinnerId);

        const newT = JSON.parse(JSON.stringify(tournament));
        const { matchType, matchIndex, roundIndex: rIdx } = resolvingTie;

        let parsedGM = []; let parsedKO = [[], [], []];
        try { parsedGM = typeof newT.groupMatches === 'string' ? JSON.parse(newT.groupMatches) : newT.groupMatches; } catch(e){}
        try { parsedKO = typeof newT.bracket === 'string' ? JSON.parse(newT.bracket) : newT.bracket; } catch(e){}

        const winningTeamObj = teams.find(t => t.id === tieWinnerId);
        const losingTeamObj = teams.find(t => t.id === (t1w > t2w ? resolvingTie.t2.id : resolvingTie.t1.id));

        if (matchType === 'group') {
            parsedGM[matchIndex].winner = winnerId; parsedGM[matchIndex].type = winType;
            
            // SMART CHECK: Determine exactly which groups are 100% finished
            const isGroupDone = (groupId) => {
                const matches = parsedGM.filter(m => m && m.group === groupId);
                return matches.length > 0 && matches.every(m => m.winner);
            };

            const sA = calcGroupStandings('A', parsedGM); const aDone = isGroupDone('A');
            const sB = calcGroupStandings('B', parsedGM); const bDone = isGroupDone('B');
            const sC = calcGroupStandings('C', parsedGM); const cDone = isGroupDone('C');
            const sD = calcGroupStandings('D', parsedGM); const dDone = isGroupDone('D');

            if (tournament.format === 'pro_am' || tournament.format === 'challenger_elite') {
                const isLargeDraw = parsedKO[0].length >= 8;
                const isMediumDraw = parsedKO[0].length === 4;

                if (isLargeDraw) {
                    const sE = calcGroupStandings('E', parsedGM); const eDone = isGroupDone('E');
                    const sF = calcGroupStandings('F', parsedGM); const fDone = isGroupDone('F');
                    const sG = calcGroupStandings('G', parsedGM); const gDone = isGroupDone('G');
                    const sH = calcGroupStandings('H', parsedGM); const hDone = isGroupDone('H');
                    
                    // INSTANT INJECTION: Top 2 from 8 Groups -> Round of 16
                    if(aDone) { parsedKO[0][0].p1 = sA[0].id; parsedKO[0][4].p2 = sA[1].id; }
                    if(bDone) { parsedKO[0][0].p2 = sB[1].id; parsedKO[0][4].p1 = sB[0].id; }
                    if(cDone) { parsedKO[0][1].p1 = sC[0].id; parsedKO[0][5].p2 = sC[1].id; }
                    if(dDone) { parsedKO[0][1].p2 = sD[1].id; parsedKO[0][5].p1 = sD[0].id; }
                    if(eDone) { parsedKO[0][2].p1 = sE[0].id; parsedKO[0][6].p2 = sE[1].id; }
                    if(fDone) { parsedKO[0][2].p2 = sF[1].id; parsedKO[0][6].p1 = sF[0].id; }
                    if(gDone) { parsedKO[0][3].p1 = sG[0].id; parsedKO[0][7].p2 = sG[1].id; }
                    if(hDone) { parsedKO[0][3].p2 = sH[1].id; parsedKO[0][7].p1 = sH[0].id; }
                } else if (isMediumDraw) {
                    // INSTANT INJECTION: Top 2 from 4 Groups -> Quarterfinals
                    if(aDone) { parsedKO[0][0].p1 = sA[0].id; parsedKO[0][2].p2 = sA[1].id; }
                    if(bDone) { parsedKO[0][0].p2 = sB[1].id; parsedKO[0][2].p1 = sB[0].id; }
                    if(cDone) { parsedKO[0][1].p1 = sC[0].id; parsedKO[0][3].p2 = sC[1].id; }
                    if(dDone) { parsedKO[0][1].p2 = sD[1].id; parsedKO[0][3].p1 = sD[0].id; }
                } else {
                    // LEGACY FALLBACK: Prevents old tournaments from crashing!
                    if(aDone && sA[0]) parsedKO[0][0].p1 = sA[0].id;
                    if(bDone && sB[0]) parsedKO[0][0].p2 = sB[0].id;
                    if(cDone && sC[0]) parsedKO[0][1].p1 = sC[0].id;
                    if(dDone && sD[0]) parsedKO[0][1].p2 = sD[0].id;
                }
            } else {
                // ATP FINALS INSTANT INJECTION
                if(aDone && sA.length >= 2) { parsedKO[0][0].p1 = sA[0].id; parsedKO[0][1].p2 = sA[1].id; }
                if(bDone && sB.length >= 2) { parsedKO[0][0].p2 = sB[1].id; parsedKO[0][1].p1 = sB[0].id; }
            }
        } else if (matchType === 'knockout') {
            parsedKO[rIdx][matchIndex].winner = tieWinnerId; parsedKO[rIdx][matchIndex].score = score; parsedKO[rIdx][matchIndex].matches = localMatches; parsedKO[rIdx][matchIndex].type = tieType;
            
            if (rIdx === 0) { 
                const nRIdx = 1; const nMIdx = Math.floor(matchIndex / 2);
                if (matchIndex % 2 === 0) parsedKO[nRIdx][nMIdx].t1 = winningTeamObj; else parsedKO[nRIdx][nMIdx].t2 = winningTeamObj;
                populateTieMatches(parsedKO[nRIdx][nMIdx]);
            } else if (rIdx === 1) { 
                const nRIdx = 2;
                if (matchIndex === 0) { parsedKO[nRIdx][1].t1 = winningTeamObj; parsedKO[nRIdx][0].t1 = losingTeamObj; }
                else { parsedKO[nRIdx][1].t2 = winningTeamObj; parsedKO[nRIdx][0].t2 = losingTeamObj; }
                [0, 1].forEach(idx => populateTieMatches(parsedKO[nRIdx][idx]));
            } else if (rIdx === 2) {
                if (parsedKO[2][0].winner && parsedKO[2][1].winner) {
                    newT.status = 'completed'; newT.completedAt = Date.now();
                }
            }
        }
        
        newT.groupMatches = JSON.stringify(parsedGM); newT.bracket = JSON.stringify(parsedKO);
        await window.fb.updateDoc(window.fb.doc(db, 'artifacts', appId, 'public', 'data', 'tournaments', tournament.id), newT);
        setSearchParams({}); 
    };

    const handleSaveSettings = async (e) => {
        e.preventDefault();
        try {
            const tRef = window.fb.doc(db, 'artifacts', appId, 'public', 'data', 'tournaments', tournament.id);
            await window.fb.updateDoc(tRef, { name: editName.trim(), location: editLocation.trim(), hostCountry: editCountry, description: editDesc.trim() });
            setShowSettings(false);
        } catch (err) { console.error(err); }
    };

    const handleDelete = async () => { try { onBack(); await window.fb.deleteDoc(window.fb.doc(db, 'artifacts', appId, 'public', 'data', 'tournaments', tournament.id)); } catch(e) { console.error(e); } };

    const tierConf = TOURNAMENT_TIERS['nations_league'];
    const IconDom = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>;
    const IconClose = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>;
    
    const getTeamGroupForm = (teamId, matches) => {
        const tMatches = matches.filter(m => m && m.winner && (m.t1?.id === teamId || m.t2?.id === teamId));
        return tMatches.map(m => m.winner === teamId ? 'W' : 'L');
    };

    const renderTeamRow = (teamId, isWinner, isLoser, score, matches = []) => {
        if (!teamId) return <div className="h-[34px] flex items-center px-3"><span className="text-[10px] font-bold text-white/30 tracking-widest uppercase">TBD</span></div>;
        const t = getTeam(teamId);
        const flagDisplay = t.flags && t.flags.length > 0 ? t.flags.map(f => getFlag(f)).join('') : getFlag('UNK');
        const wonMatches = Array.isArray(matches) ? matches.filter(m => m && m.winner === teamId && m.type) : [];

        return (
            <div className={`relative px-3 py-2 flex items-center justify-between transition-colors min-h-[38px] ${isWinner ? 'bg-rose-500/10' : 'bg-transparent'}`}>
                {isWinner && <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r shadow-[0_0_8px_rgba(244,63,94,0.8)] bg-rose-400"></div>}
                <div className={`flex items-center gap-2.5 overflow-hidden w-full pr-2 transition-all duration-300 ${isLoser ? 'opacity-40 grayscale' : ''}`}>
                    <span className="text-lg drop-shadow-md shrink-0 leading-none tracking-widest">{flagDisplay}</span>
                    <span className={`text-xs truncate ${isWinner ? 'text-white font-black drop-shadow-md' : 'text-white/80 font-bold'}`}>{t.name}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    {score !== undefined && score !== null && <span className={`text-[11px] font-black ${isWinner ? 'text-rose-400' : 'text-white/40'}`}>{score}</span>}
                    {wonMatches.length > 0 && (
                        <div className="flex gap-1 shrink-0 flex-wrap justify-end">
                            {wonMatches.map((m, i) => (
                                <span key={i} className="text-[7px] font-black text-black px-1.5 py-0.5 rounded shadow-[0_0_5px_rgba(255,255,255,0.2)] flex items-center gap-0.5 uppercase" style={{ backgroundColor: tierConf.hex }}>
                                    {m.type === 'random' ? <><Shuffle size={8} strokeWidth={3}/> LUCK</> : m.type === 'lopsided' ? <><IconDom/> DOM</> : <><IconClose/> CLS</>}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderTieBox = (tie, type, mIdx, rIdx = null) => {
        const isReady = tie && tie.t1 && tie.t2 && !tie.winner;
        const isCompleted = tie && tie.winner;
        
        let t1Score = null; let t2Score = null;
        if (tie && tie.score) {
            const [s1, s2] = tie.score.split('-');
            if (tie.winner === tie.t1.id) { t1Score = s1; t2Score = s2; } else { t1Score = s2; t2Score = s1; }
        }

        return (
            <div key={tie.id} onClick={() => openResolveModal(type, mIdx, tie, rIdx)} 
                 className={`rounded-2xl transition-all duration-300 overflow-hidden flex flex-col border shadow-sm ${
                     isReady ? 'cursor-pointer hover:-translate-y-1 hover:shadow-lg z-20 bg-white/10 border-white/30' : 
                     isCompleted ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-md hover:border-white/30 bg-black/50 border-white/10 backdrop-blur-md' : 
                     'bg-black/20 border-white/[0.05] opacity-70 backdrop-blur-sm'
                 }`} 
                 style={{ borderColor: isReady ? tierConf.hex : undefined, boxShadow: isReady ? `0 4px 15px ${tierConf.hex}20` : undefined }}>
                {renderTeamRow(tie.t1?.id, tie.winner === tie.t1?.id, tie.winner && tie.winner !== tie.t1?.id, t1Score, tie.matches)}
                <div className="h-px w-full bg-white/10"></div>
                {renderTeamRow(tie.t2?.id, tie.winner === tie.t2?.id, tie.winner && tie.winner !== tie.t2?.id, t2Score, tie.matches)}
            </div>
        );
    };

    const tStats = { total: 0, close: 0, dom: 0, luck: 0 };
    [...groupMatches, ...(knockout.flat())].forEach(tie => {
        if (tie && tie.matches && Array.isArray(tie.matches)) {
            tie.matches.forEach(match => {
                if (match && match.winner && match.type) {
                    tStats.total++;
                    if (match.type === 'close') tStats.close++;
                    else if (match.type === 'lopsided') tStats.dom++;
                    else if (match.type === 'random') tStats.luck++;
                }
            });
        }
    });

    const mapQuery = tournament.location || `${tournament.name} ${getCountryName(tournament.hostCountry)}`;
    const baseKnockoutHeight = Math.max(450, (knockout[0]?.length || 1) * 110);

    return (
        <div className="min-h-full flex flex-col pb-20 relative max-w-[1600px] mx-auto w-full">
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#020617]">
                <iframe 
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=k&z=15&ie=UTF8&iwloc=near&output=embed`} 
                    className="w-[130%] h-[130%] -translate-x-[15%] -translate-y-[15%] opacity-50 saturate-[1.2] absolute left-0 top-0 transition-all duration-[3000ms] pointer-events-none" 
                    frameBorder="0" 
                    loading="lazy" 
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/50 via-[#020617]/10 to-[#020617]/90 z-10"></div>
            </div>

            {/* HEADER */}
            <div className="flex justify-between items-start md:items-center mb-6 shrink-0 relative z-20 pt-4 px-4 xl:px-0">
                <div className="flex-1 min-w-0 mr-4">
                    <button onClick={onBack} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-3 text-sm font-medium drop-shadow-md">
                        <ArrowLeft className="w-4 h-4" /> Back to Tournaments
                    </button>
                    <h1 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3 flex-wrap drop-shadow-lg cursor-pointer group" onClick={() => setViewMode(v => v === 'bracket' ? 'info' : 'bracket')}>
                        <DynamicTrophy tier="nations_league" result="Winner" country={tournament.hostCountry} size={56} className="drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] shrink-0 group-hover:scale-110 transition-transform" />
                        <span className="text-4xl shrink-0" title={getCountryName(tournament.hostCountry || 'USA')}>{getFlag(tournament.hostCountry || 'USA')}</span>
                        <span className="truncate tracking-tight group-hover:text-rose-400 transition-colors">{tournament.name}</span>
                        <span className="bg-white/10 text-white/80 px-3 py-1.5 rounded-lg text-[10px] font-black flex items-center gap-2 group-hover:bg-white/20 transition-all shadow-inner border border-white/10 uppercase tracking-widest shrink-0 ml-2">
                            {viewMode === 'bracket' ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg> Summary</> : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg> Bracket</>}
                        </span>
                        {tournament.status === 'completed' && <span className="bg-[#059669]/20 text-[#059669] text-xs px-3 py-1.5 rounded-lg shrink-0 font-black tracking-widest uppercase border border-[#059669]/40 shadow-sm backdrop-blur-sm ml-auto">Completed</span>}
                    </h1>
                </div>
                <div className="shrink-0 mt-4 md:mt-0">
                    {isAdmin && (
                        <button onClick={() => setShowSettings(true)} className="w-12 h-12 flex items-center justify-center text-white/60 hover:text-white bg-white/5 hover:bg-white/20 backdrop-blur-xl rounded-2xl border border-white/10 transition-all hover:scale-105 shadow-sm group">
                            <Settings size={22} className="group-hover:rotate-90 transition-transform duration-500" />
                        </button>
                    )}
                </div>
            </div>

            {showSettings && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSettings(false)}></div>
                    <div className="bg-black/60 backdrop-blur-3xl border border-white/10 p-8 rounded-3xl w-full max-w-2xl relative z-10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                            <h2 className="text-2xl font-black text-white flex items-center gap-3"><Settings className="text-gold-400"/> Event Settings</h2>
                            <button onClick={() => setShowSettings(false)} className="text-white/40 hover:text-white bg-white/5 p-2 rounded-full transition-colors"><X size={20}/></button>
                        </div>
                        <form onSubmit={handleSaveSettings} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Tournament Name</label>
                                <input type="text" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:border-gold-500/50 shadow-inner transition-colors" value={editName} onChange={e => setEditName(e.target.value)} />
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Location / City (For Map)</label>
                                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-gold-500/50 shadow-inner transition-colors" value={editLocation} onChange={e => setEditLocation(e.target.value)} placeholder="e.g. Palm Beach, Florida" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Host Country (Flag)</label>
                                    <div className="bg-white/5 border border-white/10 rounded-xl p-1 shadow-inner relative z-50">
                                        <CountrySelect value={editCountry} onChange={setEditCountry} players={players} />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Storyline / Description</label>
                                <textarea className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-gold-500/50 shadow-inner transition-colors h-24 custom-scrollbar resize-none" value={editDesc} onChange={e => setEditDesc(e.target.value)} placeholder="Enter tournament narrative here..."></textarea>
                            </div>
                            <div className="flex justify-end pt-4">
                                <button type="submit" className="bg-gold-500 hover:bg-gold-400 text-black px-8 py-3.5 rounded-xl font-black tracking-wide transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)]">Save & Update Map</button>
                            </div>
                        </form>
                        <div className="mt-8 pt-6 border-t border-white/10">
                            {!showDelete ? (
                                <button type="button" onClick={() => setShowDelete(true)} className="text-rose-400 font-bold hover:text-rose-300 transition-colors text-xs flex items-center gap-2 uppercase tracking-widest"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg> Delete Tournament</button>
                            ) : (
                                <div className="p-4 border border-rose-500/30 bg-rose-500/10 rounded-2xl flex justify-between items-center animate-in fade-in zoom-in duration-200">
                                    <span className="text-rose-400 font-bold text-sm">Delete forever?</span>
                                    <div className="flex gap-2">
                                        <button type="button" onClick={handleDelete} className="bg-rose-500 hover:bg-rose-400 text-white transition-colors px-4 py-2 rounded-lg font-bold text-sm shadow-md">Confirm</button>
                                        <button type="button" onClick={() => setShowDelete(false)} className="text-white/60 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm transition-colors font-bold">Cancel</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* --- SUMMARY VIEW --- */}
            {viewMode === 'info' ? (
                // Changed from max-w-3xl to max-w-2xl to dramatically shrink the empty middle space
                <div className="px-4 xl:px-0 relative z-20 w-full flex flex-col items-start max-w-2xl">
                    
                    {/* Description */}
                    {tournament.description && (
                        <div className="mb-6 w-full bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-lg animate-in slide-in-from-top-4 fade-in duration-500">
                            <p onClick={() => setExpandedDesc(!expandedDesc)} className={`text-white/80 text-sm font-medium leading-relaxed transition-all cursor-pointer ${expandedDesc ? '' : 'line-clamp-2'}`} title="Click to expand/collapse">
                                {tournament.description}
                            </p>
                            {tournament.description.length > 100 && (
                                <button onClick={() => setExpandedDesc(!expandedDesc)} className="text-[10px] font-black uppercase tracking-widest text-rose-400 mt-2 hover:text-rose-300 transition-colors">
                                    {expandedDesc ? 'Show Less' : 'Read More'}
                                </button>
                            )}
                        </div>
                    )}

                    {/* THE MEDAL TABLE / LEADERBOARD */}
                    <div className="flex flex-col gap-2 w-full mb-6 animate-in slide-in-from-top-4 fade-in duration-500 delay-100">
                        {(() => {
                            let rankedIds = [];
                            let unrankedIds = teams.map(t => t.id);

                            if (knockout[2]?.[1]?.winner) {
                                const champ = knockout[2][1].winner;
                                const finalist = knockout[2][1].t1.id === champ ? knockout[2][1].t2.id : knockout[2][1].t1.id;
                                const third = knockout[2]?.[0]?.winner;
                                const fourth = third ? (knockout[2][0].t1.id === third ? knockout[2][0].t2.id : knockout[2][0].t1.id) : null;
                                
                                rankedIds.push(champ, finalist);
                                if (third) rankedIds.push(third);
                                if (fourth) rankedIds.push(fourth);
                                
                                if (knockout[0]) {
                                    knockout[0].forEach(tie => {
                                        if (tie && tie.winner) {
                                            const loser = tie.winner === tie.t1.id ? tie.t2.id : tie.t1.id;
                                            if (loser && !rankedIds.includes(loser)) rankedIds.push(loser);
                                        }
                                    });
                                }
                            }

                            unrankedIds = unrankedIds.filter(id => !rankedIds.includes(id));
                            const orderedTeams = [...rankedIds, ...unrankedIds].map(id => getTeam(id)).filter(Boolean);
                            const visibleTeams = showAllNations ? orderedTeams : orderedTeams.slice(0, 4);

                            return visibleTeams.map((team, index) => {
                                const rank = index + 1;
                                const isChamp = knockout[2]?.[1]?.winner && rank === 1;
                                
                                let rankNode;
                                if (isChamp) rankNode = <div className="w-8 h-8 rounded-lg bg-gold-500 text-black font-black flex items-center justify-center text-sm shadow-[0_0_10px_rgba(212,175,55,0.5)] shrink-0">1</div>;
                                else if (knockout[2]?.[1]?.winner && rank === 2) rankNode = <div className="w-8 h-8 rounded-lg bg-slate-300 text-black font-black flex items-center justify-center text-sm shadow-[0_0_10px_rgba(203,213,225,0.5)] shrink-0">2</div>;
                                else if (knockout[2]?.[0]?.winner && rank === 3) rankNode = <div className="w-8 h-8 rounded-lg bg-[#cd7f32] text-black font-black flex items-center justify-center text-sm shadow-[0_0_10px_rgba(205,127,50,0.5)] shrink-0">3</div>;
                                else rankNode = <div className="w-8 h-8 rounded-lg bg-white/10 text-white/50 font-black flex items-center justify-center text-sm border border-white/10 shrink-0">{rank}</div>;

                                return (
                                    /* FIX 1: Removed 'overflow-hidden' from this container.
                                    FIX 2: Added 'isolation-auto' to ensure tooltips can float above everything.
                                    */
                                    <div key={team.id} className={`relative flex items-center justify-between p-2.5 sm:p-3 rounded-xl border transition-all ${isChamp ? 'bg-gradient-to-r from-[#2a220a]/95 to-[#0a0a0a]/95 backdrop-blur-xl border-gold-500/40 shadow-[0_4px_15px_rgba(212,175,55,0.25)] z-10' : 'bg-[#0a0a0a]/85 backdrop-blur-xl border-white/10 shadow-sm hover:bg-[#111111]/95'}`}>

                                        <div className="flex items-center gap-3 sm:gap-4 pr-3 relative z-10">
                                            {rankNode}
                                            
                                            <div className="flex items-center gap-1 shrink-0">
                                                {team.flags && team.flags.length > 0 ? (
                                                    team.flags.map((f, i) => (
                                                        <div key={i} className="flex items-center justify-center h-8 bg-black/60 border border-white/15 rounded-md px-2 shadow-inner shrink-0 overflow-hidden">
                                                            <span className="text-[26px] leading-none drop-shadow-md pb-[1px]">{getFlag(f)}</span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="flex items-center justify-center h-8 bg-black/60 border border-white/15 rounded-md px-2 shadow-inner shrink-0 overflow-hidden">
                                                        <span className="text-[26px] leading-none drop-shadow-md pb-[1px]">{getFlag('UNK')}</span>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <span 
                                                onClick={(e) => { 
                                                    e.stopPropagation(); 
                                                    if (onNavigate && team.flags && team.flags.length > 0) {
                                                        onNavigate('nations', null, null, team.flags[0]);
                                                    }
                                                }} 
                                                className={`font-bold tracking-wide truncate cursor-pointer hover:underline transition-opacity ${isChamp ? 'text-gold-400 text-lg sm:text-xl' : 'text-white text-lg sm:text-xl'}`}
                                            >
                                                {team.name}
                                            </span>
                                        </div>
                                        
                                        {/* FIX 3: Removed 'overflow-hidden' from the avatar wrapper.
                                        FIX 4: Added 'z-30' to ensure tooltips render on top of the map layer.
                                        */}
                                        <div className="flex items-center shrink-0 pr-1 relative z-30">
                                            <div className="flex -space-x-3 sm:-space-x-4">
                                                {team.players.map(pid => {
                                                    const p = getPlayer(pid);
                                                    return (
                                                        /* FIX 5: Explicitly set z-index hierarchy and added 'group' 
                                                        to trigger visibility correctly.
                                                        */
                                                        <div key={pid} onClick={() => onNavigate('players', pid)} className="relative group cursor-pointer hover:z-50 transition-all duration-200">
                                                            <img 
                                                                referrerPolicy="no-referrer" 
                                                                src={p.images?.[0] || p.imageUrl || "https://via.placeholder.com/40"} 
                                                                className="w-9 h-9 sm:w-11 sm:h-11 rounded-full object-cover border-[2px] border-[#0a0a0a] shadow-sm bg-black/50 group-hover:scale-110 group-hover:border-white/40 transition-transform" 
                                                            />
                                                            {/* FIX 6: Changed 'bottom-full' to a higher 'mb-3' 
                                                            Added 'pointer-events-none' to ensure smooth mouse movement.
                                                            */}
                                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 hidden group-hover:block bg-white text-black text-[11px] font-black px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-[0_10px_20px_rgba(0,0,0,0.5)] z-[60] pointer-events-none animate-in fade-in zoom-in-90 duration-150 border border-black/10">
                                                                {p.name}
                                                                {/* Arrow tail for the tooltip */}
                                                                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-white"></div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                );
                            });
                        })()}
                    </div>

                    {/* Inline Expand Toggle */}
                    {teams.length > 4 && (
                        <button onClick={() => setShowAllNations(!showAllNations)} className="w-full py-3 border border-white/10 rounded-xl bg-[#0a0a0a]/80 hover:bg-white/10 text-white/60 hover:text-white text-[10px] font-black tracking-widest uppercase transition-all mb-6 shadow-md backdrop-blur-md">
                            {showAllNations ? '↑ Collapse to Top 4 ↑' : '↓ View All 16 Nations ↓'}
                        </button>
                    )}

                    {/* Match Stats */}
                    <div className="w-full flex justify-between items-center bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 p-3 sm:p-4 rounded-xl shadow-lg mb-8">
                        <div className="text-center px-2 flex-1"><div className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-1">Matches</div><div className="text-white font-black text-sm">{tStats.total}</div></div>
                        <div className="w-px h-8 bg-white/10"></div>
                        <div className="text-center px-2 flex-1"><div className="text-emerald-400/60 text-[9px] font-black uppercase tracking-widest mb-1">Close</div><div className="text-emerald-400 font-black text-sm">{tStats.close}</div></div>
                        <div className="w-px h-8 bg-white/10"></div>
                        <div className="text-center px-2 flex-1"><div className="text-sky-400/60 text-[9px] font-black uppercase tracking-widest mb-1">Dominant</div><div className="text-sky-400 font-black text-sm">{tStats.dom}</div></div>
                        <div className="w-px h-8 bg-white/10"></div>
                        <div className="text-center px-2 flex-1"><div className="text-purple-400/60 text-[9px] font-black uppercase tracking-widest mb-1">Auto</div><div className="text-purple-400 font-black text-sm">{tStats.luck}</div></div>
                    </div>

                </div>
            ) : (
                <div className="relative w-full flex-1 flex flex-col">
                    
                    {/* SCROLL-PRESERVING BRACKET LAYER */}
                    <div className="flex-1 flex flex-col relative z-20">
                        {/* 1. Group Stage */}
                        <div className={`grid md:grid-cols-2 gap-6 px-4 xl:px-0 mb-8 shrink-0`}>
                            {['A', 'B', 'C', 'D'].map(g => {
                                const standings = g==='A'?standingsA:g==='B'?standingsB:g==='C'?standingsC:standingsD;
                                const matches = groupMatches.filter(m => m && m.group === g);
                                return (
                                    <div key={g} className="flex flex-col gap-6 h-full">
                                        <div className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.4)] w-full flex flex-col shrink-0">
                                            <div className="bg-black/40 px-4 py-2 border-b border-white/10 font-black text-white flex justify-between items-center tracking-wide">
                                                <span className="text-base">Group {g}</span>
                                            </div>
                                            <div className="p-2 pb-3">
                                                <table className="w-full text-left text-[11px]">
                                                    <thead className="text-white/50 text-[8px] uppercase tracking-widest border-b border-white/5">
                                                        <tr>
                                                            <th className="px-2 py-1.5 font-bold">Nation</th>
                                                            <th className="px-2 py-1.5 text-center font-bold">W-L</th>
                                                            <th className="px-2 py-1.5 text-center font-bold">Matches</th>
                                                            <th className="px-2 py-1.5 text-center font-bold">Form</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-white/5 text-white font-medium">
                                                        {standings.map((s, idx) => {
                                                            const t = getTeam(s.id); 
                                                            const isAdvancing = idx < 2; // Always highlight top 2!
                                                            const flagCode = t.flags && t.flags.length > 0 ? t.flags[0] : 'UNK';
                                                            
                                                            const rawForm = getTeamGroupForm(s.id, groupMatches);
                                                            const paddedForm = [...rawForm, ...Array(Math.max(0, 3 - rawForm.length)).fill(null)].slice(0, 3);

                                                            return (
                                                                <tr key={s.id} className={`transition-colors ${isAdvancing ? 'bg-emerald-500/10 rounded-lg' : 'hover:bg-white/5'}`}>
                                                                    <td className="px-2 py-2 flex items-center gap-1.5">
                                                                        <span className={`w-4 h-4 flex items-center justify-center rounded-full text-[8px] font-black shadow-sm shrink-0 ${isAdvancing ? 'bg-emerald-500 text-black shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'bg-white/10 text-white/80 border border-white/10'}`}>{idx+1}</span>
                                                                        <span className="text-sm drop-shadow-sm ml-1 shrink-0 tracking-widest">{t.flags && t.flags.length > 0 ? t.flags.map(f => getFlag(f)).join('') : getFlag('UNK')}</span>
                                                                        <span className="font-bold text-xs truncate tracking-tight">{t.name}</span>
                                                                    </td>
                                                                    <td className="px-2 py-2 text-center font-bold tabular-nums text-xs">{s.wins}-{s.losses}</td>
                                                                    <td className="px-2 py-2 text-center font-bold tabular-nums text-xs text-white/60">{s.matchWins}</td>
                                                                    <td className="px-2 py-2">
                                                                        <div className="flex items-center justify-center gap-1">
                                                                            {paddedForm.map((res, i) => (
                                                                                <div key={i} title={res === 'W' ? 'Win' : res === 'L' ? 'Loss' : 'Unplayed'} 
                                                                                     className={`w-1.5 h-1.5 rounded-full shadow-inner ${res === 'W' ? 'bg-emerald-500' : res === 'L' ? 'bg-rose-500' : 'bg-white/10'}`} />
                                                                            ))}
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        <div className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.4)] flex flex-col flex-1">
                                            <div className="bg-black/40 px-5 py-3.5 border-b border-white/10 flex items-center justify-between">
                                                <h3 className="font-black text-white/70 text-[11px] uppercase tracking-widest">Matches (Group {g})</h3>
                                            </div>
                                            <div className="p-3 flex flex-col gap-3 flex-1 justify-around">
                                                {matches.map(tie => {
                                                    const mIdx = groupMatches.findIndex(m => m && m.id === tie.id);
                                                    return renderTieBox(tie, 'group', mIdx);
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* 2. Knockout Stage */}
                        <div className="flex-1 flex flex-col px-4 xl:px-0">
                            <div className="flex items-center gap-4 mb-4">
                                <h2 className="text-xl font-black text-white tracking-tight drop-shadow-md">Knockout Stage</h2>
                                <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent"></div>
                            </div>
                            
                            <div className="flex-1 bg-white/5 backdrop-blur-2xl rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.6)] relative overflow-hidden border border-white/10 flex flex-col z-20 mb-6">
                                <div className="flex-1 overflow-auto custom-scrollbar relative z-10 flex flex-col">
                                    <div className="flex min-w-max sticky top-0 z-40 bg-black/50 backdrop-blur-3xl border-b border-white/10 py-3 px-8 shadow-xl">
                                        {knockout.map((round, rIdx) => {
                                            if (!Array.isArray(round)) return null;
                                            const roundName = rIdx === 2 ? 'Final' : (rIdx === 1 ? 'Semifinals' : 'Quarterfinals');
                                            return (
                                                <div key={`header-${rIdx}`} className="w-[24rem] shrink-0 mr-12 text-center flex flex-col items-center justify-end min-h-[40px]">
                                                    <div className="flex items-center justify-center gap-2 text-white font-black uppercase tracking-widest text-[11px] drop-shadow-md" style={{ color: rIdx === 2 ? tierConf.hex : undefined }}>
                                                        {roundName}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* FLAWLESS BRACKET RENDERING - Directly cloned from Standard Bracket logic */}
                                    <div className="flex min-w-max items-stretch relative z-10 px-8 pb-10 pt-6 flex-1" style={{ minHeight: `${baseKnockoutHeight}px` }}>
                                        {knockout.map((round, rIdx) => {
                                            if (!Array.isArray(round)) return null;
                                            const hasNextRoundVisible = rIdx < 2; 
                                            
                                            // THE FIX: For the final column, ONLY put the World Championship into the flex map!
                                            const matchesToMap = rIdx === 2 ? [round[1]] : round;

                                            return (
                                            <div key={`col-${rIdx}`} className="flex flex-col w-[24rem] shrink-0 mr-12 py-1 relative">
                                                
                                                {matchesToMap.map((tie, mappedIdx) => {
                                                    const mIdx = rIdx === 2 ? 1 : mappedIdx;
                                                    if (!tie) return <div key={`empty-${mIdx}`} style={{ flex: 1 }}></div>;

                                                    return (
                                                        <div key={tie.id} className="relative flex flex-col justify-center" style={{ flex: 1, minHeight: '80px' }}>
                                                            <div className="relative z-20 w-full">
                                                                
                                                                {rIdx === 2 && (
                                                                    <>
                                                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 text-[10px] font-black uppercase tracking-widest text-gold-400 bg-gold-500/10 px-5 py-1.5 rounded-t-xl border-t border-x border-gold-500/30 shadow-sm backdrop-blur-md z-10 whitespace-nowrap">
                                                                            World Championship
                                                                        </div>
                                                                        <div className="absolute left-[calc(100%+1.5rem)] top-1/2 -translate-y-1/2 z-30 drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] transition-transform hover:scale-105 duration-500">
                                                                            <DynamicTrophy tier="nations_league" result="Winner" country={tournament.hostCountry} size={65} />
                                                                        </div>
                                                                    </>
                                                                )}
                                                                
                                                                {renderTieBox(tie, 'knockout', mIdx, rIdx)}
                                                            </div>
                                                            
                                                            {/* Standard Lines - No translate needed for horizontals */}
                                                            {rIdx > 0 && <div className="absolute -left-[24px] top-1/2 w-[24px] h-[2px] bg-white/30 z-10 shadow-md"></div>}
                                                            {hasNextRoundVisible && <div className="absolute -right-[24px] top-1/2 w-[24px] h-[2px] bg-white/30 z-10 shadow-md"></div>}
                                                            {hasNextRoundVisible && mappedIdx % 2 === 0 && <div className="absolute -right-[24px] top-1/2 w-[2px] bg-white/30 z-10 shadow-md" style={{ height: '100%' }}></div>}
                                                        </div>
                                                    );
                                                })}

                                                {/* THE ISOLATED BRONZE MATCH - Pinned absolute bottom, completely out of the flex grid! */}
                                                {rIdx === 2 && round[0] && (
                                                    <div className="absolute left-0 bottom-4 w-full z-10 opacity-90 hover:opacity-100 transition-opacity">
                                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 text-[9px] font-black uppercase tracking-widest text-[#cd7f32] bg-[#cd7f32]/10 px-4 py-1.5 rounded-t-xl border-t border-x border-[#cd7f32]/40 shadow-sm backdrop-blur-md z-10 whitespace-nowrap">
                                                            Third Place Playoff
                                                        </div>
                                                        {renderTieBox(round[0], 'knockout', 0, 2)}
                                                    </div>
                                                )}
                                            </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* OVERLAY TIE DASHBOARD (Rendered as a FIXED Modal on top of everything to preserve scroll!) */}
                    {resolvingTie && (
                        <div className="fixed inset-0 z-[200] flex flex-col bg-[#020617] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                            {(() => {
                                const isKnockout = localMatches.length === 9;
                                const mainMatchesTotal = isKnockout ? 8 : 4;
                                let t1w = 0; let t2w = 0;
                                
                                localMatches.forEach(m => {
                                    if (m.winner === resolvingTie.t1.id) t1w++;
                                    else if (m.winner === resolvingTie.t2.id) t2w++;
                                });

                                const mainMatchesPlayed = localMatches.slice(0, mainMatchesTotal).filter(m => m.winner).length;
                                const allMainMatchesFinished = mainMatchesPlayed === mainMatchesTotal;
                                const isTied = t1w === t2w;

                                const canSubmit = (allMainMatchesFinished && !isTied) || (allMainMatchesFinished && isTied && localMatches[mainMatchesTotal].winner);

                                return (
                                    <div className="flex-1 flex flex-col pb-20 relative max-w-[1200px] mx-auto w-full pt-8 px-4 xl:px-0">
                                        <button onClick={() => setSearchParams({})} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-4 text-sm font-medium w-fit drop-shadow-md">
                                            <ArrowLeft className="w-4 h-4" /> Back to Bracket
                                        </button>

                                        <div className="flex-1 bg-white/5 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden rounded-[2rem]">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between px-6 py-5 border-b border-white/10 bg-black/40 shrink-0 gap-4">
                                                <div>
                                                    <div className="flex items-center gap-3">
                                                        <h2 className="text-2xl font-black text-white tracking-tight drop-shadow-sm">Team Match Dashboard</h2>
                                                        <span className="bg-white/10 text-white/50 px-2.5 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase border border-white/5">
                                                            {localMatches.length} Matches (Singles)
                                                        </span>
                                                    </div>
                                                    <p className="text-rose-400 text-xs mt-1.5 font-bold uppercase tracking-widest flex items-center gap-2">
                                                        {resolvingTie.t1.name} vs {resolvingTie.t2.name}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="p-4 md:p-6 bg-gradient-to-b from-black/20 to-black/60 flex flex-col gap-3 overflow-y-auto custom-scrollbar flex-1">
                                                {localMatches.map((m, idx) => {
                                                    const p1a = getPlayer(m.p1); const p2a = getPlayer(m.p2); 
                                                    const t1WinsThisMatch = m.winner === resolvingTie.t1.id;
                                                    const t2WinsThisMatch = m.winner === resolvingTie.t2.id;
                                                    
                                                    const isSuddenDeath = idx === mainMatchesTotal;
                                                    let isReadyToPlay = !m.winner;
                                                    let lockMessage = null;

                                                    if (isSuddenDeath && !m.winner) {
                                                        if (!allMainMatchesFinished) { isReadyToPlay = false; lockMessage = `Complete Matches 1-${mainMatchesTotal} First`; } 
                                                        else if (!isTied) { isReadyToPlay = false; lockMessage = "Not Required (Tie Decided)"; }
                                                    }

                                                    return (
                                                        <div key={idx} 
                                                             onClick={() => { if(isReadyToPlay) setResolvingSubMatch({ ...m, mIdx: idx }) }}
                                                             className={`relative bg-white/5 border rounded-2xl p-3 flex flex-col md:flex-row gap-4 items-center transition-all ${isReadyToPlay ? 'border-white/30 cursor-pointer hover:-translate-y-0.5 hover:shadow-md hover:border-rose-500/50 hover:bg-white/10' : 'border-white/10 opacity-70 bg-black/40'} ${isSuddenDeath ? 'ring-1 ring-gold-500/30' : ''}`}>
                                                            
                                                            {isSuddenDeath && lockMessage && (
                                                                <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px] rounded-2xl flex items-center justify-center z-20">
                                                                    <span className="bg-black/90 text-white/60 border border-white/10 px-4 py-2 rounded-xl text-[9px] font-black tracking-widest uppercase flex items-center gap-2 shadow-xl">
                                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                                                        {lockMessage}
                                                                    </span>
                                                                </div>
                                                            )}

                                                            <div className="w-full md:w-32 shrink-0 text-center md:text-left border-b md:border-b-0 md:border-r border-white/10 pb-2 md:pb-0 md:pr-3">
                                                                <div className={`text-[10px] font-black uppercase tracking-widest ${isSuddenDeath ? 'text-gold-400' : 'text-white/50'}`}>{m.name}</div>
                                                                <div className="text-[9px] font-bold text-rose-400 mt-0.5">1v1</div>
                                                            </div>

                                                            <div className="flex-1 flex w-full gap-4 items-center justify-between">
                                                                <div onClick={(e) => { e.stopPropagation(); onNavigate('players', p1a.id); }} className={`flex flex-col items-center gap-1.5 flex-1 transition-all cursor-pointer hover:scale-105 ${t2WinsThisMatch ? 'opacity-30 grayscale' : ''}`}>
                                                                    <img referrerPolicy="no-referrer" src={p1a.images?.[0] || p1a.imageUrl || "https://via.placeholder.com/40"} className="w-10 h-10 rounded-full object-cover border-2 border-white/20 shadow-md bg-black/50" />
                                                                    <span className={`font-bold text-xs text-center ${t1WinsThisMatch ? 'text-white' : 'text-white/70'}`}>{p1a.name}</span>
                                                                    {t1WinsThisMatch && <span className="bg-rose-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow-sm">WINNER</span>}
                                                                </div>
                                                                
                                                                <div className="shrink-0 text-white/20 font-black italic text-lg px-2">VS</div>
                                                                
                                                                <div onClick={(e) => { e.stopPropagation(); onNavigate('players', p2a.id); }} className={`flex flex-col items-center gap-1.5 flex-1 transition-all cursor-pointer hover:scale-105 ${t1WinsThisMatch ? 'opacity-30 grayscale' : ''}`}>
                                                                    <img referrerPolicy="no-referrer" src={p2a.images?.[0] || p2a.imageUrl || "https://via.placeholder.com/40"} className="w-10 h-10 rounded-full object-cover border-2 border-white/20 shadow-md bg-black/50" />
                                                                    <span className={`font-bold text-xs text-center ${t2WinsThisMatch ? 'text-white' : 'text-white/70'}`}>{p2a.name}</span>
                                                                    {t2WinsThisMatch && <span className="bg-rose-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow-sm">WINNER</span>}
                                                                </div>
                                                            </div>
                                                            
                                                            {isReadyToPlay && !lockMessage && (
                                                                <div className="shrink-0 pl-3 hidden md:block">
                                                                    <button className="bg-rose-500/20 text-rose-400 border border-rose-500/40 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-rose-500 hover:text-white">Play</button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <div className="p-4 md:p-6 border-t border-white/10 bg-black/40 flex flex-col md:flex-row justify-between items-center shrink-0 gap-4">
                                                <div className="text-white/50 text-[10px] font-bold uppercase tracking-widest text-center md:text-left">
                                                    {isKnockout ? "Complete 8 matches. Tiebreaker unlocks if 4-4." : "Complete 4 matches. Tiebreaker unlocks if 2-2."}
                                                    <br/>
                                                    <span className="text-white/30 text-[9px]">Current Score: {resolvingTie.t1.name} {t1w} - {t2w} {resolvingTie.t2.name}</span>
                                                </div>
                                                {resolvingTie.winner ? (
                                                    <div className="w-full md:w-auto bg-white/5 text-white/40 px-8 py-3 rounded-xl font-black tracking-widest uppercase text-xs text-center border border-white/5">
                                                        Match Concluded
                                                    </div>
                                                ) : (
                                                    <button onClick={submitTieResult} disabled={!canSubmit} className="w-full md:w-auto bg-rose-500 hover:bg-rose-400 text-white px-8 py-3 rounded-xl font-black tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(244,63,94,0.4)] disabled:opacity-30 disabled:cursor-not-allowed text-xs">
                                                        Confirm Final Result
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    )}
                </div>
            )}
            
            

            {/* Cinematic Resolve Modal */}
            <ResolveMatchModal 
                resolvingMatch={resolvingSubMatch} 
                setResolvingMatch={setResolvingSubMatch} 
                submitResult={handleSubMatchResolved} 
                handleRandomize={handleRandomizeSubMatch} 
                players={players} 
                allTournaments={allTournaments} 
                tournament={tournament} 
                tierConf={tierConf} 
                onNavigate={onNavigate} 
            />
            
        </div>
    );
}

export function TournamentsView({ tournaments, onSelect, onCreate, onEdit , isAdmin}) {
    const [search, setSearch] = useState('');
    const [filterTier, setFilterTier] = useState('All');
    
    const filteredTournaments = useMemo(() => {
        return tournaments.filter(t => {
            const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || 
                                  getCountryName(t.hostCountry).toLowerCase().includes(search.toLowerCase());
            const matchesTier = filterTier === 'All' || getTournamentTier(t) === filterTier;
            return matchesSearch && matchesTier;
        }).sort((a,b) => {
            if (a.status !== b.status) return a.status === 'active' ? -1 : 1;
            return (b.completedAt || b.createdAt) - (a.completedAt || a.createdAt);
        });
    }, [tournaments, search, filterTier]);

    const tierOptions = [
        { value: 'All', label: 'All Tiers' },
        ...Object.entries(TOURNAMENT_TIERS).map(([k, conf]) => ({ value: k, label: conf.name }))
    ];

    return (
        <div className="max-w-[1400px] mx-auto space-y-8 pb-20">
            {/* GLASS COMMAND CENTER */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-3xl p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-20">
                <div>
                    <h1 className="text-3xl font-bold text-white shrink-0 flex items-center gap-3 drop-shadow-md">
                        <TournamentsIcon size={32} className="text-gold-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]"/> Tournaments
                    </h1>
                    <p className="text-white/60 mt-1.5 text-sm font-medium tracking-wide">Manage events, resolve matches, and track history.</p>
                </div>
                
                <div className="flex flex-col md:flex-row gap-3 w-full lg:w-auto">
                    <div className="relative w-full md:w-64 group">
                        <input 
                            type="text" 
                            placeholder="Search tournaments..." 
                            className="bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 pl-10 text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 focus:bg-black/40 w-full transition-all duration-300 backdrop-blur-md shadow-inner"
                            value={search} 
                            onChange={e => setSearch(e.target.value)} 
                        />
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-gold-400 transition-colors" />
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <div className="flex-1 md:flex-none min-w-[140px]">
                            <GlassDropdown value={filterTier} onChange={setFilterTier} options={tierOptions} placeholder="All Tiers" />
                        </div>
                        {isAdmin && (
                            <button onClick={onCreate} className="flex-1 md:flex-none bg-gold-500/20 hover:bg-gold-500/30 border border-gold-500/30 px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 whitespace-nowrap transition-all duration-300 text-gold-300 font-bold backdrop-blur-md shadow-[0_0_15px_rgba(234,179,8,0.15)] hover:shadow-[0_0_25px_rgba(234,179,8,0.3)]">
                                <Plus size={20}/> Create Event
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTournaments.map(t => {
                    const tierKey = t.tier || getTournamentTier(t);
                    const tierConf = TOURNAMENT_TIERS[tierKey];
                    let activeBracket = [];
                    try { activeBracket = typeof t.bracket === 'string' ? JSON.parse(t.bracket) : (t.bracket || []); } catch(e){}
                    let drawSize = 0;
                    if (tierKey === 'nations_league' || tierKey === 'pro_am' || tierKey === 'challenger_elite') drawSize = 16;
                    else if (tierKey === 'finals') drawSize = 8;
                    else drawSize = activeBracket[0]?.length ? activeBracket[0].length * 2 : 0;
                    const isActive = t.status === 'active';
                    
                    return (
                        <div key={t.id} onClick={() => onSelect(t.id)} className="bg-black/40 backdrop-blur-xl border border-white/10 hover:border-white/30 rounded-3xl p-6 cursor-pointer hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:-translate-y-1.5 transition-all duration-500 group flex flex-col h-full relative overflow-hidden">
                            {/* Ambient Glow */}
                            <div className="absolute top-0 right-0 w-32 h-32 blur-[50px] opacity-20 pointer-events-none transition-opacity duration-500 group-hover:opacity-40" style={{ backgroundColor: tierConf?.hex }}></div>
                            
                            <div className="flex-1 relative z-10">
                                <div className="flex justify-between items-start mb-5">
                                    <span className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-lg ${tierConf?.bg || 'bg-white/10'} ${tierConf?.color || 'text-white/60'} shadow-sm`}>
                                        {tierConf?.name || 'Tournament'}
                                    </span>
                                    {isActive ? (
                                        <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1.5 shadow-[0_0_10px_rgba(6,182,212,0.2)] backdrop-blur-md">
                                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span> LIVE
                                        </span>
                                    ) : (
                                        <span className="text-[10px] uppercase font-bold tracking-widest text-white/30 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">Completed</span>
                                    )}
                                </div>

                                <h3 className="font-bold text-xl text-white mb-2 leading-tight group-hover:text-gold-400 transition-colors drop-shadow-md">
                                    {t.name}
                                </h3>
                                
                                <div className="flex items-center gap-2 text-sm font-medium text-white/60 mb-6">
                                    <span className="text-xl drop-shadow-sm">{getFlag(t.hostCountry)}</span>
                                    {getCountryName(t.hostCountry)}
                                </div>
                            </div>
                            
                            <div className="text-[11px] font-bold text-white/40 uppercase tracking-widest pt-4 border-t border-white/10 flex justify-between items-center relative z-10">
                                <span>{drawSize} Players</span>
                                <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    );
                })}
                {filteredTournaments.length === 0 && (
                    <div className="col-span-full py-20 text-center border border-white/10 rounded-3xl bg-white/5 backdrop-blur-sm flex flex-col items-center">
                        <TournamentsIcon size={48} className="text-white/20 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">No tournaments found</h3>
                        <p className="text-white/50 text-sm">Try adjusting your search or tier filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
}