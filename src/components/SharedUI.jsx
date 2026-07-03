import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronRight, Search, X, Plus, Download, ArrowLeft, ArrowUpIcon, GalleryIcon, Trophy, AnalyticsIcon, PlayersIcon, NationsIcon, TournamentsIcon, UserCircle } from './Icons';
import { COUNTRIES, TOURNAMENT_TIERS } from '../utils/constants';
import { getFlag, getCountryName } from '../utils/helpers';

export function Tooltip({ children, content }) {
    return (
        <div className="group/tooltip relative flex justify-center items-center cursor-help hover:z-50">
            {children}
            {/* GLOSSY GLASSMORPHISM: bg-black/40 with intense backdrop-blur-2xl */}
            <div className="absolute bottom-full mb-3 flex flex-col bg-black/40 backdrop-blur-2xl border border-white/20 shadow-[0_30px_60px_rgba(0,0,0,0.9)] rounded-2xl p-4 text-xs z-[100] pointer-events-none min-w-[180px] opacity-0 invisible translate-y-2 group-hover/tooltip:opacity-100 group-hover/tooltip:visible group-hover/tooltip:translate-y-0 transition-all duration-300 ease-out">
                {content}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-[6px] border-transparent border-t-white/20"></div>
            </div>
        </div>
    );
}

export function GlassDropdown({ value, onChange, options, placeholder, hasSearch = false }) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const wrapperRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) { if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setIsOpen(false); }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredOptions = options.filter(o => (o.label || '').toLowerCase().includes(search.toLowerCase()) || (o.searchKey || '').toLowerCase().includes(search.toLowerCase()));
    const selected = options.find(o => o.value === value);

    return (
        // SMART Z-INDEX: Only high when open!
        <div ref={wrapperRef} className={`relative w-full sm:w-64 transition-all duration-200 ${isOpen ? 'z-50' : 'z-20'}`}>
            <div 
                // HIGH TRANSPARENCY: bg-white/5 and backdrop-blur-md so you can see numbers behind it
                className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 text-white/90 flex justify-between items-center cursor-pointer hover:bg-white/10 transition-all shadow-sm"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="truncate text-sm font-medium tracking-wide">
                    {selected ? selected.renderLabel || selected.label : placeholder}
                </span>
                <ChevronRight size={14} className={`shrink-0 text-white/40 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
            </div>
            {isOpen && (
                // Removed royal-800, changed to a sleek dark background (#0a0a0a)
                <div className="absolute w-full mt-2 bg-[#0a0a0a]/95 backdrop-blur-3xl border border-white/10 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] max-h-72 overflow-y-auto custom-scrollbar flex flex-col z-[100]">
                    {hasSearch && (
                        <div className="p-2 sticky top-0 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/5 z-10 shrink-0">
                            <input type="text" autoFocus className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-500/50 transition-colors" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                    )}
                    <div className="flex-1 overflow-y-auto py-1">
                        {filteredOptions.map(o => (
                            <div key={o.value} className="px-4 py-2.5 hover:bg-white/10 cursor-pointer flex items-center text-white/80 transition-colors" onClick={() => { onChange(o.value); setIsOpen(false); setSearch(''); }}>
                                {o.renderOption || <span className="font-medium text-sm truncate">{o.label}</span>}
                            </div>
                        ))}
                        {filteredOptions.length === 0 && <div className="p-4 text-center text-white/40 text-sm">No results found</div>}
                    </div>
                </div>
            )}
        </div>
    );
}

export function GlassTabs({ tabs, activeTab, onChange, activeColor = '#d4af37' }) {
    return (
        <div className="flex bg-black/40 backdrop-blur-2xl p-1.5 rounded-full border border-white/10 w-fit overflow-x-auto custom-scrollbar shadow-lg">
            {tabs.map(tab => {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onChange(tab.id)}
                        className={`flex-1 sm:flex-none px-5 py-1.5 rounded-full text-xs font-black tracking-widest uppercase whitespace-nowrap transition-all duration-300 ${
                            isActive 
                            ? 'scale-[1.02] shadow-md' 
                            : 'text-white/40 hover:text-white/80 hover:bg-white/[0.05] border border-transparent'
                        }`}
                        style={isActive ? { 
                            backgroundColor: `${activeColor}20`, 
                            color: activeColor, 
                            border: `1px solid ${activeColor}50`,
                            textShadow: `0 0 10px ${activeColor}40`
                        } : {}}
                    >
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
}
        
export function SectionHeader({ title, subtitle, icon: IconComponent, rightContent }) {
    return (
        <header className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                    {IconComponent && <IconComponent size={32} className="text-gold-500" />}
                    {title}
                </h1>
                {subtitle && <p className="text-white/50 text-sm mt-1.5 font-medium">{subtitle}</p>}
            </div>
            {rightContent && (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    {rightContent}
                </div>
            )}
        </header>
    );
}

export const PlayerFormIndicator = ({ matches }) => {
    const last5 = (matches || []).slice(0, 5);
    const padded = [...last5, ...Array(Math.max(0, 5 - last5.length)).fill(null)];
    return (
        <div className="flex items-center justify-center gap-1.5">
            {padded.map((m, i) => (
                <div key={i} title={m ? (m.isWin ? 'Win' : 'Loss') : 'N/A'} 
                     className={`w-2 h-2 rounded-full shadow-inner ${!m ? 'bg-white/5' : m.isWin ? 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_5px_rgba(244,63,94,0.5)]'}`} />
            ))}
        </div>
    );
};

