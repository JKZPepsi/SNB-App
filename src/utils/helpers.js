import { COUNTRIES, TOURNAMENT_TIERS, ROUND_NAMES } from './constants';

// --- HIGH PERFORMANCE CACHING ENGINE ---
// This prevents the app from parsing JSON and calculating match results 250,000 times per render!
const jsonCache = new WeakMap();
const resultCache = new WeakMap();

const getParsed = (obj, key, fallback) => {
    if (!obj || typeof obj[key] !== 'string') return obj?.[key] || fallback;
    if (!jsonCache.has(obj)) jsonCache.set(obj, {});
    const cache = jsonCache.get(obj);
    if (cache[key]) return cache[key];
    try { cache[key] = JSON.parse(obj[key]); return cache[key]; } 
    catch(e) { return fallback; }
};

export const getFlag = (code) => COUNTRIES.find(c => c.code === code)?.flag || '🏳️';
export const getCountryName = (code) => COUNTRIES.find(c => c.code === code)?.name || code || 'Unknown';
export const getOrdinalSuffix = (n) => n + (["th", "st", "nd", "rd"][(n % 100 - 20) % 10] || ["th", "st", "nd", "rd"][n % 100] || "th");

export const getDrawSize = (t) => {
    if (t.format === 'atp_finals') return 8;
    const bracket = getParsed(t, 'bracket', []);
    if (!bracket || !Array.isArray(bracket) || !bracket.length) return 32;
    
    const firstRoundSize = bracket[0]?.length || 16;
    if (firstRoundSize === 32) return 64;
    if (firstRoundSize === 16) return 32;
    if (firstRoundSize === 8) return 16;
    if (firstRoundSize === 4) return 8;
    return 32;
};

export const getTournamentTier = (t) => {
    if (!t) return 'pro';
    if (t.format === 'atp_finals') return 'finals';
    const rawTier = t.tier || 'pro';
    if (rawTier === 'grand_slam') {
        const size = getDrawSize(t);
        if (size < 64) return 'major';
    }
    return rawTier;
};

export const getSeedText = (t, pid) => {
    if (!t || !t.selectedPlayers || !pid) return '';
    const idx = t.selectedPlayers.indexOf(pid);
    if (idx === -1) return '';
    
    // THE FIX: Count the actual array length instead of guessing!
    const actualSize = t.selectedPlayers.length; 
    let numSeeds = 0;
    
    if (t.format === 'atp_finals') numSeeds = 8;
    else if (actualSize >= 128) numSeeds = 32; 
    else if (actualSize >= 64) numSeeds = 16;
    else if (actualSize >= 32) numSeeds = 8;
    else if (actualSize >= 16) numSeeds = 4;
    else if (actualSize >= 8) numSeeds = 2;
    
    if (idx < numSeeds) return `[${idx + 1}]`;
    return '';
};

