import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Droplets, Info, Beaker, Filter, Shield, Gauge, FlaskConical } from 'lucide-react';
import {
   ResponsiveContainer,
   AreaChart,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip as RechartTooltip,
   Area
} from 'recharts';
import { eatonPorePressure, eatonFractureGradient, calculateDExponent, calculateDc } from '../../lib/drilling';
import {
   characterizeMudRheology, MudRheologyInput,
   analyzeSolids, SolidsAnalysisInput,
   evaluateFluidLoss, FluidLossInput,
   evaluateShaleInhibition, ShaleInhibitionInput
} from '../../lib/mud_engineering';
import {
   MudRheologyCurve, MarshFunnelFlow, SolidsControlFlow,
   ShaleInhibitionMembrane, MudWeightProgress, FilterCakeCrossSection, EmulsionStabilityGauge
} from './FluidsSVGs';

interface FluidsTabProps {
   ppInp: any;
   setPpInp: (val: any) => void;
   dExpInp: any;
   setDExpInp: (val: any) => void;
   pressureProfile: any[];
}

const TABS = ['Pore Pressure', 'Mud Rheology', 'Solids Analysis', 'Fluid Loss', 'Shale Inhibition'];

export const FluidsTab: React.FC<FluidsTabProps> = ({
   ppInp,
   setPpInp,
   dExpInp,
   setDExpInp,
   pressureProfile
}) => {
   const [activeTab, setActiveTab] = useState(0);
   const finalPP = eatonPorePressure(ppInp.overburden, ppInp.normalPP, ppInp.dtNormal, ppInp.dtObs);
   const finalFG = eatonFractureGradient(ppInp.overburden, finalPP, ppInp.poisson);
   const dexp = calculateDExponent(dExpInp.rop, dExpInp.rpm, dExpInp.wob, dExpInp.bitDiam);
   const dc = calculateDc(dexp, dExpInp.normalMW, dExpInp.currentMW);

   // Mud Rheology state
   const [rheoInp, setRheoInp] = useState<MudRheologyInput>({
      dial600: 65, dial300: 40, dial200: 30, dial100: 20, dial6: 8, dial3: 6,
      mudWeightPpg: 12.5, temperatureF: 150
   });
   // Solids state
   const [solidsInp, setSolidsInp] = useState<SolidsAnalysisInput>({
      mudWeightPpg: 12.5, solidsVolumePct: 18, oilVolumePct: 0, waterVolumePct: 72,
      mbtLbPerBblEq: 15, clPpm: 3000, apiFluidLossCc: 6.5, cakeThickness32ndIn: 3, sandContentPct: 1.5
   });
   // Fluid loss state
   const [flInp, setFlInp] = useState<FluidLossInput>({
      apiFluidLoss30MinCc: 6.5, spurtLossCc: 1.2, cakeThickness32ndIn: 3,
      cakePermeabilityMicroDarcy: 0.5, solidsVolumePct: 18, overbalancePsi: 500,
      temperatureF: 200, fluidType: 'WBM'
   });
   // Shale inhibition state
   const [shaleInp, setShaleInp] = useState<ShaleInhibitionInput>({
      formationCecMeqPer100g: 25, waterPhaseSalinityPpm: 35000, waterActivity: 0.92,
      mudWaterActivity: 0.75, temperatureF: 180, inhibitorType: 'KCl', inhibitorConcentrationPpb: 15
   });

   // Calculations
   const rheo = useMemo(() => characterizeMudRheology(rheoInp), [rheoInp]);
   const solids = useMemo(() => analyzeSolids(solidsInp), [solidsInp]);
   const flRes = useMemo(() => evaluateFluidLoss(flInp), [flInp]);
   const shaleRes = useMemo(() => evaluateShaleInhibition(shaleInp), [shaleInp]);

   return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
         {/* Tab Bar */}
         <div className="flex gap-1 mb-6 p-1 bg-black/40 rounded-2xl border border-white/5 overflow-x-auto">
            {TABS.map((t, i) => (
               <motion.button
                  key={t}
                  onClick={() => setActiveTab(i)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${activeTab === i ? 'bg-indigo-500/30 text-white border border-indigo-500/40' : 'text-slate-500 hover:text-white'
                     }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
               >
                  {i === 0 && <Droplets className="inline w-3 h-3 mr-1.5" />}
                  {i === 1 && <Beaker className="inline w-3 h-3 mr-1.5" />}
                  {i === 2 && <Filter className="inline w-3 h-3 mr-1.5" />}
                  {i === 3 && <Gauge className="inline w-3 h-3 mr-1.5" />}
                  {i === 4 && <Shield className="inline w-3 h-3 mr-1.5" />}
                  {t}
               </motion.button>
            ))}
         </div>

         <AnimatePresence mode="wait">
            {/* ═══════════════════════════════════════════════════════ */}
            {/* TAB 0: PORE PRESSURE (existing) */}
            {/* ═══════════════════════════════════════════════════════ */}
            {activeTab === 0 && (
               <motion.div key="pp" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-8 space-y-6">
                     <div className="glass-card rounded-3xl p-8 border-white/5 bg-black/40">
                        <div className="flex justify-between items-start mb-8">
                           <div>
                              <p className="text-[10px] text-indigo-400 font-mono uppercase tracking-widest mb-1">Module 2 / Phase 2</p>
                              <h3 className="text-2xl font-black text-white italic tracking-tight uppercase">Pressure Profile & Predictors</h3>
                           </div>
                           <div className="bg-indigo-500/10 p-3 rounded-2xl border border-indigo-500/20">
                              <Droplets className="text-indigo-400" />
                           </div>
                        </div>
                        <div className="h-64 mb-8">
                           <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={pressureProfile} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                 <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                 <XAxis type="number" domain={[8, 18]} hide />
                                 <YAxis reversed dataKey="depth" type="number" fontSize={10} stroke="#475569" tickFormatter={(v) => `${v}ft`} />
                                 <RechartTooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', fontSize: '10px' }} itemStyle={{ color: '#fff' }} />
                                 <Area type="monotone" dataKey="pp" stroke="#6366f1" fill="url(#colorPP)" strokeWidth={2} name="Pore Pressure" />
                                 <Area type="monotone" dataKey="fg" stroke="#f43f5e" fill="url(#colorFG)" strokeWidth={2} name="Frac Gradient" />
                                 <defs>
                                    <linearGradient id="colorPP" x1="0" y1="0" x2="1" y2="0"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} /><stop offset="95%" stopColor="#6366f1" stopOpacity={0} /></linearGradient>
                                    <linearGradient id="colorFG" x1="0" y1="0" x2="1" y2="0"><stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} /><stop offset="95%" stopColor="#f43f5e" stopOpacity={0} /></linearGradient>
                                 </defs>
                              </AreaChart>
                           </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="space-y-6">
                              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-white/10 pb-2">Eaton's PP Predictor</h4>
                              <div className="space-y-4">
                                 <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1"><label className="text-[11px] text-slate-500 uppercase">dt Normal (μs/ft)</label><input type="number" value={ppInp.dtNormal} onChange={e => setPpInp({ ...ppInp, dtNormal: Number(e.target.value) })} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white" /></div>
                                    <div className="space-y-1"><label className="text-[11px] text-slate-500 uppercase">dt Observed (μs/ft)</label><input type="number" value={ppInp.dtObs} onChange={e => setPpInp({ ...ppInp, dtObs: Number(e.target.value) })} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white" /></div>
                                 </div>
                                 <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20"><div className="flex justify-between items-center"><span className="text-[10px] text-indigo-400 font-bold uppercase">Estimated Pore Pressure</span><span className="text-xl font-black text-white italic">{finalPP.toFixed(3)} PSI/FT</span></div></div>
                              </div>
                           </div>
                           <div className="space-y-6">
                              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-white/10 pb-2">d-exponent Analysis</h4>
                              <div className="space-y-4">
                                 <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1"><label className="text-[11px] text-slate-500 uppercase">ROP (ft/hr)</label><input type="number" value={dExpInp.rop} onChange={e => setDExpInp({ ...dExpInp, rop: Number(e.target.value) })} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white" /></div>
                                    <div className="space-y-1"><label className="text-[11px] text-slate-500 uppercase">WOB (klb)</label><input type="number" value={dExpInp.wob} onChange={e => setDExpInp({ ...dExpInp, wob: Number(e.target.value) })} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white" /></div>
                                 </div>
                                 <div className="p-4 bg-white/5 rounded-2xl border border-white/5"><div className="flex justify-between items-center text-[10px]"><span className="text-slate-500 uppercase">Corrected d-exp (dc)</span><span className="text-white font-mono font-bold">{dc.toFixed(2)}</span></div></div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="lg:col-span-4 space-y-6">
                     <div className="glass-card rounded-3xl p-6 border-white/5 bg-black/40">
                        <h4 className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest mb-4">Results Summary</h4>
                        <div className="space-y-3">
                           <div className="flex justify-between text-xs"><span className="text-slate-500">Pore Pressure</span><span className="text-indigo-400 font-mono font-bold">{finalPP.toFixed(3)} psi/ft</span></div>
                           <div className="flex justify-between text-xs"><span className="text-slate-500">Frac Gradient</span><span className="text-rose-400 font-mono font-bold">{finalFG.toFixed(3)} psi/ft</span></div>
                           <div className="flex justify-between text-xs"><span className="text-slate-500">d-exponent</span><span className="text-amber-400 font-mono font-bold">{dexp.toFixed(2)}</span></div>
                           <div className="flex justify-between text-xs"><span className="text-slate-500">dc (corrected)</span><span className="text-amber-400 font-mono font-bold">{dc.toFixed(2)}</span></div>
                        </div>
                     </div>
                  </div>
               </motion.div>
            )}

            {/* ═══════════════════════════════════════════════════════ */}
            {/* TAB 1: MUD RHEOLOGY — LIVE ANIMATIONS */}
            {/* ═══════════════════════════════════════════════════════ */}
            {activeTab === 1 && (
               <motion.div key="rheo" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-7 space-y-6">
                     <div className="glass-card rounded-3xl p-8 border-white/5 bg-black/40">
                        <div className="flex justify-between items-start mb-6">
                           <div>
                              <p className="text-[10px] text-indigo-400 font-mono uppercase tracking-widest mb-1">API RP 13B-1 / 13B-2 / 13D</p>
                              <h3 className="text-2xl font-black text-white italic tracking-tight uppercase">Mud Rheology & Models</h3>
                           </div>
                        </div>
                        <div className="h-72 mb-6">
                           <MudRheologyCurve pv={rheo.plasticViscosityCp} yp={rheo.yieldPointLbfPer100ft2}
                              dial600={rheoInp.dial600} dial300={rheoInp.dial300} dial6={rheoInp.dial6 ?? 0} dial3={rheoInp.dial3 ?? 0}
                              modelType={rheo.modelType} nPrime={rheo.nPrime} />
                        </div>
                        <div className="grid grid-cols-3 gap-3 mb-6">
                           <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-center">
                              <p className="text-[9px] text-slate-500 uppercase mb-1">PV (cP)</p>
                              <p className="text-lg font-black text-white">{rheo.plasticViscosityCp.toFixed(0)}</p>
                           </div>
                           <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-center">
                              <p className="text-[9px] text-slate-500 uppercase mb-1">YP (lbf/100ft²)</p>
                              <p className="text-lg font-black text-white">{rheo.yieldPointLbfPer100ft2.toFixed(0)}</p>
                           </div>
                           <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-center">
                              <p className="text-[9px] text-slate-500 uppercase mb-1">YP/PV Ratio</p>
                              <p className="text-lg font-black text-white">{rheo.yieldPointRatio.toFixed(2)}</p>
                           </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                           {(['dial600', 'dial300', 'dial200', 'dial100', 'dial6', 'dial3'] as const).map(key => (
                              <div key={key} className="space-y-1">
                                 <label className="text-[9px] text-slate-500 uppercase">{key.replace('dial', '')} RPM</label>
                                 <input type="number" value={rheoInp[key] ?? 0} onChange={e => setRheoInp({ ...rheoInp, [key]: Number(e.target.value) })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-1.5 text-xs text-white" />
                              </div>
                           ))}
                           <div className="space-y-1">
                              <label className="text-[9px] text-slate-500 uppercase">Temp °F</label>
                              <input type="number" value={rheoInp.temperatureF} onChange={e => setRheoInp({ ...rheoInp, temperatureF: Number(e.target.value) })}
                                 className="w-full bg-white/5 border border-white/10 rounded-lg p-1.5 text-xs text-white" />
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="lg:col-span-5 space-y-6">
                     <div className="glass-card rounded-3xl p-6 border-white/5 bg-black/40">
                        <h4 className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest mb-4">Marsh Funnel Flow</h4>
                        <div className="h-64">
                           <MarshFunnelFlow funnelSeconds={rheo.marshFunnelSecPerQt} effectiveViscosity={rheo.effectiveViscosityCp} mudWeight={rheoInp.mudWeightPpg} />
                        </div>
                     </div>
                     <div className="glass-card rounded-3xl p-6 border-white/5 bg-black/40">
                        <h4 className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest mb-4">Model Parameters</h4>
                        <div className="space-y-2 text-xs">
                           <div className="flex justify-between"><span className="text-slate-500">Model</span><span className="text-white font-bold">{rheo.modelType}</span></div>
                           <div className="flex justify-between"><span className="text-slate-500">n' (flow index)</span><span className="text-white font-mono">{rheo.nPrime.toFixed(4)}</span></div>
                           <div className="flex justify-between"><span className="text-slate-500">K' (consistency)</span><span className="text-white font-mono">{rheo.kPrimeEqCp.toFixed(1)} eq cP</span></div>
                           {rheo.tau0LbfPer100ft2 !== undefined && <div className="flex justify-between"><span className="text-slate-500">τ₀ (yield)</span><span className="text-white font-mono">{rheo.tau0LbfPer100ft2.toFixed(2)}</span></div>}
                           <div className="flex justify-between"><span className="text-slate-500">μ<sub>eff</sub> @ 511s⁻¹</span><span className="text-white font-mono">{rheo.effectiveViscosityCp.toFixed(1)} cP</span></div>
                           <div className="flex justify-between"><span className="text-slate-500">Flow (gpm/in²)</span><span className="text-white font-mono">{rheo.gpmPerSqIn.toFixed(3)}</span></div>
                        </div>
                     </div>
                  </div>
               </motion.div>
            )}

            {/* ═══════════════════════════════════════════════════════ */}
            {/* TAB 2: SOLIDS ANALYSIS — LIVE ANIMATIONS */}
            {/* ═══════════════════════════════════════════════════════ */}
            {activeTab === 2 && (
               <motion.div key="solids" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-8 space-y-6">
                     <div className="glass-card rounded-3xl p-8 border-white/5 bg-black/40">
                        <div className="flex justify-between items-start mb-6">
                           <div>
                              <p className="text-[10px] text-indigo-400 font-mono uppercase tracking-widest mb-1">Retort • MBT • Chloride</p>
                              <h3 className="text-2xl font-black text-white italic tracking-tight uppercase">Solids & Dilution Analysis</h3>
                           </div>
                        </div>
                        <div className="h-56 mb-6">
                           <SolidsControlFlow
                              shakerEff={solids.solidsControlEfficiencyPct * 0.85} desanderEff={solids.solidsControlEfficiencyPct * 0.7}
                              desilterEff={solids.solidsControlEfficiencyPct * 0.6} centrifugeEff={solids.solidsControlEfficiencyPct * 0.5}
                              shakerLoad={400} desanderLoad={280} lgsPct={solids.lgsVolumePct} overallEff={solids.solidsControlEfficiencyPct} />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                           <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-center">
                              <p className="text-[9px] text-slate-500 uppercase">LGS</p>
                              <p className="text-base font-black text-white">{solids.lgsVolumePct.toFixed(1)}%</p>
                           </div>
                           <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-center">
                              <p className="text-[9px] text-slate-500 uppercase">HGS (Barite)</p>
                              <p className="text-base font-black text-white">{solids.hgsVolumePct.toFixed(1)}%</p>
                           </div>
                           <div className="p-3 bg-rose-500/10 rounded-xl border border-rose-500/20 text-center">
                              <p className="text-[9px] text-slate-500 uppercase">Drilled Solids</p>
                              <p className="text-base font-black text-white">{solids.drilledSolidsPct.toFixed(1)}%</p>
                           </div>
                           <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-center">
                              <p className="text-[9px] text-slate-500 uppercase">Bentonite</p>
                              <p className="text-base font-black text-white">{solids.bentoniteVolumePct.toFixed(1)}%</p>
                           </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                           {(['mudWeightPpg', 'solidsVolumePct', 'mbtLbPerBblEq', 'clPpm', 'apiFluidLossCc', 'cakeThickness32ndIn', 'sandContentPct', 'waterVolumePct'] as const).map(key => (
                              <div key={key} className="space-y-1">
                                 <label className="text-[9px] text-slate-500 uppercase">{key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</label>
                                 <input type="number" value={solidsInp[key] ?? 0} onChange={e => setSolidsInp({ ...solidsInp, [key]: Number(e.target.value) })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-1.5 text-xs text-white" />
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
                  <div className="lg:col-span-4 space-y-6">
                     <div className="glass-card rounded-3xl p-6 border-white/5 bg-black/40">
                        <h4 className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest mb-4">Dilution Required</h4>
                        <div className="space-y-3 text-xs">
                           <div className="flex justify-between"><span className="text-slate-500">Dilution</span><span className="text-amber-400 font-mono font-bold">{solids.dilutionRequiredBblPer100Bbl.toFixed(1)} bbl/100bbl</span></div>
                           <div className="flex justify-between"><span className="text-slate-500">Water Needed</span><span className="text-blue-400 font-mono font-bold">{solids.waterRequiredBblPer100Bbl.toFixed(1)} bbl/100bbl</span></div>
                           <div className="flex justify-between"><span className="text-slate-500">Barite Req.</span><span className="text-emerald-400 font-mono font-bold">{solids.bariteRequiredLbPerBbl.toFixed(0)} lb/bbl</span></div>
                           <div className="flex justify-between"><span className="text-slate-500">LGS/HGS Ratio</span><span className="text-white font-mono font-bold">{solids.lgsToHgsRatio.toFixed(2)}</span></div>
                           <div className="flex justify-between"><span className="text-slate-500">Solids Control Eff.</span><span className="text-white font-mono font-bold">{solids.solidsControlEfficiencyPct.toFixed(0)}%</span></div>
                        </div>
                     </div>
                     <div className="glass-card rounded-3xl p-6 border-white/5 bg-black/40">
                        <h4 className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest mb-4">Filter Cake</h4>
                        <div className="space-y-2 text-xs">
                           <div className="flex justify-between"><span className="text-slate-500">Cake Density</span><span className="text-white font-mono">{solids.filterCakeDensityPpg.toFixed(1)} ppg</span></div>
                           <div className="flex justify-between"><span className="text-slate-500">Cake Porosity</span><span className="text-white font-mono">{solids.filterCakePorosityPct.toFixed(0)}%</span></div>
                           <div className="flex justify-between"><span className="text-slate-500">Sand Content</span><span className="text-white font-mono">{solids.sandVolumePct.toFixed(1)}%</span></div>
                        </div>
                     </div>
                  </div>
               </motion.div>
            )}

            {/* ═══════════════════════════════════════════════════════ */}
            {/* TAB 3: FLUID LOSS — LIVE ANIMATIONS */}
            {/* ═══════════════════════════════════════════════════════ */}
            {activeTab === 3 && (
               <motion.div key="fl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-7 space-y-6">
                     <div className="glass-card rounded-3xl p-8 border-white/5 bg-black/40">
                        <div className="flex justify-between items-start mb-6">
                           <div>
                              <p className="text-[10px] text-indigo-400 font-mono uppercase tracking-widest mb-1">API RP 13B-1 / 13I</p>
                              <h3 className="text-2xl font-black text-white italic tracking-tight uppercase">Fluid Loss & Filter Cake</h3>
                           </div>
                        </div>
                        <div className="h-60 mb-6">
                           <FilterCakeCrossSection fluidLoss={flRes.staticFluidLossCc} spurtLoss={flInp.spurtLossCc}
                              cakeThickness={flInp.cakeThickness32ndIn} invasionDepth={flRes.invasionDepthIn}
                              cakeQuality={flRes.cakeQuality} overbalance={flInp.overbalancePsi} />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                           <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-center">
                              <p className="text-[9px] text-slate-500 uppercase">Cake Quality</p>
                              <p className={`text-sm font-black ${flRes.cakeQuality === 'excellent' ? 'text-emerald-400' : flRes.cakeQuality === 'good' ? 'text-cyan-400' : flRes.cakeQuality === 'fair' ? 'text-amber-400' : 'text-rose-400'}`}>{flRes.cakeQuality.toUpperCase()}</p>
                           </div>
                           <div className="p-3 bg-rose-500/10 rounded-xl border border-rose-500/20 text-center">
                              <p className="text-[9px] text-slate-500 uppercase">Skin Damage</p>
                              <p className="text-sm font-black text-white">{flRes.formationDamageSkin.toFixed(2)}</p>
                           </div>
                           <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-center">
                              <p className="text-[9px] text-slate-500 uppercase">Invasion</p>
                              <p className="text-sm font-black text-white">{flRes.invasionDepthIn.toFixed(1)}"</p>
                           </div>
                           <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-center">
                              <p className="text-[9px] text-slate-500 uppercase">HTHP FL</p>
                              <p className="text-sm font-black text-white">{flRes.expectedHthpFluidLossCc.toFixed(1)} cc</p>
                           </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                           {(['apiFluidLoss30MinCc', 'spurtLossCc', 'cakeThickness32ndIn', 'cakePermeabilityMicroDarcy', 'overbalancePsi', 'temperatureF'] as const).map(key => (
                              <div key={key} className="space-y-1">
                                 <label className="text-[9px] text-slate-500 uppercase">{key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</label>
                                 <input type="number" value={flInp[key] ?? 0} onChange={e => setFlInp({ ...flInp, [key]: Number(e.target.value) })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-1.5 text-xs text-white" />
                              </div>
                           ))}
                           <div className="space-y-1">
                              <label className="text-[9px] text-slate-500 uppercase">Fluid Type</label>
                              <select value={flInp.fluidType} onChange={e => setFlInp({ ...flInp, fluidType: e.target.value as any })}
                                 className="w-full bg-white/5 border border-white/10 rounded-lg p-1.5 text-xs text-white">
                                 <option value="WBM">WBM</option>
                                 <option value="OBM">OBM</option>
                                 <option value="SBM">SBM</option>
                              </select>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="lg:col-span-5 space-y-6">
                     <div className="glass-card rounded-3xl p-6 border-white/5 bg-black/40">
                        <h4 className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest mb-4">Loss Summary</h4>
                        <div className="space-y-3 text-xs">
                           <div className="flex justify-between"><span className="text-slate-500">Static FL</span><span className="text-white font-mono">{flRes.staticFluidLossCc.toFixed(1)} cc</span></div>
                           <div className="flex justify-between"><span className="text-slate-500">Dynamic FL</span><span className="text-white font-mono">{flRes.dynamicFluidLossCc.toFixed(1)} cc</span></div>
                           <div className="flex justify-between"><span className="text-slate-500">Spurt Loss</span><span className="text-white font-mono">{flInp.spurtLossCc.toFixed(2)} cc ({flRes.spurtLossInterpretation})</span></div>
                           <div className="flex justify-between"><span className="text-slate-500">Cake Compress.</span><span className="text-white font-mono">{flRes.cakeCompressibility.toFixed(3)}</span></div>
                           <div className="flex justify-between"><span className="text-slate-500">Erosion Vel.</span><span className="text-white font-mono">{flRes.filterCakeErosionVelocityFtPerMin.toFixed(0)} ft/min</span></div>
                        </div>
                     </div>
                     <div className="glass-card rounded-3xl p-6 border-white/5 bg-black/40">
                        <h4 className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest mb-4">Mud Weight Gauge</h4>
                        <div className="h-36">
                           <MudWeightProgress currentMW={solidsInp.mudWeightPpg} targetMW={solidsInp.mudWeightPpg + (flInp.overbalancePsi / 1000) * 0.5} minMW={8.0} maxMW={18.0} bariteLb={solids.bariteRequiredLbPerBbl} />
                        </div>
                     </div>
                  </div>
               </motion.div>
            )}

            {/* ═══════════════════════════════════════════════════════ */}
            {/* TAB 4: SHALE INHIBITION — LIVE ANIMATIONS */}
            {/* ═══════════════════════════════════════════════════════ */}
            {activeTab === 4 && (
               <motion.div key="shale" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-7 space-y-6">
                     <div className="glass-card rounded-3xl p-8 border-white/5 bg-black/40">
                        <div className="flex justify-between items-start mb-6">
                           <div>
                              <p className="text-[10px] text-indigo-400 font-mono uppercase tracking-widest mb-1">Chenevert (1970) • Activity Balance</p>
                              <h3 className="text-2xl font-black text-white italic tracking-tight uppercase">Shale Inhibition Analysis</h3>
                           </div>
                        </div>
                        <div className="h-60 mb-6">
                           <ShaleInhibitionMembrane waterActivity={shaleInp.waterActivity} mudActivity={shaleInp.mudWaterActivity}
                              osmoticPsi={shaleRes.osmoticPressurePsi} direction={shaleRes.waterTransportDirection}
                              swellingPct={shaleRes.swellingIndexPct} adequacy={shaleRes.inhibitionAdequacy} />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                           <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-center">
                              <p className="text-[9px] text-slate-500 uppercase">Δ Activity</p>
                              <p className="text-sm font-black text-white">{shaleRes.activityDifference.toFixed(4)}</p>
                           </div>
                           <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-center">
                              <p className="text-[9px] text-slate-500 uppercase">Osmotic π</p>
                              <p className="text-sm font-black text-white">{Math.abs(shaleRes.osmoticPressurePsi).toFixed(0)} psi</p>
                           </div>
                           <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-center">
                              <p className="text-[9px] text-slate-500 uppercase">Swelling</p>
                              <p className="text-sm font-black text-white">{shaleRes.swellingIndexPct.toFixed(1)}%</p>
                           </div>
                           <div className="p-3 bg-rose-500/10 rounded-xl border border-rose-500/20 text-center">
                              <p className="text-[9px] text-slate-500 uppercase">Dispersion Risk</p>
                              <p className="text-sm font-black text-white">{shaleRes.dispersionRisk.toUpperCase()}</p>
                           </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                           {(['formationCecMeqPer100g', 'waterPhaseSalinityPpm', 'waterActivity', 'mudWaterActivity', 'temperatureF', 'inhibitorConcentrationPpb'] as const).map(key => (
                              <div key={key} className="space-y-1">
                                 <label className="text-[9px] text-slate-500 uppercase">{key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</label>
                                 <input type="number" value={shaleInp[key] ?? 0} onChange={e => setShaleInp({ ...shaleInp, [key]: Number(e.target.value) })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-1.5 text-xs text-white" />
                              </div>
                           ))}
                           <div className="space-y-1">
                              <label className="text-[9px] text-slate-500 uppercase">Inhibitor Type</label>
                              <select value={shaleInp.inhibitorType} onChange={e => setShaleInp({ ...shaleInp, inhibitorType: e.target.value as any })}
                                 className="w-full bg-white/5 border border-white/10 rounded-lg p-1.5 text-xs text-white">
                                 <option value="KCl">KCl</option><option value="NaCl">NaCl</option><option value="CaCl2">CaCl₂</option>
                                 <option value="amine">Amine</option><option value="glycol">Glycol</option><option value="silicate">Silicate</option>
                              </select>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="lg:col-span-5 space-y-6">
                     <div className="glass-card rounded-3xl p-6 border-white/5 bg-black/40">
                        <h4 className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest mb-4">Inhibition Status</h4>
                        <div className={`p-4 rounded-xl mb-4 ${shaleRes.inhibitionAdequacy === 'excellent' ? 'bg-emerald-500/10 border border-emerald-500/20' :
                              shaleRes.inhibitionAdequacy === 'good' ? 'bg-cyan-500/10 border border-cyan-500/20' :
                                 shaleRes.inhibitionAdequacy === 'marginal' ? 'bg-amber-500/10 border border-amber-500/20' :
                                    'bg-rose-500/10 border border-rose-500/20'
                           }`}>
                           <p className={`text-sm font-black ${shaleRes.inhibitionAdequacy === 'excellent' ? 'text-emerald-400' :
                                 shaleRes.inhibitionAdequacy === 'good' ? 'text-cyan-400' :
                                    shaleRes.inhibitionAdequacy === 'marginal' ? 'text-amber-400' : 'text-rose-400'
                              }`}>{shaleRes.inhibitionAdequacy.toUpperCase()}</p>
                           <p className="text-[10px] text-slate-400 mt-1">Water Transport: {shaleRes.waterTransportDirection.replace(/-/g, ' ')}</p>
                        </div>
                        <div className="space-y-3 text-xs">
                           <div className="flex justify-between"><span className="text-slate-500">CEC</span><span className="text-white font-mono">{shaleInp.formationCecMeqPer100g} meq/100g</span></div>
                           <div className="flex justify-between"><span className="text-slate-500">Salinity</span><span className="text-white font-mono">{shaleInp.waterPhaseSalinityPpm.toLocaleString()} ppm</span></div>
                           <div className="flex justify-between"><span className="text-slate-500">Recommended Inhibitor</span><span className="text-white font-mono">{shaleRes.recommendedInhibitorConcentration.toFixed(1)} ppb</span></div>
                           <div className="flex justify-between"><span className="text-slate-500">Current Inhibitor</span><span className="text-white font-mono">{shaleInp.inhibitorConcentrationPpb} ppb ({shaleInp.inhibitorType})</span></div>
                        </div>
                     </div>
                     <div className="glass-card rounded-3xl p-6 border-white/5 bg-black/40">
                        <h4 className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest mb-4">ABOUT THIS CALCULATION</h4>
                        <div className="text-[10px] text-slate-400 space-y-2 leading-relaxed">
                           <p>Based on <strong>Chenevert (1970)</strong> "Shale Control with Balanced Activity Oil-Continuous Muds" — osmotic pressure drives water into or out of shale based on water activity difference between mud and shale pore water.</p>
                           <p className="text-indigo-400/70 font-mono">π = (RT/V<sub>w</sub>) · ln(a<sub>mud</sub> / a<sub>shale</sub>)</p>
                           <p>Positive π → water flows OUT of shale (drying/inhibition). Negative π → water flows INTO shale (hydration/swelling).</p>
                        </div>
                     </div>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
      </div>
   );
};

export default FluidsTab;