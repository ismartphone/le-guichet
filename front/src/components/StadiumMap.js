const TRIBUNE_COLORS = [
  '#e74c8b', '#f4a261', '#e76f51', '#2a9d8f',
  '#7c6ce7', '#a8dadc', '#ff6b6b', '#ffd166',
];

// Génère les blocs pour chaque tribune — stade agrandi
function generateBlocks() {
  const gap = 3;

  // NORD — 2 rangées, 6 blocs
  const nordBlocks = [];
  const nordW = (520 - 5 * gap) / 6;
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 6; col++) {
      nordBlocks.push({
        x: 120 + col * (nordW + gap),
        y: 28 + row * (22 + gap),
        w: nordW,
        h: 22,
      });
    }
  }

  // SUD — 2 rangées, 6 blocs
  const sudBlocks = [];
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 6; col++) {
      sudBlocks.push({
        x: 120 + col * (nordW + gap),
        y: 408 + row * (22 + gap),
        w: nordW,
        h: 22,
      });
    }
  }

  // EST — 2 colonnes, 6 blocs par colonne
  const estBlocks = [];
  const estH = (330 - 5 * gap) / 6;
  for (let col = 0; col < 2; col++) {
    for (let row = 0; row < 6; row++) {
      estBlocks.push({
        x: 642 + col * (22 + gap),
        y: 75 + row * (estH + gap),
        w: 22,
        h: estH,
      });
    }
  }

  // OUEST — 2 colonnes, 6 blocs par colonne
  const ouestBlocks = [];
  for (let col = 0; col < 2; col++) {
    for (let row = 0; row < 6; row++) {
      ouestBlocks.push({
        x: 73 + col * (22 + gap),
        y: 75 + row * (estH + gap),
        w: 22,
        h: estH,
      });
    }
  }

  // COINS — 3 blocs chacun
  const coinNO = [
    { x: 73, y: 28, w: 22, h: 44 },
    { x: 98, y: 28, w: 19, h: 44 },
  ];
  const coinNE = [
    { x: 642, y: 28, w: 19, h: 44 },
    { x: 664, y: 28, w: 22, h: 44 },
  ];
  const coinSE = [
    { x: 642, y: 408, w: 19, h: 44 },
    { x: 664, y: 408, w: 22, h: 44 },
  ];
  const coinSO = [
    { x: 73, y: 408, w: 22, h: 44 },
    { x: 98, y: 408, w: 19, h: 44 },
  ];

  return { nordBlocks, sudBlocks, estBlocks, ouestBlocks, coinNO, coinNE, coinSE, coinSO };
}

const allBlocks = generateBlocks();

const ZONE_BLOCKS = [
  allBlocks.nordBlocks,
  allBlocks.sudBlocks,
  allBlocks.estBlocks,
  allBlocks.ouestBlocks,
  allBlocks.coinNO,
  allBlocks.coinNE,
  allBlocks.coinSE,
  allBlocks.coinSO,
];

const LABEL_POSITIONS = [
  { x: 380, y: 48 },
  { x: 380, y: 430 },
  { x: 673, y: 240 },
  { x: 86, y: 240 },
  { x: 90, y: 50 },
  { x: 660, y: 50 },
  { x: 660, y: 430 },
  { x: 90, y: 430 },
];

