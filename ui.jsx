// Shared UI pieces

const Heart = ({ size = 14, color = "#D4919A", style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <path d="M12 21s-7-4.5-9.5-9C.5 8 2.5 4 6.5 4c2 0 3.5 1 5.5 3 2-2 3.5-3 5.5-3 4 0 6 4 4 8-2.5 4.5-9.5 9-9.5 9z"
          fill={color} stroke={color} strokeWidth="0.5"/>
  </svg>
);

const Sparkle = ({ size = 12, color = "#C9A96E", style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z"
          fill={color}/>
  </svg>
);

const Bow = ({ size = 32, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" style={style}>
    <path d="M24 24 C 14 14, 4 14, 4 24 C 4 34, 14 34, 24 24 Z" fill="#E8B4B8" stroke="#B06B72" strokeWidth="0.8"/>
    <path d="M24 24 C 34 14, 44 14, 44 24 C 44 34, 34 34, 24 24 Z" fill="#E8B4B8" stroke="#B06B72" strokeWidth="0.8"/>
    <ellipse cx="24" cy="24" rx="3" ry="5" fill="#D4919A" stroke="#B06B72" strokeWidth="0.8"/>
    <path d="M22 28 L 20 36 M 26 28 L 28 36" stroke="#B06B72" strokeWidth="0.8" fill="none"/>
    <path d="M20 36 L 17 34 L 20 36 L 19 38 Z" fill="#E8B4B8" stroke="#B06B72" strokeWidth="0.6"/>
    <path d="M28 36 L 31 34 L 28 36 L 29 38 Z" fill="#E8B4B8" stroke="#B06B72" strokeWidth="0.6"/>
  </svg>
);

const Flower = ({ size = 18, color = "#E8B4B8", style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <g transform="translate(12 12)">
      {[0,1,2,3,4].map(i => (
        <ellipse key={i} cx="0" cy="-5" rx="3" ry="5" fill={color} opacity="0.85"
          transform={`rotate(${i*72})`}/>
      ))}
      <circle cx="0" cy="0" r="2.2" fill="#C9A96E"/>
    </g>
  </svg>
);

const Ribbon = ({ text, color = "#B06B72" }) => (
  <div style={{
    display: 'inline-flex', alignItems: 'center', padding: '3px 14px',
    background: '#fffdf9', border: `1px solid ${color}`,
    borderRadius: 2, fontFamily: '"DM Mono", monospace',
    fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase',
    color, position: 'relative',
  }}>
    {text}
  </div>
);

// Photo placeholder — beautifully abstract so no copyrighted imagery
const PhotoPlaceholder = ({ stop, blur = 0, sharpness = 0 }) => {
  // build layered svg based on stop id for visual variety
  const hue = stop.placeholderHue;
  const themes = {
    1: { // Abadía — architectural, windows, nightscape
      bg: `linear-gradient(180deg, #2b2535 0%, #4a3848 55%, #8b5a65 100%)`,
      elements: (
        <>
          <div style={{position:'absolute', left:'15%', bottom:0, width:'30%', height:'65%', background:'#1f1a28', borderTopLeftRadius:8, borderTopRightRadius:8}}>
            {[0,1,2].map(r => (
              <div key={r} style={{display:'flex', gap:'8%', padding:'12% 10%', justifyContent:'center'}}>
                {[0,1,2].map(c => (
                  <div key={c} style={{width:'18%', aspectRatio:'1/1.6', background:'#f4c87a', borderRadius:2, opacity: 0.4 + Math.random()*0.5, boxShadow:'0 0 12px #f4c87a'}}/>
                ))}
              </div>
            ))}
          </div>
          <div style={{position:'absolute', left:'48%', bottom:0, width:'40%', height:'50%', background:'#2a1f2a', borderTopLeftRadius:4, borderTopRightRadius:4}}>
            {[0,1].map(r => (
              <div key={r} style={{display:'flex', gap:'10%', padding:'15% 12%', justifyContent:'center'}}>
                {[0,1].map(c => (
                  <div key={c} style={{width:'20%', aspectRatio:'1/1.5', background:'#e8a95a', borderRadius:2, opacity:0.5 + Math.random()*0.4, boxShadow:'0 0 8px #e8a95a'}}/>
                ))}
              </div>
            ))}
          </div>
          {/* stars */}
          {[...Array(8)].map((_,i) => (
            <div key={i} style={{position:'absolute', top:`${Math.random()*40}%`, left:`${Math.random()*100}%`, width:2, height:2, background:'#fff', borderRadius:'50%', opacity:0.7}}/>
          ))}
        </>
      )
    },
    2: { // Restaurante y videojuegos — neon, arcade
      bg: `radial-gradient(ellipse at 50% 40%, #3a1f3a 0%, #1a0f2a 100%)`,
      elements: (
        <>
          {/* neon signs */}
          <div style={{position:'absolute', top:'12%', left:'15%', width:'30%', height:'12%', background:'transparent', border:'2px solid #ff4fa3', borderRadius:20, boxShadow:'0 0 18px #ff4fa3, inset 0 0 10px #ff4fa3'}}/>
          <div style={{position:'absolute', top:'10%', right:'12%', width:'22%', height:'10%', background:'transparent', border:'2px solid #4fe8ff', borderRadius:6, boxShadow:'0 0 18px #4fe8ff, inset 0 0 10px #4fe8ff'}}/>
          {/* arcade cabinets */}
          {[0,1,2].map(i => (
            <div key={i} style={{position:'absolute', bottom:'8%', left:`${12+i*28}%`, width:'22%', height:'55%', background:'linear-gradient(180deg, #2a1a3a, #1a0f26)', borderRadius:'8px 8px 2px 2px', border:'1px solid #6a4e80'}}>
              <div style={{width:'70%', height:'30%', margin:'15% auto 0', background:`linear-gradient(135deg, ${['#ff4fa3','#4fe8ff','#ffbf4f'][i]}, #2a1a3a)`, borderRadius:2, boxShadow:`0 0 12px ${['#ff4fa3','#4fe8ff','#ffbf4f'][i]}`}}/>
              <div style={{width:'50%', height:8, margin:'10% auto 0', background:'#6a4e80', borderRadius:4}}/>
            </div>
          ))}
        </>
      )
    },
    3: { // Zajari — cozy apartment view, park shadows
      bg: `linear-gradient(180deg, #1a2030 0%, #2a3045 30%, #4a3a45 70%, #2a2530 100%)`,
      elements: (
        <>
          {/* city skyline silhouette */}
          <div style={{position:'absolute', left:0, right:0, bottom:'25%', height:'30%', display:'flex', alignItems:'flex-end'}}>
            {[40,25,55,35,60,30,50,45,38].map((h,i) => (
              <div key={i} style={{flex:1, height:`${h}%`, background:'#0f1520', borderRight:'1px solid #1a2030', position:'relative'}}>
                {[...Array(4)].map((_,j) => (
                  <div key={j} style={{position:'absolute', left:'20%', top:`${20+j*20}%`, width:'20%', height:6, background:'#ffcf6a', opacity:Math.random()>0.5?0.7:0.15, boxShadow:'0 0 4px #ffcf6a'}}/>
                ))}
              </div>
            ))}
          </div>
          {/* park in front - grass */}
          <div style={{position:'absolute', left:0, right:0, bottom:0, height:'25%', background:'linear-gradient(180deg, #3a5040 0%, #2a3828 100%)'}}/>
          {/* shadow basketball figures */}
          <div style={{position:'absolute', bottom:'10%', left:'25%', width:'10%', height:'22%', background:'#0a0a0a', borderRadius:'50% 50% 10% 10%', opacity:0.6, transform:'rotate(-8deg)'}}/>
          <div style={{position:'absolute', bottom:'10%', right:'28%', width:'10%', height:'22%', background:'#0a0a0a', borderRadius:'50% 50% 10% 10%', opacity:0.6, transform:'rotate(6deg)'}}/>
          {/* moon */}
          <div style={{position:'absolute', top:'12%', right:'18%', width:30, height:30, borderRadius:'50%', background:'#f7e8c0', boxShadow:'0 0 20px rgba(247,232,192,0.5)'}}/>
        </>
      )
    },
    4: { // Nuestro hogar — warm living room
      bg: `linear-gradient(180deg, #4a3028 0%, #6a4530 60%, #8a5a42 100%)`,
      elements: (
        <>
          {/* warm window light */}
          <div style={{position:'absolute', top:'10%', right:'15%', width:'30%', height:'35%', background:'linear-gradient(135deg, #ffd4a0, #f4a878)', borderRadius:4, opacity:0.8, boxShadow:'0 0 40px rgba(255,212,160,0.6)'}}/>
          {/* couch silhouette */}
          <div style={{position:'absolute', bottom:'15%', left:'10%', right:'10%', height:'30%', background:'#3a2420', borderRadius:'20px 20px 8px 8px'}}>
            <div style={{position:'absolute', top:'20%', left:'10%', width:'30%', height:'50%', background:'#5a3830', borderRadius:8}}/>
            <div style={{position:'absolute', top:'20%', right:'10%', width:'30%', height:'50%', background:'#5a3830', borderRadius:8}}/>
          </div>
          {/* plants */}
          <div style={{position:'absolute', bottom:'12%', left:'3%', width:'12%', height:'35%'}}>
            <div style={{position:'absolute', bottom:0, left:'25%', width:'50%', height:'25%', background:'#8a5a42', borderRadius:'2px 2px 4px 4px'}}/>
            <div style={{position:'absolute', bottom:'20%', left:0, right:0, height:'75%', background:'radial-gradient(ellipse, #4a6040 30%, transparent 70%)'}}/>
          </div>
          <div style={{position:'absolute', bottom:'50%', right:'5%', width:'10%', height:'25%'}}>
            <div style={{position:'absolute', bottom:0, left:'25%', width:'50%', height:'35%', background:'#8a5a42', borderRadius:'2px 2px 4px 4px'}}/>
            <div style={{position:'absolute', bottom:'25%', left:0, right:0, height:'75%', background:'radial-gradient(ellipse, #5a7050 30%, transparent 70%)'}}/>
          </div>
          {/* birthday sparkles */}
          {[...Array(6)].map((_,i) => (
            <div key={i} style={{position:'absolute', top:`${10+Math.random()*40}%`, left:`${Math.random()*100}%`, width:3, height:3, background:'#ffd4a0', borderRadius:'50%', boxShadow:'0 0 6px #ffd4a0', opacity:0.7}}/>
          ))}
        </>
      )
    },
  };
  const theme = themes[stop.id];
  const filter = `blur(${blur}px) saturate(${0.7 + sharpness * 0.3}) contrast(${0.95 + sharpness * 0.05})`;
  // Real photo path wins over stylized placeholder when provided
  if (stop.photo) {
    return (
      <div style={{
        position: 'absolute', inset: 0, overflow: 'hidden',
        background: '#1a1520',
      }}>
        <img
          src={stop.photo}
          alt=""
          style={{
            position:'absolute', inset:0, width:'100%', height:'100%',
            objectFit:'cover',
            filter: `blur(${blur}px) saturate(${0.85 + sharpness * 0.15}) contrast(${0.95 + sharpness * 0.05})`,
            transform: `scale(${1 + blur * 0.02})`, // avoid blur edges
            transition: 'filter 1.2s cubic-bezier(0.19, 1, 0.22, 1), transform 1.2s cubic-bezier(0.19, 1, 0.22, 1)',
          }}
        />
        {/* gentle warm wash so it blends with the scrapbook palette */}
        <div style={{
          position:'absolute', inset:0,
          background:'linear-gradient(180deg, rgba(255,240,230,0.08), rgba(176,107,114,0.10))',
          mixBlendMode:'soft-light', pointerEvents:'none',
        }}/>
      </div>
    );
  }
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: theme.bg,
      filter,
      transition: 'filter 1.2s cubic-bezier(0.19, 1, 0.22, 1)',
    }}>
      {theme.elements}
    </div>
  );
};

// Progress trail with hearts
const ProgressTrail = ({ current, total = 4 }) => {
  return (
    <div className="progress-trail">
      <div className="trail-line" />
      {Array.from({length: total}).map((_, i) => {
        const state = i < current ? 'done' : i === current ? 'current' : 'upcoming';
        return (
          <div key={i} className={`trail-dot ${state}`}>
            {state === 'done' ? (
              <Heart size={20} color="#B06B72" />
            ) : state === 'current' ? (
              <div style={{position:'relative'}}>
                <Heart size={22} color="#D4919A" />
                <div style={{
                  position:'absolute', inset:-6, borderRadius:'50%',
                  border:'1.5px solid #D4919A', opacity:0.4,
                  animation:'pulseRing 2s ease-out infinite',
                }}/>
              </div>
            ) : (
              <Heart size={18} color="#D4919A" />
            )}
          </div>
        );
      })}
    </div>
  );
};

Object.assign(window, { Heart, Sparkle, Bow, Flower, Ribbon, PhotoPlaceholder, ProgressTrail });