export const TierBadge = ({ rawTier, name }) => {
    const t = String(rawTier || 'event').toLowerCase();
    let hex = '#94a3b8'; let label = t.replace(/_/g, ' ');
    
    if (t === 'grand_slam') { hex = '#a855f7'; label = name || 'Grand Slam'; }
    else if (t === 'finals' || t === 'major') { hex = '#d4af37'; label = name || 'Major'; }
    else if (t === 'international') { hex = '#38bdf8'; label = name || 'International'; }
    else if (t === 'pro') { hex = '#fb923c'; label = name || 'Pro Series'; }
    else if (t === 'challenger') { hex = '#4ade80'; label = name || 'Challenger'; }
    else if (t === 'challenger_elite') { hex = '#10b981'; label = name || 'Challenger Elite'; }
    
    return (
        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shrink-0 backdrop-blur-md border shadow-sm"
              style={{ backgroundColor: `${hex}20`, color: hex, borderColor: `${hex}40` }}>
            {label}
        </span>
    );
};


export function PlayerMedia({ url, className = "", onClick, alt }) {
    const [hasError, setHasError] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const imgRef = useRef(null);

    // FIX: Catch images that are already loaded in the browser cache!
    useEffect(() => {
        setIsLoaded(false);
        setHasError(false);

        if (imgRef.current && imgRef.current.complete) {
            setIsLoaded(true);
        }
    }, [url]);

    if (!url) {
        return (
            <div className={`bg-[#0a0a0a] border border-white/5 flex items-center justify-center ${className}`}>
                <span className="text-gold-500/40 text-[10px] font-black uppercase tracking-widest">TBD</span>
            </div>
        );
    }
    
    let processedUrl = url.trim();
    const lowerUrl = processedUrl.toLowerCase();

    const wrapperClass = `relative overflow-hidden ${className.replace('object-cover', '').trim()}`;
    const innerClass = "absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-500 ease-out";

    // --- SLEEK IOS GLASSMORPHISM LOADER ---
    const loadingOverlay = (
        <div className={`absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md transition-opacity duration-300 z-20 ${isLoaded || hasError ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <svg className="w-1/3 h-1/3 max-w-[24px] max-h-[24px] text-white/50 animate-spin drop-shadow-md" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>
    );

    // 1. YOUTUBE
    const ytMatch = processedUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))((\w|-){11})/);
    if (ytMatch && ytMatch[1]) {
        const vid = ytMatch[1];
        const ytEmbedUrl = `https://www.youtube.com/embed/${vid}?autoplay=1&mute=1&controls=0&rel=0&showinfo=0&loop=1&playlist=${vid}&playsinline=1&modestbranding=1`;
        return (
            <div className={wrapperClass} onClick={onClick}>
                {loadingOverlay}
                {/* BULLETPROOF SHIELD: Blocks YouTube from stealing the mouse! */}
                <div className="absolute inset-0 z-20 pointer-events-auto"></div>
                <iframe onLoad={() => setIsLoaded(true)} src={ytEmbedUrl} className="absolute inset-0 w-full h-full border-0 pointer-events-none scale-[1.35] z-10" allow="autoplay; encrypted-media"></iframe>
            </div>
        );
    }

// 2. TIKTOK
    const ttMatch = typeof url === 'string' ? (url.match(/video\/(\d+)/i) || url.match(/data-video-id="(\d+)"/i)) : null;
    if (ttMatch && ttMatch[1]) {
        const ttId = ttMatch[1];
        // Appending ?lang=en-US stops the TikTok server from hanging when Firefox strips its tracking cookies
        const ttEmbedUrl = `https://www.tiktok.com/embed/v2/${ttId}?lang=en-US`;
        
        return (
            <div className={`relative w-full h-full bg-black overflow-hidden ${className}`}>
                {loadingOverlay}
                <iframe 
                    onLoad={() => setIsLoaded(true)}
                    src={ttEmbedUrl} 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-0 z-10" 
                    style={{ width: '100%', height: '100%', minWidth: '325px', minHeight: '575px' }}
                    // Explicit allow permissions tell Firefox this is a valid media embed, bypassing some strict sandbox rules
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    allowFullScreen
                    title="TikTok Player"
                ></iframe>
            </div>
        );
    }

    // 3. NATIVE IFRAMES
    const isIframeString = processedUrl.startsWith('<iframe') || processedUrl.startsWith('<blockquote');
    if (isIframeString) {
        useEffect(() => { setIsLoaded(true); }, [processedUrl]);
        return (
            <div className={wrapperClass} onClick={onClick}>
                {loadingOverlay}
                <div className={`absolute inset-0 z-10 flex items-center justify-center bg-black [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0`} dangerouslySetInnerHTML={{ __html: processedUrl }} />
            </div>
        );
    }

    // 4. DIRECT VIDEO FILES
    const isVideo = lowerUrl.includes('.mp4') || lowerUrl.includes('format=mp4') || lowerUrl.includes('.webm') || lowerUrl.includes('.mov') || processedUrl.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i);
    if (isVideo) {
        return (
            <div className={wrapperClass} onClick={onClick}>
                {loadingOverlay}
                <video src={processedUrl} className={innerClass} autoPlay loop muted playsInline onLoadedData={() => setIsLoaded(true)} />
            </div>
        );
    }
    
    // 5. STANDARD IMAGES
    return (
        <div className={wrapperClass} onClick={onClick}>
            {loadingOverlay}
            
            {hasError ? (
                <div className="absolute inset-0 bg-[#0a0a0a] flex flex-col items-center justify-center z-10 border border-white/5">
                    <span className="text-gold-500/50 text-[9px] font-black uppercase tracking-widest text-center leading-tight">Link<br/>Error</span>
                </div>
            ) : (
                <img 
                    ref={imgRef}
                    src={processedUrl} 
                    className={`${innerClass} ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
                    decoding="async" 
                    onLoad={() => setIsLoaded(true)} 
                    alt={alt || "Media"} 
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                        setHasError(true);
                        setIsLoaded(true);
                        e.target.onerror = null; 
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect width='100%25' height='100%25' fill='%230a0a0a'/%3E%3Ctext x='50%25' y='50%25' fill='%23d4af37' font-family='sans-serif' font-size='11' font-weight='bold' text-anchor='middle' dy='.3em'%3EInvalid Link%3C/text%3E%3C/svg%3E";
                    }}
                />
            )}
        </div>
    );
}

export function CountrySelect({ value, onChange, disabled, allowedCodes = null, players = [] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const wrapperRef = useRef(null);
    
    useEffect(() => {
        function handleClickOutside(event) { if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setIsOpen(false); }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    
    const nationStats = useMemo(() => {
        const stats = {};
        if (players && players.length > 0) {
            players.forEach(p => {
                const c = p.nationality || 'UNK';
                if (!stats[c]) stats[c] = { activePlayers: 0, points: 0 };
                if (!p.retired) {
                    stats[c].activePlayers++;
                    stats[c].points += (p.points || 0);
                }
            });
        }
        return stats;
    }, [players]);

    let sourceList = COUNTRIES;
    if (allowedCodes) sourceList = COUNTRIES.filter(c => allowedCodes.includes(c.code));
    
    // SMART SORTING LOGIC: Tiered by Player Count, then Points
    let filtered = sourceList.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase()));
    
    filtered.sort((a, b) => {
        const statsA = nationStats[a.code] || { activePlayers: 0, points: 0 };
        const statsB = nationStats[b.code] || { activePlayers: 0, points: 0 };
        
        // Group players into tiers (5+ is the top tier, as Nations League requires 5)
        const getTier = (count) => count >= 5 ? 5 : count;
        const tierA = getTier(statsA.activePlayers);
        const tierB = getTier(statsB.activePlayers);
        
        if (tierA !== tierB) return tierB - tierA; // Higher tier comes first
        return statsB.points - statsA.points; // If same tier, sort strictly by total points
    });
    
    const selectedCountry = COUNTRIES.find(c => c.code === value);
    
    return (
        <div ref={wrapperRef} className="relative w-full md:w-auto min-w-[200px]">
            <div 
                className={`w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white flex justify-between items-center transition-colors shadow-inner backdrop-blur-md ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-white/10 hover:border-white/20'}`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                <span className="truncate font-bold text-sm text-white/90">
                    {selectedCountry ? <span className="flex items-center gap-2"><span className="text-lg drop-shadow-sm">{selectedCountry.flag}</span> {selectedCountry.name}</span> : 'Select Nationality...'}
                </span>
                <ChevronRight size={16} className={`shrink-0 transition-transform ${isOpen ? 'rotate-90' : 'text-white/50'}`} />
            </div>
            {isOpen && (
                <div className="absolute z-[100] w-full mt-2 bg-[#050505]/95 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] max-h-64 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-2 sticky top-0 bg-[#050505] border-b border-white/10 z-20 shadow-md">
                        <input type="text" autoFocus className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500/50 transition-colors placeholder-white/40 shadow-inner" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    {filtered.map(c => {
                        const stats = nationStats[c.code];
                        return (
                            <div key={c.code} className="px-4 py-3 hover:bg-white/10 cursor-pointer flex items-center gap-3 text-white/90 border-b border-white/5 transition-colors" onClick={() => { onChange(c.code); setIsOpen(false); setSearch(''); }}>
                                <span className="text-2xl drop-shadow-md shrink-0">{c.flag}</span> 
                                <div className="flex flex-col min-w-0">
                                    <span className="font-bold text-sm truncate">{c.name} <span className="text-[10px] text-white/40 ml-1 tracking-widest">{c.code}</span></span>
                                    {stats && (
                                        <span className={`text-[10px] font-bold mt-0.5 ${stats.activePlayers >= 5 ? 'text-gold-400' : 'text-white/40'}`}>
                                            {stats.activePlayers} Active Players <span className="text-white/20 mx-1">•</span> {stats.points.toLocaleString()} Pts
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    {filtered.length === 0 && <div className="p-4 text-center text-white/40 text-sm font-medium">No countries found</div>}
                </div>
            )}
        </div>
    );
}

export function HistoricalTournamentSelect({ tournaments, value, onChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const wrapperRef = useRef(null);
    
    useEffect(() => {
        function handleClickOutside(event) { if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setIsOpen(false); }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    
    const completed = useMemo(() => tournaments.filter(t => t.status === 'completed').sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0)), [tournaments]);
    const filtered = completed.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));
    const selectedT = completed.find(t => t.id === value);

    return (
        <div ref={wrapperRef} className={`relative w-full sm:w-72 ${isOpen ? 'z-50' : 'z-20'}`}>
            <div 
                className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-2.5 text-white/90 flex justify-between items-center cursor-pointer hover:bg-white/10 transition-colors shadow-sm"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="truncate text-sm font-bold tracking-wide">
                    {value === '' ? '🟢 Live Rankings' : `🕒 As of: ${selectedT?.name}`}
                </span>
                <ChevronRight size={16} className={`shrink-0 text-white/50 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
            </div>
            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl max-h-72 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-2 sticky top-0 bg-black/40 backdrop-blur-md border-b border-white/5 z-10">
                        <input type="text" autoFocus className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-500/50 transition-colors placeholder-white/30" placeholder="Search history..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <div className="px-4 py-3 hover:bg-white/10 cursor-pointer flex items-center gap-2 text-white/90 border-b border-white/5 transition-colors" onClick={() => { onChange(''); setIsOpen(false); setSearch(''); }}>
                        <span className="font-bold text-emerald-400">🟢 Live Rankings</span>
                    </div>
                    {filtered.map(t => (
                        <div key={t.id} className="px-4 py-2.5 hover:bg-white/10 cursor-pointer flex flex-col text-white/80 transition-colors" onClick={() => { onChange(t.id); setIsOpen(false); setSearch(''); }}>
                            <span className="font-bold text-sm truncate">{t.name}</span>
                            <span className="text-[10px] text-white/40 mt-0.5 tracking-wider uppercase">{new Date(t.completedAt).toLocaleDateString()}</span>
                        </div>
                    ))}
                    {filtered.length === 0 && <div className="p-4 text-center text-white/40 text-sm">No tournaments found</div>}
                </div>
            )}
        </div>
    );
}

export function DashboardCountryFilter({ value, onChange, playersRaw }) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const wrapperRef = useRef(null);
    
    useEffect(() => {
        function handleClickOutside(event) { if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setIsOpen(false); }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const activeCodes = Array.from(new Set(playersRaw.map(p => p.nationality))).filter(Boolean);
    const availableCountries = COUNTRIES.filter(c => activeCodes.includes(c.code));
    const filtered = availableCountries.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase()));
    const selected = COUNTRIES.find(c => c.code === value);

    return (
        <div ref={wrapperRef} className={`relative w-full sm:w-64 ${isOpen ? 'z-50' : 'z-20'}`}>
            <div 
                className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-2.5 text-white/90 flex justify-between items-center cursor-pointer hover:bg-white/10 transition-colors shadow-sm"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="truncate text-sm font-bold tracking-wide">
                    {value === 'All' ? 'All Nations' : `${selected?.flag} ${selected?.name}`}
                </span>
                <ChevronRight size={16} className={`shrink-0 text-white/50 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
            </div>
            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl max-h-72 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-2 sticky top-0 bg-black/40 backdrop-blur-md border-b border-white/5 z-10">
                        <input type="text" autoFocus className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-500/50 transition-colors placeholder-white/30" placeholder="Search nations..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <div className="px-4 py-3 hover:bg-white/10 cursor-pointer flex items-center gap-2 text-white/90 border-b border-white/5 transition-colors" onClick={() => { onChange('All'); setIsOpen(false); setSearch(''); }}>
                        <span className="font-bold">All Nations</span>
                    </div>
                    {filtered.map(c => (
                        <div key={c.code} className="px-4 py-2.5 hover:bg-white/10 cursor-pointer flex items-center gap-3 text-white/90 transition-colors" onClick={() => { onChange(c.code); setIsOpen(false); setSearch(''); }}>
                            <span className="text-lg">{c.flag}</span>
                            <span className="font-bold text-sm truncate">{c.name}</span>
                        </div>
                    ))}
                    {filtered.length === 0 && <div className="p-4 text-center text-white/40 text-sm">No nations found</div>}
                </div>
            )}
        </div>
    );
}

export function FloatingChartNav() {
    const scrollToSection = (id) => document.getElementById(id)?.scrollIntoView({behavior: 'smooth', block: 'start'});
    const scrollToTop = () => document.querySelector('main .overflow-auto')?.scrollTo({ top: 0, behavior: 'smooth' });

    return (
        <div className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50 bg-black/40 backdrop-blur-2xl p-3 rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] hidden xl:flex w-24">
            <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold text-center pb-2 border-b border-white/10 w-full mb-1">Jump</div>
            
            <button onClick={() => scrollToSection('snb-chart-wrapper-rank')} className="p-3 w-full bg-white/5 hover:bg-white/20 text-white/70 hover:text-white rounded-xl transition-all hover:scale-105 group flex flex-col items-center justify-center gap-1.5 shadow-inner border border-transparent hover:border-white/20">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                <span className="text-[9px] font-black uppercase tracking-wider text-center">Rank</span>
            </button>
            
            <button onClick={() => scrollToSection('snb-chart-wrapper-points')} className="p-3 w-full bg-white/5 hover:bg-white/20 text-white/70 hover:text-white rounded-xl transition-all hover:scale-105 group flex flex-col items-center justify-center gap-1.5 shadow-inner border border-transparent hover:border-white/20">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                <span className="text-[9px] font-black uppercase tracking-wider text-center">Points</span>
            </button>

            <div className="mt-2 pt-4 border-t border-white/10 w-full">
                <button onClick={scrollToTop} className="p-3 w-full bg-white/5 hover:bg-white/20 text-white/40 hover:text-white rounded-xl transition-all hover:scale-105 group flex flex-col items-center justify-center gap-1.5 shadow-inner border border-transparent hover:border-white/20">
                    <ArrowUpIcon size={20}/>
                    <span className="text-[9px] font-black uppercase tracking-wider text-center">Top</span>
                </button>
            </div>
        </div>
    );
}

export function FloatingNationNav() {
    const scrollToSection = (id) => document.getElementById(id)?.scrollIntoView({behavior: 'smooth', block: 'start'});
    const scrollToTop = () => document.querySelector('main .overflow-auto')?.scrollTo({ top: 0, behavior: 'smooth' });
    
    return (
        <div className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50 bg-black/40 backdrop-blur-2xl p-3 rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] hidden xl:flex w-24">
            <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold text-center pb-2 border-b border-white/10 w-full mb-1">Jump</div>
            
            <button onClick={() => scrollToSection('nation-chart')} className="p-3 w-full bg-white/5 hover:bg-white/20 text-white/70 hover:text-white rounded-xl transition-all hover:scale-105 group flex flex-col items-center justify-center gap-1.5 shadow-inner border border-transparent hover:border-white/20">
                <AnalyticsIcon size={24}/>
                <span className="text-[9px] font-black uppercase tracking-wider text-center">Chart</span>
            </button>
            
            <button onClick={() => scrollToSection('nation-roster')} className="p-3 w-full bg-white/5 hover:bg-white/20 text-white/70 hover:text-white rounded-xl transition-all hover:scale-105 group flex flex-col items-center justify-center gap-1.5 shadow-inner border border-transparent hover:border-white/20">
                <PlayersIcon size={24}/>
                <span className="text-[9px] font-black uppercase tracking-wider text-center">Roster</span>
            </button>
            
            <button onClick={() => scrollToSection('nation-trophies')} className="p-3 w-full bg-white/5 hover:bg-white/20 text-white/70 hover:text-white rounded-xl transition-all hover:scale-105 group flex flex-col items-center justify-center gap-1.5 shadow-inner border border-transparent hover:border-white/20">
                <Trophy size={24}/>
                <span className="text-[9px] font-black uppercase tracking-wider text-center">Trophies</span>
            </button>
            
            <div className="mt-2 pt-4 border-t border-white/10 w-full">
                <button onClick={scrollToTop} className="p-3 w-full bg-white/5 hover:bg-white/20 text-white/40 hover:text-white rounded-xl transition-all hover:scale-105 group flex flex-col items-center justify-center gap-1.5 shadow-inner border border-transparent hover:border-white/20">
                    <ArrowUpIcon size={20}/>
                    <span className="text-[9px] font-black uppercase tracking-wider text-center">Top</span>
                </button>
            </div>
        </div>
    );
}

export function FloatingPlayerNav({ hasGallery }) {
    const scrollToSection = (id) => document.getElementById(id)?.scrollIntoView({behavior: 'smooth', block: 'start'});
    const scrollToTop = () => document.querySelector('main .overflow-auto')?.scrollTo({ top: 0, behavior: 'smooth' });
    
    return (
        <div className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50 bg-black/40 backdrop-blur-2xl p-3 rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] hidden xl:flex w-24">
            <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold text-center pb-2 border-b border-white/10 w-full mb-1">Jump</div>
            
            {hasGallery && (
                <button onClick={() => scrollToSection('player-gallery')} className="p-3 w-full bg-white/5 hover:bg-white/20 text-white/70 hover:text-white rounded-xl transition-all hover:scale-105 group flex flex-col items-center justify-center gap-1.5 shadow-inner border border-transparent hover:border-white/20">
                    <GalleryIcon size={24}/>
                    <span className="text-[9px] font-black uppercase tracking-wider text-center">Gallery</span>
                </button>
            )}
            
            <button onClick={() => scrollToSection('player-achievements')} className="p-3 w-full bg-white/5 hover:bg-white/20 text-white/70 hover:text-white rounded-xl transition-all hover:scale-105 group flex flex-col items-center justify-center gap-1.5 shadow-inner border border-transparent hover:border-white/20">
                <Trophy size={24}/>
                <span className="text-[9px] font-black uppercase tracking-wider text-center">Trophies</span>
            </button>
            
            <button onClick={() => scrollToSection('player-charts')} className="p-3 w-full bg-white/5 hover:bg-white/20 text-white/70 hover:text-white rounded-xl transition-all hover:scale-105 group flex flex-col items-center justify-center gap-1.5 shadow-inner border border-transparent hover:border-white/20">
                <AnalyticsIcon size={24}/>
                <span className="text-[9px] font-black uppercase tracking-wider text-center">Charts</span>
            </button>

            <div className="mt-2 pt-4 border-t border-white/10 w-full">
                <button onClick={scrollToTop} className="p-3 w-full bg-white/5 hover:bg-white/20 text-white/40 hover:text-white rounded-xl transition-all hover:scale-105 group flex flex-col items-center justify-center gap-1.5 shadow-inner border border-transparent hover:border-white/20">
                    <ArrowUpIcon size={20}/>
                    <span className="text-[9px] font-black uppercase tracking-wider text-center">Top</span>
                </button>
            </div>
        </div>
    );
}