export const getTournamentPointsAndResult = (playerId, t) => {
    // ⚡ THE MAGIC SPEED BOOST: Check if we already calculated this specific player for this specific tournament!
    if (!resultCache.has(t)) resultCache.set(t, new Map());
    const tCache = resultCache.get(t);
    if (tCache.has(playerId)) return tCache.get(playerId);

    let pts = 0, w = 0, l = 0, played = false, resultStr = '', wonFinal = false;

    if (t.format === 'nations_league') {
        const teams = getParsed(t, 'teams', []);
        const knockout = getParsed(t, 'bracket', [[],[],[]]);
        const groupMatches = getParsed(t, 'groupMatches', []);
        
        const myTeam = teams.find(team => team.players && team.players.includes(playerId));
        if (myTeam) {
            played = true; resultStr = 'Group Stage';
            let wonQF = knockout[0]?.some(tie => tie && tie.winner === myTeam.id);
            if (knockout[0]?.some(tie => tie && (tie.t1?.id === myTeam.id || tie.t2?.id === myTeam.id))) resultStr = 'Quarterfinalist';
            
            if (wonQF) {
                resultStr = 'Semifinalist';
                let wonSF = knockout[1]?.some(tie => tie && tie.winner === myTeam.id);
                if (wonSF) {
                    resultStr = 'Finalist';
                    if (knockout[2]?.[1] && knockout[2][1].winner === myTeam.id) { resultStr = 'Winner'; wonFinal = true; }
                } else {
                    if (knockout[2]?.[0] && knockout[2][0].winner === myTeam.id) resultStr = 'Third Place';
                    else if (knockout[2]?.[0]?.winner) resultStr = 'Fourth Place';
                }
            }
            
            const allTies = [...groupMatches, ...(knockout.flat())];
            allTies.forEach(tie => {
                if (tie && tie.matches) {
                    tie.matches.forEach(m => {
                        if (m && (m.p1 === playerId || m.p2 === playerId || m.p1b === playerId || m.p2b === playerId) && m.winner) {
                            if (m.winner === myTeam.id) w++; else l++;
                        }
                    });
                }
            });
        }
    } else if (t.format === 'atp_finals' || t.format === 'pro_am') {
        const groupMatches = getParsed(t, 'groupMatches', []);
        const knockout = getParsed(t, 'bracket', [[],[]]);
        const tierConf = TOURNAMENT_TIERS[getTournamentTier(t)] || TOURNAMENT_TIERS['pro_am'];
        const rrPts = tierConf.points.RR_WIN || 0;
        
        groupMatches.forEach(m => {
            if (m && (m.p1 === playerId || m.p2 === playerId)) {
                played = true; resultStr = 'Round Robin';
                if (m.winner === playerId) { pts += rrPts; w++; } else if (m.winner) { l++; }
            }
        });

        if (played) {
            const totalKO = knockout.length;
            let highestKO = -1;
            knockout.forEach((round, rIdx) => {
                if (!Array.isArray(round)) return;
                round.forEach(m => {
                    if (m && (m.p1 === playerId || m.p2 === playerId)) {
                        if (rIdx > highestKO) highestKO = rIdx;
                        if (m.winner === playerId) {
                            w++;
                            if (rIdx === totalKO - 1) { wonFinal = true; resultStr = 'Winner'; }
                            if (t.format === 'atp_finals') { if (rIdx === 0) pts += 400; if (rIdx === 1) pts += 500; } 
                            else if (t.format === 'pro_am') { if (rIdx === 0) pts += 50; if (rIdx === 1) pts += 60; if (rIdx === 2) pts += 150; }
                        } else if (m.winner) { l++; }
                    }
                });
            });
            if (highestKO > -1 && !wonFinal) {
                const dist = totalKO - 1 - highestKO;
                if (dist === 0) resultStr = 'Finalist';
                if (dist === 1) resultStr = 'Semifinalist';
                if (dist === 2) resultStr = 'Quarterfinalist';
            }
        }
    } else {
        const parsedBracket = getParsed(t, 'bracket', []);
        const totalRounds = parsedBracket.length;
        let highestRound = -1;
        
        parsedBracket.forEach((round, rIdx) => {
            if (!Array.isArray(round)) return;
            round.forEach(m => {
                if (m && (m.p1 === playerId || m.p2 === playerId)) {
                    played = true;
                    if (rIdx > highestRound) highestRound = rIdx;
                    if (m.winner === playerId && m.type !== 'bye') w++;
                    else if (m.winner && m.winner !== playerId) l++;
                    if (m.winner === playerId && rIdx === totalRounds - 1) wonFinal = true;
                }
            });
        });
        
        if (played && highestRound > -1) {
            const tierKey = getTournamentTier(t); const tierConf = TOURNAMENT_TIERS[tierKey]; const drawSize = getDrawSize(t);
            let sizeMultiplier = 1; if (tierKey !== 'grand_slam') { if (drawSize === 16) sizeMultiplier = 0.75; if (drawSize === 8) sizeMultiplier = 0.5; }
            if (wonFinal) pts = Math.round(tierConf.points.WINNER * sizeMultiplier);
            else if (highestRound === totalRounds - 1) pts = Math.round(tierConf.points.FINALIST * sizeMultiplier);
            else if (highestRound === totalRounds - 2) pts = Math.round(tierConf.points.SF * sizeMultiplier);
            else if (highestRound === totalRounds - 3) pts = Math.round(tierConf.points.QF * sizeMultiplier);
            else if (highestRound === totalRounds - 4) pts = Math.round(tierConf.points.R16 * sizeMultiplier);
            else if (highestRound === totalRounds - 5) pts = Math.round(tierConf.points.R32 * sizeMultiplier);
            else if (highestRound === totalRounds - 6) pts = Math.round(tierConf.points.R64 * sizeMultiplier);
            const rOffset = 6 - totalRounds; resultStr = wonFinal ? 'Winner' : ROUND_NAMES[highestRound + rOffset];
        }
    }
    
    const finalResult = { pts, w, l, played, resultStr, wonFinal };
    tCache.set(playerId, finalResult); // Memorize the result!
    return finalResult;
};

