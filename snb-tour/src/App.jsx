import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate, useParams } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot, doc, addDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';

// --- 1. Import Navigation & UI ---
import { Sidebar, MobileNav } from './components/Navigation';
import { SnbLogo, Shield } from './components/Icons';

// --- 2. Import Views ---
import { DashboardView } from './views/DashboardView';
import { AnalyticsView } from './views/AnalyticsView';
import { NationsView, NationProfile } from './views/NationsView';
import { PlayersView, PlayerProfile } from './views/PlayersView';
import { TournamentsView, CreateTournamentView, TournamentBracket, SNBInternationalsBracket, SNBNationsBracket } from './views/TournamentsView';

// --- 3. Import Helpers ---
import { calculatePlayerRankings, getGlobalHistory } from './utils/helpers';

// --- 4. The Bridge ---
window.fb = { initializeApp, getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, getFirestore, collection, onSnapshot, doc, addDoc, updateDoc, deleteDoc, query, orderBy };

const firebaseConfig = {
    apiKey: "AIzaSyDHfnWgaeNG2-lZBSmPpa8JdZgUHNPMh4w",
    authDomain: "prorank-7b6b3.firebaseapp.com",
    projectId: "prorank-7b6b3",
    storageBucket: "prorank-7b6b3.firebasestorage.app",
    messagingSenderId: "991950932964",
    appId: "1:991950932964:web:db0346d0aa7d23b5ac55f1"
};
const appId = typeof window.__app_id !== 'undefined' ? window.__app_id : 'pro-rank-global';

// --- URL SLUG GENERATOR ---
const slugify = (text) => text ? text.toString().toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : '';

// --- ERROR BOUNDARY (Prevents the White Screen of Death) ---
class ErrorBoundary extends React.Component {
    constructor(props) { super(props); this.state = { hasError: false, error: null }; }
    static getDerivedStateFromError(error) { return { hasError: true, error }; }
    componentDidCatch(error, errorInfo) { console.error("App Crash Intercepted:", error, errorInfo); }
    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center h-full w-full bg-white/5 border border-rose-500/30 rounded-3xl p-8 backdrop-blur-md animate-in fade-in duration-300">
                    <Shield size={48} className="text-rose-500 mb-4" />
                    <h2 className="text-xl font-black text-white mb-2">View Render Failed</h2>
                    <p className="text-rose-400 text-sm font-mono bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">{this.state.error?.message}</p>
                    <button onClick={() => this.setState({ hasError: false })} className="mt-6 bg-rose-500 text-white px-6 py-2 rounded-xl font-bold">Try Again</button>
                </div>
            );
        }
        return this.props.children;
    }
}

// --- ROUTER WRAPPERS (Translates URLs to Data) ---
const PlayerProfileWrapper = ({ players, playersRaw, tournaments, db, appId, onNavigate }) => {
    const { slug } = useParams();
    const player = players.find(p => slugify(p.name) === slug || p.id === slug);
    
    // Dynamic Tab Title!
    useEffect(() => { 
        document.title = player ? `${player.name} | SNB Tour` : 'SNB Tour'; 
        return () => document.title = 'SNB Tour'; 
    }, [player]);

    if (!player) return <Navigate to="/players" />;
    return <PlayerProfile player={player} players={players} playersRaw={playersRaw} onBack={() => onNavigate('players')} tournaments={tournaments} db={db} appId={appId} onNavigate={onNavigate} />;
};

const NationProfileWrapper = ({ players, playersRaw, tournaments, onNavigate }) => {
    const { code } = useParams();
    const cleanCode = code.toUpperCase();
    useEffect(() => { document.title = `${cleanCode} | SNB Nations`; return () => document.title = 'SNB Tour'; }, [cleanCode]);
    return <NationProfile code={cleanCode} players={players} onBack={() => onNavigate('nations')} onNavigate={onNavigate} playersRaw={playersRaw} tournaments={tournaments} />;
};

