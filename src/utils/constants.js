export const ROUND_NAMES = ['Round of 64', 'Round of 32', 'Round of 16', 'Quarterfinals', 'Semifinals', 'Final'];

export const CHART_COLORS = ['#d4af37', '#10b981', '#0ea5e9', '#f43f5e', '#8b5cf6', '#eab308', '#f97316', '#84cc16', '#3b82f6'];

export const TOURNAMENT_TIERS = {
    'grand_slam': { name: 'Grand Slam', points: { WINNER: 2000, FINALIST: 1200, SF: 720, QF: 360, R16: 180, R32: 90, R64: 45 }, excludeTop: 0, wcCount: { 128: 16, 64: 16 }, color: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-500/50', hex: '#a855f7', shadowHover: 'hover:shadow-purple-500/20' },
    'finals': { name: 'SNB Internationals', points: { WINNER: 1500, FINALIST: 1000, SF: 400, RR_WIN: 200 }, excludeTop: 0, wcCount: { 8: 0 }, color: 'text-cyan-400', bg: 'bg-cyan-500/20', border: 'border-cyan-500/50', hex: '#22d3ee', shadowHover: 'hover:shadow-cyan-500/20' },
    'major': { name: 'Major', points: { WINNER: 1000, FINALIST: 600, SF: 360, QF: 180, R16: 90, R32: 45, R64: 20 }, excludeTop: 0, wcCount: { 128: 16, 64: 16, 32: 8 }, color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/50', hex: '#facc15', shadowHover: 'hover:shadow-yellow-500/20' },
    'pro': { 
        name: 'Pro Series', 
        points: { WINNER: 500, FINALIST: 300, SF: 180, QF: 90, R16: 45, R32: 20, R64: 10 }, 
        // FIX: Exclude Top 16
        excludeTop: 16, 
        wcCount: { 128: 16, 64: 8, 32: 4, 16: 2 }, 
        color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/50', hex: '#60a5fa', shadowHover: 'hover:shadow-blue-500/20' 
    },
    'pro_am': { 
        name: 'Pro-Am', 
        points: { WINNER: 500, FINALIST: 300, SF: 180, QF: 90, R16: 45, R32: 20, R64: 10 }, 
        // FIX: Exclude Top 16, and use standard Wildcard math instead of 100% manual entry!
        excludeTop: 16, 
        wcCount: { 32: 16, 16: 2 }, 
        color: 'text-rose-400', bg: 'bg-rose-500/20', border: 'border-rose-500/50', hex: '#f43f5e', shadowHover: 'hover:shadow-rose-500/20' 
    },
    'challenger_elite': { 
        name: 'Challenger Elite', 
        points: { WINNER: 250, FINALIST: 150, SF: 90, QF: 45, R16: 20, R32: 10, R64: 5 }, 
        // FIX: Exclude Top 32
        excludeTop: 32, 
        // Keep this at 100% manual entry if you still want Elite to be fully curated
        wcCount: { 32: 32, 16: 16 }, 
        color: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500/50', hex: '#f97316', shadowHover: 'hover:shadow-orange-500/20' 
    },
    'challenger': { 
        name: 'Challenger', 
        points: { WINNER: 250, FINALIST: 150, SF: 90, QF: 45, R16: 20, R32: 10, R64: 5 }, 
        // FIX: Exclude Top 32
        excludeTop: 32, 
        // FIX: Support 8-player draws with 1 wildcard
        wcCount: { 128: 16, 64: 8, 32: 4, 16: 2, 8: 1 }, 
        color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/50', hex: '#4ade80', shadowHover: 'hover:shadow-green-500/20' 
    },
    'nations_league': { name: 'SNB Nations League', points: { WINNER: 0, FINALIST: 0, SF: 0, QF: 0, RR_WIN: 0 }, excludeTop: 0, wcCount: {}, color: 'text-slate-100', bg: 'bg-slate-100/10', border: 'border-slate-100/40', hex: '#f8fafc', shadowHover: 'hover:shadow-slate-100/20' }
};

const countryDataStr = "ATG,Antigua and Barbuda,🇦🇬|BHS,Bahamas,🇧🇸|BRB,Barbados,🇧🇧|CAN,Canada,🇨🇦|CUB,Cuba,🇨🇺|DOM,Dominican Republic,🇩🇴|GTM,Guatemala,🇬🇹|HTI,Haiti,🇭🇹|JAM,Jamaica,🇯🇲|MEX,Mexico,🇲🇽|PAN,Panama,🇵🇦|PUR,Puerto Rico,🇵🇷|USA,United States,🇺🇸|ARG,Argentina,🇦🇷|BOL,Bolivia,🇧🇴|BRA,Brazil,🇧🇷|CHI,Chile,🇨🇱|COL,Colombia,🇨🇴|ECU,Ecuador,🇪🇨|PAR,Paraguay,🇵🇾|PER,Peru,🇵🇪|URU,Uruguay,🇺🇾|VEN,Venezuela,🇻🇪|ALB,Albania,🇦🇱|AUT,Austria,🇦🇹|BEL,Belgium,🇧🇪|BUL,Bulgaria,🇧🇬|CRO,Croatia,🇭🇷|CZE,Czechia,🇨🇿|DEN,Denmark,🇩🇰|EST,Estonia,🇪🇪|FIN,Finland,🇫🇮|FRA,France,🇫🇷|GBR,Great Britain,🇬🇧|GER,Germany,🇩🇪|GRE,Greece,🇬🇷|HUN,Hungary,🇭🇺|IRL,Ireland,🇮🇪|ISL,Iceland,🇮🇸|ITA,Italy,🇮🇹|LAT,Latvia,🇱🇻|LTU,Lithuania,🇱🇹|NED,Netherlands,🇳🇱|NOR,Norway,🇳🇴|POL,Poland,🇵🇱|POR,Portugal,🇵🇹|ROU,Romania,🇷🇴|RUS,Russia,🇷🇺|SRB,Serbia,🇷🇸|SVK,Slovakia,🇸🇰|SLO,Slovenia,🇸🇮|ESP,Spain,🇪🇸|SWE,Sweden,🇸🇪|SUI,Switzerland,🇨🇭|UKR,Ukraine,🇺🇦|AFG,Afghanistan,🇦🇫|CHN,China,🇨🇳|IND,India,🇮🇳|IDN,Indonesia,🇮🇩|IRI,Iran,🇮🇷|IRQ,Iraq,🇮🇶|ISR,Israel,🇮🇱|JPN,Japan,🇯🇵|KAZ,Kazakhstan,🇰🇿|KOR,South Korea,🇰🇷|MAS,Malaysia,🇲🇾|PAK,Pakistan,🇵🇰|PHI,Philippines,🇵🇭|QAT,Qatar,🇶🇦|KSA,Saudi Arabia,🇸🇦|SGP,Singapore,🇸🇬|THA,Thailand,🇹🇭|TUR,Turkey,🇹🇷|UAE,United Arab Emirates,🇦🇪|VIE,Vietnam,🇻🇳|ALG,Algeria,🇩🇿|ANG,Angola,🇦🇴|EGY,Egypt,🇪🇬|ETH,Ethiopia,🇪🇹|GHA,Ghana,🇬🇭|KEN,Kenya,🇰🇪|MAR,Morocco,🇲🇦|NGR,Nigeria,🇳🇬|SEN,Senegal,🇸🇳|RSA,South Africa,🇿🇦|TUN,Tunisia,🇹🇳|AUS,Australia,🇦🇺|FIJ,Fiji,🇫🇯|NZL,New Zealand,🇳🇿|PNG,Papua New Guinea,🇵🇬|UNK,Unknown,🏳️";
export const COUNTRIES = countryDataStr.split('|').map(c => { const [code, name, flag] = c.split(','); return {code, name, flag}; });