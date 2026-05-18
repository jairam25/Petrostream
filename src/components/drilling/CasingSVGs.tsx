import React from "react";
import { motion } from "motion/react";

// Casing Depth vs Lithology Schematic
export function CasingLithologySVG({ depth, sfBurst, sfCollapse, sfTensile }: { depth: number; sfBurst: number; sfCollapse: number; sfTensile: number }) {
    const h = 420;
    const w = 320;
    const margin = { top: 30, bottom: 30, left: 60, right: 30 };
    const plotH = h - margin.top - margin.bottom;
    const maxDepth = Math.max(depth * 1.2, 10000);
    const casingY = margin.top + (depth / maxDepth) * plotH;

    const layers = [
        { name: "CONDUCTOR", top: 0, h: 0.08 * plotH, color: "#64748b" },
        { name: "SURFACE", top: 0.08 * plotH, h: 0.15 * plotH, color: "#94a3b8" },
        { name: "INTERMEDIATE", top: 0.23 * plotH, h: 0.3 * plotH, color: "#cbd5e1" },
        { name: "PRODUCTION", top: 0.53 * plotH, h: 0.47 * plotH, color: "#e2e8f0" },
    ];

    const strataColors = [
        { yPct: 0, hPct: 0.1, color: "#78350f", label: "Topsoil/Clay" },
        { yPct: 0.1, hPct: 0.15, color: "#92400e", label: "Sandstone" },
        { yPct: 0.25, hPct: 0.15, color: "#57534e", label: "Shale" },
        { yPct: 0.4, hPct: 0.1, color: "#a8a29e", label: "Limestone" },
        { yPct: 0.5, hPct: 0.1, color: "#854d0e", label: "Sand/Shale" },
        { yPct: 0.6, hPct: 0.15, color: "#ca8a04", label: "Dolomite" },
        { yPct: 0.75, hPct: 0.25, color: "#1e293b", label: "Reservoir Zone" },
    ];

    return (
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            <defs>
                <linearGradient id="casingPipe1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.05" />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.3" />
                </linearGradient>
                <linearGradient id="casingPipe2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.05" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.3" />
                </linearGradient>
                <radialGradient id="bglow1" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                </radialGradient>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
            </defs>

            {/* Background */}
            <rect x={margin.left} y={margin.top} width={w - margin.left - margin.right} height={plotH} fill="#05070a" rx="12" />

            {/* Strata */}
            {strataColors.map((s, i) => (
                <rect
                    key={i}
                    x={margin.left}
                    y={margin.top + s.yPct * plotH}
                    width={w - margin.left - margin.right}
                    height={s.hPct * plotH}
                    fill={s.color}
                    fillOpacity={0.15}
                    rx={i === 0 ? 12 : i === strataColors.length - 1 ? 0 : 0}
                />
            ))}

            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
                <React.Fragment key={pct}>
                    <line x1={margin.left} y1={margin.top + pct * plotH} x2={margin.left - 8} y2={margin.top + pct * plotH} stroke="#64748b" strokeWidth="1" />
                    <text x={margin.left - 12} y={margin.top + pct * plotH + 3} textAnchor="end" fill="#64748b" fontSize="8" fontFamily="monospace" fontWeight="bold">
                        {Math.round(maxDepth * pct).toLocaleString()}
                    </text>
                    <line x1={margin.left} y1={margin.top + pct * plotH} x2={margin.left + w - margin.left - margin.right} y2={margin.top + pct * plotH} stroke="#1e293b" strokeWidth="1" strokeDasharray="4,4" />
                </React.Fragment>
            ))}

            {/* Wellbore */}
            <rect x={margin.left + (w - margin.left - margin.right) / 2 - 12} y={margin.top} width={24} height={plotH} fill="#0f172a" rx="4" />
            <motion.rect
                x={margin.left + (w - margin.left - margin.right) / 2 - 10}
                y={margin.top}
                width={20}
                height={casingY - margin.top}
                fill="url(#casingPipe1)"
                rx="2"
                animate={{ filter: ["drop-shadow(0 0 2px #38bdf8)", "drop-shadow(0 0 6px #38bdf8)", "drop-shadow(0 0 2px #38bdf8)"] }}
                transition={{ repeat: Infinity, duration: 3 }}
            />

            {/* Casing Shoe */}
            <motion.circle
                cx={margin.left + (w - margin.left - margin.right) / 2}
                cy={casingY}
                r="6"
                fill="#06b6d4"
                animate={{ opacity: [0.6, 1, 0.6], r: [5, 7, 5] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
            />
            <text x={margin.left + (w - margin.left - margin.right) / 2 + 20} y={casingY + 3} fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold">
                {depth.toLocaleString()} ft
            </text>

            {/* Annular Cement */}
            <rect x={margin.left + (w - margin.left - margin.right) / 2 - 16} y={margin.top} width={4} height={casingY - margin.top - 30} fill="#ca8a04" fillOpacity="0.3" rx="1" />
            <rect x={margin.left + (w - margin.left - margin.right) / 2 + 12} y={margin.top} width={4} height={casingY - margin.top - 30} fill="#ca8a04" fillOpacity="0.3" rx="1" />

            {/* Safety Factor Gauges on right */}
            <g transform={`translate(${w - margin.right + 5}, ${margin.top + 30})`}>
                {[
                    { label: "BURST", val: sfBurst, max: 2.0, y: 0 },
                    { label: "COLLAPSE", val: sfCollapse, max: 2.0, y: 100 },
                    { label: "TENSILE", val: sfTensile, max: 2.0, y: 200 },
                ].map((g, i) => {
                    const barH = 60;
                    const barW = 8;
                    const pct = Math.min(g.val / g.max, 1);
                    const danger = pct < 0.5;
                    const warn = pct >= 0.5 && pct < 0.8;
                    const good = pct >= 0.8;
                    const color = danger ? "#ef4444" : warn ? "#f59e0b" : "#22c55e";
                    return (
                        <g key={i} transform={`translate(0, ${g.y})`}>
                            <text x={18} y={10} fill="#94a3b8" fontSize="7" fontFamily="monospace" fontWeight="bold">{g.label}</text>
                            <rect x={18} y={14} width={barW} height={barH} fill="#1e293b" rx="4" />
                            <motion.rect
                                x={18} y={14 + (1 - pct) * barH} width={barW} height={pct * barH} fill={color} rx="4"
                                initial={{ height: 0, y: 14 + barH }}
                                animate={{ height: pct * barH, y: 14 + (1 - pct) * barH }}
                                transition={{ duration: 1, delay: 0.5 }}
                            />
                            <text x={30} y={14 + barH + 12} textAnchor="middle" fill={color} fontSize="8" fontFamily="monospace" fontWeight="bold">
                                {g.val.toFixed(2)}
                            </text>
                        </g>
                    );
                })}
            </g>

            {/* Strata Labels */}
            {strataColors.map((s, i) => (
                <text key={i} x={margin.left + 6} y={margin.top + s.yPct * plotH + s.hPct * plotH / 2 + 3} fill="#64748b" fontSize="7" fontFamily="monospace" fontWeight="bold" opacity="0.7">
                    {s.label}
                </text>
            ))}

            {/* Depth axis label */}
            <text x={10} y={h / 2} textAnchor="middle" fill="#475569" fontSize="8" fontFamily="monospace" fontWeight="bold" transform={`rotate(-90, 10, ${h / 2})`}>
                TVD (ft)
            </text>

            {/* Bottom cap */}
            <rect x={15} y={margin.top + plotH} width={w - 30} height={2} fill="#0f172a" />

            <text x={w / 2} y={h - 6} textAnchor="middle" fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold" opacity="0.4">
                CASING DESIGN & LITHOLOGY PROFILE
            </text>
        </svg>
    );
}

