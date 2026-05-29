import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const C = {
  onCorta: "#3b82f6",
  onMedia: "#60a5fa",
  acwi:    "#10b981",
  vig:     "#ec4899",
  fci:     "#f97316",
  cash:    "#94a3b8",
  gold:    "#eab308",
};

const portfolios = [
  {
    id: 1, row: 1,
    pos: "ARQUERO", emoji: "🧤",
    name: "Placard",
    intencion: "Casi como bajo el colchón, pero rindiendo.",
    alloc: [
      { name: "ON < 2Y", value: 60, color: C.onCorta },
      { name: "FCI Money Market USD", value: 30, color: C.cash },
      { name: "GLD", value: 10, color: C.gold },
    ],
  },
  {
    id: 2, row: 2, side: "right",
    pos: "CENTRAL IZQUIERDO", emoji: "🏠",
    name: "Ladrillo",
    intencion: "Como si fuera una casa: rendimiento modesto y constante + leve apreciación en el tiempo.",
    alloc: [
      { name: "ON 3–5Y", value: 75, color: C.onMedia },
      { name: "VIG", value: 15, color: C.vig },
      { name: "GLD", value: 10, color: C.gold },
    ],
  },
  {
    id: 3, row: 2, side: "left",
    pos: "CENTRAL DERECHO", emoji: "🟫",
    name: "Plata dulce de membrillo",
    intencion: "Rendimiento de renta fija puro.",
    alloc: [
      { name: "ON 3–5Y", value: 75, color: C.onMedia },
      { name: "FCI Renta Fija Sudamericana", value: 25, color: C.fci },
    ],
  },
  {
    id: 4, row: 2, side: "center",
    pos: "CENTRAL", emoji: "½",
    name: "Miti-Miti",
    intencion: "Mitad mundo, mitad región.",
    alloc: [
      { name: "ACWI", value: 50, color: C.acwi },
      { name: "FCI Renta Fija Sudamericana", value: 50, color: C.fci },
    ],
  },
  {
    id: 5, row: 3,
    pos: "CINCO", emoji: "🧉",
    name: "Mate y Sombrilla",
    intencion: "Retirar un poco cada mes sin agotar el patrimonio.",
    alloc: [
      { name: "FCI Money Market (2 años de gastos)", value: 20, color: C.cash },
      { name: "Bond Ladder ON (próximos 5 años)", value: 30, color: C.onMedia },
      { name: "ACWI", value: 25, color: C.acwi },
      { name: "VIG", value: 25, color: C.vig },
    ],
  },
  {
    id: 6, row: 4, side: "left",
    pos: "VOLANTE IZQUIERDO", emoji: "⚖️",
    name: "A la parrilla",
    intencion: "Crecimiento con protección. Retiros probables.",
    alloc: [
      { name: "ON 1–3Y", value: 50, color: C.onMedia },
      { name: "GLD", value: 10, color: C.gold },
      { name: "ACWI", value: 20, color: C.acwi },
      { name: "VIG", value: 20, color: C.vig },
    ],
  },
  {
    id: 7, row: 4, side: "right",
    pos: "VOLANTE DERECHO", emoji: "⚖️",
    name: "Al molde",
    intencion: "60 acciones y 40 obligaciones. El benchmark clásico. Simple.",
    alloc: [
      { name: "ACWI", value: 60, color: C.acwi },
      { name: "ON 3–5Y", value: 40, color: C.onMedia },
    ],
  },
  {
    id: 8, row: 5,
    pos: "ENGANCHE", emoji: "🏦",
    name: "De la mínima",
    intencion: "Construir con el tiempo una segunda jubilación para cuando será.",
    alloc: [
      { name: "SPY", value: 25, color: C.acwi },
      { name: "VEA ex USA", value: 25, color: C.vig },
      { name: "IJH (Small Cap)", value: 15, color: C.onMedia },
      { name: "IEMG (Emerging)", value: 10, color: C.fci },
      { name: "ON 5–7Y", value: 20, color: "#a78bfa" },
      { name: "GLD", value: 5, color: C.gold },
    ],
    footnote: "SPY + VEA se transformarán en IWDA cuando sea líquido.",
  },
  {
    id: 9, row: 6, side: "right",
    pos: "", emoji: "✈️",
    name: "Ezeiza",
    intencion: "Lo que en Argentina no se puede hacer.",
    isEzeiza: true,
    alloc: [],
  },
  {
    id: 10, row: 6, side: "left",
    pos: "WING DERECHO", emoji: "⛏️",
    name: "Ganas de laburar",
    intencion: "Cobrar cada trimestre por toda la vida.",
    alloc: [
      { name: "ON 3–5Y", value: 50, color: C.onMedia },
      { name: "VIG", value: 35, color: C.vig },
      { name: "ACWI", value: 15, color: C.acwi },
    ],
  },
  {
    id: 11, row: 6, side: "center",
    pos: "CENTRODELANTERO", emoji: "⏳",
    name: "Pa los hijos y los nietos",
    intencion: "No es mío — es de ellos. El tiempo hace todo el trabajo.",
    alloc: [
      { name: "ACWI", value: 95, color: C.acwi },
      { name: "FCI ON Arg. (dividendos)", value: 5, color: C.fci },
    ],
    footnote: "* Los dividendos de ACWI se acumulan aquí.",
  },
];