const TournamentBracketWrapper = ({ players, tournaments, db, appId, onNavigate }) => {
    const { slug } = useParams();
    const t = tournaments.find(t => slugify(t.name) === slug || t.id === slug);
    
    useEffect(() => { document.title = t ? `${t.name} | SNB Tour` : 'SNB Tour'; return () => document.title = 'SNB Tour'; }, [t]);

    if (!t) return <Navigate to="/tournaments" />;
    if (t.format === 'nations_league') return <SNBNationsBracket tournament={t} players={players} onBack={() => onNavigate('tournaments')} db={db} appId={appId} allTournaments={tournaments} onNavigate={onNavigate} />;
    if (t.format === 'atp_finals' || t.format === 'pro_am') return <SNBInternationalsBracket tournament={t} players={players} onBack={() => onNavigate('tournaments')} db={db} appId={appId} allTournaments={tournaments} onNavigate={onNavigate} />;
    return <TournamentBracket tournament={t} allTournaments={tournaments} players={players} onBack={() => onNavigate('tournaments')} db={db} appId={appId} onNavigate={onNavigate} />;
};

const EditTournamentWrapper = ({ players, tournaments, db, appId, onNavigate }) => {
    const { slug } = useParams();
    const t = tournaments.find(t => slugify(t.name) === slug || t.id === slug);
    return <CreateTournamentView players={players} onBack={() => onNavigate('tournaments')} onSuccess={tid => onNavigate('tournaments', null, tid)} db={db} appId={appId} editingId={t?.id} tournaments={tournaments} />;
};