// Casing Section Cutaway
export function CasingCutawaySVG({ grade, weight, internalP, externalP }: { grade: string; weight: number; internalP: number; externalP: number }) {
    return (
        <svg viewBox="0 0 280 340" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            <defs>
                <radialGradient id="pipeGrad" cx="50%" cy="50%">
                    <stop offset="0%" stopColor="#1e293b" />
                    <stop offset="40%" stopColor="#334155" />
                    <stop offset="70%" stopColor="#1e293b" />
                    <stop offset="100%" stopColor="#475569" />
                </radialGradient>
                <linearGradient id="fluidGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1" />
                </linearGradient>
            </defs>

            {/* Pipe exterior */}
            <rect x="80" y="20" width="120" height="300" fill="url(#pipeGrad)" rx="8" />

            {/* ID / fluid */}
            <rect x="110" y="25" width="60" height="290" fill="url(#fluidGrad)" rx="4" />

            {/* Arrows for internal pressure */}
            {[40, 80, 120, 160].map((y, i) => (
                <motion.g key={`int-${i}`} animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2 + i * 0.3 }}>
                    <line x1="115" y1={y} x2="130" y2={y} stroke="#f43f5e" strokeWidth="1.5" markerEnd="url(#arrowR)" />
                </motion.g>
            ))}

            {/* Arrows for external pressure */}
            {[40, 80, 120, 160].map((y, i) => (
                <motion.g key={`ext-${i}`} animate={{ x: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2 + i * 0.3 }}>
                    <line x1="65" y1={y} x2="80" y2={y} stroke="#38bdf8" strokeWidth="1.5" />
                </motion.g>
            ))}

            {/* Markers */}
            <defs>
                <marker id="arrowR" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <path d="M0,0 L6,3 L0,6 Z" fill="#f43f5e" />
                </marker>
            </defs>

            {/* Pipe Ovals at top/bottom for 3D effect */}
            <ellipse cx="140" cy="22" rx="60" ry="10" fill="#475569" />
            <ellipse cx="140" cy="318" rx="60" ry="10" fill="#1e293b" />
            <ellipse cx="140" cy="27" rx="30" ry="5" fill="#06b6d4" fillOpacity="0.3" />

            {/* Grade label */}
            <g transform="translate(20, 200)">
                <text x="0" y="0" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">{grade}</text>
                <text x="0" y="14" fill="#64748b" fontSize="8" fontFamily="monospace">{weight} ppf</text>
                <text x="0" y="28" fill="#f43f5e" fontSize="7" fontFamily="monospace">P<sub>int</sub> {internalP} psi</text>
                <text x="0" y="42" fill="#38bdf8" fontSize="7" fontFamily="monospace">P<sub>ext</sub> {externalP} psi</text>
            </g>
        </svg>
    );
}

