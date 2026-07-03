import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate, useParams } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot, doc, addDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { getAuth, signInAnonymously, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';

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
window.fb = { initializeApp, getAuth, signInAnonymously, signInWithEmailAndPassword, onAuthStateChanged, signOut, getFirestore, collection, onSnapshot, doc, addDoc, updateDoc, deleteDoc, query, orderBy };

const firebaseConfig = {
    apiKey: "AIzaSyDHfnWgaeNG2-lZBSmPpa8JdZgUHNPMh4w",
    authDomain: "prorank-7b6b3.firebaseapp.com",
    projectId: "prorank-7b6b3",
    storageBucket: "prorank-7b6b3.firebasestorage.app",
    messagingSenderId: "991950932964",
    appId: "1:991950932964:web:db0346d0aa7d23b5ac55f1"
};
const appId = typeof window.__app_id !== 'undefined' ? window.__app_id : 'pro-rank-global';

const slugify = (text) => text ? text.toString().toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : '';

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

// --- ROUTER WRAPPERS ---
const PlayerProfileWrapper = ({ players, playersRaw, tournaments, globalHistory, db, appId, onNavigate, isAdmin }) => {
    const { slug } = useParams();
    const player = players.find(p => slugify(p.name) === slug || p.id === slug);
    useEffect(() => { document.title = player ? `${player.name} | SNB Tour` : 'SNB Tour'; return () => document.title = 'SNB Tour'; }, [player]);
    if (!player) return <Navigate to="/players" />;
    return <PlayerProfile player={player} players={players} playersRaw={playersRaw} globalHistory={globalHistory} onBack={() => onNavigate('players')} tournaments={tournaments} db={db} appId={appId} onNavigate={onNavigate} isAdmin={isAdmin} />;
};

const NationProfileWrapper = ({ players, playersRaw, tournaments, globalHistory, onNavigate, isAdmin }) => {
    const { code } = useParams();
    const cleanCode = code.toUpperCase();
    useEffect(() => { document.title = `${cleanCode} | SNB Nations`; return () => document.title = 'SNB Tour'; }, [cleanCode]);
    return <NationProfile code={cleanCode} players={players} onBack={() => onNavigate('nations')} onNavigate={onNavigate} playersRaw={playersRaw} tournaments={tournaments} globalHistory={globalHistory} isAdmin={isAdmin} />;
};

const TournamentBracketWrapper = ({ players, tournaments, db, appId, onNavigate, isAdmin }) => {
    const { slug } = useParams();
    const t = tournaments.find(t => slugify(t.name) === slug || t.id === slug);
    useEffect(() => { document.title = t ? `${t.name} | SNB Tour` : 'SNB Tour'; return () => document.title = 'SNB Tour'; }, [t]);
    if (!t) return <Navigate to="/tournaments" />;
    if (t.format === 'nations_league' || t.format === 'nations_league_v2') return <SNBNationsBracket tournament={t} players={players} onBack={() => onNavigate('tournaments')} db={db} appId={appId} allTournaments={tournaments} onNavigate={onNavigate} isAdmin={isAdmin} />;
    if (t.format === 'atp_finals' || t.format === 'pro_am') return <SNBInternationalsBracket tournament={t} players={players} onBack={() => onNavigate('tournaments')} db={db} appId={appId} allTournaments={tournaments} onNavigate={onNavigate} isAdmin={isAdmin} />;
    return <TournamentBracket tournament={t} allTournaments={tournaments} players={players} onBack={() => onNavigate('tournaments')} db={db} appId={appId} onNavigate={onNavigate} isAdmin={isAdmin} />;
};

const EditTournamentWrapper = ({ players, tournaments, db, appId, onNavigate, isAdmin }) => {
    const { slug } = useParams();
    const t = tournaments.find(t => slugify(t.name) === slug || t.id === slug);
    return <CreateTournamentView players={players} onBack={() => onNavigate('tournaments')} onSuccess={tid => onNavigate('tournaments', null, tid)} db={db} appId={appId} editingId={t?.id} tournaments={tournaments} isAdmin={isAdmin} />;
};

export default function App() {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [db, setDb] = useState(null);
    const [playersRaw, setPlayersRaw] = useState([]);
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [firebaseError, setFirebaseError] = useState(false);

    // --- MODAL & AUTH STATES ---
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [isAuthenticating, setIsAuthenticating] = useState(false); // NEW!

    const navigate = useNavigate();
    const location = useLocation();
    const activeTab = location.pathname.split('/')[1] || 'dashboard';

    // *** CHANGE THIS TO YOUR ACTUAL ADMIN EMAIL ***
    const ADMIN_EMAIL = 'jakezerni1@gmail.com'; 

    useEffect(() => {
        try { window.fb.initializeApp(firebaseConfig); } 
        catch (e) { /* App already exists, totally fine */ }
        
        try {
            const auth = window.fb.getAuth();
            const firestore = window.fb.getFirestore();
            setDb(firestore);
            
            const unsub = window.fb.onAuthStateChanged(auth, (currentUser) => {
                if (currentUser) {
                    setUser(currentUser);
                    // Clean, silent, and case-insensitive check
                    setIsAdmin(currentUser.email && currentUser.email.toLowerCase() === ADMIN_EMAIL.toLowerCase());
                } else {
                    setUser(null);
                    setIsAdmin(false);
                    window.fb.signInAnonymously(auth).catch(() => setFirebaseError(true));
                }
            });
            return () => unsub();
        } catch (e) { 
            console.error("Firebase Auth Error:", e);
            setFirebaseError(true); 
            setLoading(false); 
        }
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

    const players = useMemo(() => {
        const ranked = calculatePlayerRankings(playersRaw, tournaments);
        let activeIdx = 1;
        ranked.forEach(p => { if (!p.retired) { p.currentRank = activeIdx++; } });
        return ranked;
    }, [playersRaw, tournaments]);

    const globalHistory = useMemo(() => {
        if (!playersRaw.length || !tournaments.length) return [];
        return getGlobalHistory(playersRaw, tournaments);
    }, [playersRaw, tournaments]);
    
    const handleNavigate = (tab, playerId = null, tournamentId = null, nationCode = null) => {
        // RECORD SCROLL: Save the exact pixel depth before destroying the view
        const scrollArea = document.querySelector('main .custom-scrollbar');
        if (scrollArea) sessionStorage.setItem(`scroll-${location.pathname}`, scrollArea.scrollTop);

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
    };

    // RESTORE SCROLL: When the URL changes, wait a paint cycle and inject the saved pixel depth
    useEffect(() => {
        const scrollArea = document.querySelector('main .custom-scrollbar');
        if (scrollArea) {
            const savedScroll = sessionStorage.getItem(`scroll-${location.pathname}`);
            requestAnimationFrame(() => {
                scrollArea.scrollTo({ top: savedScroll ? parseInt(savedScroll, 10) : 0, behavior: 'instant' });
            });
        }
    }, [location.pathname]);

    // --- EMAIL/PASSWORD LOGIN LOGIC ---
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setIsAuthenticating(true); // Disable button & show "Verifying..."
        
        try {
            const auth = window.fb.getAuth();
            await window.fb.signInWithEmailAndPassword(auth, loginEmail, loginPassword);
            
            setShowLoginModal(false);
            setLoginEmail('');
            setLoginPassword('');
        } catch (error) { 
            console.error("Login failed:", error);
            alert("Invalid Email or Password."); // Keep this one just in case you type it wrong!
        } finally {
            setIsAuthenticating(false); // Re-enable button when done
        }
    };

    const handleAdminLogout = async () => {
        try {
            const auth = window.fb.getAuth();
            await window.fb.signOut(auth);
        } catch (error) { console.error("Logout failed:", error); }
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
        <div className="h-screen w-full bg-[#050505] text-white flex font-sans overflow-hidden relative">
            <Sidebar activeTab={activeTab} navigateTo={handleNavigate} isAdmin={isAdmin} />
            <main className="flex-1 flex flex-col overflow-hidden relative">
                <MobileNav activeTab={activeTab} navigateTo={handleNavigate} isAdmin={isAdmin} />
                <div className="flex-1 overflow-auto p-4 md:p-8 custom-scrollbar bg-transparent">
                    <ErrorBoundary>
                        <Routes>
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            
                            <Route path="/dashboard" element={<DashboardView playersRaw={playersRaw} tournaments={tournaments} globalHistory={globalHistory} onSelectPlayer={(id) => handleNavigate('players', id)} players={players} isAdmin={isAdmin} />} />
                            <Route path="/analytics" element={<AnalyticsView globalHistory={globalHistory} playersRaw={playersRaw} tournaments={tournaments} players={players} onNavigate={handleNavigate} isAdmin={isAdmin} />} />
                            
                            <Route path="/nations" element={<NationsView players={players} playersRaw={playersRaw} tournaments={tournaments} globalHistory={globalHistory} onNavigate={handleNavigate} isAdmin={isAdmin} />} />
                            <Route path="/nations/:code" element={<NationProfileWrapper players={players} playersRaw={playersRaw} tournaments={tournaments} globalHistory={globalHistory} onNavigate={handleNavigate} isAdmin={isAdmin} />} />
                            
                            <Route path="/players" element={<PlayersView players={players} onSelectPlayer={(id) => handleNavigate('players', id)} db={db} appId={appId} isAdmin={isAdmin} />} />
                            <Route path="/players/:slug" element={<PlayerProfileWrapper players={players} playersRaw={playersRaw} tournaments={tournaments} globalHistory={globalHistory} db={db} appId={appId} onNavigate={handleNavigate} isAdmin={isAdmin} />} />
                            
                            <Route path="/tournaments" element={<TournamentsView tournaments={tournaments} onSelect={(id) => handleNavigate('tournaments', null, id)} onCreate={() => handleNavigate('create_tournament')} onEdit={(id) => handleNavigate('create_tournament', null, id)} isAdmin={isAdmin} />} />
                            <Route path="/tournaments/:slug" element={<TournamentBracketWrapper players={players} tournaments={tournaments} db={db} appId={appId} onNavigate={handleNavigate} isAdmin={isAdmin} />} />
                            
                            <Route path="/create-tournament" element={<CreateTournamentView players={players} onBack={() => handleNavigate('tournaments')} onSuccess={id => handleNavigate('tournaments', null, id)} db={db} appId={appId} tournaments={tournaments} isAdmin={isAdmin} />} />
                            <Route path="/edit-tournament/:slug" element={<EditTournamentWrapper players={players} tournaments={tournaments} db={db} appId={appId} onNavigate={handleNavigate} isAdmin={isAdmin} />} />
                        </Routes>
                    </ErrorBoundary>
                </div>
            </main>

            {/* ADMIN LOGIN BUTTON */}
            <div className="fixed bottom-4 left-4 md:left-6 z-[9999]">
                {isAdmin ? (
                    <button onClick={handleAdminLogout} className="bg-white/5 text-white/40 hover:text-rose-400 hover:bg-rose-500/10 border border-white/5 hover:border-rose-500/30 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all backdrop-blur-md shadow-lg">
                        Logout Admin
                    </button>
                ) : (
                    <button onClick={() => setShowLoginModal(true)} className="bg-black/40 text-white/20 hover:text-white/60 border border-white/5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all backdrop-blur-md">
                        Admin
                    </button>
                )}
            </div>

            {/* THE LOGIN MODAL */}
            {showLoginModal && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowLoginModal(false)}></div>
                    <form onSubmit={handleLoginSubmit} className="bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl w-full max-w-sm relative z-10 shadow-[0_30px_60px_rgba(0,0,0,0.9)] animate-in fade-in zoom-in-95 duration-200">
                        <h2 className="text-2xl font-black text-white mb-6 text-center tracking-tight">Admin Access</h2>
                        <div className="space-y-4 mb-8">
                            <input 
                                type="email" 
                                placeholder="Email" 
                                required
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500/50 shadow-inner"
                            />
                            <input 
                                type="password" 
                                placeholder="Password" 
                                required
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500/50 shadow-inner"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button type="button" onClick={() => setShowLoginModal(false)} className="flex-1 text-white/50 hover:text-white transition-colors font-bold text-sm">Cancel</button>
                            <button 
                                type="submit" 
                                disabled={isAuthenticating}
                                className="flex-1 bg-gold-500 hover:bg-gold-400 text-black py-3 rounded-xl font-black transition-colors shadow-[0_0_15px_rgba(212,175,55,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isAuthenticating ? 'Verifying...' : 'Login'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}