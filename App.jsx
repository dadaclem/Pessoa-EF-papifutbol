import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = {
  onCorta: '#3b82f6',
  onMedia: '#60a5fa',
  tbills: '#06b6d4',
  ceadrDefensivo: '#10b981',
  ceadrGrowth: '#059669',
  ceadrDividend: '#8b5cf6',
  ceadrMomentum: '#6366f1',
  ceadrSpy: '#f59e0b',
  cash: '#94a3b8',
  fci: '#f97316',
};

// Formazione Calcio a 5: 1 portiere + 2 difensori + 1 mediano + 1 attaccante
const portfolios = [
  {
    id: 1,
    category: 'ARQUERO',
    position: 'Arquero',
    positionNumber: 1,
    name: 'Dólares bajo el colchón',
    subtitle: 'Máxima liquidez — preservación absoluta en USD',
    allocation: [
      { name: 'ON Cortas < 2Y (YPF, Pampa, Telecom)', value: 55, color: COLORS.onCorta },
      { name: 'FCI ESTRA1A — T-Bills 12.8%', value: 30, color: COLORS.tbills },
      { name: 'Cash USD / Money Market', value: 15, color: COLORS.cash },
    ],
    instrumentos: 'ON: YPF 2026, Pampa 2026, Telecom 2025 | FCI: ESTRA1A (Balanz Dólar Corto Plazo) vía MEP',
    rendimiento: '6-8% USD anual',
    volatilidad: 'Mínima (max drawdown ~2-3%)',
    horizonte: 'Siempre disponible — hasta 18 meses',
    nota: 'La novità rispetto alla versione iniziale: ESTRA1A (30%) aggiunge T-Bills USA al 12.8% del sottostante — qualità creditizia sovrana irraggiungibile con sole ON argentine. Le ON corporative coprono il rendimento, i T-Bills ancórano la qualità. Accesso via MEP, zero ganancias aggiuntive, rescate 24hs. Il Money Market (15%) è liquidità pura per emergenze.',
    riesgoEspecifico: 'Le ON rimangono credito corporate argentino. ESTRA1A è FCI locale: nessun problema fiscale. Diversificare tra 3+ emittenti ON.',
    fciNote: '✅ ESTRA1A accessibile via MEP — FCI locale CNV, esenzione ganancias persone fisiche',
  },
  {
    id: 2,
    category: 'DEFENSA',
    position: 'Defensor Derecho',
    positionNumber: 2,
    name: 'Renta fija dolarizada',
    subtitle: 'Ladder ON + ancora T-Bills — flujo de caja en dólares',
    allocation: [
      { name: 'ON 2-3Y (YPF, MercadoLibre, Cresud)', value: 35, color: COLORS.onCorta },
      { name: 'ON 3-5Y (Pampa, Arcor, Loma Negra)', value: 35, color: COLORS.onMedia },
      { name: 'FCI ESTRA1A — ancora T-Bills', value: 15, color: COLORS.tbills },
      { name: 'CEDEARs Income (KO, PG, JNJ, MCD)', value: 15, color: COLORS.ceadrDividend },
    ],
    instrumentos: 'ON: YPF 2027, MercadoLibre 2028, Pampa 2029, Arcor 2028 | FCI: ESTRA1A | CEDEARs income: KO, PG, JNJ, MCD',
    rendimiento: '7-10% USD anual',
    volatilidad: 'Baja (max drawdown ~5-8%)',
    horizonte: '2-5 años',
    nota: 'Ladder escalonada ON corte+medie per ricostituzione liquidità e rendimento. ESTRA1A (15%) aggiunge l\'ancora di qualità sovrana USA che mancava. CEDEARs income: KO, PG, JNJ, MCD sono i Dividend Aristocrats disponibili in Argentina — distribuzione dividendi trimestrali in USD. ATTENZIONE: SPYD non è disponibile come CEDEAR — usare titoli singoli income per la componente dividendi.',
    riesgoEspecifico: 'Concentración sectorial argentina en las ON (energía, telecomunicaciones). I CEDEARs income hanno volatilità maggiore delle ON ma distribuiscono cash flow reale.',
    fciNote: '✅ ESTRA1A via MEP — FCI locale, fiscalmente pulito',
  },
  {
    id: 3,
    category: 'DEFENSA',
    position: 'Defensor Izquierdo',
    positionNumber: 3,
    name: 'Híbrido conservador',
    subtitle: 'Puente entre renta fija y renta variable global',
    allocation: [
      { name: 'ON Mix 2-4Y (5-6 emisores)', value: 50, color: COLORS.onMedia },
      { name: 'CEDEARs Quality (JNJ, PG, KO, WMT)', value: 25, color: COLORS.ceadrDefensivo },
      { name: 'CEDEARs BRK.B (proxy quality/valor)', value: 15, color: COLORS.ceadrDividend },
      { name: 'FCI ESTRA1A — ancora difensiva', value: 10, color: COLORS.tbills },
    ],
    instrumentos: 'ON: cartera diversificada 5-6 emisores | CEDEARs: JNJ, PG, KO, WMT, BRK.B | FCI: ESTRA1A',
    rendimiento: '8-11% USD anual',
    volatilidad: 'Baja-media (max drawdown ~10-15%)',
    horizonte: '3-7 años',
    nota: 'BRK.B è il proxy più vicino a un ETF quality/value disponibile via CEDEAR. JNJ, PG, KO, WMT sono Dividend Aristocrats reali — aumentano il dividendo da 25+ anni consecutivi: qualità strutturalmente superiore a SPYD (che seleziona solo per yield alto, senza filtro qualità). ESTRA1A (10%) come cuscinetto difensivo con T-Bills.',
    riesgoEspecifico: 'Le ON argentinas non sono bond europei IG: spread creditizio più alto, liquidità secondaria minore. I CEDEARs quality/value sottoperformano nei mercati rialzisti growth-driven.',
    fciNote: '✅ ESTRA1A via MEP — componente minima ma strategica per qualità creditizia',
  },
  {
    id: 4,
    category: 'MEDIOCAMPO',
    position: 'Pivote',
    positionNumber: 4,
    name: 'Balanceado global',
    subtitle: 'Bilanciato costruito a mano — senza ETF bilanciati disponibili',
    allocation: [
      { name: 'ON 2-4Y (diversificadas)', value: 35, color: COLORS.onMedia },
      { name: 'CEDEARs Mercado (SPY, QQQ)', value: 30, color: COLORS.ceadrSpy },
      { name: 'CEDEARs Dividend Aristocrats (KO, JNJ, PG, MCD)', value: 20, color: COLORS.ceadrDividend },
      { name: 'CEDEARs Growth (AAPL, MSFT, GOOGL)', value: 15, color: COLORS.ceadrGrowth },
    ],
    instrumentos: 'ON: 5-6 emisores | CEDEARs: SPY, QQQ, AAPL, MSFT, GOOGL, KO, JNJ, PG, MCD',
    rendimiento: '9-13% USD anual',
    volatilidad: 'Media (max drawdown ~18-25%)',
    horizonte: '5-12 años',
    nota: 'Senza ETF bilanciati disponibili in Argentina, questo portafoglio si costruisce a mano. SPY è S&P 500 puro — non SPYD (high dividend), che non esiste come CEDEAR. La distinzione è fondamentale: SPYD esclude i big tech e sottoperforma nei mercati growth-driven. KO/JNJ/PG/MCD sono Dividend Aristocrats reali con dividendi crescenti da 25+ anni. Rebalancing manuale necessario.',
    riesgoEspecifico: 'Rebalanceo manual obbligatorio — senza ETF bilanciati il drift stilistico si accumula. Rischio concentrazione USA/tech nella componente growth.',
    fciNote: '⚠️ Nessun FCI locale copre questa struttura — costruzione manuale inevitabile',
  },
  {
    id: 5,
    category: 'DELANTERO',
    position: 'Delantero',
    positionNumber: 5,
    name: 'Crecimiento dolarizado',
    subtitle: 'Proxy MSCI World — máximo capital a largo plazo en USD',
    allocation: [
      { name: 'CEDEARs SPY (S&P 500 puro)', value: 35, color: COLORS.ceadrSpy },
      { name: 'CEDEARs QQQ (Nasdaq proxy)', value: 25, color: COLORS.ceadrMomentum },
      { name: 'CEDEARs Growth (AAPL, MSFT, AMZN, GOOGL)', value: 25, color: COLORS.ceadrGrowth },
      { name: 'ON Cortas (liquidez táctica)', value: 15, color: COLORS.onCorta },
    ],
    instrumentos: 'CEDEARs: SPY, QQQ, AAPL, MSFT, AMZN, GOOGL | ON cortas: liquidità emergenza',
    rendimiento: '10-15% USD anual (largo plazo)',
    volatilidad: 'Alta (max drawdown ~35-45%)',
    horizonte: '10-20+ años',
    nota: 'Proxy MSCI World costruito a mano. SPY (non SPYD) è la scelta corretta: S&P 500 puro, include i big tech che guidano i rendimenti a lungo termine. Le ON corte (15%) non sono difesa — sono liquidità di emergenza per non vendere nei mercati ribassisti. BARVGLB di Balanz (che usa SPYD al 56%) non è raccomandato: SPYD dentro un FCI perde il suo unico vantaggio (la distribuzione dividendi), ed è irriproducibile via CEDEAR.',
    riesgoEspecifico: 'Alta concentrazione USA/tech. Rischio cambio CEDEAR vs dólar MEP. Nessuna diversificazione Europa/Asia. Orizzonte minimo reale 10 anni.',
    fciNote: '❌ BARVGLB Balanz sconsigliato: usa SPYD (non disponibile come CEDEAR) inside un wrapper che accumula — contraddizione strutturale',
  },
];