// TOC (Top of Cement) Animation
export function CementTOCSVG({ depth, mudMW }: { depth: number; mudMW: number }) {
    const tocHeight = 120;
    return (
        <svg viewBox="0 0 260 340" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            {/* Borehole */}
            <rect x="110" y="30" width="40" height="280" fill="#0f172a" rx="6" />
            {/* Annulus */}
            <rect x="90" y="30" width="20" height={tocHeight} fill="#ca8a04" fillOpacity="0.4" rx="2" />
            <rect x="150" y="30" width="20" height={tocHeight} fill="#ca8a04" fillOpacity="0.4" rx="2" />
            {/* Slurry batch flowing down */}
            <motion.rect
                x="90" y={tocHeight - 20} width="20" height="20" fill="#ca8a04" fillOpacity="0.7" rx="2"
                animate={{ y: [tocHeight - 20, tocHeight + 260] }} transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
            />
            <motion.rect
                x="150" y={tocHeight + 40} width="20" height="20" fill="#ca8a04" fillOpacity="0.7" rx="2"
                animate={{ y: [tocHeight + 40, tocHeight + 320] }} transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 2 }}
            />
            {/* TOC dashed line */}
            <line x1="70" y1={30 + tocHeight} x2="200" y2={30 + tocHeight} stroke="#ca8a04" strokeWidth="1" strokeDasharray="3,3" />
            <text x="200" y={33 + tocHeight} fill="#ca8a04" fontSize="8" fontFamily="monospace" fontWeight="bold">TOC</text>
            <text x="130" y={340} textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">{mudMW} ppg Mud</text>
        </svg>
    );
}