export const calculatePlayerRankings = (players, tournaments) => {
    const completedTournaments = tournaments
        .filter(t => t.status === 'completed')
        .sort((a, b) => (a.completedAt || 0) - (b.completedAt || 0));

    const majorTiers = ['grand_slam', 'major', 'finals'];
    let globalLastMajorTime = 0;
    for (let i = completedTournaments.length - 1; i >= 0; i--) {
        if (majorTiers.includes(getTournamentTier(completedTournaments[i]))) {
            globalLastMajorTime = completedTournaments[i].completedAt || completedTournaments[i].createdAt;
            break;
        }
    }

    const mapped = players.map(player => {
        let allPlayed = []; let recentMatches = []; let careerPoints = 0; let totalW = 0, totalL = 0; let hasPlayedAny = false;

        for (const t of completedTournaments) {
            let tMatches = [];
            if (t.format === 'atp_finals') {
                const knockout = getParsed(t, 'bracket', []);
                const groupMatches = getParsed(t, 'groupMatches', []);
                groupMatches.forEach(m => { if (m && (m.p1 === player.id || m.p2 === player.id) && m.winner) tMatches.push({ isWin: m.winner === player.id, type: m.type || 'close' }); });
                knockout.forEach(round => { if (!Array.isArray(round)) return; round.forEach(m => { if (m && (m.p1 === player.id || m.p2 === player.id) && m.winner) tMatches.push({ isWin: m.winner === player.id, type: m.type || 'close' }); }); });
            } else {
                const parsedBracket = getParsed(t, 'bracket', []);
                if (parsedBracket && Array.isArray(parsedBracket)) {
                    parsedBracket.forEach(round => {
                        if (!Array.isArray(round)) return;
                        round.forEach(match => {
                            if (match && (match.p1 === player.id || match.p2 === player.id) && match.winner && match.type !== 'bye') {
                                tMatches.push({ isWin: match.winner === player.id, type: match.type || 'close' });
                            }
                        });
                    });
                }
            }
            tMatches.forEach(m => recentMatches.push(m));

            const res = getTournamentPointsAndResult(player.id, t);
            if (res.played) {
                hasPlayedAny = true;
                careerPoints += res.pts;
                totalW += res.w;
                totalL += res.l;
                let totalRounds = t.format === 'atp_finals' ? 5 : 0;
                if (t.format !== 'atp_finals' && t.bracket) {
                    const pb = getParsed(t, 'bracket', []);
                    totalRounds = pb.length;
                }
                allPlayed.push({ 
                    tournamentId: t.id, tournamentName: t.name, tier: getTournamentTier(t),
                    points: res.pts, result: res.resultStr, totalRounds: totalRounds, date: t.completedAt || t.createdAt
                });
            }
        }

        allPlayed.forEach((pt, idx) => { pt.playedNumber = idx + 1; });
        let reversedPlayed = [...allPlayed].reverse();
        let recentTournaments = []; let officialPoints = 0; let bonusPoints = 0; let majorCount = 0;
        let droppingPoints = 0;

        for (let pt of reversedPlayed) {
            const isMajorPlus = majorTiers.includes(pt.tier);
            if (isMajorPlus) {
                if (majorCount < 20) {
                    majorCount++;
                    if (pt.date <= globalLastMajorTime) officialPoints += pt.points; else bonusPoints += pt.points;
                    recentTournaments.push(pt);
                    if (majorCount === 20) droppingPoints = pt.points;
                }
            } else {
                if (majorCount < 20) {
                    if (pt.date <= globalLastMajorTime) officialPoints += pt.points; else bonusPoints += pt.points;
                    recentTournaments.push(pt);
                }
            }
        }

        return { 
            ...player, 
            points: officialPoints, 
            bonusPoints: bonusPoints,
            totalPoints: officialPoints + bonusPoints, 
            careerPoints, 
            recentTournaments, 
            recentMatches: recentMatches.slice(-7).reverse(), 
            stats: { wins: totalW, losses: totalL, totalPlayed: allPlayed.length }, 
            droppingPoints,
            hasPlayedAny 
        };
    });

    mapped.sort((a, b) => b.points - a.points || b.totalPoints - a.totalPoints || (a.name || '').localeCompare(b.name || ''));

    let activeRank = 1;
    return mapped.map(p => ({
        ...p,
        rank: p.retired ? null : activeRank++
    }));
};

