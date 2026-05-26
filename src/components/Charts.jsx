import React, { useState, useEffect, useMemo } from 'react';
import { AnalyticsIcon } from './Icons';
import { PlayerMedia } from './SharedUI';
import { getFlag, getCountryName } from '../utils/helpers';

// --- GLOBAL CHART SYNC STATE ---
export const __snbSharedChartState = { windowSize: 10, offset: 0, showDropped: false, cutoff: 12, layoutMode: 'linear' };
export const __snbChartListeners = new Set();
export const updateSnbChartState = (updates) => {
    Object.assign(__snbSharedChartState, updates);
    __snbChartListeners.forEach(l => l());
};

const CHART_PALETTE = ["#facc15", "#38bdf8", "#f472b6", "#4ade80", "#fb923c", "#a78bfa", "#2dd4bf", "#f87171", "#818cf8", "#e879f9", "#34d399", "#fbbf24", "#60a5fa", "#a3e635", "#f43f5e", "#c084fc", "#22d3ee", "#fcd34d", "#10b981", "#8b5cf6", "#fdba74", "#67e8f9", "#d9f99d", "#fda4af"];
const getDistinctColor = (id) => {
    let hash = 0; for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
    return CHART_PALETTE[Math.abs(hash) % CHART_PALETTE.length];
};

export const getLogY = (val, maxVal, minLogVal, plotH, bottomY) => {
    if (val <= 0) return bottomY;
    const safeVal = Math.max(minLogVal, val);
    const logMin = Math.log10(minLogVal);
    const logMax = Math.log10(Math.max(minLogVal + 1, maxVal));
    const logVal = Math.log10(safeVal);
    const pct = (logVal - logMin) / (logMax - logMin);
    return bottomY - (pct * plotH);
};

export function IndividualPlayerChart({ history, type, filterPlayed = false, totalPlayersCount = 10, isRetired = false }) {
    const [range, setRange] = useState(10);
    const [hoveredPointData, setHoveredPointData] = useState(null);

    const rawData = filterPlayed ? history.filter(d => d.played) : history.filter(d => d.isMajorPlus);
    const data = rawData.slice(range === 'all' ? 0 : -range);
    
    if (data.length < 1) return <p className="text-white/40 text-sm mt-8 font-medium italic text-center w-full">Not enough tournament history.</p>;

    const width = 1000;
    const height = 350; 
    const pad = { top: 50, right: 60, bottom: 40, left: 60 };
    
    let minVal = type === 'rank' ? 1 : 0;
    let maxVal;
    if (type === 'rank') { maxVal = Math.ceil(Math.max(10, totalPlayersCount) / 10) * 10; } 
    else if (type === 'careerPoints') { maxVal = Math.max(100, ...data.map(d => d.careerPoints)) * 1.1; } 
    else { maxVal = Math.max(100, ...data.map(d => d.totalPoints)) * 1.1; }

    const getX = (i) => data.length === 1 ? (width / 2) : pad.left + (i * ((width - pad.left - pad.right) / (data.length - 1)));
    const getY = (val) => {
        if (type === 'rank') return pad.top + ((val - minVal) / (maxVal - minVal)) * (height - pad.top - pad.bottom);
        return height - pad.bottom - ((val - minVal) / (maxVal - minVal)) * (height - pad.top - pad.bottom);
    };

    const pathD = data.map((d, i) => {
        const val = type === 'rank' ? d.rank : (type === 'careerPoints' ? d.careerPoints : d.totalPoints);
        return `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(val)}`;
    }).join(' ');

    let pathD2 = "";
    if (type === 'points') {
        pathD2 = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.tournamentPoints)}`).join(' ');
    }

    const labelStep = Math.max(1, Math.ceil(data.length / 15));

    const getAchColor = (ach) => {
        if (!ach) return '#a1a1aa'; // Slate
        if (ach.result === 'Winner') return '#d4af37'; // Gold
        if (ach.result === 'Finalist' || ach.result === 'Final') return '#cbd5e1'; // Silver
        return '#cd7f32'; // Bronze
    };

    return (
        <div className="mt-8 flex flex-col items-center w-full animate-in fade-in duration-500">
            {/* GLASSMORPHISM CONTROLS */}
            <div className="flex gap-3 mb-6 w-full justify-start">
                <button onClick={() => setRange(10)} className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${range === 10 ? 'bg-gold-500 text-black border-gold-400 shadow-[0_0_20px_rgba(212,175,55,0.3)]' : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white backdrop-blur-md'}`}>Last 10</button>
                <button onClick={() => setRange(20)} className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${range === 20 ? 'bg-gold-500 text-black border-gold-400 shadow-[0_0_20px_rgba(212,175,55,0.3)]' : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white backdrop-blur-md'}`}>Last 20</button>
                <button onClick={() => setRange('all')} className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${range === 'all' ? 'bg-gold-500 text-black border-gold-400 shadow-[0_0_20px_rgba(212,175,55,0.3)]' : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white backdrop-blur-md'}`}>All Time</button>
            </div>
            
            {/* HEAVY MATTE GLASS CHART CONTAINER */}
            <div className="w-full bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 pt-4 pb-2 relative overflow-hidden shadow-2xl">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
                    {/* Restyled Dark-Theme Grid Lines */}
                    {type === 'rank' ? (
                        (() => {
                            const lines = [1];
                            const step = maxVal > 50 ? 10 : 5;
                            for (let i = step; i <= maxVal; i += step) lines.push(i);
                            return lines.map((r, i) => (
                                <g key={`grid-rank-${i}`}>
                                    <line x1={pad.left} y1={getY(r)} x2={width - pad.right} y2={getY(r)} stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4 4" />
                                    <text x={pad.left - 10} y={getY(r)} fill="rgba(255,255,255,0.3)" fontSize="12" fontWeight="bold" textAnchor="end" alignmentBaseline="middle">#{r}</text>
                                </g>
                            ));
                        })()
                    ) : (
                        (() => {
                            const rawStep = maxVal / 5;
                            const mag = Math.pow(10, Math.floor(Math.log10(rawStep || 1)));
                            const step = Math.max(10, Math.ceil(rawStep / mag) * mag);
                            const yLines = [0]; 
                            for(let v = step; v <= maxVal; v += step) yLines.push(v);
                            
                            return yLines.map((p, i) => (
                                <g key={`grid-${i}`}>
                                    <line x1={pad.left} y1={getY(p)} x2={width - pad.right + 20} y2={getY(p)} stroke={p === 0 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.05)"} strokeWidth={p === 0 ? "2" : "1.5"} strokeDasharray={p === 0 ? "none" : "4 4"} />
                                    <text x={pad.left - 15} y={getY(p)} fill="rgba(255,255,255,0.3)" fontSize="12" fontWeight="bold" textAnchor="end" alignmentBaseline="middle">{p === 0 ? 0 : Math.round(p).toLocaleString()}</text>
                                </g>
                            ));
                        })()
                    )}
                    
                    {type === 'points' && data.length > 1 && <path d={pathD2} fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="5 5" strokeLinejoin="round" />}
                    {data.length > 1 && <path d={pathD} fill="none" stroke="#d4af37" strokeWidth="3" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 10px rgba(212,175,55,0.4))' }} />}
                    
                    {type === 'points' && data.map((d, i) => {
                        const ptX = getX(i); const ptY2 = getY(d.tournamentPoints);
                        const showLabel = i % labelStep === 0 || i === data.length - 1;
                        return (
                            <g key={`tpt-${i}`}>
                                <circle cx={ptX} cy={ptY2} r={hoveredPointData && hoveredPointData.date === d.date ? "6" : "4"} fill="#0f172a" stroke="#38bdf8" strokeWidth="2" style={{ transition: 'r 0.2s ease' }} />
                                {showLabel && (
                                    <text x={ptX} y={ptY2 - 12} fill="#38bdf8" fontSize="11" fontWeight="900" textAnchor="middle" stroke="#0f172a" strokeWidth="4" paintOrder="stroke">
                                        +{d.tournamentPoints}
                                    </text>
                                )}
                            </g>
                        )
                    })}

                    {data.map((d, i) => {
                        const ptX = getX(i); const ptY = getY(type === 'rank' ? d.rank : (type === 'careerPoints' ? d.careerPoints : d.totalPoints));
                        const isHovered = hoveredPointData && hoveredPointData.date === d.date;
                        const isMinor = d.tier === 'pro' || d.tier === 'challenger';
                        const showLabel = i % labelStep === 0 || i === data.length - 1;
                        const val = type === 'rank' ? d.rank : (type === 'careerPoints' ? d.careerPoints : d.totalPoints);
                        const dotRadius = isHovered ? "8" : (isMinor ? "3.5" : "5");
                        const dotOpacity = isMinor ? "0.6" : "1";
                        const dotStroke = isMinor ? "#94a3b8" : "#d4af37";
                        const isRetirementNode = isRetired && i === data.length - 1;

                        return (
                            <g key={i}>
                                {isRetirementNode ? (
                                    <g transform={`translate(${ptX}, ${ptY})`}>
                                        <polygon points="0,-6 6,0 0,6 -6,0" fill="#be123c" stroke="#fb7185" strokeWidth="1.5" style={{ filter: 'drop-shadow(0 0 5px rgba(251,113,133,0.5))' }} />
                                        <text x="0" y="16" fill="#fb7185" fontSize="9" fontWeight="900" textAnchor="middle" stroke="#0f172a" strokeWidth="4" paintOrder="stroke">RETIRED</text>
                                    </g>
                                ) : (
                                    <circle cx={ptX} cy={ptY} r={dotRadius} fill="#0f172a" stroke={dotStroke} strokeWidth={isMinor ? "1.5" : "2"} opacity={dotOpacity} style={{ transition: 'all 0.2s ease', filter: isHovered ? 'drop-shadow(0 0 8px rgba(255,255,255,0.5))' : 'none' }} />
                                )}

                                {(showLabel || isMinor) && (
                                    <text x={ptX} y={ptY - (isMinor ? 12 : 18)} fill={isRetirementNode ? "#fb7185" : (isMinor ? "rgba(255,255,255,0.4)" : "#d4af37")} fontSize={isMinor ? "10" : "14"} fontWeight="900" textAnchor="middle" stroke="#0f172a" strokeWidth={isMinor ? "3" : "4"} paintOrder="stroke" opacity={isMinor && !isHovered ? 0 : 1} className={isMinor ? "group-hover:opacity-100 transition-opacity" : ""}>
                                        {type === 'rank' ? `#${d.rank}` : val.toLocaleString()}
                                    </text>
                                )}
                                
                                {(type === 'points' || type === 'careerPoints') && d.achievement && !isMinor && !isRetirementNode && (
                                    <g transform={`translate(${ptX - 10}, ${ptY - 50})`}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={getAchColor(d.achievement)} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))' }}>
                                            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
                                        </svg>
                                    </g>
                                )}
                                <circle cx={ptX} cy={ptY} r="20" fill="transparent" cursor="crosshair" onMouseEnter={() => setHoveredPointData(d)} onMouseLeave={() => setHoveredPointData(null)} />
                            </g>
                        );
                    })}
                </svg>
            </div>

            {/* NEW GLASSMORPHISM HOVER TOOLTIP */}
            <div className={`h-12 mt-6 flex items-center justify-center rounded-2xl px-8 min-w-[400px] transition-all duration-300 border ${hoveredPointData ? 'bg-black/60 backdrop-blur-2xl border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.5)]' : 'bg-white/5 border-transparent opacity-50'}`}>
                {hoveredPointData ? (
                    <span className="text-white font-black tracking-wide flex items-center gap-3">
                        {hoveredPointData.tournamentName} 
                        <span className="text-white/20">|</span>
                        <span className={type === 'rank' ? "text-white" : "text-gold-400"}>
                            {type === 'rank' ? `Rank #${hoveredPointData.rank}` : `${(type === 'careerPoints' ? hoveredPointData.careerPoints : hoveredPointData.totalPoints).toLocaleString()} pts`}
                        </span>
                        {type === 'points' && (
                            <span className="text-sky-400 font-bold bg-sky-500/10 px-2 py-0.5 rounded-md border border-sky-500/20 flex items-center gap-1">
                                +{hoveredPointData.tournamentPoints}
                                {hoveredPointData.isMajorPlus && <span className="text-[9px] uppercase tracking-widest bg-sky-400 text-black px-1 rounded-sm ml-1">Major+</span>}
                            </span>
                        )}
                    </span>
                ) : (
                    <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Hover over a point for details</span>
                )}
            </div>
        </div>
    );
}