const positionEmojis = {
  ARQUERO: '🧤',
  DEFENSA: '🛡️',
  MEDIOCAMPO: '⚙️',
  DELANTERO: '⚡',
};

export default function PortafoliosArgentina() {
  const [selectedPortfolio, setSelectedPortfolio] = useState(portfolios[0]);
  const [viewMode, setViewMode] = useState('field');

  const FutsalField = () => {
    const arquero = portfolios[0];
    const defensa = portfolios.slice(1, 3);
    const pivote = portfolios[3];
    const delantero = portfolios[4];

    const PlayerCard = ({ portfolio, size = 'normal' }) => {
      const isSelected = selectedPortfolio.id === portfolio.id;
      return (
        <div
          onClick={() => setSelectedPortfolio(portfolio)}
          className={`cursor-pointer rounded-xl border-2 bg-white p-2 shadow-lg transition-all hover:scale-105 hover:shadow-xl ${
            isSelected
              ? 'border-yellow-400 ring-2 ring-yellow-400 ring-offset-1'
              : 'border-blue-400'
          } ${size === 'small' ? 'w-28' : 'w-36'}`}
        >
          <div className="mb-1 text-center">
            <span className="text-lg">{positionEmojis[portfolio.category]}</span>
            <div className={`${size === 'small' ? 'text-[10px]' : 'text-xs'} font-bold text-blue-700`}>
              {portfolio.position}
            </div>
          </div>
          <div className={`${size === 'small' ? 'h-14' : 'h-20'}`}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={portfolio.allocation}
                  cx="50%"
                  cy="50%"
                  innerRadius={size === 'small' ? 12 : 18}
                  outerRadius={size === 'small' ? 24 : 34}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {portfolio.allocation.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className={`mt-1 ${size === 'small' ? 'text-[9px]' : 'text-[10px]'} text-center font-bold leading-tight text-gray-900`}>
            {portfolio.name}
          </div>
        </div>
      );
    };

    return (
      <div className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-2xl shadow-2xl" style={{ background: 'linear-gradient(180deg, #1a6b3a 0%, #145c30 50%, #1a6b3a 100%)' }}>
        {/* Futsal field markings */}
        <div className="absolute inset-0 pointer-events-none opacity-15">
          {/* Center line */}
          <div className="absolute left-1/2 top-0 h-full w-0.5 bg-white"></div>
          {/* Center circle */}
          <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white"></div>
          {/* Goal areas */}
          <div className="absolute left-1/2 top-2 h-12 w-28 -translate-x-1/2 rounded-b-full border-2 border-t-0 border-white"></div>
          <div className="absolute bottom-2 left-1/2 h-12 w-28 -translate-x-1/2 rounded-t-full border-2 border-b-0 border-white"></div>
        </div>

        <div className="relative px-6 py-8 space-y-6">
          {/* DELANTERO (attacco — in alto, zona avversaria) */}
          <div className="flex justify-center">
            <PlayerCard portfolio={delantero} />
          </div>

          {/* PIVOTE */}
          <div className="flex justify-center">
            <PlayerCard portfolio={pivote} size="small" />
          </div>

          {/* DEFENSA */}
          <div className="flex justify-around px-4">
            {defensa.map((p) => (
              <PlayerCard key={p.id} portfolio={p} size="small" />
            ))}
          </div>

          {/* ARQUERO */}
          <div className="flex justify-center">
            <PlayerCard portfolio={arquero} />
          </div>
        </div>

        <div className="pb-4 text-center text-sm font-bold text-white opacity-80">
          FORMACIÓN FÚTBOL SALA: 1-2-1-1
        </div>
      </div>
    );
  };

  const DetailView = ({ portfolio }) => (
    <div className="rounded-2xl border-2 border-blue-500 bg-white p-6 shadow-lg">
      <div className="mb-4 flex items-start gap-3">
        <span className="text-4xl">{positionEmojis[portfolio.category]}</span>
        <div>
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
            {portfolio.category} — {portfolio.position} #{portfolio.positionNumber}
          </span>
          <h2 className="text-2xl font-bold text-gray-900">{portfolio.name}</h2>
          <p className="text-gray-500 italic">{portfolio.subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <h3 className="mb-3 text-lg font-semibold text-gray-800">Allocazione</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={portfolio.allocation}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${value}%`}
                outerRadius={100}
                dataKey="value"
              >
                {portfolio.allocation.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(val, name) => [`${val}%`, name]} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="mb-3 text-lg font-semibold text-gray-800">Composición</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={portfolio.allocation} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="name" type="category" width={170} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6">
                {portfolio.allocation.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-blue-50 p-4">
          <h4 className="mb-3 font-semibold text-blue-800">Características</h4>
          <ul className="space-y-2 text-sm text-blue-900">
            <li><strong>Rendimiento esperado:</strong> {portfolio.rendimiento}</li>
            <li><strong>Volatilidad:</strong> {portfolio.volatilidad}</li>
            <li><strong>Horizonte:</strong> {portfolio.horizonte}</li>
            <li><strong>Instrumentos:</strong> {portfolio.instrumentos}</li>
          </ul>
        </div>

        <div className="rounded-xl bg-amber-50 p-4">
          <h4 className="mb-2 font-semibold text-amber-800">Nota del Asesor</h4>
          <p className="text-sm text-amber-900">{portfolio.nota}</p>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-red-50 border border-red-200 p-4">
        <h4 className="mb-1 font-semibold text-red-700">⚠️ Riesgo Específico Argentina</h4>
        <p className="text-sm text-red-800">{portfolio.riesgoEspecifico}</p>
      </div>

      {portfolio.fciNote && (
        <div className="mt-3 rounded-xl bg-cyan-50 border border-cyan-200 p-4">
          <h4 className="mb-1 font-semibold text-cyan-700">🏦 FCI / Fondos</h4>
          <p className="text-sm text-cyan-900">{portfolio.fciNote}</p>
        </div>
      )}
    </div>
  );

  const GridCard = ({ portfolio }) => (
    <div
      onClick={() => { setSelectedPortfolio(portfolio); setViewMode('detail'); }}
      className={`cursor-pointer rounded-xl border-2 p-4 transition-all hover:shadow-lg ${
        selectedPortfolio.id === portfolio.id
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 bg-white hover:border-blue-300'
      }`}
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="text-2xl">{positionEmojis[portfolio.category]}</span>
        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase">{portfolio.category}</div>
          <h3 className="font-bold text-gray-900">{portfolio.name}</h3>
          <p className="text-xs text-gray-500">{portfolio.subtitle}</p>
        </div>
      </div>
      <div className="h-36">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={portfolio.allocation} cx="50%" cy="50%" innerRadius={28} outerRadius={55} paddingAngle={2} dataKey="value">
              {portfolio.allocation.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(val, name) => [`${val}%`, name]} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-1 space-y-1 text-xs text-gray-600">
        <div><strong>Rendimiento:</strong> {portfolio.rendimiento}</div>
        <div><strong>Horizonte:</strong> {portfolio.horizonte}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-2 text-5xl">🇦🇷</div>
          <h1 className="mb-1 text-4xl font-bold text-gray-900">Portafolios Modelo Argentina</h1>
          <p className="text-lg text-gray-500">Sin deuda soberana · Sin acciones locales · Solo ON corporativas + CEDEARs</p>
          <div className="mt-3 inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
            ⚽ Fútbol Sala — Formación 1-2-1-1
          </div>
          <p className="mt-2 text-xs text-gray-400">Finalidad ilustrativa — No constituye asesoramiento personalizado</p>
        </div>

        {/* View mode buttons */}
        <div className="mb-6 flex justify-center gap-3 flex-wrap">
          {[
            { mode: 'field', label: '⚽ Cancha', color: 'green' },
            { mode: 'grid', label: '📊 Grilla', color: 'blue' },
            { mode: 'detail', label: '🔍 Detalle', color: 'blue' },
          ].map(({ mode, label, color }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`rounded-lg px-5 py-2 font-semibold transition-all ${
                viewMode === mode
                  ? color === 'green' ? 'bg-green-600 text-white shadow-md' : 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Views */}
        {viewMode === 'field' && (
          <div className="space-y-6">
            <FutsalField />
            <DetailView portfolio={selectedPortfolio} />
          </div>
        )}

        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {portfolios.map((p) => (
              <GridCard key={p.id} portfolio={p} />
            ))}
          </div>
        )}

        {viewMode === 'detail' && (
          <div className="space-y-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {portfolios.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPortfolio(p)}
                  className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                    selectedPortfolio.id === p.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {positionEmojis[p.category]} {p.positionNumber}. {p.name}
                </button>
              ))}
            </div>
            <DetailView portfolio={selectedPortfolio} />
          </div>
        )}

        {/* Gerarchia FCI */}
        <div className="mt-10 rounded-2xl bg-white p-6 shadow-md border border-gray-200">
          <h3 className="mb-1 text-xl font-bold text-gray-800">🏦 Gerarchia FCI per l'investitore argentino</h3>
          <p className="mb-4 text-sm text-gray-500">Conclusioni dall'analisi dei fondi Balanz e del mercato FCI locale</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 text-left font-semibold text-gray-600">Fondo</th>
                  <th className="py-2 text-left font-semibold text-gray-600">Accesso</th>
                  <th className="py-2 text-left font-semibold text-gray-600">Fiscale</th>
                  <th className="py-2 text-left font-semibold text-gray-600">Giudizio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  ['✅ ESTRA1A (Balanz Dólar Corto Plazo)', 'MEP diretto', 'Esenzione ganancias', 'RACCOMANDATO — T-Bills 12.8%, rescate 24hs, qualità sovrana USA'],
                  ['✅ COCOAUSD / IOL Dólar Ahorro', 'MEP diretto', 'Esenzione ganancias', 'RACCOMANDATO — ON corporative diversificate, alternativa a ESTRA1A'],
                  ['⚠️ BINCOME (T-Bills puri 99.7%)', 'CCL via canje', 'Ganancias 15%', 'ULTIMO RECURSO — solo per patrimoni grandi che vogliono rischio sovrano USA puro'],
                  ['⚠️ Balanz Short Duration (Irlanda)', 'CCL via canje', 'Ganancias 15%', 'ULTIMO RECURSO — IG global + securitized + T-Bills, fee 0.85% erode il margine'],
                  ['❌ BARFGLB (Renta Fija Global)', 'Solo cuenta exterior', 'Zona grigia AFIP', 'SCONSIGLIATO — 60-70% HY+EM duplica il rischio delle ON locali già detenute'],
                  ['❌ BARVGLB (Renta Variable Global)', 'Solo cuenta exterior', 'Zona grigia AFIP', 'SCONSIGLIATO — usa SPYD (non disponibile come CEDEAR) dentro un wrapper che accumula'],
                  ['❌ BGLOBALE / BBALANCED', 'Solo cuenta exterior', 'Zona grigia AFIP', 'NON ACCESSIBILI da conto argentino locale — Clase C/D non operative per norma CNV'],
                ].map(([fondo, accesso, fiscale, giudizio], i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="py-2 pr-3 font-medium text-gray-800 text-xs">{fondo}</td>
                    <td className="py-2 pr-3 text-xs text-gray-600">{accesso}</td>
                    <td className="py-2 pr-3 text-xs text-gray-600">{fiscale}</td>
                    <td className="py-2 text-xs text-gray-700">{giudizio}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 rounded-lg bg-cyan-50 border border-cyan-200 p-3 text-xs text-cyan-800">
            <strong>Regola pratica:</strong> Per il 90% dei clienti la risposta è ON corporative locali + ESTRA1A via MEP. BINCOME e Short Duration entrano in conversazione solo per patrimoni significativi, già operativi in CCL, con necessità specifica di qualità creditizia irraggiungibile localmente. Chi vuole operare con broker estero non ha bisogno di nessuno di questi fondi: usa direttamente i portafogli del modello italiano.
          </div>
        </div>

        {/* Confronto con versione italiana */}
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-md border border-gray-200">
          <h3 className="mb-4 text-xl font-bold text-gray-800">🔄 Da 11 a 5: cosa cambia rispetto al modello italiano</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 text-left font-semibold text-gray-600">Portafoglio IT</th>
                  <th className="py-2 text-left font-semibold text-gray-600">Versione AR</th>
                  <th className="py-2 text-left font-semibold text-gray-600">Motivo adattamento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  ['🧤 Sotto il materasso', '🧤 Dólares bajo el colchón', 'ON corte + ESTRA1A (T-Bills) + cash. ESTRA1A risolve il problema del debito qualità in Argentina'],
                  ['🛡️ Terzino dx – Flussi affitto', '🛡️ Renta fija dolarizada', 'Ladder ON + ESTRA1A + CEDEARs income (KO/JNJ/PG/MCD). SPYD non disponibile come CEDEAR'],
                  ['🛡️ All Weather / Mezze stagioni', '🛡️ Híbrido conservador', 'Bond lunghi inesistenti: ON + quality proxy BRK.B/JNJ + ESTRA1A minimo'],
                  ['⚙️ Mediano + Mezzala fusi', '⚙️ Balanceado global', 'SPY (non SPYD) + QQQ + Dividend Aristocrats reali + growth. Rebalancing manuale'],
                  ['⚡ Fenomeno + Cent\'anni fusi', '⚡ Crecimiento dolarizado', 'SPY puro + QQQ + tech. BARVGLB Balanz sconsigliato per contraddizione SPYD/accumulo'],
                  ['❌ Regista (piano pensione)', '—', 'ELIMINATO: LifeStrategy e de-risking automatico non disponibili'],
                  ['❌ Ombrellone (decumulo)', '—', 'ELIMINATO: bond ladder iBonds inesistente in Argentina'],
                  ['❌ Io ce li ho sul libretto', '—', 'ELIMINATO: nessun equivalente dolarizzato sensato'],
                ].map(([it, ar, motivo], i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="py-2 pr-4 font-medium text-gray-800">{it}</td>
                    <td className="py-2 pr-4 text-blue-700 font-medium">{ar}</td>
                    <td className="py-2 text-gray-600">{motivo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 rounded-2xl bg-gray-50 p-5 text-xs text-gray-500 border border-gray-200">
          <strong className="text-gray-700">Disclaimer:</strong> Los rendimientos indicados son estimaciones basadas en datos históricos y no garantizan resultados futuros.
          Las ON corporativas argentinas implican riesgo crediticio significativamente mayor que los bonos soberanos de países desarrollados.
          Los CEDEARs replican precios en USD pero cotizan en ARS; existe riesgo de brecha cambiaria entre dólar MEP y oficial.
          El tratamiento impositivo de los FCI locales en moneda extranjera puede estar sujeto a criterios AFIP no consolidados — consultar contador especializado antes de operar.
          Este material tiene finalidad exclusivamente didáctica e ilustrativa.
        </div>
      </div>
    </div>
  );
}