export const getGlobalHistory = (playersRaw, tournaments) => {
    const completedAsc = tournaments.filter(t => t.status === 'completed').sort((a, b) => (a.completedAt || 0) - (b.completedAt || 0));
    
    const lastActiveDates = {};
    playersRaw.forEach(p => {
        if (p.retired) {
            let lastDate = 0;
            completedAsc.forEach(t => {
                if (t.selectedPlayers && t.selectedPlayers.includes(p.id)) {
                    lastDate = Math.max(lastDate, t.completedAt || t.createdAt);
                }
            });
            lastActiveDates[p.id] = lastDate;
        }
    });

    const history = [];
    completedAsc.forEach((currentT, index) => {
        const relevantTournaments = completedAsc.slice(0, index + 1);
        const snapshotRankings = calculatePlayerRankings(playersRaw, relevantTournaments);
        
        let activeRankings = snapshotRankings.filter(p => p.hasPlayedAny);
        const currentTDate = currentT.completedAt || currentT.createdAt;
        
        activeRankings = activeRankings.filter(p => {
            if (!p.retired) return true;
            return currentTDate <= (lastActiveDates[p.id] || 0);
        });
        
        activeRankings.sort((a, b) => b.points - a.points || b.totalPoints - a.totalPoints || (a.name || '').localeCompare(b.name || ''));
        activeRankings.forEach((p, idx) => p.rank = idx + 1);
        
        const playerPoints = activeRankings.map(p => ({
            id: p.id, name: p.name, pts: p.points, totalPts: p.totalPoints, 
            careerPoints: p.careerPoints, wins: p.stats.wins, matchesPlayed: p.stats.totalPlayed,
            imageUrl: p.imageUrl, nationality: p.nationality || 'UNK', rank: p.rank
        }));
        const tier = getTournamentTier(currentT);
        history.push({ tournamentId: currentT.id, tournamentName: currentT.name, tier: tier, isMajorPlus: ['grand_slam', 'major', 'finals'].includes(tier), date: currentT.completedAt, standings: playerPoints });
    });
    return history;
};