const ezeizaCards = [
  { icon: "🏛️", name: "Renta Fija Diversificada", desc: "BND · AGG · TLT · Duration reale · IG global" },
  { icon: "📐", name: "Estrategia Factorial", desc: "QUAL · MTUM · VLUE · USMV · Premi di rischio accademici" },
  { icon: "💸", name: "Renta Agresiva", desc: "JEPI · JEPQ · Covered call · Yield 7–10% mensile" },
  { icon: "🌐", name: "Liquidez y Variedad", desc: "VT · VEA · IEMG · Small cap · Mercati di frontiera · Nessun vincolo" },
];

const ROWS = {
  6: [portfolios[8], portfolios[10], portfolios[9]],
  5: [portfolios[7]],
  4: [portfolios[5], portfolios[6]],
  3: [portfolios[4]],
  2: [portfolios[1], portfolios[3], portfolios[2]],
  1: [portfolios[0]],
};

export default function App() {
  const [accepted, setAccepted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [sel, setSel] = useState(portfolios[0]);
  const [view, setView] = useState("cancha");

  const handleScroll = (e) => {
    const el = e.target;
    if (el.scrollHeight - el.scrollTop <= el.clientHeight + 10) setScrolled(true);
  };

  if (!accepted) return (
    <div className="min-h-screen bg-gradient-to-br from-green-700 to-green-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">⚠️</span>
          <h2 className="text-lg font-black text-slate-900">Aviso Importante</h2>
        </div>
        <div onScroll={handleScroll} className="space-y-3 text-sm text-slate-600 max-h-[60vh] overflow-y-auto pr-1">
          <div>
            <p className="font-black text-slate-800 mb-0.5">Finalidad didáctica y educativa</p>
            <p>Los contenidos presentados tienen exclusivamente finalidad informativa y educativa en el ámbito de la educación financiera. No constituyen asesoramiento financiero personalizado, solicitud de inversión ni recomendación de productos financieros específicos.</p>
          </div>
          <div>
            <p className="font-black text-slate-800 mb-0.5">Ninguna actividad regulada</p>
            <p>Pessoa no es un asesor financiero autorizado ni presta servicios de inversión. No gestionamos capitales, no percibimos comisiones de intermediarios y no tenemos conflictos de interés en la presentación de los portafolios modelo.</p>
          </div>
          <div>
            <p className="font-black text-slate-800 mb-0.5">Portafolios modelo teóricos</p>
            <p>Las asignaciones presentadas son ejemplos didácticos con fines ilustrativos. No tienen en cuenta tu situación financiera personal, objetivos, tolerancia al riesgo, horizonte temporal ni limitaciones específicas.</p>
          </div>
          <div>
            <p className="font-black text-slate-800 mb-0.5">Rendimientos hipotéticos</p>
            <p>Los rendimientos indicados son estimaciones basadas en datos históricos y proyecciones teóricas. Los rendimientos pasados no son indicativos de resultados futuros. Toda inversión conlleva riesgos, incluida la posible pérdida total o parcial del capital.</p>
          </div>
          <div>
            <p className="font-black text-slate-800 mb-0.5">Responsabilidad</p>
            <p>El usuario es el único responsable de las decisiones de inversión que tome. Pessoa no puede ser considerada responsable de eventuales pérdidas derivadas del uso de la información contenida en esta aplicación.</p>
          </div>
          <div>
            <p className="font-black text-slate-800 mb-0.5">Recomendación</p>
            <p>Antes de realizar cualquier inversión, consulta a un asesor financiero habilitado que pueda evaluar tu situación específica. Lee siempre con atención la documentación informativa de los instrumentos financieros (KIID, folleto).</p>
          </div>
        </div>
        {!scrolled && (
          <p className="mt-3 text-xs text-slate-400 text-center italic">↓ Scorri fino in fondo per continuare</p>
        )}
        <button
          onClick={() => setAccepted(true)}
          disabled={!scrolled}
          className={`mt-4 w-full font-black py-3 rounded-xl transition-colors text-sm ${scrolled ? "bg-green-600 hover:bg-green-700 text-white cursor-pointer" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}>
          He leído y comprendido el aviso
        </button>
      </div>
    </div>
  );

  const PlayerBtn = ({ p, size = "sm" }) => {
    const isSel = sel.id === p.id;
    const w = size === "md" ? "w-28" : "w-20";
    return (
      <button onClick={() => setSel(p)}
        className={`${w} rounded-xl border-2 p-1.5 transition-all hover:scale-105 shadow cursor-pointer
          ${p.isEzeiza
            ? isSel ? "border-yellow-500 ring-2 ring-yellow-300 bg-yellow-50" : "border-yellow-300 bg-yellow-50/60"
            : isSel ? "border-blue-500 ring-2 ring-blue-200 bg-white" : "border-slate-300 bg-white"}`}>
        <div className="text-center text-base mb-0.5">{p.emoji}</div>
        {p.isEzeiza ? (
          <div className="h-10 flex items-center justify-center">
            <span className="text-xl">🌍</span>
          </div>
        ) : (
          <div className="h-10">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={p.alloc} cx="50%" cy="50%" innerRadius={8} outerRadius={18} paddingAngle={2} dataKey="value">
                  {p.alloc.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
        <div className="text-[7px] font-black text-center text-slate-800 leading-tight mt-0.5 px-0.5 truncate">{p.name}</div>
      </button>
    );
  };

  const Campo = () => (
    <div className="relative mx-auto max-w-xs rounded-2xl overflow-hidden shadow-2xl"
      style={{ background: "linear-gradient(180deg, #14532d 0%, #166534 35%, #15803d 50%, #166534 65%, #14532d 100%)" }}>
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute left-1/2 top-0 h-full w-px bg-white" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-white" />
        <div className="absolute left-1/2 top-2 -translate-x-1/2 w-24 h-8 border border-t-0 border-white rounded-b-full" />
        <div className="absolute left-1/2 bottom-2 -translate-x-1/2 w-24 h-8 border border-b-0 border-white rounded-t-full" />
      </div>
      <div className="relative py-4 px-3 space-y-3">
        <div className="flex justify-around items-center">
          {ROWS[6].map(p => <PlayerBtn key={p.id} p={p} />)}
        </div>
        <div className="flex justify-center">
          <PlayerBtn p={ROWS[5][0]} size="md" />
        </div>
        <div className="flex justify-around items-center">
          {ROWS[4].map(p => <PlayerBtn key={p.id} p={p} />)}
        </div>
        <div className="flex justify-center">
          <PlayerBtn p={ROWS[3][0]} size="md" />
        </div>
        <div className="flex justify-around items-center">
          {ROWS[2].map(p => <PlayerBtn key={p.id} p={p} />)}
        </div>
        <div className="flex justify-center">
          <PlayerBtn p={ROWS[1][0]} size="md" />
        </div>
      </div>
      <div className="pb-3 text-center text-[9px] text-white/40 font-bold tracking-widest">
        3 · 4 · 3
      </div>
    </div>
  );

  const Detail = () => {
    const p = sel;
    if (p.isEzeiza) return (
      <div className="rounded-2xl border-2 border-yellow-400 bg-white p-5 shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">{p.emoji}</span>
          <div>
            <h2 className="text-2xl font-black text-slate-900">{p.name}</h2>
            <p className="text-slate-500 italic text-sm">{p.intencion}</p>
          </div>
        </div>
        <div className="flex gap-2 mb-4 flex-wrap">
          <span className="text-xs font-black bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">✈️ Operatoria Internacional</span>
          <span className="text-xs font-black bg-orange-100 text-orange-800 px-3 py-1 rounded-full">📋 Régimen Fiscal Diferenciado</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {ezeizaCards.map((c, i) => (
            <div key={i} className="rounded-xl bg-slate-50 border border-slate-200 p-3">
              <div className="text-2xl mb-1">{c.icon}</div>
              <div className="font-black text-sm text-slate-800">{c.name}</div>
            </div>
          ))}
        </div>
      </div>
    );

    return (
      <div className="rounded-2xl border-2 border-blue-300 bg-white p-5 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">{p.emoji}</span>
          <div>
            <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{p.pos}</div>
            <h2 className="text-2xl font-black text-slate-900">{p.name}</h2>
            <p className="text-slate-500 italic text-sm">{p.intencion}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={p.alloc} cx="50%" cy="50%" innerRadius={40} outerRadius={80}
                  paddingAngle={3} dataKey="value">
                  {p.alloc.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip formatter={(v, n) => [`${v}%`, n]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col justify-center gap-3">
            {p.alloc.map((e, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: e.color }} />
                <span className="text-sm text-slate-700 flex-1">{e.name}</span>
                <span className="text-sm font-black text-slate-900">{e.value}%</span>
              </div>
            ))}
          </div>
        </div>
        {p.footnote && (
          <div className="mt-3 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-700 italic">
            {p.footnote}
          </div>
        )}
      </div>
    );
  };

  const GridCard = ({ p }) => (
    <button onClick={() => { setSel(p); setView("detalle"); }}
      className={`rounded-xl border-2 p-3 bg-white text-left transition-all hover:shadow-lg cursor-pointer w-full
        ${p.isEzeiza ? "border-yellow-300 bg-yellow-50/40 hover:border-yellow-500" : "border-slate-200 hover:border-blue-300"}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{p.emoji}</span>
        <div className="min-w-0 flex-1">
          {p.pos && <div className="text-[9px] text-slate-400 uppercase font-bold truncate">{p.pos}</div>}
          <div className="font-black text-slate-800 text-sm truncate">{p.name}</div>
        </div>
      </div>
      {p.isEzeiza ? (
        <div className="flex flex-wrap gap-1 mt-2">
          {ezeizaCards.map((c, i) => (
            <span key={i} className="text-[9px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded font-bold">{c.icon} {c.name}</span>
          ))}
        </div>
      ) : (
        <>
          <div className="h-20">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={p.alloc} cx="50%" cy="50%" innerRadius={16} outerRadius={34} paddingAngle={2} dataKey="value">
                  {p.alloc.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip formatter={(v, n) => [`${v}%`, n]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-slate-400 italic leading-tight">{p.intencion}</p>
        </>
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 p-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">🇦🇷</div>
          <h1 className="text-3xl font-black text-slate-900">Portafolios Modelo</h1>
          <p className="text-slate-500 text-sm mt-1">El once ideal</p>
          <div className="mt-2 inline-flex items-center gap-2 bg-green-100 text-green-700 rounded-full px-4 py-1 text-sm font-black">
            ⚽ Formación 3-4-3
          </div>
        </div>

        <div className="flex justify-center gap-2 mb-5">
          {[["cancha","⚽ Cancha"],["grilla","📊 Grilla"],["detalle","🔍 Detalle"]].map(([m,l]) => (
            <button key={m} onClick={() => setView(m)}
              className={`px-4 py-2 rounded-lg font-black text-sm transition-all cursor-pointer
                ${view === m ? "bg-green-700 text-white shadow" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}>
              {l}
            </button>
          ))}
        </div>

        {view === "cancha" && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 items-start">
            <div className="lg:col-span-3"><Campo /></div>
            <div className="lg:col-span-2"><Detail /></div>
          </div>
        )}

        {view === "grilla" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {portfolios.map(p => <GridCard key={p.id} p={p} />)}
          </div>
        )}

        {view === "detalle" && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1.5">
              {portfolios.map(p => (
                <button key={p.id} onClick={() => setSel(p)}
                  className={`rounded-lg px-3 py-2 text-left text-xs font-black transition-all cursor-pointer flex items-center gap-2
                    ${sel.id === p.id
                      ? p.isEzeiza ? "bg-yellow-400 text-slate-900" : "bg-blue-600 text-white"
                      : p.isEzeiza ? "bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100"
                      : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"}`}>
                  <span>{p.emoji}</span>
                  <span className="truncate">{p.name}</span>
                </button>
              ))}
            </div>
            <div className="lg:col-span-3"><Detail /></div>
          </div>
        )}

        <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-[11px] text-slate-400 border border-slate-200">
          <strong className="text-slate-600">Disclaimer:</strong> Finalidad exclusivamente didáctica e ilustrativa. Los rendimientos pasados no garantizan resultados futuros. Ezeiza: operatoria internacional sujeta a régimen fiscal diferenciado.
        </div>
      </div>
    </div>
  );
}