export function TopPlayersChart({ globalHistory, playersRaw, type, onNavigate }) {
    const [, setTick] = useState(0);
    const [selectedLineId, setSelectedLineId] = useState(null);
    const [hoveredLineId, setHoveredLineId] = useState(null);

    useEffect(() => {
        const l = () => setTick(t => t + 1);
        __snbChartListeners.add(l);
        return () => __snbChartListeners.delete(l);
    }, []);

    const { windowSize, offset, showDropped, cutoff, layoutMode } = __snbSharedChartState;
    const hasCutoff = cutoff !== 'all';
    const isAll = !hasCutoff;
    
    // Auto-enable Log scale natively when viewing all players' points!
    const isLogScale = layoutMode === 'logarithmic' || (type === 'points' && isAll && layoutMode !== 'linear');
    
    const filteredHistory = globalHistory.filter(h => h.isMajorPlus);
    const N = filteredHistory.length;

    const maxOffset = windowSize === 'all' ? 0 : Math.max(0, N - windowSize);
    const safeOffset = Math.min(offset, maxOffset);
    const endIndex = N - safeOffset;
    const startIndex = windowSize === 'all' ? 0 : Math.max(0, endIndex - windowSize);
    const historyData = filteredHistory.slice(startIndex, endIndex);

    if (historyData.length < 1) return <p className="text-white/40 italic font-medium text-sm mt-4 text-center">Not enough Major+ tournament history.</p>;

    const playerDebuts = useMemo(() => {
        const debuts = {};
        filteredHistory.forEach(h => h.standings?.forEach(s => { if (!debuts[s.id]) debuts[s.id] = h.id; }));
        return debuts;
    }, [filteredHistory]);

    const lastActiveIndices = useMemo(() => {
        const indices = {};
        playersRaw.forEach(p => {
            if (p.retired) {
                let maxM = -1; let lastIdx = -1;
                for (let i = 0; i < filteredHistory.length; i++) {
                    const st = filteredHistory[i].standings?.find(x => x.id === p.id);
                    if (st && st.matchesPlayed > maxM) { maxM = st.matchesPlayed; lastIdx = i; }
                }
                indices[p.id] = lastIdx;
            }
        });
        return indices;
    }, [filteredHistory, playersRaw]);

    const includedPlayerIds = new Set();
    let absoluteMaxRank = 12;
    historyData.forEach(h => h.standings?.forEach(s => { 
        if (!hasCutoff || s.rank <= cutoff) includedPlayerIds.add(s.id); 
        if (s.rank > absoluteMaxRank) absoluteMaxRank = s.rank;
    }));

    const cConf = { gap: 16, font: 9, img: 12, rectH: 14, rectW: 100, ptR: 1.5, debutR: 2.5, stroke: 1.5 };
    const width = 1200;
    const effectiveCutoff = hasCutoff ? cutoff : absoluteMaxRank;

    let maxPointsVal = 10;
    if (type !== 'rank') {
        historyData.forEach(h => h.standings?.forEach(s => { 
            if (includedPlayerIds.has(s.id) && (!hasCutoff || s.rank <= cutoff) && s.pts > maxPointsVal) maxPointsVal = s.pts;
        }));
        maxPointsVal = Math.ceil(maxPointsVal * 1.05);
    }

    let plotHeight = 480;
    if (type === 'rank') {
        if (cutoff === 8) plotHeight = 350;
        else if (cutoff === 12) plotHeight = 450;
        else if (cutoff === 24) plotHeight = 550;
        else plotHeight = Math.max(500, (effectiveCutoff - 1) * (cConf.rectH + 4));
    } else {
        const baseHeight = cutoff === 8 ? 500 : cutoff === 12 ? 600 : 700;
        plotHeight = Math.max(baseHeight, includedPlayerIds.size * 6);
    }

    const pad = { top: 60, right: isAll ? 130 : 200, left: type === 'rank' ? 60 : 80, bottom: isAll ? 40 : 100 }; 
    const gridBottomY = pad.top + plotHeight;

    const getX = (i) => historyData.length <= 1 ? (pad.left + (width - pad.left - pad.right) / 2) : pad.left + (i * ((width - pad.left - pad.right) / (historyData.length - 1)));
    const getY = (val) => {
        if (type === 'rank') return pad.top + ((val - 1) / Math.max(1, effectiveCutoff - 1)) * plotHeight;
        if (isLogScale && val > 0) return getLogY(val, maxPointsVal, 10, plotHeight, gridBottomY);
        return gridBottomY - (val / Math.max(1, maxPointsVal)) * plotHeight;
    };

    const thresholdData = historyData.map((h, k) => {
        if (!hasCutoff) return { k, x: getX(k), val: 0, y: gridBottomY + 2000 }; 
        let val = type === 'rank' ? cutoff + 1 : 0;
        if (type !== 'rank' && h.standings) {
            const sCut = h.standings.find(s => s.rank === cutoff + 1);
            if (sCut) val = sCut.pts;
            else if (h.standings.length >= cutoff + 1) val = h.standings[cutoff].pts;
            else if (h.standings.length > 0) val = h.standings[h.standings.length - 1].pts;
        }
        return { k, x: getX(k), val, y: getY(val) };
    });

    const lines = [];
    Array.from(includedPlayerIds).forEach(pid => {
        const player = playersRaw.find(p => p.id === pid);
        if (!player) return;

        const timeline = [];
        for (let k = 0; k < historyData.length; k++) {
            const h = historyData[k];
            const s = h.standings?.find(st => st.id === pid);
            const globalK = filteredHistory.findIndex(gh => gh.tournamentId === h.tournamentId);
            const isPastRetirement = player.retired && globalK > lastActiveIndices[pid];
            
            const exists = !!s && !isPastRetirement;
            let val = s ? (type === 'rank' ? s.rank : s.pts) : (type === 'rank' ? effectiveCutoff + 5 : -1000); 
            timeline.push({ k, x: getX(k), y: getY(val), val, s, exists, isDebut: s && playerDebuts[pid] === h.tournamentId });
        }

        const segments = [];
        let currentSeg = [];

        const getIntersect = (p0, p1, t0, t1) => {
            const D = (t1.y - p1.y) - (t0.y - p0.y);
            if (Math.abs(D) < 0.001) return null; 
            let t = Math.max(0, Math.min(1, (p0.y - t0.y) / D)); 
            return { x: p0.x + t*(p1.x - p0.x), y: p0.y + t*(p1.y - p0.y), isDot: false, isIntersection: true, k: p0.k + t, val: t0.val + t*(t1.val - t0.val) };
        };

        for (let k = 0; k < timeline.length; k++) {
            const pt = timeline[k], prev = k > 0 ? timeline[k-1] : null, next = k < timeline.length - 1 ? timeline[k+1] : null;
            if (!pt.exists) {
                if (currentSeg.length > 0) { segments.push(currentSeg); currentSeg = []; }
            } else {
                if (isAll) {
                    currentSeg.push({ ...pt, isDot: true });
                } else {
                    const inCutoff = pt.s.rank <= cutoff;
                    if (inCutoff) {
                        if (prev && prev.exists && prev.s.rank > cutoff) {
                            const I = getIntersect(prev, pt, thresholdData[k-1], thresholdData[k]); 
                            if (I) currentSeg.push(I);
                        }
                        currentSeg.push({ ...pt, isDot: true });
                        if (next && next.exists && next.s.rank > cutoff) {
                            const I = getIntersect(pt, next, thresholdData[k], thresholdData[k+1]); 
                            if (I) { currentSeg.push(I); segments.push(currentSeg); currentSeg = []; }
                        }
                    } else {
                        if (currentSeg.length > 0) { segments.push(currentSeg); currentSeg = []; }
                    }
                }
            }
        }
        if (currentSeg.length > 0) segments.push(currentSeg);
        if (segments.length > 0) {
            const paths = segments.map(seg => seg.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`).join(' '));
            lines.push({ player, segments, paths, color: getDistinctColor(player.id) });
        }
    });

    const labels = [];
    lines.forEach(line => {
        if (!line.segments.length) return;
        const endPt = line.segments[line.segments.length - 1].slice(-1)[0];
        const isDropped = line.player.retired || (hasCutoff ? (endPt.isIntersection || endPt.k < historyData.length - 1) : (!endPt.exists || endPt.k < historyData.length - 1));
        labels.push({ id: line.player.id, endX: endPt.x, endY: endPt.y, actualVal: endPt.val, isDropped, name: line.player.name });
    });

    const columns = [];
    labels.forEach(l => {
        let placed = false;
        for (let c of columns) {
            if (Math.abs(c.x - l.endX) < 10) { c.labels.push(l); placed = true; break; }
        }
        if (!placed) columns.push({ x: l.endX, labels: [l] });
    });

    const physicsGap = cConf.rectH + 2; 

    columns.forEach(col => {
        const colLabels = col.labels;
        colLabels.sort((a,b) => type === 'rank' ? a.actualVal - b.actualVal : b.actualVal - a.actualVal);
        if (colLabels.length > 0) {
            colLabels[0].currentY = colLabels[0].endY;
            for (let i = 1; i < colLabels.length; i++) colLabels[i].currentY = Math.max(colLabels[i].endY, colLabels[i-1].currentY + physicsGap);
            if (colLabels[colLabels.length - 1].currentY > gridBottomY) {
                colLabels[colLabels.length - 1].currentY = gridBottomY;
                for (let i = colLabels.length - 2; i >= 0; i--) colLabels[i].currentY = Math.min(colLabels[i].currentY, colLabels[i+1].currentY - physicsGap);
            }
        }
    });

    const labelPositions = {};
    labels.forEach(el => labelPositions[el.id] = el.currentY);
    const dynamicHeight = gridBottomY + pad.bottom;
    const thresholdPath = thresholdData.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`).join(' ');
    const dropZonePath = `${thresholdPath} L ${getX(historyData.length - 1)} ${gridBottomY} L ${getX(0)} ${gridBottomY} Z`;

    const sortedLines = [...lines].sort((a, b) => {
        const aH = a.player.id === selectedLineId || a.player.id === hoveredLineId, bH = b.player.id === selectedLineId || b.player.id === hoveredLineId;
        if (aH && !bH) return 1; if (!aH && bH) return -1;
        const aL = labels.find(l => l.id === a.player.id), bL = labels.find(l => l.id === b.player.id);
        if (!aL || !bL) return 0;
        if (aL.isDropped && !bL.isDropped) return -1; if (!aL.isDropped && bL.isDropped) return 1;
        return type === 'points' ? aL.actualVal - bL.actualVal : bL.actualVal - aL.actualVal;
    });

    return (
        <div className="w-full" id={`snb-chart-${type}`}>
            <div className="flex flex-wrap gap-4 items-center justify-between mb-6 bg-black/20 backdrop-blur-md p-3 rounded-2xl border border-white/5 shadow-inner">
                <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-1.5 bg-black/40 p-1.5 rounded-xl border border-white/5 shadow-inner">
                        <span className="text-[10px] text-white/30 uppercase tracking-widest font-black px-2 hidden sm:block">Window</span>
                        {[10, 20, 50, 'all'].map(ws => (
                            <button key={ws} onClick={() => updateSnbChartState({ windowSize: ws, offset: 0 })}
                                className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${windowSize === ws ? 'bg-gold-500 text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'bg-transparent text-white/50 hover:text-white hover:bg-white/10'}`}>
                                {ws === 'all' ? 'All Time' : ws}
                            </button>
                        ))}
                    </div>
                    {!isAll && windowSize !== 'all' && (
                        <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-xl border border-white/5 shadow-inner">
                            <button onClick={() => updateSnbChartState({ offset: Math.min(maxOffset, safeOffset + windowSize) })} disabled={safeOffset >= maxOffset} className="p-1 hover:bg-white/10 text-white/50 hover:text-white rounded-lg disabled:opacity-30 transition-colors"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg></button>
                            <span className="text-xs font-bold text-white/70 w-28 text-center tabular-nums">{startIndex + 1} - {endIndex} of {N}</span>
                            <button onClick={() => updateSnbChartState({ offset: Math.max(0, safeOffset - windowSize) })} disabled={safeOffset <= 0} className="p-1 hover:bg-white/10 text-white/50 hover:text-white rounded-lg disabled:opacity-30 transition-colors"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg></button>
                        </div>
                    )}
                    <div className="w-px h-6 bg-white/10 hidden lg:block"></div>
                    <div className="flex items-center gap-1.5 bg-black/40 p-1.5 rounded-xl border border-white/5 shadow-inner">
                        <span className="text-[10px] text-white/30 uppercase tracking-widest font-black px-2 hidden sm:block">Cutoff</span>
                        {[8, 12, 24, 'all'].map(c => (
                            <button key={c} onClick={() => updateSnbChartState({ cutoff: c })}
                                className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${cutoff === c ? 'bg-gold-500 text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'bg-transparent text-white/50 hover:text-white hover:bg-white/10'}`}>
                                {c === 'all' ? 'All' : `Top ${c}`}
                            </button>
                        ))}
                    </div>
                    
                    {type === 'points' && (
                        <>
                            <div className="w-px h-6 bg-white/10 hidden lg:block"></div>
                            <div className="flex items-center gap-1.5 bg-black/40 p-1.5 rounded-xl border border-white/5 shadow-inner">
                                <button onClick={() => updateSnbChartState({ layoutMode: 'linear' })} className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${!isLogScale ? 'bg-gold-500 text-black shadow-sm' : 'bg-transparent text-white/50 hover:text-white hover:bg-white/10'}`}>Linear</button>
                                <button onClick={() => updateSnbChartState({ layoutMode: 'logarithmic' })} className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${isLogScale ? 'bg-gold-500 text-black shadow-sm' : 'bg-transparent text-white/50 hover:text-white hover:bg-white/10'}`}>Logarithmic</button>
                            </div>
                        </>
                    )}
                    
                    {hasCutoff && (
                        <button onClick={() => updateSnbChartState({ showDropped: !showDropped })} 
                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border shadow-sm ${showDropped ? 'bg-white/20 border-white/40 text-white' : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'}`}>
                            {showDropped ? 'Hide Dropped' : 'Show Dropped'}
                        </button>
                    )}
                </div>
                {selectedLineId && <button onClick={() => setSelectedLineId(null)} className="text-xs font-black uppercase tracking-widest text-rose-400 hover:text-rose-300 px-4 py-2 bg-rose-500/10 rounded-xl border border-rose-500/20 transition-colors shadow-sm">Clear Selection</button>}
            </div>
            
            <div className="w-full bg-black/20 rounded-3xl border border-white/5 pt-4 pb-2 relative overflow-x-auto select-none custom-scrollbar" onClick={() => setSelectedLineId(null)}>
                <svg viewBox={`0 0 ${width} ${dynamicHeight}`} style={{ minWidth: `800px`, transition: 'viewBox 0.3s ease' }} className="w-full h-auto overflow-visible font-sans">
                    <defs>
                        {lines.map(line => (
                            <clipPath id={`clip-${type}-${line.player.id}`} key={`clip-${line.player.id}`}>
                                <circle cx={4 + cConf.img/2} cy="0" r={cConf.img/2} />
                            </clipPath>
                        ))}
                    </defs>

                    {hasCutoff && (
                        <g className="threshold-layer">
                            <path d={dropZonePath} fill="#000000" opacity="0.3" style={{ transition: 'd 0.3s ease' }} />
                            <path d={thresholdPath} fill="none" stroke="#fb7185" strokeWidth="2.5" strokeDasharray="8 6" opacity="0.6" />
                            <text x={width - pad.right + 10} y={thresholdData[thresholdData.length - 1].y} fill="#fb7185" fontSize="12" fontWeight="bold" alignmentBaseline="middle" opacity="0.8">Top {cutoff} Cutoff</text>
                            <text x={pad.left - 15} y={thresholdData[0].y} fill="#fb7185" fontSize="12" fontWeight="bold" textAnchor="end" alignmentBaseline="middle" opacity="0.8">{type === 'rank' ? 'Drop' : `Top ${cutoff}`}</text>
                        </g>
                    )}

                    {type === 'rank' ? (
                        (() => {
                            const rLines = [];
                            const step = isAll ? (effectiveCutoff > 30 ? 5 : 2) : 1;
                            for (let i = 1; i <= effectiveCutoff; i += step) rLines.push(i);
                            if (isAll && !rLines.includes(1)) rLines.unshift(1);
                            if (isAll && !rLines.includes(effectiveCutoff)) rLines.push(effectiveCutoff);
                            return rLines.map((r, i) => (
                                <g key={`grid-${i}`}>
                                    <line x1={pad.left} y1={pad.top + ((r - 1) / Math.max(1, effectiveCutoff - 1)) * plotHeight} x2={width - pad.right + 20} y2={pad.top + ((r - 1) / Math.max(1, effectiveCutoff - 1)) * plotHeight} stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" strokeDasharray="4 4" />
                                    <text x={pad.left - 15} y={pad.top + ((r - 1) / Math.max(1, effectiveCutoff - 1)) * plotHeight} fill="rgba(255,255,255,0.3)" fontSize="12" fontWeight="bold" textAnchor="end" alignmentBaseline="middle">#{r}</text>
                                </g>
                            ));
                        })()
                    ) : (
                        (() => {
                            let yLines = [];
                            if (isLogScale) {
                                yLines = [0];
                                const maxPow = Math.ceil(Math.log10(maxPointsVal));
                                for (let i = 1; i <= maxPow; i++) yLines.push(Math.pow(10, i));
                            } else {
                                const rawStep = maxPointsVal / (isAll ? 20 : 15);
                                const mag = Math.pow(10, Math.floor(Math.log10(rawStep || 1)));
                                const step = Math.max(10, Math.ceil(rawStep / mag) * mag);
                                yLines = [0]; for(let v = step; v <= maxPointsVal; v += step) yLines.push(v);
                            }
                            return yLines.map((p, i) => (
                                <g key={`grid-${i}`}>
                                    <line x1={pad.left} y1={getY(p)} x2={width - pad.right + 20} y2={getY(p)} stroke={p === 0 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.05)"} strokeWidth={p === 0 ? "2" : "1.5"} strokeDasharray={p === 0 ? "none" : "4 4"} />
                                    <text x={pad.left - 15} y={getY(p)} fill="rgba(255,255,255,0.3)" fontSize="12" fontWeight="bold" textAnchor="end" alignmentBaseline="middle">{p === 0 ? 0 : Math.round(p).toLocaleString()}</text>
                                </g>
                            ));
                        })()
                    )}
                    
                    {sortedLines.map((line) => {
                        const isHighlighted = selectedLineId === line.player.id || hoveredLineId === line.player.id;
                        const isFaded = (selectedLineId || hoveredLineId) && !isHighlighted;
                        return line.paths.map((pStr, pIdx) => (
                            <path key={`path-${line.player.id}-${pIdx}`} d={pStr} fill="none" stroke={line.color} strokeWidth={isHighlighted ? cConf.stroke * 2.5 : cConf.stroke} opacity={isFaded ? 0.15 : 0.9} strokeLinejoin="round" strokeLinecap="round" className="cursor-pointer" onClick={(e) => { e.stopPropagation(); setSelectedLineId(line.player.id === selectedLineId ? null : line.player.id); }} onMouseEnter={() => setHoveredLineId(line.player.id)} onMouseLeave={() => setHoveredLineId(null)} style={{ filter: isHighlighted ? `drop-shadow(0 0 6px ${line.color}60)` : 'none' }} />
                        ));
                    })}
                    
                    {sortedLines.map((line) => {
                        const isHighlighted = selectedLineId === line.player.id || hoveredLineId === line.player.id;
                        const isFaded = (selectedLineId || hoveredLineId) && !isHighlighted;
                        const endPt = line.segments[line.segments.length - 1].slice(-1)[0];
                        const isDropped = line.player.retired || (hasCutoff ? (endPt.isIntersection || endPt.k < historyData.length - 1) : (!endPt.exists || endPt.k < historyData.length - 1));
                        
                        // Hide massive label clusters if viewing all points, unless hovered
                        const shouldShowLabel = (type === 'points' && isAll) ? isHighlighted : (!isDropped || showDropped || isHighlighted);
                        const adjY = labelPositions[line.player.id];

                        return (
                            <g key={`overlay-${line.player.id}`} style={{ transition: 'opacity 0.2s ease' }} opacity={isFaded ? 0.2 : 1}>
                                {line.segments.map((seg, sIdx) => seg.map((pt, i) => {
                                    if (!pt.isDot) return null;
                                    const isLastPt = (sIdx === line.segments.length - 1 && i === seg.length - 1);
                                    const shouldShowText = isHighlighted && (historyData.length <= 15 || i % 2 === 0 || isLastPt);
                                    
                                    const isSolidDebut = pt.isDebut && sIdx === 0 && i === 0;
                                    const rSize = isHighlighted ? cConf.ptR * 1.5 : cConf.ptR;
                                    const sWidth = isHighlighted ? 2.5 : 1.5;
                                    const debutR = isHighlighted ? cConf.debutR * 1.5 : cConf.debutR;

                                    return (
                                        <g key={`pt-${line.player.id}-${sIdx}-${i}`} className="group cursor-pointer" onClick={(e) => { e.stopPropagation(); setSelectedLineId(line.player.id === selectedLineId ? null : line.player.id); }} onMouseEnter={() => setHoveredLineId(line.player.id)} onMouseLeave={() => setHoveredLineId(null)}>
                                            <circle cx={pt.x} cy={pt.y} r={isSolidDebut ? debutR : rSize} fill={isSolidDebut ? line.color : "#0f172a"} stroke={line.color} strokeWidth={isSolidDebut ? 0 : sWidth} style={{ transition: 'r 0.2s ease, stroke-width 0.2s ease' }} />
                                            <text x={pt.x} y={pt.y - 12} fill={line.color} fontSize="12" fontWeight="900" textAnchor="middle" stroke="#000000" strokeWidth="4" paintOrder="stroke" className={shouldShowText ? "opacity-100" : "opacity-0 group-hover:opacity-100"}>{type === 'rank' ? `#${pt.val}` : Math.round(pt.val).toLocaleString()}</text>
                                            <circle cx={pt.x} cy={pt.y} r="20" fill="transparent" />
                                        </g>
                                    );
                                }))}

                                {/* Smart Physics: Disable dashed lines and spaced labels if viewing ALL points */}
                                {shouldShowLabel && (!isAll) && (Math.abs(adjY - endPt.y) > 2 || isDropped) && (
                                    <path d={`M ${endPt.x} ${endPt.y} C ${endPt.x + 15} ${endPt.y}, ${endPt.x + 10} ${adjY}, ${endPt.x + 20} ${adjY}`} fill="none" stroke={line.color} strokeWidth="1.5" opacity="0.5" strokeDasharray="4 4" style={{ transition: 'opacity 0.3s ease' }} />
                                )}

                                {shouldShowLabel && (
                                    <g transform={`translate(${endPt.x + (isAll ? 10 : 20)}, ${isAll ? endPt.y : adjY})`} className="cursor-pointer z-50" style={{ transition: 'opacity 0.3s ease, transform 0.3s ease' }} onClick={(e) => { e.stopPropagation(); onNavigate('players', line.player.id); }} onMouseEnter={() => setHoveredLineId(line.player.id)} onMouseLeave={() => setHoveredLineId(null)}>
                                        <rect x="0" y={-cConf.rectH/2} width={cConf.rectW} height={cConf.rectH} rx={cConf.rectH/2} fill="#000000" fillOpacity={isHighlighted ? "0.95" : (isDropped ? "0.5" : "0.7")} stroke={line.color} strokeWidth={isHighlighted ? 2 : 1} style={{ filter: isHighlighted ? `drop-shadow(0 0 10px ${line.color}60)` : 'none' }} />
                                        {line.player.imageUrl ? (
                                            <image href={line.player.imageUrl} x="4" y={-cConf.img/2} width={cConf.img} height={cConf.img} clipPath={`url(#clip-${type}-${line.player.id})`} preserveAspectRatio="xMidYMid slice" style={{ filter: isDropped && !isHighlighted ? 'grayscale(0.8)' : 'none' }} />
                                        ) : ( <circle cx={4 + cConf.img/2} cy="0" r={cConf.img/2} fill="#1e293b" /> )}
                                        <text x={4 + cConf.img + 6} y={cConf.font * 0.35} fill={isHighlighted ? "#ffffff" : (isDropped ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.8)")} fontSize={cConf.font} fontWeight="bold">{line.player.name}</text>
                                    </g>
                                )}
                            </g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
}

export function TopNationsChart({ globalHistory, playersRaw, onNavigate }) {
    const [, setTick] = useState(0);
    const [selectedCode, setSelectedCode] = useState(null);
    const [hoveredCode, setHoveredCode] = useState(null);

    useEffect(() => {
        const l = () => setTick(t => t + 1);
        __snbChartListeners.add(l);
        return () => __snbChartListeners.delete(l);
    }, []);

    const { windowSize, offset, layoutMode } = __snbSharedChartState;
    const isLogScale = layoutMode === 'logarithmic';

    const allHistory = globalHistory.filter(h => h.isMajorPlus);
    const N = allHistory.length;

    const maxOffset = windowSize === 'all' ? 0 : Math.max(0, N - windowSize);
    const safeOffset = Math.min(offset, maxOffset);
    const endIndex = N - safeOffset;
    const startIndex = windowSize === 'all' ? 0 : Math.max(0, endIndex - windowSize);
    const historyData = allHistory.slice(startIndex, endIndex);

    if (historyData.length < 1) return <p className="text-white/40 italic font-medium text-sm mt-4 text-center">Not enough Major+ tournament history.</p>;

    const NATION_COLORS = {
        'USA': '#38bdf8', 'GBR': '#f87171', 'AUS': '#facc15', 'FRA': '#60a5fa', 'GER': '#f8fafc', 'ITA': '#60a5fa', 'ESP': '#facc15', 'NED': '#fb923c', 'BRA': '#4ade80', 'ARG': '#7dd3fc', 'JPN': '#818cf8', 'CAN': '#ef4444', 'CHN': '#f43f5e', 'RUS': '#f87171', 'SWE': '#fde047', 'NOR': '#ef4444', 'MEX': '#22c55e', 'KOR': '#38bdf8', 'NZL': '#94a3b8', 'RSA': '#10b981', 'SUI': '#ef4444', 'BEL': '#ef4444', 'AUT': '#ef4444', 'POR': '#10b981', 'POL': '#f8fafc', 'CZE': '#38bdf8', 'CRO': '#f87171', 'SRB': '#ef4444', 'DEN': '#ef4444', 'FIN': '#38bdf8', 'IRL': '#4ade80', 'UKR': '#facc15'
    };
    const getNationColor = (code) => {
        if (NATION_COLORS[code]) return NATION_COLORS[code];
        let hash = 0; for (let i = 0; i < code.length; i++) hash = code.charCodeAt(i) + ((hash << 5) - hash);
        const p = Object.values(NATION_COLORS); return p[Math.abs(hash) % p.length];
    };

    const nationCodes = new Set();
    playersRaw.forEach(p => { if (p.nationality) nationCodes.add(p.nationality); });

    const width = 1200;
    const cConf = { gap: 20, font: 9, rectH: 20, rectW: 64, ptR: 3, debutR: 4, stroke: 2 };    
    const plotHeight = 480; 
    const pad = { top: 40, right: 140, left: 80, bottom: 40 }; 
    const gridBottomY = pad.top + plotHeight;

    let maxPointsVal = 10;
    const rawNationTimelines = {};

    Array.from(nationCodes).forEach(code => {
        rawNationTimelines[code] = [];
        for (let k = 0; k < historyData.length; k++) {
            let pts = 0;
            historyData[k].standings?.forEach(s => {
                const p = playersRaw.find(x => x.id === s.id);
                if (p && p.nationality === code && !p.retired) pts += s.pts;
            });
            rawNationTimelines[code].push({ k, val: pts });
            if (pts > maxPointsVal) maxPointsVal = pts;
        }
    });
    maxPointsVal = Math.ceil(maxPointsVal * 1.05);

    const nationDebuts = {};
    Array.from(nationCodes).forEach(code => {
        for (let i = 0; i < allHistory.length; i++) {
            let hasPoints = false;
            allHistory[i].standings?.forEach(s => {
                const p = playersRaw.find(x => x.id === s.id);
                if (p && p.nationality === code && !p.retired) hasPoints = true;
            });
            if (hasPoints) { nationDebuts[code] = allHistory[i].id; break; }
        }
    });

    const getX = (i) => historyData.length <= 1 ? (pad.left + (width - pad.left - pad.right) / 2) : pad.left + (i * ((width - pad.left - pad.right) / (historyData.length - 1)));
    const getY = (val) => {
        if (isLogScale && val > 0) return getLogY(val, maxPointsVal, 10, plotHeight, gridBottomY);
        return gridBottomY - (val / Math.max(1, maxPointsVal)) * plotHeight;
    };

    const lines = [];
    Array.from(nationCodes).forEach(code => {
        const timeline = rawNationTimelines[code];
        const segments = []; let currentSeg = [];

        timeline.forEach((pt, i) => {
            const isDebut = pt.val > 0 && nationDebuts[code] === historyData[pt.k].id;
            const mappedPt = { ...pt, x: getX(pt.k), y: getY(pt.val), isDot: true, isDebut };
            if (pt.val > 0 || (i > 0 && timeline[i-1].val > 0)) { currentSeg.push(mappedPt); } 
            else if (currentSeg.length > 0) { segments.push(currentSeg); currentSeg = []; }
        });
        if (currentSeg.length > 0) segments.push(currentSeg);
        if (segments.length > 0) {
            const paths = segments.map(seg => seg.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`).join(' '));
            lines.push({ code, segments, paths, color: getNationColor(code) });
        }
    });

    const labels = [];
    lines.forEach(line => {
        const endPt = line.segments[line.segments.length - 1].slice(-1)[0];
        labels.push({ id: line.code, endX: endPt.x, endY: endPt.y, actualVal: endPt.val, line });
    });
    labels.sort((a, b) => b.actualVal - a.actualVal);

    const physicsGap = cConf.gap * 0.8;
    if (labels.length > 0) {
        labels[0].currentY = labels[0].endY;
        for (let i = 1; i < labels.length; i++) labels[i].currentY = Math.max(labels[i].endY, labels[i-1].currentY + physicsGap);
        if (labels[labels.length - 1].currentY > gridBottomY) {
            labels[labels.length - 1].currentY = gridBottomY;
            for (let i = labels.length - 2; i >= 0; i--) labels[i].currentY = Math.min(labels[i].currentY, labels[i+1].currentY - physicsGap);
        }
    }

    const sortedLines = [...lines].sort((a, b) => {
        const aH = a.code === selectedCode || a.code === hoveredCode, bH = b.code === selectedCode || b.code === hoveredCode;
        if (aH && !bH) return 1; if (!aH && bH) return -1;
        const aL = labels.find(l => l.id === a.code), bL = labels.find(l => l.id === b.code);
        return bL.actualVal - aL.actualVal;
    });

    return (
        <div className="w-full">
            <div className="flex flex-wrap gap-4 items-center justify-between mb-6 bg-black/20 backdrop-blur-md p-3 rounded-2xl border border-white/5 shadow-inner">
                <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-1.5 bg-black/40 p-1.5 rounded-xl border border-white/5 shadow-inner">
                        <span className="text-[10px] text-white/30 uppercase tracking-widest font-black px-2 hidden sm:block">Window</span>
                        {[10, 20, 50, 'all'].map(ws => (
                            <button key={ws} onClick={() => updateSnbChartState({ windowSize: ws, offset: 0 })}
                                className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${windowSize === ws ? 'bg-gold-500 text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'bg-transparent text-white/50 hover:text-white hover:bg-white/10'}`}>
                                {ws === 'all' ? 'All Time' : ws}
                            </button>
                        ))}
                    </div>
                    {windowSize !== 'all' && (
                        <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-xl border border-white/5 shadow-inner">
                            <button onClick={() => updateSnbChartState({ offset: Math.min(maxOffset, safeOffset + windowSize) })} disabled={safeOffset >= maxOffset} className="p-1 hover:bg-white/10 text-white/50 hover:text-white rounded-lg disabled:opacity-30 transition-colors"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg></button>
                            <span className="text-xs font-bold text-white/70 w-28 text-center tabular-nums">{startIndex + 1} - {endIndex} of {N}</span>
                            <button onClick={() => updateSnbChartState({ offset: Math.max(0, safeOffset - windowSize) })} disabled={safeOffset <= 0} className="p-1 hover:bg-white/10 text-white/50 hover:text-white rounded-lg disabled:opacity-30 transition-colors"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg></button>
                        </div>
                    )}
                    <div className="w-px h-6 bg-white/10 hidden lg:block"></div>
                    <div className="flex items-center gap-1.5 bg-black/40 p-1.5 rounded-xl border border-white/5 shadow-inner">
                        <button onClick={() => updateSnbChartState({ layoutMode: 'linear' })} className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${!isLogScale ? 'bg-gold-500 text-black shadow-sm' : 'bg-transparent text-white/50 hover:text-white hover:bg-white/10'}`}>Linear</button>
                        <button onClick={() => updateSnbChartState({ layoutMode: 'logarithmic' })} className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${isLogScale ? 'bg-gold-500 text-black shadow-sm' : 'bg-transparent text-white/50 hover:text-white hover:bg-white/10'}`}>Logarithmic</button>
                    </div>
                </div>
                {selectedCode && <button onClick={() => setSelectedCode(null)} className="text-xs font-black uppercase tracking-widest text-rose-400 hover:text-rose-300 px-4 py-2 bg-rose-500/10 rounded-xl border border-rose-500/20 transition-colors shadow-sm">Clear Selection</button>}
            </div>
            
            <div className="w-full bg-black/20 rounded-3xl border border-white/5 pt-4 pb-2 relative overflow-x-auto select-none custom-scrollbar" onClick={() => setSelectedCode(null)}>
                <svg viewBox={`0 0 ${width} ${gridBottomY + pad.bottom}`} style={{ minWidth: `800px`, transition: 'viewBox 0.3s ease' }} className="w-full h-auto overflow-visible font-sans">
                    {(() => {
                        let yLines = [];
                        if (isLogScale) {
                            yLines = [0];
                            const maxPow = Math.ceil(Math.log10(maxPointsVal));
                            for (let i = 1; i <= maxPow; i++) yLines.push(Math.pow(10, i));
                        } else {
                            const rawStep = maxPointsVal / (windowSize === 'all' ? 20 : 15);
                            const mag = Math.pow(10, Math.floor(Math.log10(rawStep || 1)));
                            const step = Math.max(100, Math.ceil(rawStep / mag) * mag);
                            yLines = [0]; for(let v = step; v <= maxPointsVal; v += step) yLines.push(v);
                        }
                        return yLines.map((p, i) => (
                            <g key={`grid-${i}`}>
                                <line x1={pad.left} y1={getY(p)} x2={width - pad.right + 20} y2={getY(p)} stroke={p === 0 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.05)"} strokeWidth={p === 0 ? "2" : "1.5"} strokeDasharray={p === 0 ? "none" : "4 4"} />
                                <text x={pad.left - 15} y={getY(p)} fill="rgba(255,255,255,0.3)" fontSize="12" fontWeight="bold" textAnchor="end" alignmentBaseline="middle">{p === 0 ? 0 : Math.round(p).toLocaleString()}</text>
                            </g>
                        ));
                    })()}
                    
                    {sortedLines.map((line) => {
                        const isHighlighted = selectedCode === line.code || hoveredCode === line.code;
                        const isFaded = (selectedCode || hoveredCode) && !isHighlighted;
                        return line.paths.map((pStr, pIdx) => (
                            <path key={`path-${line.code}-${pIdx}`} d={pStr} fill="none" stroke={line.color} strokeWidth={isHighlighted ? cConf.stroke * 2.5 : cConf.stroke} opacity={isFaded ? 0.15 : 0.9} strokeLinejoin="round" strokeLinecap="round" className="cursor-pointer" onClick={(e) => { e.stopPropagation(); setSelectedCode(line.code === selectedCode ? null : line.code); }} onMouseEnter={() => setHoveredCode(line.code)} onMouseLeave={() => setHoveredCode(null)} style={{ filter: isHighlighted ? `drop-shadow(0 0 6px ${line.color}60)` : 'none' }} />
                        ));
                    })}
                    
                    {sortedLines.map((line) => {
                        const isHighlighted = selectedCode === line.code || hoveredCode === line.code;
                        const isFaded = (selectedCode || hoveredCode) && !isHighlighted;
                        const lObj = labels.find(l => l.id === line.code);

                        return (
                            <g key={`overlay-${line.code}`} style={{ transition: 'opacity 0.2s ease' }} opacity={isFaded ? 0.2 : 1}>
                                {line.segments.map((seg, sIdx) => seg.map((pt, i) => {
                                    const isLastPt = (sIdx === line.segments.length - 1 && i === seg.length - 1);
                                    const shouldShowText = isHighlighted && (historyData.length <= 15 || i % 2 === 0 || isLastPt);
                                    
                                    const isSolidDebut = pt.isDebut && sIdx === 0 && i === 0;
                                    const rSize = isHighlighted ? "3" : "2";
                                    const debutR = isHighlighted ? "4.5" : "3.5";
                                    const sWidth = isHighlighted ? 2.5 : 1.5;
                                    
                                    return (
                                        <g key={`pt-${line.code}-${sIdx}-${i}`} className="group cursor-pointer" onClick={(e) => { e.stopPropagation(); setSelectedCode(line.code === selectedCode ? null : line.code); }} onMouseEnter={() => setHoveredCode(line.code)} onMouseLeave={() => setHoveredCode(null)}>
                                            <circle cx={pt.x} cy={pt.y} r={isSolidDebut ? debutR : rSize} fill={isSolidDebut ? line.color : "#0f172a"} stroke={line.color} strokeWidth={isSolidDebut ? 0 : sWidth} />
                                            <text x={pt.x} y={pt.y - 12} fill={line.color} fontSize="12" fontWeight="900" textAnchor="middle" stroke="#000000" strokeWidth="4" paintOrder="stroke" className={shouldShowText ? "opacity-100" : "opacity-0 group-hover:opacity-100"}>{Math.round(pt.val).toLocaleString()}</text>
                                            <circle cx={pt.x} cy={pt.y} r="20" fill="transparent" />
                                        </g>
                                    );
                                }))}
                                
                                {(Math.abs(lObj.currentY - lObj.endY) > 2) && <path d={`M ${lObj.endX} ${lObj.endY} C ${lObj.endX + 15} ${lObj.endY}, ${lObj.endX + 10} ${lObj.currentY}, ${lObj.endX + 20} ${lObj.currentY}`} fill="none" stroke={line.color} strokeWidth="1.5" opacity="0.4" strokeDasharray="3 3" />}
                                
                                <g transform={`translate(${lObj.endX + 20}, ${lObj.currentY})`} className="cursor-pointer" onClick={(e) => { e.stopPropagation(); onNavigate('nations', null, null, line.code); }} onMouseEnter={() => setHoveredCode(line.code)} onMouseLeave={() => setHoveredCode(null)}>
                                    <rect x="0" y={-cConf.rectH/2} width={cConf.rectW} height={cConf.rectH} rx={cConf.rectH/2} fill="#000000" fillOpacity={isHighlighted ? "0.9" : "0.7"} stroke={line.color} strokeWidth={isHighlighted ? 2 : 1} style={{ filter: isHighlighted ? `drop-shadow(0 0 10px ${line.color}60)` : 'none' }} />
                                    <text x={6} y={cConf.font * 0.35} fontSize={12}>{getFlag(line.code)}</text>
                                    <text x={24} y={cConf.font * 0.35} fill={isHighlighted ? "#ffffff" : "rgba(255,255,255,0.8)"} fontSize={cConf.font} fontWeight="bold">{line.code}</text>
                                </g>
                            </g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
}

export function NationPointsChart({ code, globalHistory, playersRaw, onNavigate }) {
    const [, setTick] = useState(0);
    const [selectedId, setSelectedId] = useState(null);
    const [hoveredId, setHoveredId] = useState(null);
    
    const [showTotal, setShowTotal] = useState(false);
    const [showAvg, setShowAvg] = useState(true);

    useEffect(() => {
        const l = () => setTick(t => t + 1);
        __snbChartListeners.add(l);
        return () => __snbChartListeners.delete(l);
    }, []);

    const { windowSize, offset, layoutMode } = __snbSharedChartState;
    const isLogScale = layoutMode === 'logarithmic';

    const allHistory = globalHistory.filter(h => h.isMajorPlus);
    const N = allHistory.length;

    const maxOffset = windowSize === 'all' ? 0 : Math.max(0, N - windowSize);
    const safeOffset = Math.min(offset, maxOffset);
    const endIndex = N - safeOffset;
    const startIndex = windowSize === 'all' ? 0 : Math.max(0, endIndex - windowSize);
    const historyData = allHistory.slice(startIndex, endIndex);

    if (historyData.length < 1) return null;

    const NATION_COLORS = {
        'USA': '#38bdf8', 'GBR': '#f87171', 'AUS': '#facc15', 'FRA': '#60a5fa', 'GER': '#f8fafc', 'ITA': '#60a5fa', 'ESP': '#facc15', 'NED': '#fb923c', 'BRA': '#4ade80', 'ARG': '#7dd3fc', 'JPN': '#818cf8', 'CAN': '#ef4444', 'CHN': '#f43f5e', 'RUS': '#f87171', 'SWE': '#fde047', 'NOR': '#ef4444', 'MEX': '#22c55e', 'KOR': '#38bdf8', 'NZL': '#94a3b8', 'RSA': '#10b981', 'SUI': '#ef4444', 'BEL': '#ef4444', 'AUT': '#ef4444', 'POR': '#10b981', 'POL': '#f8fafc', 'CZE': '#38bdf8', 'CRO': '#f87171', 'SRB': '#ef4444', 'DEN': '#ef4444', 'FIN': '#38bdf8', 'IRL': '#4ade80', 'UKR': '#facc15'
    };
    const nationColor = NATION_COLORS[code] || '#facc15';

    const playerDebuts = {};
    allHistory.forEach(h => h.standings?.forEach(s => { if (!playerDebuts[s.id]) playerDebuts[s.id] = h.id; }));

    const allNationPlayerIds = new Set();
    historyData.forEach(h => h.standings?.forEach(s => {
        const p = playersRaw.find(x => x.id === s.id);
        if (p && p.nationality === code) allNationPlayerIds.add(s.id);
    }));

    const width = 1200;
    const LABEL_GAP = 20; 
    const plotHeight = 450;
    
    const pad = { top: 40, right: 180, left: 80, bottom: 40 }; 
    const gridBottomY = pad.top + plotHeight;

    const timelines = { total: [], avg: [] };
    Array.from(allNationPlayerIds).forEach(pid => timelines[pid] = []);

    for (let k = 0; k < historyData.length; k++) {
        let stepTotal = 0;
        let activeCount = 0;
        
        historyData[k].standings?.forEach(s => {
            if (allNationPlayerIds.has(s.id)) {
                timelines[s.id].push({ k, val: s.pts });
                stepTotal += s.pts;
                if (s.pts > 0) activeCount++;
            }
        });
        
        Array.from(allNationPlayerIds).forEach(pid => {
            if (timelines[pid].length === k) timelines[pid].push({ k, val: 0 });
        });
        
        timelines.total.push({ k, val: stepTotal });
        timelines.avg.push({ k, val: stepTotal / Math.max(1, activeCount) });
    }

    let maxPointsVal = 10;
    if (showTotal) maxPointsVal = Math.max(maxPointsVal, ...timelines.total.map(t => t.val));
    if (showAvg) maxPointsVal = Math.max(maxPointsVal, ...timelines.avg.map(t => t.val));
    Array.from(allNationPlayerIds).forEach(pid => {
        maxPointsVal = Math.max(maxPointsVal, ...timelines[pid].map(t => t.val));
    });
    maxPointsVal = Math.ceil(maxPointsVal * 1.05);

    const getX = (i) => historyData.length <= 1 ? (pad.left + (width - pad.left - pad.right) / 2) : pad.left + (i * ((width - pad.left - pad.right) / (historyData.length - 1)));
    const getY = (val) => {
        if (isLogScale && val > 0) return getLogY(val, maxPointsVal, 10, plotHeight, gridBottomY);
        return gridBottomY - (val / Math.max(1, maxPointsVal)) * plotHeight;
    };

    const lines = [];
    
    if (showTotal) {
        const tSegs = []; let cSeg = [];
        timelines.total.forEach((pt, i) => {
            const mapped = { ...pt, x: getX(pt.k), y: getY(pt.val), isDot: true };
            if (pt.val > 0) cSeg.push(mapped); else if (cSeg.length > 0) { tSegs.push(cSeg); cSeg = []; }
        });
        if (cSeg.length > 0) tSegs.push(cSeg);
        if (tSegs.length > 0) lines.push({ id: 'total', name: 'National Total', color: nationColor, isTotal: true, paths: tSegs.map(seg => seg.map((pt, i) => `${i===0?'M':'L'} ${pt.x} ${pt.y}`).join(' ')), segments: tSegs });
    }

    if (showAvg) {
        const aSegs = []; let aCSeg = [];
        timelines.avg.forEach((pt, i) => {
            const mapped = { ...pt, x: getX(pt.k), y: getY(pt.val), isDot: true };
            if (pt.val > 0) aCSeg.push(mapped); else if (aCSeg.length > 0) { aSegs.push(aCSeg); aCSeg = []; }
        });
        if (aCSeg.length > 0) aSegs.push(aCSeg);
        // FIX: isTotal changed to false so the average line is not overly thick
        if (aSegs.length > 0) lines.push({ id: 'avg', name: 'Player Average', color: '#cbd5e1', isTotal: false, isAvg: true, paths: aSegs.map(seg => seg.map((pt, i) => `${i===0?'M':'L'} ${pt.x} ${pt.y}`).join(' ')), segments: aSegs });
    }

    Array.from(allNationPlayerIds).forEach(pid => {
        const p = playersRaw.find(x => x.id === pid);
        const pSegs = []; let pCSeg = [];
        timelines[pid].forEach((pt, i) => {
            const isDebut = pt.val > 0 && playerDebuts[pid] === historyData[pt.k].id;
            const mapped = { ...pt, x: getX(pt.k), y: getY(pt.val), isDot: true, isDebut };
            if (pt.val > 0) pCSeg.push(mapped); else if (pCSeg.length > 0) { pSegs.push(pCSeg); pCSeg = []; }
        });
        if (pCSeg.length > 0) pSegs.push(pCSeg);
        if (pSegs.length > 0) lines.push({ id: pid, name: p.name, img: p.imageUrl, color: nationColor, isTotal: false, paths: pSegs.map(seg => seg.map((pt, i) => `${i===0?'M':'L'} ${pt.x} ${pt.y}`).join(' ')), segments: pSegs, retired: !!p.retired });
    });

    const labels = [];
    lines.forEach(line => {
        const endPt = line.segments[line.segments.length - 1].slice(-1)[0];
        labels.push({ id: line.id, endX: endPt.x, endY: endPt.y, actualVal: endPt.val, line });
    });
    
    const columns = [];
    labels.forEach(l => {
        let placed = false;
        for (let c of columns) { if (Math.abs(c.x - l.endX) < 10) { c.labels.push(l); placed = true; break; } }
        if (!placed) columns.push({ x: l.endX, labels: [l] });
    });

    columns.forEach(col => {
        const colLabels = col.labels;
        colLabels.sort((a,b) => b.actualVal - a.actualVal);
        if (colLabels.length > 0) {
            colLabels[0].currentY = colLabels[0].endY;
            for (let i = 1; i < colLabels.length; i++) colLabels[i].currentY = Math.max(colLabels[i].endY, colLabels[i-1].currentY + LABEL_GAP);
            if (colLabels[colLabels.length - 1].currentY > gridBottomY) {
                colLabels[colLabels.length - 1].currentY = gridBottomY;
                for (let i = colLabels.length - 2; i >= 0; i--) colLabels[i].currentY = Math.min(colLabels[i].currentY, colLabels[i+1].currentY - LABEL_GAP);
            }
        }
    });

    const sortedLines = [...lines].sort((a, b) => {
        const aH = a.id === selectedId || a.id === hoveredId, bH = b.id === selectedId || b.id === hoveredId;
        if (aH && !bH) return 1; if (!aH && bH) return -1;
        const aL = labels.find(l => l.id === a.id), bL = labels.find(l => l.id === b.id);
        return bL.actualVal - aL.actualVal;
    });

    return (
        <div className="w-full bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] mb-8" id="nation-chart">
            <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
                <h3 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight"><AnalyticsIcon size={24} className="text-white/40"/> Internal Progression</h3>
                
                <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-1.5 bg-black/40 p-1.5 rounded-xl border border-white/5 shadow-inner">
                        <span className="text-[10px] text-white/30 uppercase tracking-widest font-black px-2 hidden sm:block">Window</span>
                        {[10, 20, 50, 'all'].map(ws => (
                            <button key={ws} onClick={() => updateSnbChartState({ windowSize: ws, offset: 0 })} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${windowSize === ws ? 'bg-gold-500 text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'bg-transparent text-white/50 hover:text-white hover:bg-white/10'}`}>
                                {ws === 'all' ? 'All' : ws}
                            </button>
                        ))}
                    </div>
                    {windowSize !== 'all' && (
                        <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-xl border border-white/5 shadow-inner">
                            <button onClick={() => updateSnbChartState({ offset: Math.min(maxOffset, safeOffset + windowSize) })} disabled={safeOffset >= maxOffset} className="p-1 hover:bg-white/10 text-white/50 hover:text-white rounded-lg disabled:opacity-30 transition-colors"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg></button>
                            <span className="text-[10px] font-bold text-white/70 w-20 text-center tabular-nums">{startIndex + 1} - {endIndex} of {N}</span>
                            <button onClick={() => updateSnbChartState({ offset: Math.max(0, safeOffset - windowSize) })} disabled={safeOffset <= 0} className="p-1 hover:bg-white/10 text-white/50 hover:text-white rounded-lg disabled:opacity-30 transition-colors"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg></button>
                        </div>
                    )}
                    <div className="w-px h-6 bg-white/10 hidden lg:block"></div>
                    <div className="flex items-center gap-1.5 bg-black/40 p-1.5 rounded-xl border border-white/5 shadow-inner">
                        <button onClick={() => updateSnbChartState({ layoutMode: 'linear' })} className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${!isLogScale ? 'bg-gold-500 text-black shadow-sm' : 'bg-transparent text-white/50 hover:text-white hover:bg-white/10'}`}>Linear</button>
                        <button onClick={() => updateSnbChartState({ layoutMode: 'logarithmic' })} className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${isLogScale ? 'bg-gold-500 text-black shadow-sm' : 'bg-transparent text-white/50 hover:text-white hover:bg-white/10'}`}>Logarithmic</button>
                    </div>
                    <div className="w-px h-6 bg-white/10 hidden lg:block"></div>
                    <div className="flex items-center gap-1.5 bg-black/40 p-1.5 rounded-xl border border-white/5 shadow-inner">
                        <span className="text-[10px] text-white/30 uppercase tracking-widest font-black px-2 hidden sm:block">Lines</span>
                        <button onClick={() => setShowTotal(!showTotal)} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${showTotal ? 'bg-white/20 text-white shadow-sm' : 'bg-transparent text-white/40 hover:text-white hover:bg-white/10'}`}>Total</button>
                        <button onClick={() => setShowAvg(!showAvg)} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${showAvg ? 'bg-white/20 text-white shadow-sm' : 'bg-transparent text-white/40 hover:text-white hover:bg-white/10'}`}>Average</button>
                    </div>
                </div>
                {selectedId && <button onClick={() => setSelectedId(null)} className="text-xs font-black uppercase tracking-widest text-rose-400 hover:text-rose-300 px-4 py-2 bg-rose-500/10 rounded-xl border border-rose-500/20 transition-colors shadow-sm">Clear Selection</button>}
            </div>
            
            <div className="w-full bg-black/20 rounded-3xl border border-white/5 pt-4 pb-2 relative overflow-x-auto select-none custom-scrollbar" onClick={() => setSelectedId(null)}>
                <svg viewBox={`0 0 ${width} ${gridBottomY + pad.bottom}`} style={{ minWidth: `800px`, transition: 'viewBox 0.3s ease' }} className="w-full h-auto overflow-visible font-sans">
                    {(() => {
                        let yLines = [];
                        if (isLogScale) {
                            yLines = [0];
                            const maxPow = Math.ceil(Math.log10(maxPointsVal));
                            for (let i = 1; i <= maxPow; i++) yLines.push(Math.pow(10, i));
                        } else {
                            const rawStep = maxPointsVal / 12;
                            const mag = Math.pow(10, Math.floor(Math.log10(rawStep || 1)));
                            const step = Math.max(10, Math.ceil(rawStep / mag) * mag);
                            yLines = [0]; for(let v=step; v<=maxPointsVal; v+=step) yLines.push(v);
                        }
                        return yLines.map((p, i) => (
                            <g key={`g-${i}`}>
                                <line x1={pad.left} y1={getY(p)} x2={width - pad.right + 20} y2={getY(p)} stroke={p === 0 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.05)"} strokeWidth={p === 0 ? "2" : "1.5"} strokeDasharray={p === 0 ? "none" : "4 4"} />
                                <text x={pad.left - 15} y={getY(p)} fill="rgba(255,255,255,0.3)" fontSize="11" fontWeight="bold" textAnchor="end" alignmentBaseline="middle">{p === 0 ? 0 : Math.round(p).toLocaleString()}</text>
                            </g>
                        ));
                    })()}

                    {sortedLines.map(line => {
                        const isHighlighted = selectedId === line.id || hoveredId === line.id;
                        const isFaded = (selectedId || hoveredId) && !isHighlighted;
                        return line.paths.map((pStr, pIdx) => (
                            <path key={`p-${line.id}-${pIdx}`} d={pStr} fill="none" stroke={line.color} strokeDasharray={line.isAvg ? "6 4" : "none"} strokeWidth={line.isTotal ? 4 : (isHighlighted ? 3 : 1.5)} opacity={isFaded ? 0.15 : (line.isTotal ? 1 : 0.6)} strokeLinejoin="round" className="cursor-pointer" onClick={(e) => { e.stopPropagation(); setSelectedId(line.id === selectedId ? null : line.id); }} onMouseEnter={() => setHoveredId(line.id)} onMouseLeave={() => setHoveredId(null)} style={{ filter: isHighlighted ? `drop-shadow(0 0 6px ${line.color}60)` : 'none' }} />
                        ));
                    })}

                    {sortedLines.map(line => {
                        const lObj = labels.find(l => l.id === line.id);
                        const isHighlighted = selectedId === line.id || hoveredId === line.id;
                        const isFaded = (selectedId || hoveredId) && !isHighlighted;
                        
                        // Decide label visibility, but DO NOT return null here so ALL dots still render!
                        const shouldShowLabel = line.isTotal || line.isAvg || isHighlighted;

                        return (
                            <g key={`o-${line.id}`} opacity={isFaded ? 0.2 : 1} style={{ transition: 'opacity 0.2s ease' }}>
                                {/* 1. Render all the dots for this line */}
                                {line.segments.map((seg, sI) => seg.map((pt, i) => {
                                    const isSolidDebut = pt.isDebut && sI === 0 && i === 0;
                                    const r = line.isTotal ? 3.5 : (isHighlighted ? 3 : 2);
                                    const debutR = line.isTotal ? 4.5 : (isHighlighted ? 4 : 3);
                                    const sWidth = isHighlighted ? 2.5 : 1.5;

                                    return (
                                        <g key={`d-${line.id}-${sI}-${i}`} className="group cursor-pointer" onClick={(e) => { e.stopPropagation(); setSelectedId(line.id === selectedId ? null : line.id); }} onMouseEnter={() => setHoveredId(line.id)} onMouseLeave={() => setHoveredId(null)}>
                                            <circle cx={pt.x} cy={pt.y} r={isSolidDebut ? debutR : r} fill={isSolidDebut ? line.color : "#0f172a"} stroke={line.color} strokeWidth={isSolidDebut ? 0 : sWidth} />
                                            <circle cx={pt.x} cy={pt.y} r="20" fill="transparent" />
                                            <title>{`${line.name}: ${Math.round(pt.val).toLocaleString()}`}</title>
                                        </g>
                                    );
                                }))}
                                
                                {/* 2. Render the label ONLY if shouldShowLabel is true */}
                                {shouldShowLabel && (
                                    <g transform={`translate(${lObj.endX + 20}, ${
                                            (line.isAvg || line.isTotal || isHighlighted)
                                                ? lObj.endY
                                                : lObj.currentY
                                        })`} className="cursor-pointer" onClick={(e) => { if (!line.isTotal && !line.isAvg) { e.stopPropagation(); onNavigate('players', line.id); } }} onMouseEnter={() => setHoveredId(line.id)} onMouseLeave={() => setHoveredId(null)}>
                                        <rect x="0" y={-11} width={140} height={22} rx={11} fill="#000000" fillOpacity={isHighlighted ? "0.95" : "0.7"} stroke={line.color} strokeWidth={line.isTotal || isHighlighted ? 2 : 1} style={{ filter: isHighlighted ? `drop-shadow(0 0 10px ${line.color}60)` : 'none' }} />
                                        
                                        {line.isTotal || line.isAvg ? <circle cx="11" cy="0" r="4" fill={line.color} /> : (line.img ? <image href={line.img} x="4" y="-7" width={14} height={14} preserveAspectRatio="xMidYMid slice" clipPath={`url(#clip-nat-${line.id})`} /> : <circle cx="11" cy="0" r="7" fill="#1e293b"/>)}
                                        {line.img && <defs><clipPath id={`clip-nat-${line.id}`}><circle cx="11" cy="0" r="7" /></clipPath></defs>}
                                        
                                        <text x={26} y={4} fill={line.isTotal || line.isAvg ? line.color : "#ffffff"} fontSize={10} fontWeight="bold">{line.name}</text>
                                    </g>
                                )}
                            </g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
}