export function generateKnockoutDraw(players, size) {
    // 1. Perfect ATP/WTA Seeding Algorithm (1 at top, 2 at bottom, perfectly spaced)
    let rounds = Math.log2(size);
    let seedOrder = [1];
    
    for (let r = 1; r <= rounds; r++) {
        let nextOrder = [];
        let sum = Math.pow(2, r) + 1;
        for (let i = 0; i < seedOrder.length; i++) {
            let s1 = seedOrder[i];
            let s2 = sum - s1;
            // Flip the placement on odd indices to push Seed 2 to the absolute bottom
            if (i % 2 === 0) {
                nextOrder.push(s1, s2);
            } else {
                nextOrder.push(s2, s1);
            }
        }
        seedOrder = nextOrder;
    }

    // 2. Map the players to the generated seed positions
    const firstRoundMatches = [];
    for (let i = 0; i < size; i += 2) {
        const s1 = seedOrder[i] - 1; 
        const s2 = seedOrder[i+1] - 1;
        firstRoundMatches.push({
            id: `m-0-${i/2}`,
            p1: players[s1] ? players[s1].id : null,
            p2: players[s2] ? players[s2].id : null,
            winner: null,
            type: null
        });
    }

    // 3. Build the rest of the empty bracket
    const bracket = [firstRoundMatches];
    let currentRound = firstRoundMatches;
    let r = 1;

    while (currentRound.length > 1) {
        const nextRound = [];
        for (let i = 0; i < currentRound.length; i += 2) {
            nextRound.push({ id: `m-${r}-${i/2}`, p1: null, p2: null, winner: null, type: null });
        }
        bracket.push(nextRound);
        currentRound = nextRound;
        r++;
    }

    return bracket;
}

export const generateATPFinalsDraw = (selectedPlayers) => {
    const seeds = selectedPlayers.slice(0, 8);
    const groupA = [seeds[0]]; const groupB = [seeds[1]];
    Math.random() > 0.5 ? (groupA.push(seeds[2]), groupB.push(seeds[3])) : (groupA.push(seeds[3]), groupB.push(seeds[2]));
    Math.random() > 0.5 ? (groupA.push(seeds[4]), groupB.push(seeds[5])) : (groupA.push(seeds[5]), groupB.push(seeds[4]));
    Math.random() > 0.5 ? (groupA.push(seeds[6]), groupB.push(seeds[7])) : (groupA.push(seeds[7]), groupB.push(seeds[6]));

    const makeMatches = (group, name) => [
        { id: `${name}-1`, p1: group[0].id, p2: group[1].id, winner: null, type: null, group: name },
        { id: `${name}-2`, p1: group[2].id, p2: group[3].id, winner: null, type: null, group: name },
        { id: `${name}-3`, p1: group[0].id, p2: group[2].id, winner: null, type: null, group: name },
        { id: `${name}-4`, p1: group[1].id, p2: group[3].id, winner: null, type: null, group: name },
        { id: `${name}-5`, p1: group[0].id, p2: group[3].id, winner: null, type: null, group: name },
        { id: `${name}-6`, p1: group[1].id, p2: group[2].id, winner: null, type: null, group: name },
    ];

    return {
        format: 'atp_finals', groups: { A: groupA.map(p=>p.id), B: groupB.map(p=>p.id) },
        groupMatches: JSON.stringify([...makeMatches(groupA, 'A'), ...makeMatches(groupB, 'B')]),
        knockout: JSON.stringify([[{ id: 'sf-1', p1: null, p2: null, winner: null, type: null }, { id: 'sf-2', p1: null, p2: null, winner: null, type: null }], [{ id: 'f-1', p1: null, p2: null, winner: null, type: null }]])
    };
};