export default function StadiumMap({ tribunes, selectedTribune, onSelect }) {
  const getColor = (index) => TRIBUNE_COLORS[index % TRIBUNE_COLORS.length];

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-2xl">
      <svg viewBox="0 0 760 480" className="w-full h-auto" style={{ background: '#0c1222' }}>
        <defs>
          <filter id="selectedGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="shadow">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000" floodOpacity="0.4" />
          </filter>
          <filter id="softShadow">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#000" floodOpacity="0.3" />
          </filter>
          <pattern id="grassTexture" patternUnits="userSpaceOnUse" width="6" height="6">
            <rect width="6" height="6" fill="transparent" />
            <circle cx="2" cy="2" r="0.3" fill="rgba(0,0,0,0.04)" />
            <circle cx="5" cy="5" r="0.2" fill="rgba(255,255,255,0.02)" />
          </pattern>
          <radialGradient id="ambientGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2a3a5a" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0c1222" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Étoiles */}
        {[20,740,35,720,90,700,160,600,300,460,50,730,380,130,650,260,520,80,710,360,210,570,150,630,330,450,40,750,230,500].map((x, i) => {
          const y = [8,5,470,475,12,10,472,9,4,476,16,470,6,14,478,472,11,476,3,479,8,474,480,5,477,10,18,462,15,465][i];
          return <circle key={`s${i}`} cx={x} cy={y} r={[0.8,1,0.5,0.7,1.2,0.6,0.9,0.4,1.1,0.8,0.5,0.7,1,0.6,0.9,0.4,1.1,0.8,0.5,0.7,1,0.6,0.9,0.4,1.1,0.8,0.5,0.7,0.6,0.9][i]} fill="white" opacity={[.4,.6,.3,.5,.7,.4,.6,.3,.5,.7,.4,.6,.3,.5,.7,.4,.6,.3,.5,.7,.4,.6,.3,.5,.7,.4,.6,.3,.5,.7][i]} />;
        })}

        <ellipse cx="380" cy="240" rx="380" ry="250" fill="url(#ambientGlow)" />

        {/* ===== BÂTIMENTS ===== */}
        {[
          [8,4,28,16], [690,2,32,14], [8,462,28,14], [700,464,30,12],
          [10,120,18,35], [10,320,20,40], [732,130,20,35], [730,310,22,42],
          [180,462,24,14], [560,464,26,12],
        ].map(([x,y,w,h], i) => (
          <g key={`bld${i}`}>
            <rect x={x} y={y} width={w} height={h} rx="2" fill={i%2===0?'#192035':'#1a2540'} stroke="#2a3550" strokeWidth="0.5" filter="url(#softShadow)" />
            {[0,1].map(r => [0,1].map(c => (
              <rect key={`bw${i}${r}${c}`} x={x+3+c*7} y={y+3+r*6} width="3" height="3" fill="#2a4070" opacity={0.3+((i+r+c)%3)*0.15} />
            )))}
          </g>
        ))}

        {/* Parking */}
        {[0,1,2,3,4].map(i => (
          <rect key={`pk${i}`} x={90+i*16} y="465" width="10" height="5" rx="1" fill="#1a2238" stroke="#252e42" strokeWidth="0.3" />
        ))}
        {[0,1,2,3].map(i => (
          <rect key={`pkr${i}`} x={600+i*16} y="466" width="10" height="5" rx="1" fill="#1a2238" stroke="#252e42" strokeWidth="0.3" />
        ))}

        {/* ===== STRUCTURE DU STADE ===== */}
        <rect x="55" y="15" width="650" height="450" rx="30" fill="none" stroke="#3a4565" strokeWidth="3" filter="url(#shadow)" />
        <rect x="60" y="20" width="640" height="440" rx="27" fill="#1a2035" stroke="#2d3555" strokeWidth="1" />
        <rect x="68" y="23" width="624" height="434" rx="23" fill="#232b42" />

        {/* ===== TRIBUNES EN BLOCS ===== */}
        {tribunes.map((tribune, i) => {
          const zi = i % ZONE_BLOCKS.length;
          const blocks = ZONE_BLOCKS[zi];
          const isSelected = selectedTribune?.id === tribune.id;
          const color = getColor(i);

          return (
            <g key={tribune.id} onClick={() => onSelect(tribune)} className="cursor-pointer">
              {blocks.map((block, bi) => (
                <rect
                  key={`b${i}-${bi}`}
                  x={block.x}
                  y={block.y}
                  width={block.w}
                  height={block.h}
                  rx="2"
                  fill={isSelected ? '#22c55e' : color}
                  stroke={isSelected ? '#fff' : 'rgba(0,0,0,0.35)'}
                  strokeWidth={isSelected ? 1.5 : 0.5}
                  opacity={isSelected ? 1 : 0.82}
                  filter={isSelected ? 'url(#selectedGlow)' : undefined}
                  className="hover:opacity-100 transition-all duration-200"
                />
              ))}
              {/* Pas de label dans les tribunes */}
            </g>
          );
        })}

        {/* ===== ENTRÉES ===== */}
        {[ [365,18,30,10], [365,452,30,10], [55,230,10,20], [695,230,10,20] ].map(([x,y,w,h],i) => (
          <rect key={`ent${i}`} x={x} y={y} width={w} height={h} rx="2" fill="#151c30" stroke="#2d3555" strokeWidth="0.5" />
        ))}

        {/* ===== PELOUSE ===== */}
        <g>
          <rect x="130" y="82" width="500" height="316" rx="3" fill="#1a7a3a" />
          {Array.from({length:16},(_,i) => (
            <rect key={`st${i}`} x={130+i*(500/16)} y="82" width={500/16} height="316" fill={i%2===0?'#1f8e46':'#24a252'} />
          ))}
          <rect x="130" y="82" width="500" height="316" fill="url(#grassTexture)" />
          <rect x="136" y="88" width="488" height="304" rx="2" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />

          {/* Ligne médiane */}
          <line x1="380" y1="88" x2="380" y2="392" stroke="rgba(255,255,255,0.6)" strokeWidth="1.3" />
          {/* Rond central */}
          <circle cx="380" cy="240" r="40" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.3" />
          <circle cx="380" cy="240" r="2.5" fill="rgba(255,255,255,0.7)" />

          {/* Surface gauche */}
          <rect x="136" y="178" width="65" height="124" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2" />
          <rect x="136" y="205" width="28" height="70" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1" />
          <circle cx="180" cy="240" r="1.8" fill="rgba(255,255,255,0.6)" />
          <path d="M 201 205 A 28 28 0 0 1 201 275" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1" />

          {/* Surface droite */}
          <rect x="559" y="178" width="65" height="124" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2" />
          <rect x="596" y="205" width="28" height="70" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1" />
          <circle cx="580" cy="240" r="1.8" fill="rgba(255,255,255,0.6)" />
          <path d="M 559 205 A 28 28 0 0 0 559 275" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1" />

          {/* Buts */}
          <rect x="126" y="226" width="11" height="28" rx="1.5" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
          <rect x="623" y="226" width="11" height="28" rx="1.5" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />

          {/* Corners */}
          <path d="M 136 92 A 5 5 0 0 1 141 88" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
          <path d="M 619 88 A 5 5 0 0 1 624 92" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
          <path d="M 136 388 A 5 5 0 0 0 141 392" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
          <path d="M 619 392 A 5 5 0 0 0 624 388" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
        </g>

        {/* Points cardinaux */}
        <text x="380" y="10" textAnchor="middle" fill="#7a8bb5" fontSize="14" fontWeight="bold" letterSpacing="3">NORD</text>
        <text x="380" y="476" textAnchor="middle" fill="#7a8bb5" fontSize="14" fontWeight="bold" letterSpacing="3">SUD</text>
        <text x="745" y="244" textAnchor="middle" fill="#7a8bb5" fontSize="14" fontWeight="bold" letterSpacing="3" transform="rotate(90, 745, 244)">EST</text>
        <text x="15" y="244" textAnchor="middle" fill="#7a8bb5" fontSize="14" fontWeight="bold" letterSpacing="3" transform="rotate(-90, 15, 244)">OUEST</text>

        {/* Projecteurs */}
        {[[80,22],[680,22],[80,458],[680,458],[62,120],[698,120],[62,360],[698,360],[62,240],[698,240]].map(([cx,cy],i) => (
          <g key={`l${i}`}>
            <circle cx={cx} cy={cy} r="5" fill="rgba(255,255,200,0.08)" />
            <circle cx={cx} cy={cy} r="2" fill="rgba(255,255,220,0.4)" />
            <circle cx={cx} cy={cy} r="0.8" fill="rgba(255,255,255,0.9)" />
          </g>
        ))}

        {/* Arbres */}
        {[[45,80],[45,400],[715,80],[715,400],[45,200],[45,280],[715,200],[715,280],[150,468],[250,470],[510,468],[610,470]].map(([cx,cy],i) => (
          <g key={`tree${i}`}>
            <circle cx={cx} cy={cy} r="5" fill="#0e3a1a" opacity="0.7" />
            <circle cx={cx} cy={cy} r="3.5" fill="#16502a" opacity="0.8" />
          </g>
        ))}
      </svg>
    </div>
  );
}