export default function App() {
    const [user, setUser] = useState(null);
    const [db, setDb] = useState(null);
    const [playersRaw, setPlayersRaw] = useState([]);
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [firebaseError, setFirebaseError] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const activeTab = location.pathname.split('/')[1] || 'dashboard';

    useEffect(() => {
        try {
            const fbApp = window.fb.initializeApp(firebaseConfig);
            const auth = window.fb.getAuth(fbApp);
            const firestore = window.fb.getFirestore(fbApp);
            setDb(firestore);
            const initAuth = async () => { await window.fb.signInAnonymously(auth); };
            initAuth().catch(() => { setFirebaseError(true); setLoading(false); });
            window.fb.onAuthStateChanged(auth, setUser);
        } catch (e) { setFirebaseError(true); setLoading(false); }
    }, []);

    useEffect(() => {
        if (!user || !db) return;
        const pRef = window.fb.collection(db, 'artifacts', appId, 'public', 'data', 'players');
        const tRef = window.fb.collection(db, 'artifacts', appId, 'public', 'data', 'tournaments');
        
        const unsubP = window.fb.onSnapshot(pRef, snap => setPlayersRaw(snap.docs.map(d => ({ id: d.id, ...d.data() }))), () => setFirebaseError(true));
        const unsubT = window.fb.onSnapshot(tRef, snap => { 
            setTournaments(snap.docs.map(d => { 
                const dt = d.data(); let b = []; 
                if (dt.format !== 'atp_finals') { try { b = typeof dt.bracket === 'string' ? JSON.parse(dt.bracket) : dt.bracket; } catch(e){} }
                return { id: d.id, ...dt, bracket: dt.format === 'atp_finals' ? dt.bracket : b }; 
            })); 
            setLoading(false); 
        }, () => setFirebaseError(true));
        
        return () => { unsubP(); unsubT(); };
    }, [user, db]);

    // THE SPEED FIX: We compute the heavy math here ONCE and memorize it.
    const players = useMemo(() => {
        const ranked = calculatePlayerRankings(playersRaw, tournaments);
        let activeIdx = 1;
        ranked.forEach(p => { if (!p.retired) { p.currentRank = activeIdx++; } });
        return ranked;
    }, [playersRaw, tournaments]);
    
    // The Universal Navigation Router
    const handleNavigate = (tab, playerId = null, tournamentId = null, nationCode = null) => {
        let path = `/${tab}`;

        if (tab === 'players' && playerId) {
            const p = players.find(x => x.id === playerId);
            path = `/players/${p ? slugify(p.name) : playerId}`;
        } else if (tab === 'tournaments' && tournamentId) {
            const t = tournaments.find(x => x.id === tournamentId);
            path = `/tournaments/${t ? slugify(t.name) : tournamentId}`;
        } else if (tab === 'nations' && nationCode) {
            path = `/nations/${nationCode.toLowerCase()}`;
        } else if (tab === 'create_tournament') {
            const t = tournaments.find(x => x.id === tournamentId);
            path = tournamentId ? `/edit-tournament/${t ? slugify(t.name) : tournamentId}` : `/create-tournament`;
        }

        navigate(path);
        
        setTimeout(() => {
            const scrollArea = document.querySelector('main .custom-scrollbar');
            if (scrollArea) scrollArea.scrollTo({ top: 0, behavior: 'instant' });
        }, 10);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#050505] w-full selection:bg-transparent">
            <div className="flex flex-col items-center gap-6 animate-pulse">
                <SnbLogo size={42} className="text-gold-500/70" />
                <span className="text-white/40 text-[10px] font-medium tracking-[0.4em] uppercase">Loading SNB Tour...</span>
            </div>
        </div>
    );
    
    if (firebaseError || (!user && !loading)) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-white w-full p-4">
            <div className="text-center p-8 bg-white/[0.02] rounded-2xl border border-red-500/30 max-w-md shadow-2xl">
                <Shield size={48} className="mx-auto mb-4 text-red-500" />
                <h2 className="text-xl font-bold text-white mb-2">Connection Error</h2>
            </div>
        </div>
    );

    return (
        <div className="h-screen w-full bg-[#050505] text-white flex font-sans overflow-hidden">
            <Sidebar activeTab={activeTab} navigateTo={handleNavigate} />
            <main className="flex-1 flex flex-col overflow-hidden relative">
                <MobileNav activeTab={activeTab} navigateTo={handleNavigate} />
                <div className="flex-1 overflow-auto p-4 md:p-8 custom-scrollbar bg-transparent">
                    <ErrorBoundary>
                        <Routes>
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            <Route path="/dashboard" element={<DashboardView playersRaw={playersRaw} tournaments={tournaments} onSelectPlayer={(id) => handleNavigate('players', id)} players={players} />} />
                            <Route path="/analytics" element={<AnalyticsView playersRaw={playersRaw} tournaments={tournaments} players={players} onNavigate={handleNavigate} />} />
                            
                            <Route path="/nations" element={<NationsView players={players} playersRaw={playersRaw} tournaments={tournaments} onNavigate={handleNavigate} />} />
                            <Route path="/nations/:code" element={<NationProfileWrapper players={players} playersRaw={playersRaw} tournaments={tournaments} onNavigate={handleNavigate} />} />
                            
                            <Route path="/players" element={<PlayersView players={players} onSelectPlayer={(id) => handleNavigate('players', id)} db={db} appId={appId} />} />
                            <Route path="/players/:slug" element={<PlayerProfileWrapper players={players} playersRaw={playersRaw} tournaments={tournaments} db={db} appId={appId} onNavigate={handleNavigate} />} />
                            
                            <Route path="/tournaments" element={<TournamentsView tournaments={tournaments} onSelect={(id) => handleNavigate('tournaments', null, id)} onCreate={() => handleNavigate('create_tournament')} onEdit={(id) => handleNavigate('create_tournament', null, id)} />} />
                            <Route path="/tournaments/:slug" element={<TournamentBracketWrapper players={players} tournaments={tournaments} db={db} appId={appId} onNavigate={handleNavigate} />} />
                            
                            <Route path="/create-tournament" element={<CreateTournamentView players={players} onBack={() => handleNavigate('tournaments')} onSuccess={id => handleNavigate('tournaments', null, id)} db={db} appId={appId} tournaments={tournaments} />} />
                            <Route path="/edit-tournament/:slug" element={<EditTournamentWrapper players={players} tournaments={tournaments} db={db} appId={appId} onNavigate={handleNavigate} />} />
                        </Routes>
                    </ErrorBoundary>
                </div>
            </main>
        </div>
    );
}