export const generateProAmDraw = (selectedPlayers) => {
    const seeds = selectedPlayers; 
    const groupA = [seeds[0], seeds[7], seeds[8], seeds[15]];
    const groupB = [seeds[1], seeds[6], seeds[9], seeds[14]];
    const groupC = [seeds[2], seeds[5], seeds[10], seeds[13]];
    const groupD = [seeds[3], seeds[4], seeds[11], seeds[12]];

    const makeMatches = (group, name) => [
        { id: `${name}-1`, p1: group[0].id, p2: group[1].id, winner: null, type: null, group: name },
        { id: `${name}-2`, p1: group[2].id, p2: group[3].id, winner: null, type: null, group: name },
        { id: `${name}-3`, p1: group[0].id, p2: group[2].id, winner: null, type: null, group: name },
        { id: `${name}-4`, p1: group[1].id, p2: group[3].id, winner: null, type: null, group: name },
        { id: `${name}-5`, p1: group[0].id, p2: group[3].id, winner: null, type: null, group: name },
        { id: `${name}-6`, p1: group[1].id, p2: group[2].id, winner: null, type: null, group: name },
    ];

    return {
        format: 'pro_am',
        groups: { A: groupA.map(p=>p.id), B: groupB.map(p=>p.id), C: groupC.map(p=>p.id), D: groupD.map(p=>p.id) },
        groupMatches: JSON.stringify([ ...makeMatches(groupA, 'A'), ...makeMatches(groupB, 'B'), ...makeMatches(groupC, 'C'), ...makeMatches(groupD, 'D') ]),
        knockout: JSON.stringify([
            [{ id: 'qf-1', p1: null, p2: null, winner: null, type: null }, { id: 'qf-2', p1: null, p2: null, winner: null, type: null }, { id: 'qf-3', p1: null, p2: null, winner: null, type: null }, { id: 'qf-4', p1: null, p2: null, winner: null, type: null }],
            [{ id: 'sf-1', p1: null, p2: null, winner: null, type: null }, { id: 'sf-2', p1: null, p2: null, winner: null, type: null }],
            [{ id: 'f-1', p1: null, p2: null, winner: null, type: null }]
        ])
    };
};

