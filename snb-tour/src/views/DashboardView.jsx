import React, { useState, useMemo } from 'react';
import { SectionHeader, GlassDropdown } from '../components/SharedUI';
import { PlayerDataGrid } from '../components/PlayerDataGrid';
import { calculatePlayerRankings, getGlobalHistory, attachDiffsAndForm } from '../utils/helpers';
import { COUNTRIES } from '../utils/constants';

export function DashboardView({ playersRaw, tournaments, onSelectPlayer, players }) {
    const [asOfId, setAsOfId] = useState('');
    const [filterCountry, setFilterCountry] = useState('All');

    const { processedPlayers } = useMemo(() => {
        const targetT = asOfId ? tournaments.find(t => t.id === asOfId) : null;
        const completedAsc = tournaments.filter(t => t.status === 'completed').sort((a, b) => (a.completedAt || 0) - (b.completedAt || 0));
        const filteredTournaments = targetT 
            ? completedAsc.filter(t => (t.completedAt || 0) <= (targetT.completedAt || 0))
            : completedAsc;
        
        const rankedPlayers = calculatePlayerRankings(playersRaw, filteredTournaments);
        const globalHist = getGlobalHistory(playersRaw, filteredTournaments);

        // Assign absolute global rank before any filtering
        rankedPlayers.forEach((p, i) => { if (!p.retired) p.currentRank = i + 1; });

        let filteredList = rankedPlayers;
        if (filterCountry !== 'All') {
            filteredList = filteredList.filter(p => p.nationality === filterCountry);
        }

        const listWithDiffs = attachDiffsAndForm(filteredList, globalHist);

        // Calculate Peaks for retirees
        const finalPlayers = listWithDiffs.map(p => {
            if (!p.retired) return p;
            let peakRank = 9999, peakPoints = 0;
            globalHist.forEach(h => {
                const s = h.standings?.find(st => st.id === p.id);
                if (s) {
                    if (s.rank > 0 && s.rank < peakRank) peakRank = s.rank;
                    if (s.pts > peakPoints) peakPoints = s.pts;
                }
            });
            return { ...p, peakRank: peakRank === 9999 ? '-' : peakRank, peakPoints: peakPoints || p.points };
        });

        return { processedPlayers: finalPlayers };
    }, [playersRaw, tournaments, asOfId, filterCountry]);

    // Options for the Country Filter
    const activeCodes = Array.from(new Set(playersRaw.map(p => p.nationality))).filter(Boolean);
    const countryOptions = [
        { value: 'All', label: 'All', searchKey: 'all nations everywhere' },
        ...COUNTRIES.filter(c => activeCodes.includes(c.code)).map(c => ({
            value: c.code,
            label: `${c.flag} ${c.name}`,
            searchKey: `${c.name} ${c.code}`,
            renderLabel: <span className="flex items-center gap-2"><span className="text-lg">{c.flag}</span> <span className="truncate">{c.name}</span></span>,
            renderOption: <span className="flex items-center gap-3"><span className="text-lg">{c.flag}</span> <span className="font-medium text-sm truncate">{c.name}</span></span>
        }))
    ];

    // Options for Date History
    const historyOptions = [
        { value: '', label: 'Live', searchKey: 'live current today' },
        ...tournaments.filter(t => t.status === 'completed').sort((a,b) => b.completedAt - a.completedAt).map(t => ({
            value: t.id,
            label: `As of: ${t.name}`,
            searchKey: t.name,
            renderOption: (
                <div className="flex flex-col w-full">
                    <span className="font-medium text-sm truncate">{t.name}</span>
                    <span className="text-[10px] text-white/40 mt-0.5 tracking-wider uppercase">{new Date(t.completedAt).toLocaleDateString()}</span>
                </div>
            )
        }))
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-20">
            <SectionHeader 
                title="SNB Rankings" 
                subtitle="Based on the last 20 SNB Major+ tournaments."
                rightContent={
                    <>
                        <GlassDropdown value={filterCountry} onChange={setFilterCountry} options={countryOptions} placeholder="All" hasSearch={true} />
                        <GlassDropdown value={asOfId} onChange={setAsOfId} options={historyOptions} placeholder="Live" hasSearch={true} />
                    </>
                }
            />
            <PlayerDataGrid 
                players={processedPlayers} 
                tournaments={tournaments} 
                onSelectPlayer={onSelectPlayer}
                onNavigate={() => {}}
                rankKey="currentRank"
                showNationality={true}
            />
        </div>
    );
}