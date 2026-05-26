import React from 'react';
import trophyImage from '../assets/NLGoldtrophy.svg'; 
// --- Custom Picasso-Style Abstract Icons ---
export const SnbLogo = ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 100 100" className={className}>
        <path d="M 15 65 C 5 25 40 5 75 15 L 50 50 Z" fill="#00E68A" />
        <path d="M 75 15 C 95 45 80 90 40 95 L 50 50 Z" fill="#059669" />
        <polygon points="30,85 70,75 80,30 20,40" fill="#FBBF24" />
        <polygon points="50,50 80,30 70,75" fill="#FDE047" />
        <path d="M 30 20 L 70 80 L 55 90 L 15 30 Z" fill="#ffffff" opacity="0.95" />
    </svg>
);

export const DashboardIcon = ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 100 100" className={className}>
        <path d="M 5 80 C 30 50, 70 30, 95 60 C 70 95, 30 100, 5 80 Z" fill="currentColor" opacity="0.3" />
        <polygon points="15,75 35,40 50,55 80,15 90,30 60,85 40,65" fill="currentColor" opacity="0.9" />
        <polygon points="25,35 45,15 55,25" fill="currentColor" opacity="0.7" />
    </svg>
);

export const PlayersIcon = ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 100 100" className={className}>
        <path d="M 50 50 C 20 50, 20 10, 50 10 C 70 10, 75 30, 50 50 Z" fill="currentColor" opacity="0.4" />
        <polygon points="50,10 75,35 45,55 35,30" fill="currentColor" opacity="0.8" />
        <path d="M 10 95 C 15 65, 35 55, 60 60 C 85 65, 95 80, 95 95 Z" fill="currentColor" opacity="0.3" />
        <polygon points="35,60 70,95 20,95" fill="currentColor" opacity="0.9" />
    </svg>
);

export const NationsIcon = ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 100 100" className={className}>
        <circle cx="45" cy="55" r="40" fill="currentColor" opacity="0.2" />
        <path d="M 5 55 C 20 10, 80 5, 95 45 C 70 30, 30 40, 5 55 Z" fill="currentColor" opacity="0.4" />
        <path d="M 45 15 C 85 20, 95 70, 65 95 C 80 60, 60 30, 45 15 Z" fill="currentColor" opacity="0.5" />
        <polygon points="25,40 65,25 75,70 35,85" fill="currentColor" opacity="0.95" />
    </svg>
);

export const TournamentsIcon = ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 100 100" className={className}>
        <path d="M 15 20 C 15 70, 40 85, 50 85 C 60 85, 85 70, 85 20 Z" fill="currentColor" opacity="0.3" />
        <polygon points="35,85 65,85 80,95 20,95" fill="currentColor" opacity="0.7" />
        <polygon points="25,20 50,60 70,10 60,35 40,25" fill="currentColor" opacity="0.9" />
    </svg>
);

export const AnalyticsIcon = ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 100 100" className={className}>
        <path d="M 10 90 C 20 40, 50 10, 90 20 C 70 60, 50 90, 10 90 Z" fill="currentColor" opacity="0.3" />
        <polygon points="20,80 40,30 55,45 80,10 95,25 60,75 45,55" fill="currentColor" opacity="0.9" />
        <polygon points="50,90 70,40 85,55 60,100" fill="currentColor" opacity="0.6" />
    </svg>
);

export const Trophy = ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 100 100" className={className}>
        <path d="M 15 20 C -10 50 30 80 45 75 L 50 50 Z" fill="currentColor" opacity="0.4" />
        <polygon points="50,50 85,15 95,40 60,80 45,75" fill="currentColor" />
        <polygon points="45,75 60,80 75,95 20,90" fill="currentColor" opacity="0.7" />
        <path d="M 10 15 C 40 30 70 5 95 10 L 85 20 C 60 25 30 35 15 20 Z" fill="currentColor" />
    </svg>
);

export const Star = ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 100 100" className={className}>
        <path d="M 50 10 C 60 40, 90 50, 90 50 C 90 50, 60 60, 50 90 C 40 60, 10 50, 10 50 C 10 50, 40 40, 50 10 Z" fill="currentColor" opacity="0.4" />
        <polygon points="50,5 65,35 95,45 70,65 80,95 50,75 20,95 30,65 5,45 35,35" fill="currentColor" opacity="0.9" />
    </svg>
);

export const History = ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 100 100" className={className}>
        <path d="M 90 50 C 90 80, 60 90, 30 85 C 10 80, 5 50, 20 25 C 35 5, 70 5, 85 25" fill="none" stroke="currentColor" strokeWidth="8" opacity="0.4" />
        <polygon points="50,15 55,55 85,70 75,80 40,60 40,15" fill="currentColor" opacity="0.9" />
    </svg>
);

export const UserCircle = ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 100 100" className={className}>
        <circle cx="50" cy="50" r="45" fill="currentColor" opacity="0.2" />
        <path d="M 25 85 C 30 50, 70 50, 75 85 Z" fill="currentColor" opacity="0.9" />
        <polygon points="50,20 65,45 35,45" fill="currentColor" opacity="0.7" />
    </svg>
);

export const GalleryIcon = ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline>
    </svg>
);

export const ArrowUpIcon = ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline>
    </svg>
);