export const generateNationsDraw = (teamsList) => {
    const t = teamsList;
    const groupA = [t[0], t[7], t[8], t[15]];
    const groupB = [t[1], t[6], t[9], t[14]];
    const groupC = [t[2], t[5], t[10], t[13]];
    const groupD = [t[3], t[4], t[11], t[12]];

    // Pure Singles Group Stage: 4 Required Matches + 1 Ace Decider Tiebreaker
    const makeGroupTie = (t1, t2, idPrefix, groupName) => ({
        id: idPrefix, group: groupName, t1, t2, winner: null, score: null, type: null,
        matches: [
            { mId: `${idPrefix}-m1`, name: 'Singles 4', p1: t1.players[3], p2: t2.players[3], winner: null, type: null },
            { mId: `${idPrefix}-m2`, name: 'Singles 3', p1: t1.players[2], p2: t2.players[2], winner: null, type: null },
            { mId: `${idPrefix}-m3`, name: 'Singles 2', p1: t1.players[1], p2: t2.players[1], winner: null, type: null },
            { mId: `${idPrefix}-m4`, name: 'Singles 1 (Aces)', p1: t1.players[0], p2: t2.players[0], winner: null, type: null },
            { mId: `${idPrefix}-m5`, name: 'Ace Decider (Tiebreaker)', p1: t1.players[0], p2: t2.players[0], winner: null, type: null }
        ]
    });

    const makeGroupTies = (g, name) => [
        makeGroupTie(g[0], g[1], `${name}-1`, name), makeGroupTie(g[2], g[3], `${name}-2`, name),
        makeGroupTie(g[0], g[2], `${name}-3`, name), makeGroupTie(g[1], g[3], `${name}-4`, name),
        makeGroupTie(g[0], g[3], `${name}-5`, name), makeGroupTie(g[1], g[2], `${name}-6`, name)
    ];

    // Pure Singles Knockout Stage: 8 Required Matches + 1 Ace Decider Tiebreaker
    const emptyKnockoutTie = (idPrefix) => ({
        id: idPrefix, group: 'knockout', t1: null, t2: null, winner: null, score: null, type: null,
        matches: [
            { mId: `${idPrefix}-m1`, name: 'Singles 4', p1: null, p2: null, winner: null, type: null },
            { mId: `${idPrefix}-m2`, name: 'Singles 3', p1: null, p2: null, winner: null, type: null },
            { mId: `${idPrefix}-m3`, name: 'Singles 2', p1: null, p2: null, winner: null, type: null },
            { mId: `${idPrefix}-m4`, name: 'Singles 1 (Aces)', p1: null, p2: null, winner: null, type: null },
            { mId: `${idPrefix}-m5`, name: 'Cross Singles (4v3)', p1: null, p2: null, winner: null, type: null },
            { mId: `${idPrefix}-m6`, name: 'Cross Singles (3v4)', p1: null, p2: null, winner: null, type: null },
            { mId: `${idPrefix}-m7`, name: 'Cross Singles (2v1)', p1: null, p2: null, winner: null, type: null },
            { mId: `${idPrefix}-m8`, name: 'Cross Singles (1v2)', p1: null, p2: null, winner: null, type: null },
            { mId: `${idPrefix}-m9`, name: 'Ace Decider (Tiebreaker)', p1: null, p2: null, winner: null, type: null }
        ]
    });

    return {
        format: 'nations_league', 
        teams: JSON.stringify(teamsList),
        groups: { A: groupA.map(x=>x.id), B: groupB.map(x=>x.id), C: groupC.map(x=>x.id), D: groupD.map(x=>x.id) },
        groupMatches: JSON.stringify([ ...makeGroupTies(groupA, 'A'), ...makeGroupTies(groupB, 'B'), ...makeGroupTies(groupC, 'C'), ...makeGroupTies(groupD, 'D') ]),
        knockout: JSON.stringify([
            [emptyKnockoutTie('qf-1'), emptyKnockoutTie('qf-2'), emptyKnockoutTie('qf-3'), emptyKnockoutTie('qf-4')],
            [emptyKnockoutTie('sf-1'), emptyKnockoutTie('sf-2')],
            [emptyKnockoutTie('bronze'), emptyKnockoutTie('final')]
        ])
    };
};

export const calcGroupStandings = (groupId, matches) => {
    const scores = {};
    if (!Array.isArray(matches)) return [];
    matches.filter(m => m && m.group === groupId).forEach(m => {
        if (!scores[m.p1]) scores[m.p1] = { id: m.p1, wins: 0, losses: 0, tiebreaker: 0 };
        if (!scores[m.p2]) scores[m.p2] = { id: m.p2, wins: 0, losses: 0, tiebreaker: 0 };
        if (m.winner) {
            const loser = m.winner === m.p1 ? m.p2 : m.p1;
            scores[m.winner].wins += 1; scores[loser].losses += 1;
            scores[m.winner].tiebreaker += (m.type === 'lopsided' ? 2 : 1);
            scores[loser].tiebreaker -= (m.type === 'lopsided' ? 2 : 1);
        }
    });
    return Object.values(scores).sort((a,b) => b.wins - a.wins || b.tiebreaker - a.tiebreaker);
};

export const attachDiffsAndForm = (playersList, globalHist) => {
    const majorHist = globalHist.filter(h => h.isMajorPlus);
    const prevHist = majorHist.length > 1 ? majorHist[majorHist.length - 2] : null;

    return playersList.map(p => {
        let diff = 0;
        if (prevHist) {
            const prevStanding = prevHist.standings.find(s => s.id === p.id);
            const prevPoints = prevStanding ? prevStanding.pts : 0;
            diff = p.points - prevPoints;
        } else {
            diff = p.points;
        }
        return { ...p, diff };
    });
};