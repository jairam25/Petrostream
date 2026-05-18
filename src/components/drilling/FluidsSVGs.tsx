import React from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATED SVG COMPONENTS FOR MUD ENGINEERING (FLUIDS TAB)
// ═══════════════════════════════════════════════════════════════════════════

/* ── CSS Keyframes injected via style ── */
const fluidStyles = `
  @keyframes fluidPulse { 0%,100% { opacity:0.6; } 50% { opacity:1; } }
  @keyframes flowRight { 0% { transform:translateX(-100%); } 100% { transform:translateX(100%); } }
  @keyframes flowDown { 0% { transform:translateY(-100%); } 100% { transform:translateY(100%); } }
  @keyframes bubbleUp { 0% { transform:translateY(0); opacity:0.8; } 100% { transform:translateY(-40px); opacity:0; } }
  @keyframes rotateRheo { 0% { transform:rotate(0deg); } 100% { transform:rotate(360deg); } }
  @keyframes scaleBounce { 0%,100% { transform:scale(1); } 50% { transform:scale(1.08); } }
  @keyframes shearOsc { 0%,100% { transform:skewX(0deg); } 50% { transform:skewX(8deg); } }
  @keyframes particleDrift { 0% { transform:translate(0,0); } 100% { transform:translate(60px,-30px); opacity:0; } }
  @keyframes bariteDrop { 0% { transform:translateY(-20px); opacity:0.4; } 40% { opacity:1; } 100% { transform:translateY(0); opacity:1; } }
  @keyframes gelStrength { 0%,100% { transform:scaleY(1); } 50% { transform:scaleY(1.5); } }
  @keyframes marshFunnel { 0%,100% { transform:scaleY(1); } 50% { transform:scaleY(0.97); } }
  @keyframes spinnerRot { 0% { transform:rotate(0deg); } 100% { transform:rotate(360deg); } }
  @keyframes shearRate { 0% { stroke-dashoffset:100; } 100% { stroke-dashoffset:0; } }
  @keyframes warningFlash { 0%,100% { opacity:0.3; } 50% { opacity:1; } }
  @keyframes progressFill { 0% { stroke-dashoffset:226; } 100% { stroke-dashoffset:var(--target-offset); } }
  @keyframes glowPulse { 0%,100% { filter:drop-shadow(0 0 2px rgba(99,102,241,0.3)); } 50% { filter:drop-shadow(0 0 8px rgba(99,102,241,0.8)); } }
  .fluid-svg { font-family: system-ui, sans-serif; }
`;

