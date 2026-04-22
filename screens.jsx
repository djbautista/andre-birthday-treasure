// Screens: Intro, Stop (guess + reveal), Transition, Finale

const { useState, useEffect, useRef, useMemo } = React;

// ─────────────────────────────────────────────
// Intro / Cover
// ─────────────────────────────────────────────
function IntroScreen({ onStart }) {
  return (
    <div className="soft-in" style={{padding: '24px 24px 40px', position:'relative', minHeight:'100%', display:'flex', flexDirection:'column'}}>
      {/* decorative bows + flowers */}
      <Bow size={38} style={{position:'absolute', top:18, left:26, transform:'rotate(-18deg)', opacity:0.85}} />
      <Flower size={22} style={{position:'absolute', top:80, right:30, transform:'rotate(24deg)'}} />
      <Flower size={16} color="#C8A2C8" style={{position:'absolute', top:140, left:32}} />
      <Sparkle size={14} style={{position:'absolute', top:200, right:52}} />

      <div style={{textAlign:'center', marginTop: 56}}>
        <div className="font-label" style={{color:'var(--rose-ink)', marginBottom: 12, opacity:0.8}}>
          · Para Paula Andrea · Con amor ·
        </div>
        <div style={{marginBottom: 4}}>
          <span className="font-script" style={{fontSize: 52, color:'var(--rose-ink)', lineHeight: 1}}>Andre&rsquo;s</span>
        </div>
        <h1 className="font-display" style={{
          fontSize: 44, lineHeight: 1.0, fontWeight: 400, margin: '0 0 2px',
          letterSpacing:'-0.01em', fontStyle:'italic',
        }}>
          Birthday
        </h1>
        <h1 className="font-display" style={{
          fontSize: 44, lineHeight: 1.0, fontWeight: 400, margin: 0,
          letterSpacing:'0.02em',
        }}>
          Treasure
        </h1>

        <div style={{margin: '24px auto 0', display:'flex', alignItems:'center', justifyContent:'center', gap: 8}}>
          <div style={{width: 22, height:1, background:'var(--rose-ink)', opacity:0.4}}/>
          <Heart size={10} color="#B06B72" />
          <div className="font-label" style={{color:'var(--rose-ink)', fontSize: 9}}>22 · Abril · 2026</div>
          <Heart size={10} color="#B06B72" />
          <div style={{width: 22, height:1, background:'var(--rose-ink)', opacity:0.4}}/>
        </div>
      </div>

      {/* polaroid cover "map" */}
      <div style={{position:'relative', margin: '36px auto 0', width: 240}}>
        <div className="polaroid" style={{transform:'rotate(-3deg)'}}>
          <div className="tape tape-top-left" />
          <div className="tape tape-top-right" />
          <div style={{
            width: '100%', aspectRatio:'1/1', position:'relative',
            background:'linear-gradient(135deg, #FDF4EE 0%, #F5D5D0 50%, #E8B4B8 100%)',
            overflow:'hidden', borderRadius: 2,
          }}>
            {/* mini map */}
            <svg viewBox="0 0 200 200" style={{position:'absolute', inset:0, width:'100%', height:'100%'}}>
              <path d="M 30 170 Q 60 130, 80 120 T 130 80 Q 150 55, 170 30"
                    fill="none" stroke="#B06B72" strokeWidth="1.2" strokeDasharray="3 4" opacity="0.7"/>
              {[[30,170],[80,120],[130,80],[170,30]].map(([x,y],i) => (
                <g key={i} transform={`translate(${x} ${y})`}>
                  <circle r="10" fill="#fffdf9" opacity="0.9"/>
                  <path d="M0 4 C -5 -1, -10 -4, -10 -8 C -10 -12, -7 -14, -4 -14 C -2 -14, -1 -13, 0 -11 C 1 -13, 2 -14, 4 -14 C 7 -14, 10 -12, 10 -8 C 10 -4, 5 -1, 0 4 Z"
                        fill="#D4919A"/>
                  <text x="0" y="22" textAnchor="middle" fontSize="10" fontFamily="Fraunces, serif" fill="#B06B72" fontStyle="italic">{i+1}</text>
                </g>
              ))}
              <text x="100" y="195" textAnchor="middle" fontSize="8" fontFamily="DM Mono, monospace" fill="#B06B72" letterSpacing="2">BOGOTÁ · NUESTROS LUGARES</text>
            </svg>
          </div>
          <div className="caption">nuestro mapa, amor</div>
        </div>
        <Heart size={22} color="#B06B72" style={{position:'absolute', top:-10, right:-6, transform:'rotate(12deg)'}} />
      </div>

      <p className="font-body" style={{
        textAlign:'center', fontSize: 17, lineHeight: 1.5,
        color:'var(--ink-soft)', margin:'32px 18px 0', fontStyle:'italic',
      }}>
        Hoy no solo vas a descubrir lugares, amor.<br/>
        También vas a reencontrarte con pedacitos<br/>muy bonitos de nuestra historia.
      </p>

      <div style={{flex: 1}} />

      <div style={{textAlign:'center', marginTop: 36}}>
        <button className="btn-primary soft-bounce" onClick={onStart}>
          <Heart size={14} color="#fff"/> Empezar el recorrido
        </button>
        <div className="font-label" style={{marginTop: 14, color:'var(--rose-ink)', opacity:0.7}}>
          4 paradas · 4 recuerdos
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Stop screen (guess + reveal + message)
// ─────────────────────────────────────────────

const ROWS = [
  'QWERTYUIOP'.split(''),
  'ASDFGHJKLÑ'.split(''),
  'ZXCVBNM'.split(''),
];

// Normalize a single character for comparison:
// - Uppercase
// - Strip diacritics (so Á → A, É → E, etc.)
// - Preserve Ñ as its own letter
function normChar(ch) {
  if (!ch) return '';
  const up = ch.toUpperCase();
  if (up === 'Ñ') return 'Ñ';
  return up.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Is this a character we should HIDE until guessed? (letters only)
function isGuessable(ch) {
  const n = normChar(ch);
  return /^[A-ZÑ]$/.test(n);
}

function StopScreen({ stop, stopIndex, onComplete }) {
  const target = stop.answer;
  // Pre-compute per-position metadata
  const letterSlots = useMemo(() => (
    target.split('').map((ch, i) => ({
      i, ch, norm: normChar(ch), guessable: isGuessable(ch),
    }))
  ), [target]);

  // Unique guessable letters in the target (by normalized form)
  const targetLetterSet = useMemo(() => (
    new Set(letterSlots.filter(s => s.guessable).map(s => s.norm))
  ), [letterSlots]);

  const [guessed, setGuessed] = useState(() => new Set());        // set of normalized letters
  const [wrongCount, setWrongCount] = useState(0);
  const [hintRevealedNorms, setHintRevealedNorms] = useState(() => new Set()); // letters auto-revealed via help
  const [showError, setShowError] = useState('');
  const [lastWrong, setLastWrong] = useState(null);
  const [hearts, setHearts] = useState([]);
  // Stop-level phase machine. Flow for every stop:
  //   guessing → solved → traveling → arrived → letter → (parent: completed)
  const [phase, setPhase] = useState('guessing');
  const heartId = useRef(0);

  // A position is "revealed" if its normalized letter has been guessed OR auto-revealed
  const isNormRevealed = (norm) => guessed.has(norm) || hintRevealedNorms.has(norm);

  // Count revealed letter-positions
  const totalGuessableSlots = letterSlots.filter(s => s.guessable).length;
  const revealedSlotCount = letterSlots.filter(s => s.guessable && isNormRevealed(s.norm)).length;
  const isSolved = totalGuessableSlots > 0 && revealedSlotCount === totalGuessableSlots;

  // Clue escalation based on wrong guesses
  const clueLevel = Math.min(3, Math.floor(wrongCount / 2));
  const currentClue = clueLevel === 0 ? stop.intro : stop.hints[clueLevel - 1];

  // Photo blur reduces as player reveals more of the phrase + wrong guesses
  const progressRatio = totalGuessableSlots ? revealedSlotCount / totalGuessableSlots : 0;
  const blurPx = Math.max(2, 22 - progressRatio * 16 - wrongCount * 1.2);
  const sharpness = Math.min(1, progressRatio * 0.8 + wrongCount * 0.04);

  // Auto-transition to 'solved' when the phrase is fully revealed.
  // (No letter yet — that happens post-arrival.)
  useEffect(() => {
    if (isSolved && phase === 'guessing') {
      popHearts(16);
      setPhase('solved');
    }
  }, [isSolved, phase]);

  const popHearts = (n) => {
    const batch = Array.from({length: n}).map((_, i) => ({
      id: heartId.current++,
      x: 20 + Math.random() * 60,
      delay: i * 60,
      rot: (Math.random() - 0.5) * 40,
      kind: Math.random() > 0.6 ? 'sparkle' : 'heart',
    }));
    setHearts(h => [...h, ...batch]);
    setTimeout(() => setHearts(h => h.filter(x => !batch.find(b => b.id === x.id))), 2000);
  };

  // Core hangman guess — one letter at a time
  const guessLetter = (rawCh) => {
    const letter = normChar(rawCh);
    if (!/^[A-ZÑ]$/.test(letter)) return;
    if (guessed.has(letter)) return;           // repeat: silent no-op
    if (hintRevealedNorms.has(letter)) {       // already revealed by help: still mark as guessed, no penalty
      setGuessed(prev => new Set(prev).add(letter));
      return;
    }

    const next = new Set(guessed);
    next.add(letter);
    setGuessed(next);

    if (targetLetterSet.has(letter)) {
      popHearts(3);
    } else {
      setWrongCount(w => w + 1);
      setLastWrong(letter);
      setShowError(pickError());
      setTimeout(() => setShowError(''), 2000);
    }
  };

  // Help: reveal one unrevealed letter-class (not a single position)
  const revealHintLetter = () => {
    const unrevealed = [...targetLetterSet].filter(n => !guessed.has(n) && !hintRevealedNorms.has(n));
    if (unrevealed.length === 0) return;
    const pick = unrevealed[Math.floor(Math.random() * unrevealed.length)];
    setHintRevealedNorms(prev => new Set(prev).add(pick));
    popHearts(5);
  };

  // Render hidden phrase — spaces + punctuation stay visible
  const renderSlots = () => (
    <div style={{display:'flex', flexWrap:'wrap', justifyContent:'center', gap:'2px 0', maxWidth: 340, margin:'0 auto'}}>
      {letterSlots.map(s => {
        if (s.ch === ' ') return <div key={s.i} className="letter-cell space" />;
        if (!s.guessable) {
          // punctuation: always visible
          return <div key={s.i} className="letter-cell" style={{borderBottom:'none', color:'var(--rose-ink)'}}>{s.ch}</div>;
        }
        const shown = isNormRevealed(s.norm);
        return (
          <div key={s.i} className={`letter-cell ${shown ? 'correct filled' : ''}`}>
            {shown ? s.ch : ''}
          </div>
        );
      })}
    </div>
  );

  if (phase !== 'guessing') {
    return (
      <StopReveal
        stop={stop}
        phase={phase}
        isFinal={stop.id === 4}
        onDepart={() => setPhase('traveling')}
        onArrive={() => setPhase('arrived')}
        onOpenLetter={() => setPhase('letter')}
        onContinue={onComplete}
      />
    );
  }

  return (
    <div className="soft-in" style={{padding: '12px 16px 24px', position:'relative', maxWidth: '100%', boxSizing:'border-box', overflowX:'hidden'}}>
      {/* floating hearts layer */}
      <div style={{position:'fixed', inset:0, pointerEvents:'none', zIndex:100, overflow:'hidden'}}>
        {hearts.map(h => (
          <div key={h.id} className="heart-pop" style={{
            left: `${h.x}%`, bottom: '30%',
            animationDelay: `${h.delay}ms`,
            ['--r']: `${h.rot}deg`,
          }}>
            {h.kind === 'sparkle' ? <Sparkle size={16} color="#C9A96E"/> : <Heart size={18} color="#D4919A"/>}
          </div>
        ))}
      </div>

      {/* chapter header */}
      <div style={{textAlign:'center', marginTop: 8}}>
        <div className="font-label" style={{color:'var(--rose-ink)', opacity:0.8}}>
          {stop.chapter} · {stop.theme}
        </div>
        <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginTop:6}}>
          <div style={{width:20,height:1,background:'var(--dusty)',opacity:0.4}}/>
          <h2 className="font-display" style={{fontSize:22, margin:0, fontStyle:'italic', fontWeight:400}}>
            Parada {stop.id}
          </h2>
          <div style={{width:20,height:1,background:'var(--dusty)',opacity:0.4}}/>
        </div>
      </div>

      <div style={{marginTop: 14}}>
        <ProgressTrail current={stopIndex} total={4} />
      </div>

      {/* polaroid blur photo */}
      <div style={{
        position:'relative', margin:'22px auto 0', width: 240,
        transform: 'rotate(-1.5deg)',
      }}>
        <div className="polaroid">
          <div className="tape tape-top-left" />
          <div className="memory-photo" style={{aspectRatio:'4/5'}}>
            <PhotoPlaceholder stop={stop} blur={blurPx} sharpness={sharpness}/>
            <div style={{
              position:'absolute', inset:0,
              background:'radial-gradient(ellipse at center, transparent 40%, rgba(232,180,184,0.15) 100%)',
              mixBlendMode:'soft-light', pointerEvents:'none',
            }}/>
          </div>
          <div className="caption">
            {wrongCount < 2 ? '¿adivinas dónde, amor?' :
             wrongCount < 4 ? 'un lugar muy nuestro…' :
             'casi casi, princesa'}
          </div>
        </div>
        <div style={{
          position:'absolute', top: -8, right: -14,
          background:'#fffdf9', padding:'4px 10px', borderRadius:2,
          border:'1px solid var(--rose-ink)', transform:'rotate(6deg)',
          fontFamily:'"DM Mono", monospace', fontSize:9,
          letterSpacing:'0.15em', color:'var(--rose-ink)',
        }}>
          {revealedSlotCount}/{totalGuessableSlots} letras · {wrongCount} fallo{wrongCount===1?'':'s'}
        </div>
      </div>

      {/* clue */}
      <div key={clueLevel} className="soft-in" style={{
        margin:'22px 4px 0', padding:'16px 18px',
        background:'rgba(255,253,249,0.7)',
        border:'1px dashed var(--dusty)',
        borderRadius: 8, position:'relative',
      }}>
        <div className="font-label" style={{color:'var(--rose-ink)', opacity:0.75, marginBottom:6}}>
          {clueLevel === 0 ? '· La narradora ·' : `· Pista ${clueLevel} ·`}
        </div>
        <p className="font-body" style={{
          margin:0, fontSize:16, lineHeight:1.45, color:'var(--ink)',
          fontStyle: clueLevel === 0 ? 'italic' : 'normal',
        }}>
          {currentClue}
        </p>
        <Heart size={14} color="#D4919A" style={{position:'absolute', top:-8, left:14, background:'var(--cream)', padding:'0 3px'}}/>
      </div>

      {/* letter slots — the hidden phrase */}
      <div style={{marginTop: 24, textAlign:'center'}}>
        {renderSlots()}
        <div className="font-label" style={{marginTop: 10, color:'var(--rose-ink)', opacity:0.6}}>
          adivina una letra a la vez
        </div>
      </div>

      {/* error feedback */}
      {showError && (
        <div className="soft-in" style={{
          textAlign:'center', marginTop: 12,
          color:'var(--rose-ink)', fontStyle:'italic',
          fontSize: 15, fontFamily: '"Cormorant Garamond", serif',
        }}>
          <Heart size={11} color="#D4919A" style={{verticalAlign:'middle', marginRight:6}}/>
          {showError}
          {lastWrong && <span style={{marginLeft:6, fontFamily:'"DM Mono", monospace', fontSize:11, opacity:0.7}}>(la «{lastWrong}» no está)</span>}
        </div>
      )}

      {/* help button after 3 wrong */}
      {wrongCount >= 3 && (
        <div style={{textAlign:'center', marginTop: 14}}>
          <button className="btn-ghost" onClick={revealHintLetter}>
            <Sparkle size={12} color="#C9A96E"/> Dame una pista más
          </button>
          {wrongCount >= 5 && (
            <div className="font-script" style={{
              marginTop: 10, fontSize: 28, color:'var(--rose-ink)', lineHeight: 1.1,
            }}>
              {stop.letterHint}
            </div>
          )}
        </div>
      )}

      {/* on-screen hangman keyboard — single letter per tap */}
      <div style={{marginTop: 22}}>
        <HangmanKeyboard
          rows={ROWS}
          guessed={guessed}
          targetSet={targetLetterSet}
          hintRevealed={hintRevealedNorms}
          onGuess={guessLetter}
        />
      </div>
    </div>
  );
}

// Hangman keyboard — each key shows state: used+correct (pink filled),
// used+wrong (dimmed), hint-revealed (gold), or unused.
function HangmanKeyboard({ rows, guessed, targetSet, hintRevealed, onGuess }) {
  const stateFor = (letter) => {
    const n = letter; // already uppercase ASCII or Ñ
    if (hintRevealed.has(n) && !guessed.has(n)) return 'hint';
    if (!guessed.has(n)) return 'idle';
    return targetSet.has(n) ? 'correct' : 'wrong';
  };
  const keyStyle = (state) => {
    switch(state) {
      case 'correct': return { background: 'linear-gradient(180deg,#E8B4B8,#D4919A)', color:'#fffdf9', boxShadow:'0 1px 0 rgba(176,107,114,0.4)', pointerEvents:'none' };
      case 'wrong':   return { background: '#f1e2dc', color:'rgba(107,85,86,0.45)', boxShadow:'none', pointerEvents:'none', textDecoration:'line-through' };
      case 'hint':    return { background: 'linear-gradient(180deg,#E8D1A8,#C9A96E)', color:'#fffdf9', boxShadow:'0 1px 0 rgba(176,140,80,0.4)' };
      default:        return {};
    }
  };
  return (
    <div style={{padding:'4px 6px', maxWidth:'100%', boxSizing:'border-box', overflow:'hidden'}}>
      {rows.map((row, ri) => (
        <div key={ri} style={{
          display:'flex',
          gap: 4,
          marginBottom: 5,
          width: '100%',
          // center bottom row; top rows fill width
          justifyContent: ri === 2 ? 'center' : 'stretch',
          padding: ri === 1 ? '0 4%' : ri === 2 ? '0 8%' : 0,
          boxSizing:'border-box',
        }}>
          {row.map(k => {
            const st = stateFor(k);
            return (
              <button key={k} className="kb-key"
                      style={{ flex: '1 1 0', minWidth: 0, ...keyStyle(st) }}
                      disabled={st === 'correct' || st === 'wrong'}
                      onClick={() => onGuess(k)}>
                {k}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

const ERRORS = [
  'Vas muy cerca, amor',
  'Inténtalo otra vez, princesa',
  'Esa no era… pero casi',
  'Respira, bebé — lo tienes',
  'Piensa en nosotros, mi niña',
];
function pickError() { return ERRORS[Math.floor(Math.random() * ERRORS.length)]; }

// ─────────────────────────────────────────────
// Post-solve flow: solved → traveling → arrived → letter
// One component, four phases. Letter only appears after arrival.
// ─────────────────────────────────────────────
function StopReveal({ stop, phase, isFinal, onDepart, onArrive, onOpenLetter, onContinue }) {
  if (phase === 'traveling') {
    return <TravelingView stop={stop} onArrive={onArrive} />;
  }
  if (phase === 'arrived') {
    return <ArrivedView stop={stop} onOpenLetter={onOpenLetter} />;
  }
  // 'solved' or 'letter' — both show the unblurred polaroid header
  const showLetter = phase === 'letter';
  return (
    <div className="soft-in" style={{padding:'18px 20px 40px', position:'relative'}}>
      {/* celebration sparkles */}
      {[...Array(12)].map((_, i) => (
        <div key={i} className="sparkle" style={{
          position:'absolute',
          top: `${10 + Math.random()*60}%`,
          left: `${Math.random()*90}%`,
          animationDelay: `${Math.random()*2}s`,
          zIndex: 1,
        }}>
          <Sparkle size={8 + Math.random()*8} color={Math.random()>0.5 ? '#C9A96E' : '#D4919A'}/>
        </div>
      ))}

      <div style={{textAlign:'center', marginTop:8, position:'relative', zIndex:2}}>
        <div className="font-label" style={{color:'var(--rose-ink)'}}>
          · {showLetter ? 'Una carta para ti' : `Recuerdo ${stop.id} desbloqueado`} ·
        </div>
        <h2 className="font-display" style={{
          fontSize: 34, margin:'10px 0 4px', fontWeight:400,
          fontStyle:'italic', letterSpacing:'-0.01em',
        }}>
          {stop.answer}
        </h2>
        <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:8}}>
          <div style={{width:18, height:1, background:'var(--rose-ink)', opacity:0.4}}/>
          <Heart size={12} color="#B06B72"/>
          <div style={{width:18, height:1, background:'var(--rose-ink)', opacity:0.4}}/>
        </div>
      </div>

      {/* unblurred polaroid */}
      <div style={{position:'relative', margin:'20px auto 0', width: 240, transform:'rotate(1deg)'}}>
        <div className="polaroid">
          <div className="tape tape-top-left" />
          <div className="tape tape-top-right" />
          <div className="memory-photo" style={{aspectRatio:'4/5'}}>
            <PhotoPlaceholder stop={stop} blur={0} sharpness={1}/>
          </div>
          <div className="caption">{stop.theme.toLowerCase()}</div>
        </div>
        <Flower size={22} style={{position:'absolute', top:-12, right:-8}}/>
      </div>

      {!showLetter && (
        <div className="soft-in" style={{textAlign:'center', marginTop: 28}}>
          <div className="font-script" style={{fontSize: 44, color:'var(--rose-ink)', lineHeight:1, marginBottom: 18}}>
            ¡lo adivinaste, amor!
          </div>
          <p className="font-body" style={{
            margin:'0 auto 22px', maxWidth: 300, fontSize: 15,
            color:'var(--ink-soft)', fontStyle:'italic', lineHeight:1.45,
          }}>
            El carro ya está listo. Hay algo esperándote en este lugar…
          </p>
          <button className="btn-primary" onClick={onDepart}>
            Vamos allá <Heart size={13} color="#fff"/>
          </button>
        </div>
      )}

      {showLetter && (
        <div className="soft-in-slow" style={{marginTop: 28}}>
          <div style={{textAlign:'center', marginBottom: 12}}>
            <div className="font-label" style={{color:'var(--rose-ink)', opacity:0.75}}>
              · Ya llegamos · léeme aquí ·
            </div>
          </div>
          {/* letter card */}
          <div style={{
            position:'relative',
            background:'#fffdf9',
            padding:'28px 22px 24px',
            borderRadius: 4,
            boxShadow: 'var(--paper-shadow-lg)',
            border:'1px solid rgba(232,180,184,0.4)',
          }}>
            <div className="tape tape-top-left" style={{background:'rgba(200,162,200,0.5)'}}/>
            <div style={{textAlign:'center', marginBottom: 14}}>
              <Ribbon text={`De: G   ·   Para: Andre`} />
            </div>
            <p className="font-body" style={{
              margin:0, fontSize:16, lineHeight:1.6, color:'var(--ink)',
              fontStyle:'italic', textWrap:'pretty',
            }}>
              {stop.reveal}
            </p>
            <div style={{textAlign:'right', marginTop: 14}}>
              <span className="font-script" style={{fontSize:40, color:'var(--rose-ink)', lineHeight:1}}>
                siempre tuyo,
              </span>
            </div>
            <Heart size={16} color="#D4919A" style={{position:'absolute', bottom:-8, right:18}}/>
          </div>

          <div style={{textAlign:'center', marginTop: 26}}>
            <button className="btn-primary" onClick={onContinue}>
              {isFinal ? (
                <>Abrir el cierre <Sparkle size={13} color="#fff"/></>
              ) : (
                <>Ir al siguiente recuerdo <Heart size={13} color="#fff"/></>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Traveling — animated map transition
// ─────────────────────────────────────────────
function TravelingView({ stop, onArrive }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(iv); return 100; }
        return p + 1.5;
      });
    }, 60);
    return () => clearInterval(iv);
  }, []);
  // Auto-advance to 'arrived' state a beat after the route completes
  useEffect(() => {
    if (progress >= 100) {
      const t = setTimeout(onArrive, 1100);
      return () => clearTimeout(t);
    }
  }, [progress, onArrive]);

  return (
    <div className="soft-in" style={{
      padding:'40px 24px', minHeight:'100%', display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center', textAlign:'center',
    }}>
      <div className="font-label" style={{color:'var(--rose-ink)', opacity:0.75}}>
        · En camino ·
      </div>

      <p className="font-display" style={{
        fontSize: 24, lineHeight: 1.35, fontStyle:'italic',
        margin: '18px 10px 0', fontWeight: 400, color:'var(--ink)', textWrap:'pretty',
      }}>
        {stop.transition}
      </p>

      {/* animated map */}
      <div style={{position:'relative', margin:'32px auto 0', width: 280, height: 180}}>
        <svg viewBox="0 0 280 180" style={{position:'absolute', inset:0, width:'100%', height:'100%'}}>
          <defs>
            <pattern id="paper" width="4" height="4" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="0.3" fill="#B06B72" opacity="0.15"/>
            </pattern>
          </defs>
          <rect width="280" height="180" fill="#fffdf9" rx="4"/>
          <rect width="280" height="180" fill="url(#paper)" rx="4"/>
          <path d="M 30 150 Q 80 120, 120 110 T 200 70 Q 230 50, 250 30"
                fill="none" stroke="#E8B4B8" strokeWidth="1.5"
                strokeDasharray="4 4" opacity="0.4"/>
          <path d="M 30 150 Q 80 120, 120 110 T 200 70 Q 230 50, 250 30"
                fill="none" stroke="#B06B72" strokeWidth="2"
                strokeDasharray="300" strokeDashoffset={300 - (progress * 3)}
                style={{transition:'stroke-dashoffset 0.1s linear'}}/>
          <g transform="translate(30 150)">
            <circle r="8" fill="#fffdf9" stroke="#B06B72" strokeWidth="1.2"/>
            <circle r="3" fill="#B06B72"/>
            <text y="22" fontSize="8" textAnchor="middle" fontFamily="DM Mono, monospace" fill="#B06B72">AQUÍ</text>
          </g>
          <g transform="translate(250 30)">
            <circle r="10" fill="#fffdf9" stroke="#B06B72" strokeWidth="1.2" opacity={progress > 80 ? 1 : 0.4}/>
            <path d="M0 4 C -5 -1, -10 -4, -10 -8 C -10 -12, -7 -14, -4 -14 C -2 -14, -1 -13, 0 -11 C 1 -13, 2 -14, 4 -14 C 7 -14, 10 -12, 10 -8 C 10 -4, 5 -1, 0 4 Z"
                  fill="#D4919A" opacity={progress > 80 ? 1 : 0.3}/>
          </g>
          <g style={{
            transform: `translate(${30 + progress * 2.2}px, ${150 - progress * 1.2 + Math.sin(progress/6)*3}px)`,
            transition:'transform 0.1s linear',
          }}>
            <circle r="7" fill="#B06B72" opacity="0.15"/>
            <path d="M0 3 C -3 0, -7 -3, -7 -6 C -7 -9, -4 -10, -2 -10 C -1 -10, 0 -9, 0 -8 C 0 -9, 1 -10, 2 -10 C 4 -10, 7 -9, 7 -6 C 7 -3, 3 0, 0 3 Z"
                  fill="#B06B72"/>
          </g>
        </svg>
      </div>

      <div className="font-label" style={{marginTop: 16, color:'var(--rose-ink)', opacity: 0.8}}>
        próxima parada en {Math.max(0, Math.ceil((100 - progress) / 20))} min
      </div>

      <div style={{marginTop: 24}}>
        <div className="font-script" style={{color:'var(--rose-ink)', fontSize: 34, opacity:0.8, lineHeight:1}}>
          avanzando con amor…
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Arrived — brief arrival state before the letter
// ─────────────────────────────────────────────
function ArrivedView({ stop, onOpenLetter }) {
  return (
    <div className="soft-in" style={{
      padding:'40px 24px', minHeight:'100%', display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center', textAlign:'center', position:'relative',
    }}>
      {/* pulse ring */}
      <div style={{position:'relative', width: 120, height: 120, marginBottom: 8}}>
        <div style={{
          position:'absolute', inset:0, borderRadius:'50%',
          border:'1.5px solid #D4919A', opacity:0.35,
          animation:'pulseRing 2.2s ease-out infinite',
        }}/>
        <div style={{
          position:'absolute', inset:10, borderRadius:'50%',
          border:'1.5px solid #D4919A', opacity:0.55,
          animation:'pulseRing 2.2s ease-out 0.4s infinite',
        }}/>
        <div style={{
          position:'absolute', inset:'50%', transform:'translate(-50%,-50%)',
        }}>
          <Heart size={56} color="#B06B72"/>
        </div>
      </div>

      <div className="font-label" style={{color:'var(--rose-ink)', marginTop: 14}}>
        · Ya llegamos ·
      </div>

      <h2 className="font-display" style={{
        fontSize: 34, margin:'10px 12px 6px', fontWeight:400,
        fontStyle:'italic', letterSpacing:'-0.01em', lineHeight:1.15,
      }}>
        {stop.answer}
      </h2>

      <p className="font-body" style={{
        margin:'8px 18px 0', fontSize: 16, lineHeight: 1.5, fontStyle:'italic',
        color:'var(--ink-soft)', maxWidth: 300, textWrap:'pretty',
      }}>
        Bájate conmigo, amor. Antes de entrar, hay algo que quiero contarte.
      </p>

      <div style={{marginTop: 32}}>
        <button className="btn-primary" onClick={onOpenLetter}>
          Abrir la carta <Sparkle size={13} color="#fff"/>
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Finale — birthday closing
// ─────────────────────────────────────────────
function FinaleScreen({ onRestart }) {
  const [confetti, setConfetti] = useState([]);
  useEffect(() => {
    const now = Date.now();
    setConfetti(Array.from({length: 40}).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 4 + Math.random() * 3,
      rot: Math.random() * 360,
      color: ['#E8B4B8','#D4919A','#C8A2C8','#C9A96E','#F5D5D0'][Math.floor(Math.random()*5)],
      size: 6 + Math.random() * 8,
    })));
  }, []);

  return (
    <div className="soft-in" style={{
      padding:'32px 24px 40px', position:'relative',
      minHeight:'100%', display:'flex', flexDirection:'column',
      alignItems:'center', textAlign:'center',
    }}>
      {/* confetti */}
      <div style={{position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden'}}>
        {confetti.map(c => (
          <div key={c.id} style={{
            position:'absolute', top: -20, left: `${c.left}%`,
            width: c.size, height: c.size * 1.5,
            background: c.color, borderRadius: 1,
            transform: `rotate(${c.rot}deg)`,
            animation: `fall ${c.duration}s linear ${c.delay}s infinite`,
            opacity: 0.85,
          }}/>
        ))}
      </div>
      <style>{`@keyframes fall { 0% { transform: translateY(-20px) rotate(0deg); opacity: 0;} 10%{opacity:1;} 100% { transform: translateY(800px) rotate(720deg); opacity: 0;}}`}</style>

      <div style={{marginTop: 24, position:'relative'}}>
        <Bow size={48} style={{position:'absolute', top:-6, right:-30, transform:'rotate(12deg)'}}/>
        <div className="font-label" style={{color:'var(--rose-ink)'}}>
          · Capítulo final ·
        </div>
      </div>

      <h1 className="font-display" style={{
        fontSize: 48, lineHeight: 1, margin:'22px 0 6px',
        fontStyle:'italic', fontWeight: 400, letterSpacing:'-0.01em',
      }}>
        Feliz
      </h1>
      <h1 className="font-display" style={{
        fontSize: 54, lineHeight: 1, margin:0, fontWeight: 400,
      }}>
        cumpleaños,
      </h1>
      <div className="font-script" style={{fontSize: 74, color:'var(--rose-ink)', marginTop: 6, lineHeight:1}}>
        princesa
      </div>

      <div style={{margin:'22px 0', display:'flex', alignItems:'center', justifyContent:'center', gap:12}}>
        <div style={{width:28, height:1, background:'var(--rose-ink)', opacity:0.5}}/>
        <Heart size={14} color="#B06B72"/>
        <Sparkle size={12}/>
        <Heart size={14} color="#B06B72"/>
        <div style={{width:28, height:1, background:'var(--rose-ink)', opacity:0.5}}/>
      </div>

      {/* letter */}
      <div style={{
        background:'#fffdf9', padding:'26px 22px',
        borderRadius: 4, boxShadow:'var(--paper-shadow-lg)',
        border:'1px solid rgba(232,180,184,0.4)', position:'relative',
        transform:'rotate(-0.5deg)', textAlign:'left', marginTop: 4,
      }}>
        <div className="tape tape-top-left" style={{background:'rgba(201,169,110,0.55)'}}/>
        <div className="tape tape-top-right" style={{background:'rgba(200,162,200,0.55)'}}/>

        <p className="font-body" style={{
          margin:0, fontSize: 17, lineHeight: 1.6,
          fontStyle:'italic', color:'var(--ink)', textWrap:'pretty',
        }}>
          Y ahora sí, amor…<br/><br/>
          Recorrimos cuatro pedacitos de nuestra historia: las raíces, el primer beso, nuestro primer hogar y el presente. Y aunque aquí se cierra el recorrido, esto apenas empieza.<br/><br/>
          Hoy te toca disfrutar este día con todas las personas que más te amamos. Están esperándote, con los brazos abiertos y con todo el cariño del mundo.
        </p>

        <div style={{textAlign:'center', margin:'20px 0 10px'}}>
          <div className="font-script" style={{fontSize: 52, color:'var(--rose-ink)', lineHeight: 1}}>
            feliz cumpleaños, amor mío
          </div>
        </div>

        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop: 10}}>
          <div className="font-label" style={{opacity:0.6}}>22 · abril</div>
          <div style={{display:'flex', gap:6}}>
            <Heart size={12} color="#B06B72"/>
            <Heart size={10} color="#D4919A"/>
            <Heart size={8} color="#E8B4B8"/>
          </div>
        </div>
      </div>

      {/* pets */}
      <div style={{
        marginTop: 24, display:'flex', gap: 10, alignItems:'center',
        background:'rgba(255,253,249,0.6)', padding:'10px 18px',
        borderRadius: 999, border:'1px dashed var(--dusty)',
      }}>
        <span className="font-script" style={{fontSize: 36, color:'var(--rose-ink)', lineHeight:1}}>
          Chelsea &amp; Oliver
        </span>
        <span className="font-body" style={{fontSize:14, color:'var(--ink-soft)', fontStyle:'italic'}}>
          también te aman 🐾
        </span>
      </div>

      <div style={{flex: 1, minHeight: 24}}/>

      <button className="btn-ghost" onClick={onRestart} style={{marginTop: 26}}>
        <Heart size={12} color="#B06B72"/> Volver al inicio
      </button>
    </div>
  );
}

Object.assign(window, { IntroScreen, StopScreen, FinaleScreen });