// --- Standard UI Icons ---
export const Icon = ({ d, size = 24, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d={d} /></svg>;
export const Plus = (props) => <Icon d="M12 5v14M5 12h14" {...props} />;
export const ChevronRight = (props) => <Icon d="m9 18 6-6-6-6" {...props} />;
export const ChevronLeft = (props) => <Icon d="m15 18-6-6 6-6" {...props} />;
export const Shield = (props) => <Icon d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" {...props} />;
export const CheckCircle = (props) => <Icon d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3" {...props} />;
export const ArrowLeft = (props) => <Icon d="m12 19-7-7 7-7M5 12h14" {...props} />;
export const Play = (props) => <Icon d="m5 3 14 9-14 9V3z" {...props} />;
export const Trash2 = (props) => <Icon d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6" {...props} />;
export const Edit2 = (props) => <Icon d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" {...props} />;
export const X = (props) => <Icon d="M18 6 6 18M6 6l12 12" {...props} />;
export const Shuffle = (props) => <Icon d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22M18 2l4 4-4 4M2 6h1.9c1.5 0 2.8.8 3.6 2l3.5 5c.8 1.2 2.1 2 3.6 2H22M18 14l4 4-4 4" {...props} />;
export const BarChart2 = (props) => <Icon d="M18 20V10M12 20V4M6 20v-6" {...props} />;
export const Download = (props) => <Icon d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" {...props} />;
export const Search = (props) => <Icon d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" {...props} />;

export const Settings = ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
);

// --- Trophies & Colors ---
export const getCountryColors = (code) => {
    const map = {
        'USA': ['#b91c1c', '#ffffff', '#1d4ed8'], 'CAN': ['#ff0000', '#ffffff', '#ff0000'], 'MEX': ['#006847', '#ffffff', '#ce1126'],
        'CUB': ['#002a8f', '#ffffff', '#cf142b'], 'PUR': ['#ed1c24', '#ffffff', '#0050f0'], 'DOM': ['#002d62', '#ffffff', '#ce1126'],
        'JAM': ['#000000', '#007749', '#ffb81c'], 'BAH': ['#00a9ce', '#fecb00', '#000000'],
        'GBR': ['#032b44', '#ffffff', '#c8102e'], 'FRA': ['#002654', '#ffffff', '#ed2939'], 'ESP': ['#aa151b', '#f1bf00', '#aa151b'], 
        'ITA': ['#009246', '#ffffff', '#ce2b37'], 'GER': ['#000000', '#dd0000', '#ffcc00'], 'SUI': ['#ff0000', '#ffffff', '#ff0000'], 
        'SRB': ['#c6363c', '#0c4076', '#ffffff'], 'SWE': ['#005293', '#fecb00', '#005293'], 'RUS': ['#ffffff', '#0039a6', '#d52b1e'],
        'CRO': ['#c6363c', '#ffffff', '#171796'], 'NED': ['#ae1c28', '#ffffff', '#21468b'], 'BEL': ['#000000', '#fdda24', '#ef3340'],
        'POL': ['#ffffff', '#dc143c', '#ffffff'], 'CZE': ['#11457e', '#ffffff', '#d7141a'], 'GRE': ['#001489', '#ffffff', '#001489'],
        'AUT': ['#ed2939', '#ffffff', '#ed2939'], 'POR': ['#006600', '#ff0000', '#ffcc00'], 'DEN': ['#c60c30', '#ffffff', '#c60c30'],
        'NOR': ['#ba0c2f', '#ffffff', '#00205b'], 'FIN': ['#ffffff', '#002f6c', '#ffffff'], 'ROU': ['#002b7f', '#fcd116', '#ce1126'],
        'BUL': ['#ffffff', '#00966e', '#d62612'], 'HUN': ['#ce2939', '#ffffff', '#477050'], 'SVK': ['#ffffff', '#0b4ea2', '#ee1c25'],
        'BLR': ['#c8313e', '#4aa657', '#ffffff'], 'UKR': ['#0057b7', '#ffd700', '#0057b7'], 'TUR': ['#e30a17', '#ffffff', '#e30a17'],
        'ISL': ['#02529c', '#ffffff', '#dc1e35'], 'IRL': ['#169b62', '#ffffff', '#ff883e'], 'LTU': ['#fdb913', '#006a44', '#c1272d'],
        'LAT': ['#9e3039', '#ffffff', '#9e3039'], 'EST': ['#0072ce', '#000000', '#ffffff'], 'SLO': ['#ffffff', '#005ce6', '#ed1c24'],
        'GEO': ['#ffffff', '#ff0000', '#ffffff'], 'ARM': ['#d90012', '#0033a0', '#f28e00'], 'MON': ['#ce1126', '#ffffff', '#ce1126'],
        'ARG': ['#75aadb', '#ffffff', '#75aadb'], 'BRA': ['#009c3b', '#ffdf00', '#002776'], 'CHI': ['#0039a6', '#ffffff', '#d52b1e'],
        'COL': ['#fcd116', '#003893', '#ce1126'], 'PER': ['#d91023', '#ffffff', '#d91023'], 'URU': ['#0038a8', '#ffffff', '#fcd116'],
        'ECU': ['#ffdd00', '#034ea2', '#ed1c24'], 'PAR': ['#d52b1e', '#ffffff', '#0038a8'],
        'AUS': ['#012169', '#ffffff', '#e4002b'], 'NZL': ['#00247d', '#ffffff', '#cc142b'], 'JPN': ['#ffffff', '#bc002d', '#ffffff'], 
        'CHN': ['#ee1c25', '#ffff00', '#ee1c25'], 'KOR': ['#ffffff', '#cd2e3a', '#0f64cd'], 'IND': ['#ff9933', '#ffffff', '#138808'], 
        'THA': ['#a51931', '#f4f5f8', '#2d2a4a'], 'TPE': ['#fe0000', '#000095', '#ffffff'], 'KAZ': ['#00afec', '#fce100', '#00afec'], 
        'UZB': ['#0099b5', '#ffffff', '#1eb53a'], 'INA': ['#ff0000', '#ffffff', '#ff0000'], 'PHI': ['#0038a8', '#ffffff', '#ce1126'], 
        'VIE': ['#da251d', '#ffff00', '#da251d'], 'ISR': ['#0038b8', '#ffffff', '#0038b8'], 'QAT': ['#8a1538', '#ffffff', '#8a1538'], 
        'UAE': ['#00732f', '#ffffff', '#000000'], 'KSA': ['#006c35', '#ffffff', '#006c35'], 'BHR': ['#ce1126', '#ffffff', '#ce1126'], 
        'KUW': ['#007a3d', '#ffffff', '#ce1126'], 'OMA': ['#db161b', '#ffffff', '#008000'], 'SIN': ['#ed2939', '#ffffff', '#ed2939'], 
        'MAS': ['#012c7d', '#ffcc00', '#cc0000'],
        'RSA': ['#007749', '#ffb81c', '#e03c31'], 'EGY': ['#ce1126', '#ffffff', '#000000'], 'MAR': ['#c1272d', '#006233', '#c1272d'],
        'TUN': ['#e70013', '#ffffff', '#e70013'], 'ALG': ['#006233', '#ffffff', '#d21034'], 'NGR': ['#008751', '#ffffff', '#008751']
    };
    return map[code] || ['#94a3b8', '#cbd5e1', '#94a3b8']; 
};

export const DynamicTrophy = ({ tier, result, country, size = 24, className = "" }) => {
    const c = getCountryColors(country || 'UNK');
    const isWinner = result === 'Winner';
    const isFinalist = result === 'Finalist' || result === 'Final';
    const isSF = result === 'Semifinalist' || result === 'Semifinals';


    if (tier === 'nations_league') {
        // --- 1ST PLACE: UEFA-STYLE TWISTING PLATINUM SCULPTURE ---
        if (isWinner) {
            return <img src={trophyImage} alt="Winner Trophy" style={{ width: size * 1.5, height: size * 1.7 }} />;
        }

        // --- 2ND & 3RD PLACE: OLYMPIC/UEFA STYLE MEDALS ---
        // Tightened viewBox and adjusted height/width multipliers to match standard trophy scaling
        else if (result === 'Finalist' || result === 'Third Place') {
            const isSilver = result === 'Finalist';
            
            // Adjusted Third Place to utilize distinct, warm Bronze/Copper gradients (Removes the yellow/gold look)
            const m1 = isSilver ? '#ffffff' : '#fdba74'; // Bright copper edge
            const m2 = isSilver ? '#94a3b8' : '#b45309'; // Warm amber/bronze mid tone
            const m3 = isSilver ? '#475569' : '#78350f'; // Deep copper/brown core
            const mGlow = isSilver ? '#e2e8f0' : '#fb923c'; // Orange-copper shine 

            return (
                <svg viewBox="10 0 80 150" width={size * 0.7} height={size * 1.3} className={className} xmlns="http://www.w3.org/2000/svg" style={{filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.5))'}}>
                    <defs>
                        <linearGradient id={`nl-med-grad-${isSilver}`} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={m1} />
                            <stop offset="50%" stopColor={m2} />
                            <stop offset="100%" stopColor={m3} />
                        </linearGradient>
                        <linearGradient id={`nl-med-shine-${isSilver}`} x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={m3} />
                            <stop offset="50%" stopColor={mGlow} />
                            <stop offset="100%" stopColor={m2} />
                        </linearGradient>
                        <linearGradient id="nl-ribbon-1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={c[0]} /><stop offset="100%" stopColor="#0f172a" />
                        </linearGradient>
                    </defs>

                    {/* --- RIBBON (Sharp V-Fold) --- */}
                    <polygon points="35,0 45,60 50,65 30,0" fill={c[0]} opacity="0.8" />
                    <polygon points="65,0 55,60 50,65 70,0" fill={c[2]} opacity="0.8" />
                    <polygon points="25,0 50,70 55,65 35,0" fill={c[0]} />
                    <polygon points="40,0 50,70 55,65 50,0" fill={c[1]} />
                    <polygon points="75,0 50,70 45,65 65,0" fill={c[2]} />
                    <polygon points="50,70 45,65 55,65" fill="#000000" opacity="0.3" />
                    
                    {/* --- MEDAL CLASP --- */}
                    <path d="M 45 70 L 55 70 L 53 78 L 47 78 Z" fill={m2} />
                    <rect x="42" y="68" width="16" height="3" fill={m1} />

                    {/* --- GEOMETRIC MEDAL BODY --- */}
                    <g style={{filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.6))'}}>
                        {/* Heavy Outer Rim */}
                        <circle cx="50" cy="110" r="35" fill={`url(#nl-med-grad-${isSilver})`} />
                        <circle cx="50" cy="110" r="32" fill="none" stroke={m1} strokeWidth="1.5" opacity="0.8" />
                        
                        {/* Beveled Core */}
                        <circle cx="50" cy="110" r="28" fill={`url(#nl-med-shine-${isSilver})`} />
                        <circle cx="50" cy="110" r="25" fill="none" stroke="url(#nl-ribbon-1)" strokeWidth="2" opacity="0.7" />

                        {/* Geometric "Octagram" Engraving */}
                        <rect x="34" y="94" width="32" height="32" fill="none" stroke={m3} strokeWidth="1.5" opacity="0.8" transform="rotate(0 50 110)" />
                        <rect x="34" y="94" width="32" height="32" fill="none" stroke={m1} strokeWidth="1.5" opacity="0.8" transform="rotate(45 50 110)" />
                        <rect x="38" y="98" width="24" height="24" fill={m3} opacity="0.2" transform="rotate(22.5 50 110)" />
                        
                        {/* Etched Crosshairs & Node */}
                        <line x1="50" y1="82" x2="50" y2="138" stroke={m3} strokeWidth="1" opacity="0.5" />
                        <line x1="22" y1="110" x2="78" y2="110" stroke={m3} strokeWidth="1" opacity="0.5" />
                        <circle cx="50" cy="110" r="7" fill={`url(#nl-med-grad-${isSilver})`} stroke={m1} strokeWidth="1.5" />
                        <circle cx="50" cy="110" r="3" fill={m3} opacity="0.6" />
                    </g>
                </svg>
            );
        }
        
        // --- PARTICIPATION: MODERN TITANIUM/GLASS SHIELD ---
        else {
            return (
                <svg viewBox="0 0 100 140" width={size} height={size * 1.4} className={className} xmlns="http://www.w3.org/2000/svg" style={{filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.5))'}}>
                    <defs>
                        <linearGradient id="plaque-titanium" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#334155" />
                            <stop offset="50%" stopColor="#1e293b" />
                            <stop offset="100%" stopColor="#0f172a" />
                        </linearGradient>
                        <linearGradient id="plaque-glass" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
                            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.05" />
                            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
                        </linearGradient>
                    </defs>

                    {/* Heavy Titanium Backplate */}
                    <polygon points="15,10 85,10 90,110 50,135 10,110" fill="url(#plaque-titanium)" />
                    <polygon points="15,10 85,10 85,15 15,15" fill="#64748b" opacity="0.5" />
                    <polygon points="90,110 50,135 48,135 88,110" fill="#020617" opacity="0.6" />

                    {/* Sharp Flag Color Slash (Enameled into the metal) */}
                    <g style={{filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'}}>
                        <polygon points="10,85 85,45 85,55 12,95" fill={c[0]} />
                        <polygon points="12,95 85,55 85,65 14,105" fill={c[1]} />
                        <polygon points="14,105 85,65 85,75 16,113" fill={c[2]} />
                    </g>

                    {/* Frosted Glass Overlay */}
                    <polygon points="20,20 80,20 85,105 50,125 15,105" fill="url(#plaque-glass)" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.4" />
                    
                    {/* Glass Reflection Glare */}
                    <polygon points="20,20 45,20 30,110 15,105" fill="#ffffff" opacity="0.08" />

                    {/* Etched Accents */}
                    <circle cx="50" cy="35" r="8" fill="none" stroke="#94a3b8" strokeWidth="1.5" opacity="0.6" />
                    <circle cx="50" cy="35" r="4" fill="#94a3b8" opacity="0.8" />
                    <line x1="30" y1="35" x2="40" y2="35" stroke="#94a3b8" strokeWidth="1" opacity="0.5" />
                    <line x1="60" y1="35" x2="70" y2="35" stroke="#94a3b8" strokeWidth="1" opacity="0.5" />
                </svg>
            );
        }
    }


    if (isWinner) {
        if (tier === 'grand_slam') {
            return (
                <svg width={size} height={size} viewBox="-15 -5 130 150" className={className} style={{filter: 'drop-shadow(0 15px 22px rgba(0,0,0,0.85))'}}>
                    <defs>
                        <linearGradient id="gsPlatinum" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#e2e8f0"/><stop offset="25%" stopColor="#ffffff"/><stop offset="50%" stopColor="#94a3b8"/><stop offset="75%" stopColor="#f8fafc"/><stop offset="100%" stopColor="#475569"/></linearGradient>
                        <linearGradient id="gsOxidized" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#334155"/><stop offset="40%" stopColor="#94a3b8"/><stop offset="80%" stopColor="#1e293b"/><stop offset="100%" stopColor="#0f172a"/></linearGradient>
                        <linearGradient id="gsChrome" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#475569"/><stop offset="50%" stopColor="#ffffff"/><stop offset="100%" stopColor="#1e293b"/></linearGradient>
                        <linearGradient id="gsObsidian" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1e293b"/><stop offset="40%" stopColor="#0f172a"/><stop offset="100%" stopColor="#020617"/></linearGradient>
                        <pattern id="gsFiligree" width="6" height="6" patternUnits="userSpaceOnUse">
                            <path d="M 0 6 L 6 0 M -1 1 L 1 -1 M 5 7 L 7 5" stroke="#f1f5f9" strokeWidth="0.3" opacity="0.3"/>
                        </pattern>
                    </defs>
                    <path d="M 22 65 Q -10 100 12 145" fill="none" stroke={c[0]} strokeWidth="4.5" opacity="0.6" strokeLinecap="round" />
                    <path d="M 78 65 Q 110 100 88 145" fill="none" stroke={c[0]} strokeWidth="4.5" opacity="0.6" strokeLinecap="round" />
                    <path d="M 15 135 L 85 135 L 80 122 L 20 122 Z" fill="url(#gsObsidian)" />
                    <path d="M 20 122 L 80 122 L 72 116 L 28 116 Z" fill="url(#gsOxidized)" />
                    <path d="M 28 116 L 72 116 L 68 112 L 32 112 Z" fill="url(#gsPlatinum)" />
                    <rect x="32" y="126" width="36" height="6" rx="1" fill="url(#gsPlatinum)" style={{filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.8))'}}/>
                    <line x1="36" y1="129" x2="64" y2="129" stroke="#475569" strokeWidth="0.5" strokeDasharray="2 1"/>
                    <circle cx="34" cy="129" r="0.8" fill="#1e293b"/>
                    <circle cx="66" cy="129" r="0.8" fill="#1e293b"/>
                    <path d="M 38 112 L 44 98 L 56 98 L 62 112 Z" fill="url(#gsOxidized)" />
                    <path d="M 44 112 L 47 98 M 50 112 L 50 98 M 56 112 L 53 98" stroke="url(#gsPlatinum)" strokeWidth="1.5" fill="none"/>
                    <ellipse cx="50" cy="98" rx="16" ry="3.5" fill="url(#gsChrome)" />
                    <ellipse cx="50" cy="95" rx="18" ry="4.5" fill="url(#gsPlatinum)" />
                    <ellipse cx="50" cy="92" rx="14" ry="3" fill="url(#gsOxidized)" />
                    <path d="M 44 92 L 46 82 L 54 82 L 56 92 Z" fill="url(#gsOxidized)" />
                    <path d="M 46 92 L 48 82 M 50 92 L 50 82 M 54 92 L 52 82" stroke="url(#gsPlatinum)" strokeWidth="1" fill="none"/>
                    <path d="M 18 35 C 18 90, 35 95, 50 95 C 65 95, 82 90, 82 35 Z" fill="url(#gsPlatinum)" />
                    <path d="M 18 35 C 18 90, 35 95, 50 95 C 65 95, 82 90, 82 35 Z" fill="url(#gsFiligree)" />
                    <path d="M 18 35 C 18 90, 35 95, 50 95 L 50 35 Z" fill="#ffffff" opacity="0.3" />
                    <path d="M 82 35 C 82 90, 65 95, 50 95 L 50 35 Z" fill="#000000" opacity="0.3" />
                    <path d="M 22 65 C 25 85, 38 95, 50 95 C 62 95, 75 85, 78 65 C 65 72, 35 72, 22 65 Z" fill="url(#gsOxidized)" opacity="0.8"/>
                    <path d="M 28 68 Q 38 90, 50 93 M 36 70 Q 42 90, 50 94 M 44 71 Q 47 90, 50 95 M 72 68 Q 62 90, 50 93 M 64 70 Q 58 90, 50 94 M 56 71 Q 53 90, 50 95" stroke="url(#gsPlatinum)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                    <path d="M 18 48 Q 50 53 82 48" fill="none" stroke="url(#gsOxidized)" strokeWidth="2" opacity="0.8"/>
                    <path d="M 18 48 Q 50 53 82 48" fill="none" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="2 2"/>
                    <path d="M 50 82 C 32 82, 30 55, 42 45" fill="none" stroke="url(#gsOxidized)" strokeWidth="1.5" />
                    <path d="M 50 82 C 68 82, 70 55, 58 45" fill="none" stroke="url(#gsOxidized)" strokeWidth="1.5" />
                    <polygon points="38,72 42,75 40,78" fill="url(#gsChrome)"/>
                    <polygon points="34,62 39,64 36,68" fill="url(#gsChrome)"/>
                    <polygon points="36,52 41,54 39,58" fill="url(#gsChrome)"/>
                    <polygon points="62,72 58,75 60,78" fill="url(#gsChrome)"/>
                    <polygon points="66,62 61,64 64,68" fill="url(#gsChrome)"/>
                    <polygon points="64,52 59,54 61,58" fill="url(#gsChrome)"/>
                    <polygon points="50,48 58,56 50,74 42,56" fill="url(#gsOxidized)" stroke="url(#gsPlatinum)" strokeWidth="1.5" style={{filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))'}}/>
                    <polygon points="50,52 55,58 50,68 45,58" fill="url(#gsChrome)" />
                    <circle cx="50" cy="58" r="1.5" fill="#ffffff" style={{filter: 'drop-shadow(0 0 2px #ffffff)'}}/>
                    <path d="M 18 38 C 0 28, -5 65, 12 70 C 22 75, 18 85, 30 82 C 24 80, 26 75, 16 72 C 2 64, 6 36, 18 42 Z" fill="url(#gsOxidized)" style={{filter: 'drop-shadow(3px 4px 5px rgba(0,0,0,0.6))'}}/>
                    <path d="M 18 39 C 2 30, -3 63, 13 68 C 21 72, 19 82, 28 80 C 23 78, 24 74, 15 70 C 4 62, 8 38, 18 42 Z" fill="url(#gsPlatinum)" />
                    <path d="M 18 45 C 10 45, 10 52, 15 52" fill="none" stroke="url(#gsPlatinum)" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M 82 38 C 100 28, 105 65, 88 70 C 78 75, 82 85, 70 82 C 76 80, 74 75, 84 72 C 98 64, 94 36, 82 42 Z" fill="url(#gsOxidized)" style={{filter: 'drop-shadow(-3px 4px 5px rgba(0,0,0,0.6))'}}/>
                    <path d="M 82 39 C 98 30, 103 63, 87 68 C 79 72, 81 82, 72 80 C 77 78, 76 74, 85 70 C 96 62, 92 38, 82 42 Z" fill="url(#gsPlatinum)" />
                    <path d="M 82 45 C 90 45, 90 52, 85 52" fill="none" stroke="url(#gsPlatinum)" strokeWidth="1.5" strokeLinecap="round"/>
                    <ellipse cx="50" cy="35" rx="34" ry="5.5" fill="url(#gsOxidized)" />
                    <ellipse cx="50" cy="35" rx="31" ry="4" fill="url(#gsChrome)" />
                    <ellipse cx="50" cy="35" rx="27" ry="2.5" fill="#0f172a" />
                    <path d="M 23 34 C 28 24, 72 24, 77 34 Z" fill="url(#gsPlatinum)" />
                    <path d="M 30 26 C 35 18, 65 18, 70 26 Z" fill="url(#gsOxidized)" />
                    <path d="M 38 20 C 42 14, 58 14, 62 20 Z" fill="url(#gsChrome)" />
                    <polygon points="48,15 52,15 50,0" fill="url(#gsPlatinum)" />
                    <circle cx="50" cy="-2" r="2.5" fill="url(#gsChrome)" style={{filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.5))'}}/>
                    <path d="M 20 68 C 5 95, 30 120, 10 148" fill="none" stroke={c[1]} strokeWidth="4.5" strokeLinecap="round" style={{filter: 'drop-shadow(3px 4px 5px rgba(0,0,0,0.7))'}}/>
                    <path d="M 20 68 C 5 95, 30 120, 10 148" fill="none" stroke="#ffffff" strokeWidth="1" strokeDasharray="3 2" opacity="0.6"/>
                    <path d="M 25 70 C 10 95, 35 120, 20 148" fill="none" stroke={c[2]} strokeWidth="4.5" strokeLinecap="round" style={{filter: 'drop-shadow(3px 4px 5px rgba(0,0,0,0.7))'}}/>
                    <path d="M 80 68 C 95 95, 70 120, 90 148" fill="none" stroke={c[1]} strokeWidth="4.5" strokeLinecap="round" style={{filter: 'drop-shadow(-3px 4px 5px rgba(0,0,0,0.7))'}}/>
                    <path d="M 80 68 C 95 95, 70 120, 90 148" fill="none" stroke="#ffffff" strokeWidth="1" strokeDasharray="3 2" opacity="0.6"/>
                    <path d="M 75 70 C 90 95, 65 120, 80 148" fill="none" stroke={c[2]} strokeWidth="4.5" strokeLinecap="round" style={{filter: 'drop-shadow(-3px 4px 5px rgba(0,0,0,0.7))'}}/>
                </svg>
            );
        }
        if (tier === 'major') {
            return (
                <svg width={size} height={size} viewBox="-15 -5 130 150" className={className} style={{filter: 'drop-shadow(0 15px 22px rgba(0,0,0,0.85))'}}>
                    <defs>
                        <linearGradient id="majPlatinum" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#e2e8f0"/><stop offset="20%" stopColor="#ffffff"/><stop offset="50%" stopColor="#94a3b8"/><stop offset="80%" stopColor="#f8fafc"/><stop offset="100%" stopColor="#475569"/></linearGradient>
                        <linearGradient id="majOxidized" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#334155"/><stop offset="40%" stopColor="#94a3b8"/><stop offset="80%" stopColor="#1e293b"/><stop offset="100%" stopColor="#0f172a"/></linearGradient>
                        <linearGradient id="majChrome" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#475569"/><stop offset="50%" stopColor="#ffffff"/><stop offset="100%" stopColor="#1e293b"/></linearGradient>
                        <linearGradient id="majBase" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1e293b"/><stop offset="100%" stopColor="#020617"/></linearGradient>
                        <pattern id="majHatch" width="8" height="8" patternUnits="userSpaceOnUse">
                            <path d="M -2 10 L 10 -2 M 2 14 L 14 2" stroke="#f1f5f9" strokeWidth="0.5" opacity="0.3"/>
                        </pattern>
                    </defs>
                    <path d="M 18 65 Q -15 100 10 145" fill="none" stroke={c[0]} strokeWidth="4.5" opacity="0.6" strokeLinecap="round" />
                    <path d="M 82 65 Q 115 100 90 145" fill="none" stroke={c[0]} strokeWidth="4.5" opacity="0.6" strokeLinecap="round" />
                    <path d="M 22 135 L 78 135 L 72 120 L 28 120 Z" fill="url(#majBase)" />
                    <path d="M 28 120 L 72 120 L 65 115 L 35 115 Z" fill="url(#majOxidized)" />
                    <rect x="35" y="112" width="30" height="3" fill="url(#majPlatinum)" />
                    <rect x="34" y="125" width="32" height="6" rx="1" fill="url(#majPlatinum)" style={{filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.8))'}}/>
                    <line x1="38" y1="128" x2="62" y2="128" stroke="#475569" strokeWidth="0.5" strokeDasharray="1.5 1.5"/>
                    <circle cx="36" cy="128" r="0.8" fill="#1e293b"/>
                    <circle cx="64" cy="128" r="0.8" fill="#1e293b"/>
                    <path d="M 40 112 L 45 95 L 55 95 L 60 112 Z" fill="url(#majOxidized)" />
                    <path d="M 45 112 L 48 95 M 50 112 L 50 95 M 55 112 L 52 95" stroke="url(#majPlatinum)" strokeWidth="1.5" fill="none"/>
                    <ellipse cx="50" cy="100" rx="14" ry="3" fill="url(#majChrome)" />
                    <ellipse cx="50" cy="95" rx="10" ry="2.5" fill="url(#majOxidized)" />
                    <path d="M 16 35 C 16 85, 35 95, 50 95 C 65 95, 84 85, 84 35 Z" fill="url(#majPlatinum)" />
                    <path d="M 16 35 C 16 85, 35 95, 50 95 C 65 95, 84 85, 84 35 Z" fill="url(#majHatch)" />
                    <path d="M 16 35 C 16 85, 35 95, 50 95 L 50 35 Z" fill="#ffffff" opacity="0.35" />
                    <path d="M 84 35 C 84 85, 65 95, 50 95 L 50 35 Z" fill="#000000" opacity="0.35" />
                    <path d="M 22 65 C 28 85, 40 95, 50 95 C 60 95, 72 85, 78 65 C 60 75, 40 75, 22 65 Z" fill="url(#majOxidized)" opacity="0.85"/>
                    <path d="M 26 70 Q 38 90, 50 93 M 34 72 Q 42 90, 50 94 M 42 74 Q 47 90, 50 95 M 74 70 Q 62 90, 50 93 M 66 72 Q 58 90, 50 94 M 58 74 Q 53 90, 50 95" stroke="url(#majPlatinum)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                    <path d="M 40 50 L 60 50 L 55 70 L 50 76 L 45 70 Z" fill="url(#majOxidized)" stroke="url(#majPlatinum)" strokeWidth="1.5" style={{filter: 'drop-shadow(0 4px 5px rgba(0,0,0,0.5))'}}/>
                    <path d="M 43 53 L 57 53 L 53 67 L 50 72 L 47 67 Z" fill="url(#majChrome)" />
                    <circle cx="50" cy="60" r="2.5" fill="url(#majPlatinum)" style={{filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.6))'}}/>
                    <path d="M 18 42 C -5 35, -15 80, 26 80" fill="none" stroke="url(#majOxidized)" strokeWidth="6" strokeLinecap="round" style={{filter: 'drop-shadow(2px 4px 4px rgba(0,0,0,0.5))'}}/>
                    <path d="M 18 42 C -5 35, -15 80, 26 80" fill="none" stroke="url(#majPlatinum)" strokeWidth="3" strokeLinecap="round"/>
                    <path d="M 16 52 C 5 50, 5 70, 20 73" fill="none" stroke="url(#majChrome)" strokeWidth="1.5" strokeLinecap="round"/>
                    <circle cx="26" cy="80" r="2.5" fill="url(#majPlatinum)" />
                    <path d="M 82 42 C 105 35, 115 80, 74 80" fill="none" stroke="url(#majOxidized)" strokeWidth="6" strokeLinecap="round" style={{filter: 'drop-shadow(-2px 4px 4px rgba(0,0,0,0.5))'}}/>
                    <path d="M 82 42 C 105 35, 115 80, 74 80" fill="none" stroke="url(#majPlatinum)" strokeWidth="3" strokeLinecap="round"/>
                    <path d="M 78 52 C 95 50, 95 70, 80 73" fill="none" stroke="url(#majChrome)" strokeWidth="1.5" strokeLinecap="round"/>
                    <circle cx="74" cy="80" r="2.5" fill="url(#majPlatinum)" />
                    <ellipse cx="50" cy="35" rx="36" ry="6" fill="url(#majOxidized)" />
                    <ellipse cx="50" cy="35" rx="33" ry="4" fill="url(#majChrome)" />
                    <ellipse cx="50" cy="35" rx="30" ry="3" fill="#020617" />
                    <path d="M 20 35 C 20 42, 80 42, 80 35 C 80 28, 20 28, 20 35 Z" fill="url(#majObsidian)" opacity="0.9" />
                    <path d="M 18 68 C 5 95, 30 120, 8 150" fill="none" stroke={c[1]} strokeWidth="4.5" strokeLinecap="round" style={{filter: 'drop-shadow(3px 4px 5px rgba(0,0,0,0.7))'}}/>
                    <path d="M 18 68 C 5 95, 30 120, 8 150" fill="none" stroke="#ffffff" strokeWidth="1" strokeDasharray="3 2" opacity="0.6"/>
                    <path d="M 23 70 C 10 95, 35 120, 18 150" fill="none" stroke={c[2]} strokeWidth="4.5" strokeLinecap="round" style={{filter: 'drop-shadow(3px 4px 5px rgba(0,0,0,0.7))'}}/>
                    <path d="M 82 68 C 95 95, 70 120, 92 150" fill="none" stroke={c[1]} strokeWidth="4.5" strokeLinecap="round" style={{filter: 'drop-shadow(-3px 4px 5px rgba(0,0,0,0.7))'}}/>
                    <path d="M 82 68 C 95 95, 70 120, 92 150" fill="none" stroke="#ffffff" strokeWidth="1" strokeDasharray="3 2" opacity="0.6"/>
                    <path d="M 77 70 C 90 95, 65 120, 82 150" fill="none" stroke={c[2]} strokeWidth="4.5" strokeLinecap="round" style={{filter: 'drop-shadow(-3px 4px 5px rgba(0,0,0,0.7))'}}/>
                </svg>
            );
        }
        if (tier === 'finals') {
            return (
                <svg width={size} height={size} viewBox="-15 -10 130 150" className={className} style={{filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.9))'}}>
                    <defs>
                        <linearGradient id="snbWinObsidian" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#1e293b"/><stop offset="50%" stopColor="#020617"/><stop offset="100%" stopColor="#0f172a"/></linearGradient>
                        <linearGradient id="snbWinChrome" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#475569"/><stop offset="50%" stopColor="#f8fafc"/><stop offset="100%" stopColor="#334155"/></linearGradient>
                        <linearGradient id="snbWinCyan" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#67e8f9"/><stop offset="50%" stopColor="#06b6d4"/><stop offset="100%" stopColor="#083344"/></linearGradient>
                        <linearGradient id="snbWinGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fef08a"/><stop offset="50%" stopColor="#eab308"/><stop offset="100%" stopColor="#713f12"/></linearGradient>
                        <linearGradient id="snbWinMagenta" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#f9a8d4"/><stop offset="50%" stopColor="#d946ef"/><stop offset="100%" stopColor="#4a044e"/></linearGradient>
                    </defs>
                    <path d="M 20 140 L 80 140 L 95 125 L 5 125 Z" fill="url(#snbWinObsidian)" />
                    <path d="M 5 125 L 95 125 L 85 110 L 15 110 Z" fill="#0f172a" />
                    <path d="M 15 110 L 85 110 L 70 100 L 30 100 Z" fill="url(#snbWinChrome)" />
                    <path d="M 15 110 L 85 110" fill="none" stroke="#e2e8f0" strokeWidth="1.5" />
                    <path d="M 30 100 L 70 100 L 65 95 L 35 95 Z" fill="url(#snbWinCyan)" />
                    <polygon points="45,95 55,95 52,100 48,100" fill="#ffffff" style={{filter: 'drop-shadow(0 0 6px #67e8f9)'}}/>
                    <path d="M 25 95 L 42 50 L 25 10 L 5 60 Z" fill="url(#snbWinObsidian)" />
                    <path d="M 25 95 L 42 50 L 25 10 L 5 60 Z" fill="url(#snbWinChrome)" opacity="0.3"/>
                    <path d="M 25 10 L 42 50 L 25 95" fill="none" stroke="url(#snbWinChrome)" strokeWidth="2" />
                    <path d="M 5 60 L 25 10 L 40 10" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.6"/>
                    <path d="M 75 95 L 58 50 L 75 10 L 95 60 Z" fill="url(#snbWinObsidian)" />
                    <path d="M 75 95 L 58 50 L 75 10 L 95 60 Z" fill="url(#snbWinChrome)" opacity="0.3"/>
                    <path d="M 75 10 L 58 50 L 75 95" fill="none" stroke="url(#snbWinChrome)" strokeWidth="2" />
                    <path d="M 95 60 L 75 10 L 60 10" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.6"/>
                    <polygon points="50,95 35,60 50,30 65,60" fill="url(#snbWinMagenta)" style={{filter: 'drop-shadow(0 0 10px rgba(217,70,239,0.5))'}} />
                    <polygon points="50,95 35,60 50,30" fill="#ffffff" opacity="0.3" />
                    <polygon points="50,85 40,45 50,5 60,45" fill="url(#snbWinGold)" style={{filter: 'drop-shadow(0 0 12px rgba(234,179,8,0.6))'}} />
                    <polygon points="50,85 40,45 50,5" fill="#ffffff" opacity="0.5" />
                    <polygon points="50,85 60,45 50,5" fill="#713f12" opacity="0.4" />
                    <path d="M 50 5 L 50 85 M 40 45 L 50 50 L 60 45" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinejoin="round" />
                    <polygon points="48,45 52,45 50,52" fill="#ffffff" />
                    <ellipse cx="50" cy="50" rx="35" ry="8" fill="none" stroke="url(#snbWinCyan)" strokeWidth="2" opacity="0.8" strokeDasharray="15 5" style={{filter: 'drop-shadow(0 0 4px #06b6d4)'}} transform="rotate(-15 50 50)" />
                    <ellipse cx="50" cy="50" rx="35" ry="8" fill="none" stroke="url(#snbWinMagenta)" strokeWidth="2" opacity="0.8" strokeDasharray="15 5" style={{filter: 'drop-shadow(0 0 4px #d946ef)'}} transform="rotate(15 50 50)" />
                    <polygon points="48,5 52,5 50,-10" fill="#ffffff" style={{filter: 'drop-shadow(0 0 8px #ffffff)'}} />
                    <circle cx="50" cy="-5" r="3" fill="url(#snbWinCyan)" />
                    <circle cx="50" cy="-5" r="1.5" fill="#ffffff" />
                </svg>
            );
        }
        if (tier === 'pro_am') {
            return (
                <svg width={size} height={size} viewBox="-15 -10 130 150" className={className} style={{filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.9))'}}>
                    <defs>
                        <linearGradient id="snbWinObsidian" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#1e293b"/><stop offset="50%" stopColor="#020617"/><stop offset="100%" stopColor="#0f172a"/></linearGradient>
                        <linearGradient id="snbWinChrome" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#475569"/><stop offset="50%" stopColor="#f8fafc"/><stop offset="100%" stopColor="#334155"/></linearGradient>
                        <linearGradient id="snbWinCyan" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#67e8f9"/><stop offset="50%" stopColor="#06b6d4"/><stop offset="100%" stopColor="#083344"/></linearGradient>
                        <linearGradient id="snbWinGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fef08a"/><stop offset="50%" stopColor="#eab308"/><stop offset="100%" stopColor="#713f12"/></linearGradient>
                        <linearGradient id="snbWinMagenta" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#f9a8d4"/><stop offset="50%" stopColor="#d946ef"/><stop offset="100%" stopColor="#4a044e"/></linearGradient>
                    </defs>
                    <path d="M 20 140 L 80 140 L 95 125 L 5 125 Z" fill="url(#snbWinObsidian)" />
                    <path d="M 5 125 L 95 125 L 85 110 L 15 110 Z" fill="#0f172a" />
                    <path d="M 15 110 L 85 110 L 70 100 L 30 100 Z" fill="url(#snbWinChrome)" />
                    <path d="M 15 110 L 85 110" fill="none" stroke="#e2e8f0" strokeWidth="1.5" />
                    <path d="M 30 100 L 70 100 L 65 95 L 35 95 Z" fill="url(#snbWinCyan)" />
                    <polygon points="45,95 55,95 52,100 48,100" fill="#ffffff" style={{filter: 'drop-shadow(0 0 6px #67e8f9)'}}/>
                    <path d="M 25 95 L 42 50 L 25 10 L 5 60 Z" fill="url(#snbWinObsidian)" />
                    <path d="M 25 95 L 42 50 L 25 10 L 5 60 Z" fill="url(#snbWinChrome)" opacity="0.3"/>
                    <path d="M 25 10 L 42 50 L 25 95" fill="none" stroke="url(#snbWinChrome)" strokeWidth="2" />
                    <path d="M 5 60 L 25 10 L 40 10" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.6"/>
                    <path d="M 75 95 L 58 50 L 75 10 L 95 60 Z" fill="url(#snbWinObsidian)" />
                    <path d="M 75 95 L 58 50 L 75 10 L 95 60 Z" fill="url(#snbWinChrome)" opacity="0.3"/>
                    <path d="M 75 10 L 58 50 L 75 95" fill="none" stroke="url(#snbWinChrome)" strokeWidth="2" />
                    <path d="M 95 60 L 75 10 L 60 10" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.6"/>
                    <polygon points="50,95 35,60 50,30 65,60" fill="url(#snbWinMagenta)" style={{filter: 'drop-shadow(0 0 10px rgba(217,70,239,0.5))'}} />
                    <polygon points="50,95 35,60 50,30" fill="#ffffff" opacity="0.3" />
                    <polygon points="50,85 40,45 50,5 60,45" fill="url(#snbWinGold)" style={{filter: 'drop-shadow(0 0 12px rgba(234,179,8,0.6))'}} />
                    <polygon points="50,85 40,45 50,5" fill="#ffffff" opacity="0.5" />
                    <polygon points="50,85 60,45 50,5" fill="#713f12" opacity="0.4" />
                    <path d="M 50 5 L 50 85 M 40 45 L 50 50 L 60 45" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinejoin="round" />
                    <polygon points="48,45 52,45 50,52" fill="#ffffff" />
                    <ellipse cx="50" cy="50" rx="35" ry="8" fill="none" stroke="url(#snbWinCyan)" strokeWidth="2" opacity="0.8" strokeDasharray="15 5" style={{filter: 'drop-shadow(0 0 4px #06b6d4)'}} transform="rotate(-15 50 50)" />
                    <ellipse cx="50" cy="50" rx="35" ry="8" fill="none" stroke="url(#snbWinMagenta)" strokeWidth="2" opacity="0.8" strokeDasharray="15 5" style={{filter: 'drop-shadow(0 0 4px #d946ef)'}} transform="rotate(15 50 50)" />
                    <polygon points="48,5 52,5 50,-10" fill="#ffffff" style={{filter: 'drop-shadow(0 0 8px #ffffff)'}} />
                    <circle cx="50" cy="-5" r="3" fill="url(#snbWinCyan)" />
                    <circle cx="50" cy="-5" r="1.5" fill="#ffffff" />
                </svg>
            );
        }
    } 
    
    if (isFinalist) {
        if (tier === 'finals') {
            return (
                <svg width={size} height={size} viewBox="-15 -10 130 150" className={className} style={{filter: 'drop-shadow(0 15px 22px rgba(0,0,0,0.85))'}}>
                    <defs>
                        <linearGradient id="snbFinObsidian" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#1e293b"/><stop offset="50%" stopColor="#020617"/><stop offset="100%" stopColor="#0f172a"/></linearGradient>
                        <linearGradient id="snbFinChrome" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#475569"/><stop offset="50%" stopColor="#f8fafc"/><stop offset="100%" stopColor="#334155"/></linearGradient>
                        <linearGradient id="snbFinCyan" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#22d3ee" stopOpacity="0.9"/><stop offset="100%" stopColor="#083344" stopOpacity="0.9"/></linearGradient>
                        <linearGradient id="snbFinMagenta" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#f9a8d4" stopOpacity="0.9"/><stop offset="100%" stopColor="#4a044e" stopOpacity="0.9"/></linearGradient>
                        <linearGradient id="snbFinSilver" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ffffff"/><stop offset="50%" stopColor="#cbd5e1"/><stop offset="100%" stopColor="#64748b"/></linearGradient>
                    </defs>
                    <path d="M 20 140 L 80 140 L 95 125 L 5 125 Z" fill="url(#snbFinObsidian)" />
                    <path d="M 5 125 L 95 125 L 85 110 L 15 110 Z" fill="#0f172a" />
                    <path d="M 15 110 L 85 110 L 70 100 L 30 100 Z" fill="url(#snbFinChrome)" />
                    <path d="M 15 110 L 85 110" fill="none" stroke="#e2e8f0" strokeWidth="1.5" />
                    <path d="M 30 100 L 70 100 L 65 95 L 35 95 Z" fill="url(#snbFinCyan)" />
                    <polygon points="45,95 55,95 52,100 48,100" fill="#ffffff" style={{filter: 'drop-shadow(0 0 6px #67e8f9)'}}/>
                    <polygon points="45,95 15,55 30,20 50,45" fill="url(#snbFinMagenta)" stroke="#f9a8d4" strokeWidth="1" strokeLinejoin="round" />
                    <polygon points="45,95 15,55 30,55" fill="#ffffff" opacity="0.2" />
                    <polygon points="55,95 85,55 70,20 50,45" fill="url(#snbFinCyan)" stroke="#67e8f9" strokeWidth="1" strokeLinejoin="round" />
                    <polygon points="55,95 85,55 70,55" fill="#000000" opacity="0.2" />
                    <path d="M 28 95 L 38 60 L 18 15 L 8 65 Z" fill="url(#snbFinObsidian)" />
                    <path d="M 28 95 L 38 60 L 18 15 L 8 65 Z" fill="url(#snbFinChrome)" opacity="0.3"/>
                    <path d="M 18 15 L 38 60 L 28 95" fill="none" stroke="url(#snbFinChrome)" strokeWidth="2" />
                    <path d="M 8 65 L 18 15 L 25 15" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.6"/>
                    <path d="M 72 95 L 62 60 L 82 15 L 92 65 Z" fill="url(#snbFinObsidian)" />
                    <path d="M 72 95 L 62 60 L 82 15 L 92 65 Z" fill="url(#snbFinChrome)" opacity="0.3"/>
                    <path d="M 82 15 L 62 60 L 72 95" fill="none" stroke="url(#snbFinChrome)" strokeWidth="2" />
                    <path d="M 92 65 L 82 15 L 75 15" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.6"/>
                    <polygon points="50,90 38,50 50,5 62,50" fill="url(#snbFinSilver)" style={{filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.3))'}} />
                    <polygon points="50,90 38,50 50,5" fill="#ffffff" opacity="0.6" />
                    <polygon points="50,90 62,50 50,5" fill="#475569" opacity="0.5" />
                    <path d="M 50 5 L 50 90 M 38 50 L 50 55 L 62 50" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinejoin="round" />
                    <polygon points="46,50 54,50 50,55" fill="#ffffff" />
                    <ellipse cx="50" cy="50" rx="32" ry="6" fill="none" stroke="url(#snbFinCyan)" strokeWidth="2" opacity="0.85" strokeDasharray="12 6" style={{filter: 'drop-shadow(0 0 4px #06b6d4)'}} transform="rotate(-15 50 50)" />
                    <circle cx="50" cy="2" r="3" fill="url(#snbFinCyan)" />
                    <circle cx="50" cy="2" r="1.5" fill="#ffffff" style={{filter: 'drop-shadow(0 0 5px #ffffff)'}}/>
                </svg>
            );
        }
        
        if (tier === 'grand_slam') {
            return (
                <svg width={size} height={size} viewBox="-10 -10 120 120" className={className} style={{filter: 'drop-shadow(0 12px 18px rgba(0,0,0,0.85))'}}>
                    <defs>
                        <linearGradient id="gsShBright" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#ffffff"/><stop offset="50%" stopColor="#cbd5e1"/><stop offset="100%" stopColor="#64748b"/></linearGradient>
                        <linearGradient id="gsShDark" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#1e293b"/><stop offset="50%" stopColor="#64748b"/><stop offset="100%" stopColor="#0f172a"/></linearGradient>
                        <linearGradient id="gsShChrome" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#e2e8f0"/><stop offset="50%" stopColor="#ffffff"/><stop offset="100%" stopColor="#334155"/></linearGradient>
                        <radialGradient id="gsShBase" cx="50%" cy="50%" r="50%"><stop offset="60%" stopColor="#94a3b8"/><stop offset="100%" stopColor="#334155"/></radialGradient>
                    </defs>
                    <circle cx="50" cy="50" r="54" fill="url(#gsShDark)" />
                    <circle cx="50" cy="50" r="52" fill="url(#gsShBright)" />
                    <circle cx="50" cy="50" r="49" fill="#0f172a" />
                    <circle cx="50" cy="50" r="47" fill="none" stroke={c[0]} strokeWidth="2.5" opacity="0.9" />
                    <circle cx="50" cy="50" r="44.5" fill="none" stroke={c[1]} strokeWidth="2.5" opacity="0.95" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke={c[2]} strokeWidth="2.5" opacity="0.9" />
                    <circle cx="50" cy="50" r="40" fill="url(#gsShBase)" stroke="#1e293b" strokeWidth="1.5" />
                    {[0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165].map(deg => (
                        <ellipse key={`s1-${deg}`} cx="50" cy="50" rx="38" ry="10" transform={`rotate(${deg} 50 50)`} fill="none" stroke="url(#gsShChrome)" strokeWidth="0.75" opacity="0.45" />
                    ))}
                    {[0, 20, 40, 60, 80, 100, 120, 140, 160].map(deg => (
                        <ellipse key={`s2-${deg}`} cx="50" cy="50" rx="26" ry="6" transform={`rotate(${deg} 50 50)`} fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.6" />
                    ))}
                    {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
                        <polygon key={`f1-${deg}`} points="50,50 64,16 36,16" transform={`rotate(${deg} 50 50)`} fill="url(#gsShBright)" opacity="0.25" />
                    ))}
                    {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map(deg => (
                        <polygon key={`f2-${deg}`} points="50,50 58,22 42,22" transform={`rotate(${deg} 50 50)`} fill="#000000" opacity="0.15" />
                    ))}
                    <polygon points="50,15 80,30 80,70 50,85 20,70 20,30" fill="none" stroke="url(#gsShDark)" strokeWidth="1.5" />
                    <polygon points="50,16 79,31 79,69 50,84 21,69 21,31" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.4" />
                    <circle cx="50" cy="50" r="16" fill="url(#gsShDark)" style={{filter: 'drop-shadow(0 5px 8px rgba(0,0,0,0.7))'}} />
                    <circle cx="50" cy="50" r="14" fill="url(#gsShBright)" />
                    <circle cx="50" cy="50" r="10" fill="url(#gsShChrome)" />
                    <polygon points="50,38 53,47 62,50 53,53 50,62 47,53 38,50 47,47" fill="#ffffff" opacity="0.9" style={{filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.5))'}} />
                    <circle cx="50" cy="50" r="2.5" fill="url(#gsShDark)" />
                </svg>
            );
        }

        const sScale = 0.88;
        return (
            <svg width={size} height={size} viewBox="-10 -10 120 120" className={className} style={{filter: 'drop-shadow(0 12px 18px rgba(0,0,0,0.85))'}}>
                <defs>
                    <linearGradient id="majShGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#fef08a"/><stop offset="50%" stopColor="#d97706"/><stop offset="100%" stopColor="#78350f"/></linearGradient>
                    <linearGradient id="majShBronze" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#78350f"/><stop offset="50%" stopColor="#b45309"/><stop offset="100%" stopColor="#fcd34d"/></linearGradient>
                    <linearGradient id="majShDark" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#451a03"/><stop offset="50%" stopColor="#78350f"/><stop offset="100%" stopColor="#020617"/></linearGradient>
                </defs>
                
                <g transform={`translate(50,50) scale(${sScale}) translate(-50,-50)`}>
                    {[0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165].map(deg => (
                        <rect key={`gear-${deg}`} x="45" y="-2" width="10" height="104" fill="url(#majShDark)" transform={`rotate(${deg} 50 50)`} rx="2" />
                    ))}
                    <circle cx="50" cy="50" r="48" fill="url(#majShDark)" />
                    <circle cx="50" cy="50" r="46" fill="url(#majShGold)" />
                    <circle cx="50" cy="50" r="43" fill="#0f172a" />
                    <circle cx="50" cy="50" r="41" fill="none" stroke={c[0]} strokeWidth="2.5" opacity="0.95" />
                    <circle cx="50" cy="50" r="38.5" fill="none" stroke={c[1]} strokeWidth="2.5" opacity="0.95" />
                    <circle cx="50" cy="50" r="36" fill="none" stroke={c[2]} strokeWidth="2.5" opacity="0.95" />
                    <circle cx="50" cy="50" r="33" fill="url(#majShBronze)" />
                    {[0, 15, 30, 45, 60, 75].map(deg => (
                        <rect key={`sq-${deg}`} x="22" y="22" width="56" height="56" fill="none" stroke="url(#majShGold)" strokeWidth="0.75" transform={`rotate(${deg} 50 50)`} opacity="0.5" />
                    ))}
                    {[7.5, 22.5, 37.5, 52.5, 67.5, 82.5].map(deg => (
                        <rect key={`sq2-${deg}`} x="28" y="28" width="44" height="44" fill="none" stroke="#ffffff" strokeWidth="0.5" transform={`rotate(${deg} 50 50)`} opacity="0.3" />
                    ))}
                    {[0, 45].map((deg, i) => (
                        <polygon key={`star-${deg}`} points="50,16 57,43 84,50 57,57 50,84 43,57 16,50 43,43" 
                                 transform={`rotate(${deg} 50 50)`} 
                                 fill={i === 0 ? "url(#majShGold)" : "url(#majShBronze)"} 
                                 opacity="0.85" stroke="#451a03" strokeWidth="0.75" 
                                 style={{filter: 'drop-shadow(0 3px 5px rgba(0,0,0,0.6))'}} />
                    ))}
                    <polygon points="50,16 84,50 50,84" fill="#ffffff" opacity="0.15" />
                    <polygon points="50,16 16,50 50,84" fill="#000000" opacity="0.3" />
                    <polygon points="50,32 68,50 50,68 32,50" fill="url(#majShDark)" style={{filter: 'drop-shadow(0 6px 8px rgba(0,0,0,0.7))'}} />
                    <polygon points="50,35 64,50 50,65 36,50" fill="url(#majShGold)" />
                    <polygon points="50,35 64,50 50,50" fill="#ffffff" opacity="0.6" />
                    <polygon points="36,50 50,65 50,50" fill="#451a03" opacity="0.6" />
                    <circle cx="50" cy="50" r="6" fill="url(#majShBronze)" />
                    <circle cx="50" cy="50" r="2.5" fill="#ffffff" opacity="0.9" style={{filter: 'drop-shadow(0 0 2px #ffffff)'}}/>
                </g>
            </svg>
        );
    }

    if (isSF) {
        if (tier === 'finals') {
            return (
                <svg width={size} height={size} viewBox="-15 -10 130 140" className={className} style={{filter: 'drop-shadow(0 12px 20px rgba(0,0,0,0.8))'}}>
                    <defs>
                        <linearGradient id="snbCyan" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#22d3ee" stopOpacity="0.85"/><stop offset="100%" stopColor="#0369a1" stopOpacity="0.95"/></linearGradient>
                        <linearGradient id="snbMagenta" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#e879f9" stopOpacity="0.85"/><stop offset="100%" stopColor="#a21caf" stopOpacity="0.95"/></linearGradient>
                        <linearGradient id="snbPurple" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#a78bfa" stopOpacity="0.85"/><stop offset="100%" stopColor="#5b21b6" stopOpacity="0.95"/></linearGradient>
                        <linearGradient id="snbGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fde047" stopOpacity="0.9"/><stop offset="100%" stopColor="#b45309" stopOpacity="0.95"/></linearGradient>
                        <linearGradient id="snbObsidian" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1e293b"/><stop offset="100%" stopColor="#020617"/></linearGradient>
                    </defs>
                    <g transform={`translate(50,55) scale(0.95) translate(-50,-55)`}>
                        <polygon points="25,95 75,95 85,110 15,110" fill="url(#snbObsidian)" />
                        <polygon points="15,110 85,110 80,120 20,120" fill="#020617" />
                        <path d="M 15 110 L 85 110" fill="none" stroke="#475569" strokeWidth="1.5" />
                        <polygon points="46,95 54,95 52,110 48,110" fill="url(#snbCyan)" style={{filter: 'drop-shadow(0 0 6px #22d3ee)'}} />
                        <polygon points="50,90 10,45 25,5 45,30" fill="url(#snbPurple)" stroke="#c4b5fd" strokeWidth="1.5" strokeLinejoin="round" />
                        <polygon points="50,90 90,40 75,10 55,35" fill="url(#snbMagenta)" stroke="#f9a8d4" strokeWidth="1.5" strokeLinejoin="round" />
                        <polygon points="45,95 5,65 20,25 55,55" fill="url(#snbGold)" stroke="#fef08a" strokeWidth="1.5" strokeLinejoin="round" />
                        <polygon points="55,95 95,70 80,30 45,60" fill="url(#snbCyan)" stroke="#67e8f9" strokeWidth="1.5" strokeLinejoin="round" />
                        <polygon points="50,95 22,52 50,0 78,55" fill="url(#snbCyan)" />
                        <polygon points="50,95 22,52 50,0" fill="#ffffff" opacity="0.35" />
                        <polygon points="50,95 78,55 50,0" fill="#000000" opacity="0.25" />
                        <polygon points="50,80 32,52 50,15 68,54" fill="url(#snbGold)" />
                        <polygon points="50,80 32,52 50,15" fill="#ffffff" opacity="0.4" />
                        <path d="M 50 95 L 50 0 M 22 52 L 50 55 L 78 55 M 32 52 L 50 15 L 68 54 M 50 80 L 32 52 M 50 80 L 68 54" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.9" strokeLinecap="round" strokeLinejoin="round" />
                        <polygon points="12,30 20,22 16,16" fill="url(#snbCyan)" stroke="#ffffff" strokeWidth="1" />
                        <polygon points="85,25 95,35 88,40" fill="url(#snbPurple)" stroke="#ffffff" strokeWidth="1" />
                        <circle cx="50" cy="0" r="2.5" fill="#ffffff" style={{filter: 'drop-shadow(0 0 5px #ffffff)'}} />
                    </g>
                </svg>
            );
        } else {
            const sScale = tier === 'grand_slam' ? 0.82 : 0.75; 
            return (
                <svg width={size} height={size} viewBox="-15 -10 130 155" className={className} style={{filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.7))'}}>
                    <defs>
                        <linearGradient id="cGlass1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#ffffff" stopOpacity="0.95"/><stop offset="100%" stopColor="#bae6fd" stopOpacity="0.3"/></linearGradient>
                        <linearGradient id="cGlass2" x1="1" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f0f9ff" stopOpacity="0.7"/><stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.2"/></linearGradient>
                        <linearGradient id="cGlass3" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.8"/><stop offset="100%" stopColor="#ffffff" stopOpacity="0.9"/></linearGradient>
                        <linearGradient id="sfWoodTop" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#451a03"/><stop offset="50%" stopColor="#78350f"/><stop offset="100%" stopColor="#451a03"/></linearGradient>
                        <linearGradient id="sfWoodFront" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#78350f"/><stop offset="100%" stopColor="#2c1002"/></linearGradient>
                        <linearGradient id="gsPlinthLight" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#e2e8f0"/><stop offset="50%" stopColor="#ffffff"/><stop offset="100%" stopColor="#94a3b8"/></linearGradient>
                    </defs>
                    <g transform={`translate(50,60) scale(${sScale}) translate(-50,-60)`}>
                        <polygon points="15,115 85,115 95,125 5,125" fill="url(#sfWoodTop)" />
                        <rect x="5" y="125" width="90" height="15" fill="url(#sfWoodFront)" />
                        <rect x="40" y="125" width="6.66" height="15" fill={c[0]} />
                        <rect x="46.66" y="125" width="6.66" height="15" fill={c[1]} />
                        <rect x="53.32" y="125" width="6.66" height="15" fill={c[2]} />
                        <rect x="40" y="125" width="20" height="15" fill="#ffffff" opacity="0.15" />
                        <rect x="40" y="125" width="20" height="15" fill="none" stroke="#000000" strokeWidth="0.5" opacity="0.3" />
                        <path d="M 30,115 L 70,115 L 65,100 L 35,100 Z" fill="url(#gsPlinthLight)" style={{filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'}}/>
                        <path d="M 30,115 L 70,115 L 65,100 L 35,100 Z" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.9" strokeLinejoin="round" />
                        <rect x="33" y="112" width="34" height="3" fill="#94a3b8" opacity="0.8" />
                        <polygon points="50,95 20,40 30,20 45,45" fill="url(#cGlass2)" opacity="0.6" stroke="#bae6fd" strokeWidth="1" strokeLinejoin="round" />
                        <polygon points="50,95 80,40 70,20 55,45" fill="url(#cGlass2)" opacity="0.6" stroke="#bae6fd" strokeWidth="1" strokeLinejoin="round" />
                        <polygon points="50,95 10,65 22,50" fill="url(#cGlass1)" opacity="0.5" stroke="#ffffff" strokeWidth="1.2" strokeLinejoin="round" />
                        <polygon points="10,65 15,45 30,35 22,50" fill="url(#cGlass3)" opacity="0.7" stroke="#ffffff" strokeWidth="1.2" strokeLinejoin="round" />
                        <polygon points="50,95 90,65 78,50" fill="url(#cGlass1)" opacity="0.5" stroke="#ffffff" strokeWidth="1.2" strokeLinejoin="round" />
                        <polygon points="90,65 85,45 70,35 78,50" fill="url(#cGlass3)" opacity="0.7" stroke="#ffffff" strokeWidth="1.2" strokeLinejoin="round" />
                        <polygon points="50,95 22,50 35,40" fill="#ffffff" opacity="0.3" stroke="#ffffff" strokeWidth="1.2" strokeLinejoin="round" />
                        <polygon points="22,50 30,25 45,35 35,40" fill="url(#cGlass1)" opacity="0.8" stroke="#ffffff" strokeWidth="1.2" strokeLinejoin="round" />
                        <polygon points="50,95 78,50 65,40" fill="#ffffff" opacity="0.3" stroke="#ffffff" strokeWidth="1.2" strokeLinejoin="round" />
                        <polygon points="78,50 70,25 55,35 65,40" fill="url(#cGlass1)" opacity="0.8" stroke="#ffffff" strokeWidth="1.2" strokeLinejoin="round" />
                        <polygon points="45,35 50,10 38,55" fill="url(#cGlass2)" opacity="0.5" stroke="#ffffff" strokeWidth="1" strokeLinejoin="round" />
                        <polygon points="55,35 50,10 62,55" fill="url(#cGlass2)" opacity="0.5" stroke="#ffffff" strokeWidth="1" strokeLinejoin="round" />
                        <polygon points="50,95 38,55 50,10" fill="url(#cGlass1)" stroke="#ffffff" strokeWidth="1.5" strokeLinejoin="round" />
                        <polygon points="50,95 62,55 50,10" fill="url(#cGlass3)" stroke="#ffffff" strokeWidth="1.5" strokeLinejoin="round" />
                        <polygon points="50,85 43,55 50,25 57,55" fill="#ffffff" opacity="0.5" style={{filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.9))'}} stroke="#ffffff" strokeWidth="1" strokeLinejoin="round" />
                        <polygon points="50,85 43,55 50,25" fill="#ffffff" opacity="0.8" />
                        <path d="M 50 10 L 50 95" fill="none" stroke="#ffffff" strokeWidth="2.5" opacity="0.9" strokeLinecap="round" />
                        <circle cx="50" cy="10" r="2.5" fill="#ffffff" style={{filter: 'drop-shadow(0 0 5px #ffffff)'}} />
                        <path d="M 50 4 L 50 16 M 44 10 L 56 10" fill="none" stroke="#ffffff" strokeWidth="1.2" opacity="0.8" strokeLinecap="round"/>
                    </g>
                </svg>
            );
        }
    }
    
    if (tier === 'nations_league') {
        if (result === 'Winner') {
            return (
                <svg width={size} height={size} viewBox="-15 -10 130 150" className={className} style={{filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.9))'}}>
                    <defs>
                        <linearGradient id="globeGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#fef08a"/><stop offset="50%" stopColor="#eab308"/><stop offset="100%" stopColor="#713f12"/></linearGradient>
                        <linearGradient id="globeSapphire" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#67e8f9"/><stop offset="50%" stopColor="#0284c7"/><stop offset="100%" stopColor="#082f49"/></linearGradient>
                        <linearGradient id="globeObsidian" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#1e293b"/><stop offset="50%" stopColor="#020617"/><stop offset="100%" stopColor="#0f172a"/></linearGradient>
                        <pattern id="worldMap" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="scale(0.8)">
                            <path d="M 5 5 Q 10 0 15 5 T 20 15 Q 10 20 5 15 T 0 5 Z" fill="#38bdf8" opacity="0.3"/>
                            <path d="M 0 10 Q 5 5 10 10 T 15 20 Q 5 25 0 20 Z" fill="#0ea5e9" opacity="0.4"/>
                        </pattern>
                    </defs>
                    <path d="M 15 135 L 85 135 L 75 120 L 25 120 Z" fill="url(#globeObsidian)" />
                    <path d="M 25 120 L 75 120 L 65 110 L 35 110 Z" fill="url(#globeGold)" />
                    <rect x="35" y="105" width="30" height="5" fill="#eab308" />
                    <path d="M 38 105 Q 20 70 38 35" fill="none" stroke="url(#globeGold)" strokeWidth="4" strokeLinecap="round" style={{filter: 'drop-shadow(-2px 0 4px rgba(0,0,0,0.6))'}}/>
                    <path d="M 45 105 Q 35 70 45 35" fill="none" stroke="url(#globeGold)" strokeWidth="3" strokeLinecap="round"/>
                    <path d="M 55 105 Q 65 70 55 35" fill="none" stroke="url(#globeGold)" strokeWidth="3" strokeLinecap="round"/>
                    <path d="M 62 105 Q 80 70 62 35" fill="none" stroke="url(#globeGold)" strokeWidth="4" strokeLinecap="round" style={{filter: 'drop-shadow(2px 0 4px rgba(0,0,0,0.6))'}}/>
                    <circle cx="50" cy="40" r="28" fill="url(#globeSapphire)" style={{filter: 'drop-shadow(0 0 15px rgba(2,132,199,0.5))'}}/>
                    <circle cx="50" cy="40" r="28" fill="url(#worldMap)" />
                    <circle cx="50" cy="40" r="28" fill="url(#chromeDark)" opacity="0.4" />
                    <ellipse cx="50" cy="40" rx="28" ry="10" fill="none" stroke="url(#globeGold)" strokeWidth="1.5" opacity="0.8" />
                    <ellipse cx="50" cy="40" rx="10" ry="28" fill="none" stroke="url(#globeGold)" strokeWidth="1.5" opacity="0.8" />
                    <ellipse cx="50" cy="40" rx="42" ry="14" fill="none" stroke="url(#globeGold)" strokeWidth="2" strokeDasharray="15 5" transform="rotate(-15 50 40)" style={{filter: 'drop-shadow(0 0 5px #facc15)'}}/>
                    <ellipse cx="50" cy="40" rx="38" ry="12" fill="none" stroke="#38bdf8" strokeWidth="1.5" transform="rotate(25 50 40)" opacity="0.6"/>
                    <rect x="35" y="130" width="10" height="5" fill={c[0]} />
                    <rect x="45" y="130" width="10" height="5" fill={c[1]} />
                    <rect x="55" y="130" width="10" height="5" fill={c[2]} />
                </svg>
            );
        }
        
        if (result === 'Finalist' || result === 'Third Place') {
            const isSilver = result === 'Finalist';
            const mColor1 = isSilver ? '#f8fafc' : '#fcd34d';
            const mColor2 = isSilver ? '#94a3b8' : '#d97706';
            const mColor3 = isSilver ? '#334155' : '#78350f';
            
            return (
                <svg width={size} height={size} viewBox="-10 -10 120 140" className={className} style={{filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.6))'}}>
                    <defs>
                        <linearGradient id={`medalGrad-${isSilver}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor={mColor1}/><stop offset="50%" stopColor={mColor2}/><stop offset="100%" stopColor={mColor3}/></linearGradient>
                        <linearGradient id={`medalRibbon-${isSilver}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c[0]}/><stop offset="100%" stopColor={c[2]}/></linearGradient>
                    </defs>
                    <path d="M 20 -10 L 50 50 L 80 -10 L 65 -10 L 50 35 L 35 -10 Z" fill={`url(#medalRibbon-${isSilver})`} stroke={c[1]} strokeWidth="2" style={{filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))'}}/>
                    <rect x="46" y="45" width="8" height="12" rx="2" fill={mColor2} stroke={mColor3} strokeWidth="1.5" />
                    <circle cx="50" cy="80" r="32" fill={`url(#medalGrad-${isSilver})`} stroke={mColor1} strokeWidth="2" style={{filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.7))'}}/>
                    <circle cx="50" cy="80" r="26" fill="none" stroke={mColor3} strokeWidth="1.5" opacity="0.6" strokeDasharray="3 3"/>
                    <circle cx="50" cy="80" r="18" fill="none" stroke={mColor1} strokeWidth="2" opacity="0.8"/>
                    <path d="M 32 80 Q 50 60 68 80 M 32 80 Q 50 100 68 80" fill="none" stroke={mColor3} strokeWidth="1.5" opacity="0.5"/>
                    <path d="M 50 62 Q 30 80 50 98 M 50 62 Q 70 80 50 98" fill="none" stroke={mColor3} strokeWidth="1.5" opacity="0.5"/>
                    <circle cx="50" cy="80" r="4" fill={mColor1} />
                </svg>
            );
        }
    }
    
    return null;
};