// ═══════════════════════════════════════════════════════════════════════════
// 1. MUD RHEOLOGY CURVE (Shear Stress vs Shear Rate)
// ═══════════════════════════════════════════════════════════════════════════
export const MudRheologyCurve: React.FC<{
    pv: number; yp: number; dial600: number; dial300: number; dial6: number; dial3: number;
    modelType: 'Bingham' | 'PowerLaw' | 'HerschelBulkley'; nPrime: number;
}> = ({ pv, yp, dial600, dial300, dial6, dial3, modelType, nPrime }) => {
    const w = 360, h = 260, pad = 50;
    const maxShearRate = 1022, maxShearStress = Math.max(dial600 * 2, 120);
    const sx = (sr: number) => pad + (sr / maxShearRate) * (w - 2 * pad);
    const sy = (ss: number) => h - pad - (ss / maxShearStress) * (h - 2 * pad);
    const dataPoints = [
        { sr: 1022, ss: dial600 }, { sr: 511, ss: dial300 }, { sr: 340, ss: dial600 ? dial600 * (340 / 1022) ** nPrime * (1 / 0.8) : 80 },
    ];
    if (dial6) dataPoints.push({ sr: 10.22, ss: dial6 });
    if (dial3) dataPoints.push({ sr: 5.11, ss: dial3 });
    dataPoints.sort((a, b) => a.sr - b.sr);
    const lineD = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${sx(p.sr)} ${sy(p.ss)}`).join(' ');

    const ypIntercept = sy(yp);
    const bx1 = sx(maxShearRate), by1 = sy(pv + yp);

    return (
        <svg viewBox={`0 0 ${w} ${h}`} className="fluid-svg w-full h-full">
            <style>{fluidStyles}</style>
            <defs>
                <linearGradient id="rheoGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.35" />
                </linearGradient>
                <filter id="glowRheo">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
            </defs>
            <rect x={0} y={0} width={w} height={h} fill="#0f172a" rx={12} />
            {/* Grid */}
            {[0, 0.25, 0.5, 0.75, 1].map(f => (
                <g key={f}>
                    <line x1={pad} y1={sy(maxShearStress * f)} x2={w - pad} y2={sy(maxShearStress * f)} stroke="#1e293b" strokeWidth={0.5} />
                    <line x1={sx(maxShearRate * f)} y1={pad} x2={sx(maxShearRate * f)} y2={h - pad} stroke="#1e293b" strokeWidth={0.5} />
                </g>
            ))}
            {/* Axes */}
            <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke="#475569" strokeWidth={1.5} />
            <line x1={pad} y1={pad} x2={pad} y2={h - pad} stroke="#475569" strokeWidth={1.5} />
            <text x={w / 2} y={h - 8} fill="#94a3b8" fontSize={10} textAnchor="middle">Shear Rate γ (sec⁻¹)</text>
            <text x={12} y={h / 2} fill="#94a3b8" fontSize={10} textAnchor="middle" transform={`rotate(-90,12,${h / 2})`}>Shear Stress τ (lbf/100ft²)</text>
            {/* Axis labels */}
            <text x={sx(1022)} y={h - pad + 14} fill="#475569" fontSize={9} textAnchor="middle">1022</text>
            <text x={sx(511)} y={h - pad + 14} fill="#475569" fontSize={9} textAnchor="middle">511</text>
            {/* Animated shear stress curve */}
            <path d={lineD} fill="none" stroke="url(#rheoGrad)" strokeWidth={3} filter="url(#glowRheo)" opacity={0.9}>
                <animate attributeName="stroke-dasharray" from="500" to="0" dur="1.5s" fill="freeze" />
            </path>
            {/* Data point dots with pulse */}
            {dataPoints.map((p, i) => (
                <circle key={i} cx={sx(p.sr)} cy={sy(p.ss)} r={4} fill="#818cf8" filter="url(#glowRheo)">
                    <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
                </circle>
            ))}
            {/* PV at 300 RPM */}
            <text x={sx(511) + 8} y={sy(dial300) - 10} fill="#818cf8" fontSize={9}>PV={pv}</text>
            {/* YP dashed line */}
            <line x1={pad} y1={ypIntercept} x2={w - pad} y2={ypIntercept} stroke="#f59e0b" strokeWidth={1} strokeDasharray="4,4" opacity={0.6} />
            <text x={w - pad - 30} y={ypIntercept - 6} fill="#f59e0b" fontSize={9}>YP={yp}</text>
            {/* Model badge */}
            <rect x={w - 95} y={8} width={85} height={20} rx={8} fill="#6366f1" opacity={0.2} />
            <text x={w - 52} y={22} fill="#818cf8" fontSize={9} textAnchor="middle" fontWeight={700}>
                {modelType} {nPrime ? `n=${nPrime.toFixed(2)}` : ''}
            </text>
            {/* Animated flow indicator in corner */}
            <g transform={`translate(${w - 40},${h - 40})`} opacity={0.5}>
                <rect width={24} height={24} rx={4} fill="none" stroke="#06b6d4" strokeWidth={1} />
                <circle cx={12} cy={12} r={4} fill="#06b6d4">
                    <animate attributeName="cy" values="16;8;16" dur="2.5s" repeatCount="indefinite" />
                </circle>
            </g>
        </svg>
    );
};

// ═══════════════════════════════════════════════════════════════════════════
// 2. MARSH FUNNEL VISCOUS FLOW ANIMATION
// ═══════════════════════════════════════════════════════════════════════════
export const MarshFunnelFlow: React.FC<{
    funnelSeconds: number; effectiveViscosity: number; mudWeight: number;
}> = ({ funnelSeconds, effectiveViscosity, mudWeight }) => {
    const w = 200, h = 280;
    const flowHeight = Math.max(0, Math.min(100, 100 - (funnelSeconds - 26) * 3));
    return (
        <svg viewBox={`0 0 ${w} ${h}`} className="fluid-svg w-full h-full">
            <style>{fluidStyles}</style>
            <defs>
                <linearGradient id="mudGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#92400e" /><stop offset="100%" stopColor="#78350f" />
                </linearGradient>
                <clipPath id="funnelClip">
                    <rect x={45} y={50} width={110} height={150} />
                </clipPath>
            </defs>
            <rect width={w} height={h} fill="#0f172a" rx={12} />
            {/* Funnel shape */}
            <polygon points="50,50 150,50 120,120 80,120" fill="none" stroke="#475569" strokeWidth={2} />
            <line x1={80} y1={120} x2={120} y2={120} stroke="#475569" strokeWidth={2} />
            <line x1={90} y1={120} x2={90} y2={160} stroke="#475569" strokeWidth={1.5} />
            <line x1={110} y1={120} x2={110} y2={160} stroke="#475569" strokeWidth={1.5} />
            {/* Mud in funnel */}
            <polygon points="55,55 145,55 118,118 82,118" fill="url(#mudGrad)" opacity={0.7}>
                <animate attributeName="opacity" values="0.65;0.8;0.65" dur="3s" repeatCount="indefinite" />
            </polygon>
            {/* Flowing stream */}
            <rect x={88} y={120} width={24} height={Math.max(0, flowHeight)} fill="url(#mudGrad)" opacity={0.6} rx={2}>
                <animate attributeName="height" values={`${flowHeight * 0.9};${flowHeight};${flowHeight * 0.95}`} dur="1.5s" repeatCount="indefinite" />
            </rect>
            {/* Drip animation */}
            {[0, 1, 2].map(i => (
                <circle key={i} cx={95 + i * 8} cy={120 + flowHeight + 15} r={3} fill="#92400e" opacity={0}>
                    <animate attributeName="cy" values={`${120 + flowHeight};${120 + flowHeight + 40}`} dur={`${1.2 + i * 0.4}s`} repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6;0" dur={`${1.2 + i * 0.4}s`} repeatCount="indefinite" />
                    <animate attributeName="r" values="3;1" dur={`${1.2 + i * 0.4}s`} repeatCount="indefinite" />
                </circle>
            ))}
            {/* Level indicator */}
            <text x={100} y={185} fill="#94a3b8" fontSize={9} textAnchor="middle">
                {funnelSeconds.toFixed(1)}s/qt
            </text>
            <text x={100} y={200} fill="#475569" fontSize={8} textAnchor="middle">
                μ<sub>eff</sub>={effectiveViscosity.toFixed(0)}cp
            </text>
        </svg>
    );
};

// ═══════════════════════════════════════════════════════════════════════════
// 3. SOLIDS CONTROL HIERARCHY — SHAKER → CENTRIFUGE
// ═══════════════════════════════════════════════════════════════════════════
export const SolidsControlFlow: React.FC<{
    shakerEff: number; desanderEff: number; desilterEff: number; centrifugeEff: number;
    shakerLoad: number; desanderLoad: number; lgsPct: number; overallEff: number;
}> = ({ shakerEff, desanderEff, desilterEff, centrifugeEff, shakerLoad, desanderLoad, lgsPct, overallEff }) => {
    const w = 500, h = 260;
    const stages = [
        { name: 'Shale Shaker', eff: shakerEff, load: shakerLoad, x: 80, color: '#f59e0b' },
        { name: 'Desander', eff: desanderEff, load: desanderLoad, x: 185, color: '#06b6d4' },
        { name: 'Desilter', eff: desilterEff, load: desanderLoad * 0.7, x: 290, color: '#8b5cf6' },
        { name: 'Centrifuge', eff: centrifugeEff, load: desanderLoad * 0.4, x: 395, color: '#10b981' },
    ];
    return (
        <svg viewBox={`0 0 ${w} ${h}`} className="fluid-svg w-full h-full">
            <style>{fluidStyles}</style>
            <defs>
                <linearGradient id="solidFlowGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.6} />
                </linearGradient>
            </defs>
            <rect width={w} height={h} fill="#0f172a" rx={12} />
            {/* Flow pipe */}
            <rect x={30} y={70} width={440} height={6} rx={3} fill="url(#solidFlowGrad)" />
            {/* Flow particles */}
            {Array.from({ length: 8 }).map((_, i) => (
                <circle key={i} cx={0} cy={73} r={3} fill="#6366f1" opacity={0.6}>
                    <animate attributeName="cx" from={30} to={470} dur={`${4 + i * 0.5}s`} repeatCount="indefinite" />
                </circle>
            ))}
            {/* Stages */}
            {stages.map((s, i) => (
                <g key={i}>
                    {/* Equipment box */}
                    <rect x={s.x - 35} y={20} width={70} height={40} rx={8} fill={s.color} opacity={0.15} stroke={s.color} strokeWidth={1.5} />
                    <text x={s.x} y={38} fill={s.color} fontSize={9} textAnchor="middle" fontWeight={700}>{s.name}</text>
                    <text x={s.x} y={52} fill={s.color} fontSize={8} textAnchor="middle" opacity={0.7}>{s.eff.toFixed(0)}%</text>
                    {/* Connection line down to pipe */}
                    <line x1={s.x} y1={60} x2={s.x} y2={70} stroke={s.color} strokeWidth={1.5} />
                    {/* Efficiency ring */}
                    <circle cx={s.x} cy={s.name === 'Shale Shaker' ? 100 : 110} r={20} fill="none" stroke={s.color} strokeWidth={3} strokeDasharray={`${s.eff * 1.256} 126`} strokeLinecap="round" opacity={0.6}>
                        <animate attributeName="stroke-dashoffset" from={126} to={0} dur="2s" fill="freeze" />
                    </circle>
                    <text x={s.x} cy={s.name === 'Shale Shaker' ? 104 : 114} fill={s.color} fontSize={10} textAnchor="middle" fontWeight={700}>{s.eff.toFixed(0)}%</text>
                    {/* Discard stream */}
                    <line x1={s.x} y1={130} x2={s.x + 15} y2={150} stroke={s.color} strokeWidth={1} strokeDasharray="2,2" opacity={0.4} />
                    <text x={s.x + 28} y={150} fill={s.color} fontSize={7} opacity={0.5}>discard</text>
                </g>
            ))}
            {/* Overall efficiency bar */}
            <rect x={30} y={175} width={440} height={16} rx={6} fill="#1e293b" />
            <rect x={30} y={175} width={440 * overallEff / 100} height={16} rx={6} fill="url(#solidFlowGrad)">
                <animate attributeName="width" from={0} to={440 * overallEff / 100} dur="2s" fill="freeze" />
            </rect>
            <text x={250} y={187} fill="white" fontSize={10} textAnchor="middle" fontWeight={700}>
                Overall Efficiency: {overallEff.toFixed(1)}%
            </text>
            {/* Incoming label */}
            <text x={35} y={16} fill="#94a3b8" fontSize={9}>Drilled Solids In</text>
            <text x={w - 65} y={16} fill="#94a3b8" fontSize={9} textAnchor="end">Mud To Pit</text>
            <text x={250} y={225} fill="#475569" fontSize={9} textAnchor="middle">LGS: {lgsPct.toFixed(1)}% vol</text>
        </svg>
    );
};

// ═══════════════════════════════════════════════════════════════════════════
// 4. SHALE INHIBITION OSMOTIC MEMBRANE DIAGRAM
// ═══════════════════════════════════════════════════════════════════════════
export const ShaleInhibitionMembrane: React.FC<{
    waterActivity: number; mudActivity: number; osmoticPsi: number; direction: string;
    swellingPct: number; adequacy: string;
}> = ({ waterActivity, mudActivity, osmoticPsi, direction, swellingPct, adequacy }) => {
    const w = 340, h = 220;
    const flowDir = direction === 'into-shale' ? 1 : direction === 'out-of-shale' ? -1 : 0;
    const adequacyColor = adequacy === 'excellent' ? '#10b981' : adequacy === 'good' ? '#06b6d4' : adequacy === 'marginal' ? '#f59e0b' : '#ef4444';
    return (
        <svg viewBox={`0 0 ${w} ${h}`} className="fluid-svg w-full h-full">
            <style>{fluidStyles}</style>
            <defs>
                <linearGradient id="shaleGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d4a574" /><stop offset="100%" stopColor="#8b6914" />
                </linearGradient>
                <filter id="shaleGlow"><feGaussianBlur stdDeviation="3" /></filter>
            </defs>
            <rect width={w} height={h} fill="#0f172a" rx={12} />
            {/* Mud side */}
            <rect x={20} y={30} width={120} height={160} rx={10} fill="#1e3a5f" opacity={0.5} stroke="#3b82f6" strokeWidth={1.5} />
            <text x={80} y={55} fill="#60a5fa" fontSize={10} textAnchor="middle" fontWeight={700}>Mud</text>
            <text x={80} y={75} fill="#94a3b8" fontSize={9} textAnchor="middle">Aw = {mudActivity.toFixed(3)}</text>
            {/* Water molecules on mud side */}
            {Array.from({ length: 5 }).map((_, i) => (
                <circle key={`m${i}`} cx={30 + i * 18} cy={100 + i * 12} r={4} fill="#3b82f6" opacity={0.6}>
                    <animate attributeName="cx" values={`${30 + i * 18};${30 + i * 18 + flowDir * 30};${30 + i * 18}`} dur={`${2 + i * 0.5}s`} repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6;0.3;0.6" dur={`${2 + i * 0.5}s`} repeatCount="indefinite" />
                </circle>
            ))}
            {/* Membrane */}
            <rect x={135} y={30} width={10} height={160} rx={3} fill={adequacyColor} opacity={0.3} stroke={adequacyColor} strokeWidth={1.5}>
                <animate attributeName="opacity" values="0.25;0.5;0.25" dur="2s" repeatCount="indefinite" />
            </rect>
            <text x={140} y={25} fill={adequacyColor} fontSize={8} textAnchor="middle">membrane</text>
            {/* Shale side */}
            <rect x={200} y={30} width={120} height={160} rx={10} fill="#3d2b0a" opacity={0.5} stroke="#d4a574" strokeWidth={1.5} />
            <text x={260} y={55} fill="#d4a574" fontSize={10} textAnchor="middle" fontWeight={700}>Shale</text>
            <text x={260} y={75} fill="#94a3b8" fontSize={9} textAnchor="middle">Aw = {waterActivity.toFixed(3)}</text>
            {/* Clay layers on shale side */}
            {[0, 1, 2, 3].map(i => (
                <line key={`clay${i}`} x1={215} y1={95 + i * 15} x2={305} y2={95 + i * 15} stroke="#d4a574" strokeWidth={1.5} opacity={0.4} />
            ))}
            {/* Swelling indicator */}
            <rect x={215} y={95} width={4} height={60 * swellingPct / 100} fill="#d4a574" opacity={0.3} rx={2}>
                <animate attributeName="height" from={0} to={60 * swellingPct / 100} dur="1.5s" fill="freeze" />
            </rect>
            <text x={260} y={170} fill="#94a3b8" fontSize={9} textAnchor="middle">Swelling: {swellingPct.toFixed(1)}%</text>
            {/* Osmotic pressure gauge */}
            <text x={140} y={205} fill="#94a3b8" fontSize={10} textAnchor="middle">π = {Math.abs(osmoticPsi).toFixed(0)} psi</text>
            <text x={140} y={218} fill={adequacyColor} fontSize={9} textAnchor="middle" fontWeight={700}>{adequacy.toUpperCase()}</text>
        </svg>
    );
};

// ═══════════════════════════════════════════════════════════════════════════
// 5. BARITE BALANCE / MUD WEIGHT PROGRESS
// ═══════════════════════════════════════════════════════════════════════════
export const MudWeightProgress: React.FC<{
    currentMW: number; targetMW: number; minMW: number; maxMW: number; bariteLb: number;
}> = ({ currentMW, targetMW, minMW, maxMW, bariteLb }) => {
    const w = 280, h = 140, r = 55;
    const cx = w / 2, cy = h / 2 + 10;
    const pct = ((currentMW - minMW) / (maxMW - minMW)) * 100;
    const arcLen = 2 * Math.PI * r;
    const fillLen = (pct / 100) * arcLen * 0.75;
    return (
        <svg viewBox={`0 0 ${w} ${h}`} className="fluid-svg w-full h-full">
            <style>{fluidStyles}</style>
            <defs>
                <linearGradient id="mwGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
            </defs>
            <rect width={w} height={h} fill="#0f172a" rx={12} />
            {/* Arc gauge */}
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1e293b" strokeWidth={12} />
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="url(#mwGrad)" strokeWidth={12}
                strokeDasharray={`${arcLen * 0.75} ${arcLen * 0.25}`} strokeDashoffset={arcLen * 0.125}
                strokeLinecap="round" transform={`rotate(135,${cx},${cy})`} opacity={0.3} />
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="url(#mwGrad)" strokeWidth={12}
                strokeDasharray={`${fillLen} ${arcLen}`} strokeDashoffset={0}
                strokeLinecap="round" transform={`rotate(135,${cx},${cy})`}>
                <animate attributeName="stroke-dasharray" from={`0 ${arcLen}`} to={`${fillLen} ${arcLen}`} dur="2s" fill="freeze" />
            </circle>
            {/* Center text */}
            <text x={cx} y={cy - 5} fill="white" fontSize={22} fontWeight={900} textAnchor="middle">{currentMW.toFixed(1)}</text>
            <text x={cx} y={cy + 15} fill="#94a3b8" fontSize={10} textAnchor="middle">ppg MW</text>
            {/* Target marker */}
            <text x={cx + r + 15} y={cy} fill="#f59e0b" fontSize={10} fontWeight={700}>Target: {targetMW.toFixed(1)}</text>
            {/* Barite needed */}
            <rect x={15} y={10} width={120} height={24} rx={6} fill="#1e293b" />
            <text x={75} y={26} fill="#94a3b8" fontSize={9} textAnchor="middle">Barite: {bariteLb.toFixed(0)} lb</text>
        </svg>
    );
};

// ═══════════════════════════════════════════════════════════════════════════
// 6. FLUID LOSS & FILTER CAKE CROSS-SECTION
// ═══════════════════════════════════════════════════════════════════════════
export const FilterCakeCrossSection: React.FC<{
    fluidLoss: number; spurtLoss: number; cakeThickness: number; invasionDepth: number;
    cakeQuality: string; overbalance: number;
}> = ({ fluidLoss, spurtLoss, cakeThickness, invasionDepth, cakeQuality, overbalance }) => {
    const w = 320, h = 200;
    const cakeColor = cakeQuality === 'excellent' ? '#10b981' : cakeQuality === 'good' ? '#06b6d4' : cakeQuality === 'fair' ? '#f59e0b' : '#ef4444';
    const scaledCake = Math.min(30, cakeThickness * 3);
    const scaledInvasion = Math.min(60, invasionDepth * 8);
    return (
        <svg viewBox={`0 0 ${w} ${h}`} className="fluid-svg w-full h-full">
            <style>{fluidStyles}</style>
            <rect width={w} height={h} fill="#0f172a" rx={12} />
            {/* Wellbore */}
            <rect x={20} y={40} width={40} height={120} rx={8} fill="#1e293b" stroke="#475569" strokeWidth={1.5} />
            <text x={40} y={100} fill="#94a3b8" fontSize={9} textAnchor="middle" transform={`rotate(-90,40,100)`}>WELLBORE</text>
            {/* Filter cake layer */}
            <rect x={60} y={55} width={scaledCake} height={90} rx={2} fill={cakeColor} opacity={0.25} stroke={cakeColor} strokeWidth={1}>
                <animate attributeName="width" from={0} to={scaledCake} dur="1.8s" fill="freeze" />
            </rect>
            <text x={60 + scaledCake / 2} y={102} fill={cakeColor} fontSize={8} textAnchor="middle">cake</text>
            {/* Invasion zone */}
            <rect x={60 + scaledCake} y={50} width={scaledInvasion} height={100} rx={4} fill="#6366f1" opacity={0.12} stroke="#818cf8" strokeWidth={1} strokeDasharray="3,3">
                <animate attributeName="width" from={0} to={scaledInvasion} dur="2s" fill="freeze" />
            </rect>
            <text x={60 + scaledCake + scaledInvasion / 2} y={102} fill="#818cf8" fontSize={8} textAnchor="middle">invaded zone</text>
            {/* Formation */}
            <rect x={60 + scaledCake + scaledInvasion} y={40} width={w - (80 + scaledCake + scaledInvasion)} height={120} rx={4} fill="#a16207" opacity={0.15} />
            <text x={w - 30} y={100} fill="#a16207" fontSize={9} textAnchor="middle">formation</text>
            {/* Fluid loss arrows */}
            {Array.from({ length: 4 }).map((_, i) => (
                <g key={i}>
                    <line x1={40} y1={60 + i * 25} x2={60 + scaledCake * 0.7} y2={60 + i * 25} stroke="#3b82f6" strokeWidth={1} opacity={0.5} />
                    <polygon points={`${60 + scaledCake * 0.7},${56 + i * 25} ${60 + scaledCake * 0.7 + 6},${60 + i * 25} ${60 + scaledCake * 0.7},${64 + i * 25}`} fill="#3b82f6" opacity={0.5}>
                        <animate attributeName="points" values={`${60 + scaledCake * 0.7},${56 + i * 25} ${60 + scaledCake * 0.7 + 6},${60 + i * 25} ${60 + scaledCake * 0.7},${64 + i * 25};${60 + scaledCake * 0.7 + 3},${56 + i * 25} ${60 + scaledCake * 0.7 + 9},${60 + i * 25} ${60 + scaledCake * 0.7 + 3},${64 + i * 25};${60 + scaledCake * 0.7},${56 + i * 25} ${60 + scaledCake * 0.7 + 6},${60 + i * 25} ${60 + scaledCake * 0.7},${64 + i * 25}`} dur="2s" repeatCount="indefinite" />
                    </polygon>
                </g>
            ))}
            {/* FT/Loss labels */}
            <text x={40 + scaledCake / 2} y={170} fill={cakeColor} fontSize={9} textAnchor="middle">{cakeThickness.toFixed(1)}/32"</text>
            <text x={60 + scaledCake + scaledInvasion / 2} y={170} fill="#818cf8" fontSize={9} textAnchor="middle">{invasionDepth.toFixed(1)}"</text>
            <text x={w / 2} y={192} fill="#94a3b8" fontSize={10} textAnchor="middle">FL: {fluidLoss.toFixed(1)} cc  |  Spurt: {spurtLoss.toFixed(2)} cc  |  ΔP: {overbalance.toFixed(0)} psi</text>
        </svg>
    );
};

// ═══════════════════════════════════════════════════════════════════════════
// 7. OBM EMULSION STABILITY GAUGE
// ═══════════════════════════════════════════════════════════════════════════
export const EmulsionStabilityGauge: React.FC<{
    esVolts: number; owr: number; oilVol: number; waterVol: number; esStatus: string;
}> = ({ esVolts, owr, oilVol, waterVol, esStatus }) => {
    const w = 260, h = 200, r = 65;
    const cx = w / 2, cy = h / 2 + 10;
    const pct = Math.min(100, (esVolts / 800) * 100);
    const color = esVolts > 500 ? '#10b981' : esVolts > 300 ? '#06b6d4' : esVolts < 150 ? '#ef4444' : '#f59e0b';
    const arcLen = 2 * Math.PI * r * 0.75;
    return (
        <svg viewBox={`0 0 ${w} ${h}`} className="fluid-svg w-full h-full">
            <style>{fluidStyles}</style>
            <rect width={w} height={h} fill="#0f172a" rx={12} />
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1e293b" strokeWidth={14} />
            <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={14}
                strokeDasharray={`${pct / 100 * arcLen} ${arcLen}`} strokeLinecap="round"
                strokeDashoffset={0} transform={`rotate(135,${cx},${cy})`}>
                <animate attributeName="stroke-dasharray" from={`0 ${arcLen}`} to={`${pct / 100 * arcLen} ${arcLen}`} dur="2.5s" fill="freeze" />
            </circle>
            <text x={cx} y={cy - 8} fill="white" fontSize={26} fontWeight={900} textAnchor="middle">{esVolts.toFixed(0)}</text>
            <text x={cx} y={cy + 12} fill={color} fontSize={10} fontWeight={700} textAnchor="middle">Volts</text>
            <text x={cx} y={cy + 28} fill="#94a3b8" fontSize={9} textAnchor="middle">{esStatus}</text>
            {/* O/W ratio bar */}
            <rect x={30} y={160} width={200} height={14} rx={7} fill="#1e293b" />
            <rect x={30} y={160} width={200 * oilVol / 100} height={14} rx={7} fill="#f59e0b" opacity={0.6}>
                <animate attributeName="width" from={0} to={200 * oilVol / 100} dur="1.5s" fill="freeze" />
            </rect>
            <rect x={30 + 200 * oilVol / 100} y={160} width={200 * waterVol / 100} height={14} rx={7} fill="#3b82f6" opacity={0.6}>
                <animate attributeName="width" from={0} to={200 * waterVol / 100} dur="1.5s" fill="freeze" />
            </rect>
            <text x={30 + 100 * oilVol / 100} y={172} fill="white" fontSize={8} textAnchor="middle" fontWeight={700}>Oil {oilVol.toFixed(0)}%</text>
            <text x={30 + 200 * oilVol / 100 + 100 * waterVol / 100} y={172} fill="white" fontSize={8} textAnchor="middle" fontWeight={700}>Water {waterVol.toFixed(0)}%</text>
            <text x={w / 2} y={192} fill="#475569" fontSize={9} textAnchor="middle">O/W Ratio: {owr.toFixed(0)}/{100 - owr}</text>
        </svg>
    );
};

export default { MudRheologyCurve, MarshFunnelFlow, SolidsControlFlow, ShaleInhibitionMembrane, MudWeightProgress, FilterCakeCrossSection, EmulsionStabilityGauge };