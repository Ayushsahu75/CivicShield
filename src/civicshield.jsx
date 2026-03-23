import { useState, useEffect, useRef } from "react";

// ── DATA ──
const STATIONS = {
  VJNPS:  { id:"VJNPS",  name:"Vijay Nagar Police Station", short:"VJN", pass:"vjn@2026",  area:"Vijay Nagar, Indore",  color:"#1a3de4",
    officers:[
      {id:"OFF-VJN-01",name:"SI Priya Sharma",   post:"Sub Inspector",      status:"On Duty",  cases:12,resolved:34,rating:4.6},
      {id:"OFF-VJN-02",name:"ASI Ramesh Kumar",  post:"Asst Sub Inspector", status:"On Duty",  cases:5, resolved:28,rating:4.1},
      {id:"OFF-VJN-03",name:"HC Suresh Patel",   post:"Head Constable",     status:"On Duty",  cases:3, resolved:19,rating:3.9},
      {id:"OFF-VJN-04",name:"Const. Meena Rao",  post:"Constable",          status:"Off Duty", cases:0, resolved:11,rating:4.3},
    ]},
  MGRDPS: { id:"MGRDPS", name:"MG Road Police Station",     short:"MGR", pass:"mgr@2026",  area:"MG Road, Indore",      color:"#7c3aed",
    officers:[
      {id:"OFF-MGR-01",name:"Insp. R. Verma",    post:"Inspector",          status:"On Duty",  cases:8, resolved:61,rating:4.8},
      {id:"OFF-MGR-02",name:"SI K. Singh",        post:"Sub Inspector",      status:"On Duty",  cases:6, resolved:42,rating:4.4},
      {id:"OFF-MGR-03",name:"ASI D. Yadav",      post:"Asst Sub Inspector", status:"Off Duty", cases:0, resolved:15,rating:3.7},
    ]},
  PALPS:  { id:"PALPS",  name:"Palasia Police Station",     short:"PAL", pass:"pal@2026",  area:"Palasia, Indore",      color:"#0f766e",
    officers:[
      {id:"OFF-PAL-01",name:"SI A. Tiwari",       post:"Sub Inspector",      status:"On Duty",  cases:9, resolved:27,rating:4.2},
      {id:"OFF-PAL-02",name:"HC B. Mishra",       post:"Head Constable",     status:"On Duty",  cases:4, resolved:18,rating:4.0},
    ]},
};

const INIT_CASES = [
  { id:"RPT-1001",token:"CIV-4821",type:"witness",reportType:"Crime",
    title:"Chain snatching near bus stand",
    description:"Two individuals on a motorcycle — black jacket, red shirt — snatched a woman's handbag and fled towards the flyover.",
    location:"Vijay Nagar, Indore",time:"11:43 PM · 19 Mar",score:84,
    status:"In Process",stationId:"VJNPS",
    assignedOfficer:{id:"OFF-VJN-01",name:"SI Priya Sharma",post:"Sub Inspector"},
    proof:"photo",proofFile:null,identity:null,firDecision:null,rating:null,
    aiAnalysis:{score:84,verdict:"VERIFIED",summary:"Report contains specific identifying details — motorcycle, clothing colors, direction of escape. Evidence photo strengthens the case considerably.",signals:{description_coherence:{score:17,max:20,status:"STRONG",note:"Named vehicle type, clothing details, and escape direction provided."},location_match:{score:16,max:18,status:"STRONG",note:"Bus stand area is a high foot-traffic crime hotspot — very plausible."},time_plausibility:{score:14,max:15,status:"STRONG",note:"11:43 PM near transport hub — chain snatching peak window."},evidence_quality:{score:18,max:20,status:"STRONG",note:"Photo evidence uploaded with case."},corroboration_potential:{score:9,max:12,status:"MODERATE",note:"Public bus stand — likely bystander witnesses present."},category_match:{score:10,max:15,status:"MODERATE",note:"Description matches crime/theft category well."}},police_action:"Dispatch officer immediately. Review uploaded photo for suspect ID. Check CCTV at bus stand flyover junction.",weak_points:["Suspect vehicle registration not noted","Exact direction of escape unclear"]} },
  { id:"RPT-1002",token:"CIV-4819",type:"victim",reportType:"Accident",
    title:"Road accident — 2 injured",
    description:"A truck hit our vehicle from the side on MG Road. Both occupants are injured and need immediate medical attention.",
    location:"MG Road, Indore",time:"9:12 PM · 19 Mar",score:91,
    status:"Complete",stationId:"MGRDPS",
    assignedOfficer:{id:"OFF-MGR-01",name:"Insp. R. Verma",post:"Inspector"},
    proof:"photo",proofFile:null,identity:{name:"Rahul Sharma",phone:"98XX0001"},
    firDecision:true,rating:4,
    aiAnalysis:{score:91,verdict:"VERIFIED",summary:"High-credibility victim report with identity verification. Specific incident description with location and injury details. Photo evidence uploaded.",signals:{description_coherence:{score:19,max:20,status:"STRONG",note:"Specific incident — vehicle type, direction of impact, injury severity mentioned."},location_match:{score:17,max:18,status:"STRONG",note:"MG Road is a high-traffic accident zone — fully plausible."},time_plausibility:{score:14,max:15,status:"STRONG",note:"9:12 PM peak traffic time — accident probability high."},evidence_quality:{score:18,max:20,status:"STRONG",note:"Photo evidence attached."},corroboration_potential:{score:11,max:12,status:"STRONG",note:"MG Road at 9PM — many witnesses likely present."},category_match:{score:12,max:15,status:"STRONG",note:"Description perfectly matches accident category."}},police_action:"Case resolved. FIR filed. Follow up on insurance documentation if required.",weak_points:[]} },
  { id:"RPT-1003",token:"CIV-4815",type:"witness",reportType:"Crime",
    title:"Drunk driving spotted",
    description:"A white Swift car driving erratically at high speed, zigzagging across lanes. Driver appears heavily intoxicated.",
    location:"Palasia, Indore",time:"1:30 AM · 19 Mar",score:67,
    status:"Pending",stationId:"PALPS",
    assignedOfficer:null,proof:"video",proofFile:null,identity:null,firDecision:null,rating:null,
    aiAnalysis:{score:67,verdict:"REVIEW",summary:"Report has supporting video evidence and plausible time, but lacks vehicle registration number and specific identifiers needed for action. Manual review recommended.",signals:{description_coherence:{score:11,max:20,status:"MODERATE",note:"Vehicle color and model noted, but no registration plate or driver description provided."},location_match:{score:13,max:18,status:"MODERATE",note:"Palasia is a residential area — drunk driving possible but less common at 1:30 AM."},time_plausibility:{score:13,max:15,status:"STRONG",note:"1:30 AM is peak drunk driving window after late-night venues close."},evidence_quality:{score:16,max:20,status:"STRONG",note:"Video evidence uploaded — strongest element of this report."},corroboration_potential:{score:5,max:12,status:"WEAK",note:"1:30 AM — very few witnesses likely on road."},category_match:{score:9,max:15,status:"MODERATE",note:"Description matches erratic driving but 'crime' category is broad."}},police_action:"Request witness to provide vehicle registration if visible in video. Patrol Palasia area. Check video for plate number before dispatching.",weak_points:["No vehicle registration number","Driver not identified","Anonymous witness — cannot follow up for more details"]} },
  { id:"RPT-1004",token:"CIV-4810",type:"victim",reportType:"Harassment",
    title:"Repeated street harassment",
    description:"A group of individuals has been harassing me on this stretch every evening around 8–9 PM. I feel unsafe walking home.",
    location:"Vijay Nagar, Indore",time:"8:00 PM · 18 Mar",score:78,
    status:"Pending",stationId:"VJNPS",
    assignedOfficer:null,proof:null,proofFile:null,identity:{name:"Priya Gupta",phone:"97XX0042"},
    firDecision:null,rating:null,
    aiAnalysis:{score:78,verdict:"VERIFIED",summary:"Victim report with verified identity. Pattern harassment is credible given time consistency (8-9 PM daily). Lack of photographic evidence is the primary gap.",signals:{description_coherence:{score:13,max:20,status:"MODERATE",note:"Pattern described with time window, but no physical description of harassers provided."},location_match:{score:15,max:18,status:"STRONG",note:"Vijay Nagar residential stretch — matches harassment incident profile."},time_plausibility:{score:13,max:15,status:"STRONG",note:"8-9 PM evening — peak harassment window for residential areas."},evidence_quality:{score:4,max:20,status:"WEAK",note:"No photo or video evidence uploaded. This is the biggest gap in the case."},corroboration_potential:{score:7,max:12,status:"MODERATE",note:"Evening hour — some witnesses possible on the street."},category_match:{score:14,max:15,status:"STRONG",note:"Description clearly matches harassment category."}},police_action:"Contact victim Priya Gupta at provided number. Ask for physical description of harassers. Arrange plain-clothes patrol at 8-9 PM on reported stretch.",weak_points:["No photo or video evidence — critical gap","No physical description of harassers","No vehicle or other identifying information"]} },
];

// ── SCREENS ──
const SCREENS = { HOME:"home",CHOOSE:"choose",WITNESS:"witness",VICTIM:"victim",TRACK:"track",STATION_LOGIN:"station_login",POLICE:"police" };

// ── STYLES (design tokens) ──
const T = {
  ink:"#0c0c14", paper:"#f6f4ef", blue:"#1a3de4", blue2:"#0f2899",
  green:"#0a7a35", red:"#d91a1a", amber:"#b87000",
  muted:"#6b6872", border:"rgba(12,12,20,0.1)",
  card:"#ffffff", serif:"'Syne',sans-serif", sans:"'DM Sans',sans-serif",
};

// Global styles injected once
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{background:${T.paper};color:${T.ink};font-family:${T.sans};overflow-x:hidden}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:${T.paper}}::-webkit-scrollbar-thumb{background:${T.blue};border-radius:2px}
input,textarea,select{font-family:${T.sans}}
@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes scaleIn{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}
@keyframes slideLeft{from{opacity:0;transform:translateX(-28px)}to{opacity:1;transform:translateX(0)}}
@keyframes slideRight{from{opacity:0;transform:translateX(28px)}to{opacity:1;transform:translateX(0)}}
@keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes pulse2{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes barFill{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes countUp{from{opacity:0}to{opacity:1}}
.animate-fadeUp{animation:fadeUp .6s ease both}
.animate-scaleIn{animation:scaleIn .5s ease both}
.animate-slideLeft{animation:slideLeft .6s ease both}
.animate-slideRight{animation:slideRight .6s ease both}
.bar-animated{animation:barFill 1.2s cubic-bezier(.4,0,.2,1) both;transform-origin:left}
.delay-1{animation-delay:.08s}.delay-2{animation-delay:.16s}.delay-3{animation-delay:.24s}
.delay-4{animation-delay:.32s}.delay-5{animation-delay:.4s}.delay-6{animation-delay:.48s}
`;

function injectGlobalCSS() {
  if(document.getElementById('cs-global')) return;
  const s = document.createElement('style'); s.id='cs-global'; s.textContent=GLOBAL_CSS;
  document.head.appendChild(s);
}

// ── TINY HELPERS ──
const fU = (s,d=0) => ({ animation:`fadeUp .55s ease ${d}s both` });
const sI = (d=0) => ({ animation:`scaleIn .5s ease ${d}s both` });
const sL = (d=0) => ({ animation:`slideLeft .6s ease ${d}s both` });
const sR = (d=0) => ({ animation:`slideRight .6s ease ${d}s both` });

function initials(name){ return name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase() }

function Badge({label,color="#1a3de4",bg,small=false}){
  const bgc = bg || (color==='#1a3de4'?'#eef1fd':color==='#7c3aed'?'#f4f0fe':color==='#0a7a35'?'#e8f5ee':color==='#d91a1a'?'#fdeaea':color==='#b87000'?'#fdf6e3':'#f0f0f4');
  return <span style={{display:'inline-flex',alignItems:'center',background:bgc,color,fontSize:small?9:10,fontWeight:700,letterSpacing:'1.5px',padding:small?'3px 8px':'4px 11px',textTransform:'uppercase'}}>{label}</span>;
}

function ScoreBadge({score}){
  const c = score>=70?T.green:score>=40?T.amber:T.red;
  const bg = score>=70?'#e8f5ee':score>=40?'#fdf6e3':'#fdeaea';
  return <span style={{background:bg,color:c,fontSize:11,fontWeight:700,padding:'4px 10px'}}>{score}/100</span>;
}

function StatusChip({status}){
  const m={'Pending':{c:T.amber,bg:'#fdf6e3'},'In Process':{c:T.blue,bg:'#eef1fd'},'Complete':{c:T.green,bg:'#e8f5ee'}};
  const s=m[status]||{c:T.muted,bg:'#f0f0f4'};
  return <span style={{background:s.bg,color:s.c,fontSize:10,fontWeight:700,letterSpacing:'1px',padding:'4px 11px',textTransform:'uppercase'}}>{status}</span>;
}

function Stars({value,onChange,readonly=false,size=22}){
  const [hover,setHover]=useState(0);
  return <div style={{display:'flex',gap:2}}>{[1,2,3,4,5].map(i=>(
    <span key={i} onMouseEnter={()=>!readonly&&setHover(i)} onMouseLeave={()=>!readonly&&setHover(0)} onClick={()=>!readonly&&onChange?.(i)}
      style={{fontSize:size,cursor:readonly?'default':'pointer',color:(hover||value)>=i?'#f59e0b':'#e2e8f0',transition:'color .12s',lineHeight:1}}>★</span>
  ))}</div>;
}

function AvatarCircle({name,size=42,bg=T.blue,textColor='#fff'}){
  return <div style={{width:size,height:size,borderRadius:'50%',background:bg,display:'flex',alignItems:'center',justifyContent:'center',color:textColor,fontFamily:T.serif,fontWeight:700,fontSize:size*.32,flexShrink:0}}>{initials(name)}</div>;
}

function Input({label,value,onChange,type='text',placeholder='',disabled=false,mono=false}){
  return <div style={{display:'flex',flexDirection:'column',gap:5}}>
    {label&&<label style={{fontSize:10,fontWeight:600,letterSpacing:'1.5px',textTransform:'uppercase',color:T.muted}}>{label}</label>}
    <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} disabled={disabled}
      style={{border:`1px solid ${T.border}`,background:disabled?'#f6f4ef':T.card,borderRadius:0,padding:'10px 14px',fontSize:13,color:T.ink,outline:'none',fontFamily:mono?'monospace':T.sans,letterSpacing:mono?'1px':0,transition:'border-color .2s',opacity:disabled?.6:1}}
      onFocus={e=>e.target.style.borderColor=T.blue} onBlur={e=>e.target.style.borderColor=T.border}/>
  </div>;
}

function Textarea({label,value,onChange,placeholder='',rows=4}){
  return <div style={{display:'flex',flexDirection:'column',gap:5}}>
    {label&&<label style={{fontSize:10,fontWeight:600,letterSpacing:'1.5px',textTransform:'uppercase',color:T.muted}}>{label}</label>}
    <textarea rows={rows} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
      style={{border:`1px solid ${T.border}`,background:T.card,borderRadius:0,padding:'10px 14px',fontSize:13,color:T.ink,outline:'none',fontFamily:T.sans,resize:'vertical',transition:'border-color .2s',lineHeight:1.6}}
      onFocus={e=>e.target.style.borderColor=T.blue} onBlur={e=>e.target.style.borderColor=T.border}/>
  </div>;
}

function Select({label,value,onChange,options}){
  return <div style={{display:'flex',flexDirection:'column',gap:5}}>
    {label&&<label style={{fontSize:10,fontWeight:600,letterSpacing:'1.5px',textTransform:'uppercase',color:T.muted}}>{label}</label>}
    <select value={value} onChange={e=>onChange(e.target.value)}
      style={{border:`1px solid ${T.border}`,background:T.card,borderRadius:0,padding:'10px 14px',fontSize:13,color:T.ink,outline:'none',fontFamily:T.sans,appearance:'none',cursor:'pointer',backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236b6872' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,backgroundRepeat:'no-repeat',backgroundPosition:'right 14px center'}}>
      {options.map(([v,l])=><option key={v} value={v}>{l}</option>)}
    </select>
  </div>;
}

function Btn({children,onClick,variant='primary',disabled=false,full=false,sm=false}){
  const [hov,setHov]=useState(false);
  const v={
    primary:{bg:hov?T.blue2:T.blue,c:'#fff',border:'none'},
    ghost:{bg:hov?T.ink:'transparent',c:hov?'#fff':T.ink,border:`1.5px solid ${T.ink}`},
    danger:{bg:hov?'#b91c1c':T.red,c:'#fff',border:'none'},
    green:{bg:hov?'#065f2a':T.green,c:'#fff',border:'none'},
    outline:{bg:hov?'rgba(26,61,228,.06)':'transparent',c:T.blue,border:`1.5px solid ${T.blue}`},
  }[variant]||{};
  return <button onClick={onClick} disabled={disabled}
    onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
    style={{...v,padding:sm?'7px 16px':'11px 24px',fontSize:sm?12:14,fontWeight:600,fontFamily:T.sans,cursor:disabled?'default':'pointer',letterSpacing:'.3px',transition:'all .18s',width:full?'100%':'auto',opacity:disabled?.45:1,display:'inline-flex',alignItems:'center',gap:8,justifyContent:'center',borderRadius:0}}>
    {children}
  </button>;
}

// ── PROGRESS BAR ──
function ProgressBar({steps,current,color=T.blue}){
  return <div style={{display:'flex',gap:4,marginBottom:24}}>
    {Array.from({length:steps}).map((_,i)=>(
      <div key={i} style={{flex:1,height:3,background:i<current?color:'rgba(12,12,20,.1)',transition:'background .3s',borderRadius:0}}/>
    ))}
  </div>;
}

// ── TIMELINE STATUS ──
function CaseTimeline({status}){
  const steps=['Pending','In Process','Complete'];
  const cur=steps.indexOf(status);
  return <div style={{display:'flex',alignItems:'center',gap:0}}>
    {steps.map((s,i)=>{
      const done=i<=cur, active=i===cur;
      return <div key={s} style={{display:'flex',alignItems:'center',flex:1}}>
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:5,flex:'none'}}>
          <div style={{width:28,height:28,borderRadius:'50%',border:`2px solid ${done?T.blue:T.border}`,background:active?T.blue:done?'rgba(26,61,228,.12)':'transparent',display:'flex',alignItems:'center',justifyContent:'center',transition:'all .3s'}}>
            {done&&!active&&<span style={{color:T.blue,fontSize:11,fontWeight:700}}>✓</span>}
            {active&&<span style={{width:8,height:8,borderRadius:'50%',background:'#fff',display:'block'}}/>}
          </div>
          <span style={{fontSize:9,fontWeight:600,letterSpacing:'1px',textTransform:'uppercase',color:active?T.blue:done?T.muted:'rgba(12,12,20,.3)',whiteSpace:'nowrap'}}>{s}</span>
        </div>
        {i<steps.length-1&&<div style={{flex:1,height:1.5,background:cur>i?T.blue:T.border,margin:'0 4px',marginBottom:18,transition:'background .3s'}}/>}
      </div>;
    })}
  </div>;
}

// ══════════════════════════════════════════════════════════
// SCREENS
// ══════════════════════════════════════════════════════════

// ── HOME ──
function Home({setScreen}){
  const [count,setCount]=useState({a:0,b:0,c:0,d:0});
  useEffect(()=>{
    const targets={a:92,b:23,c:89,d:7};
    const duration=1800, steps=60;
    let frame=0;
    const iv=setInterval(()=>{
      frame++;
      const p=Math.min(1, frame/steps);
      const ease=1-Math.pow(1-p,3);
      setCount({a:Math.round(targets.a*ease),b:Math.round(targets.b*ease),c:Math.round(targets.c*ease),d:Math.round(targets.d*ease)});
      if(frame>=steps) clearInterval(iv);
    },duration/steps);
    return ()=>clearInterval(iv);
  },[]);

  return <div style={{minHeight:'100vh',background:T.paper}}>
    {/* HERO */}
    <div style={{minHeight:'100vh',display:'flex',flexDirection:'column',justifyContent:'flex-end',padding:'0 48px 72px',position:'relative',overflow:'hidden'}}>
      {/* BG text */}
      <div style={{position:'absolute',right:40,top:'50%',transform:'translateY(-50%)',fontFamily:T.serif,fontSize:'min(28vw,340px)',fontWeight:800,color:'rgba(12,12,20,.04)',lineHeight:1,pointerEvents:'none',letterSpacing:-12,userSelect:'none'}}>CS</div>

      {/* Top left label */}
      <div style={{...sL(0),position:'absolute',top:36,left:48,display:'flex',alignItems:'center',gap:10,fontSize:11,fontWeight:500,letterSpacing:'2.5px',textTransform:'uppercase',color:T.blue}}>
        <span style={{width:28,height:1,background:T.blue,display:'block'}}/>
        Smart City Safety · Indore
      </div>

      {/* HEADLINE */}
      <div style={fU(.15)}>
        <h1 style={{fontFamily:T.serif,fontSize:'min(11vw,108px)',fontWeight:800,lineHeight:.92,letterSpacing:'-4px',marginBottom:36,color:T.ink}}>
          Report.<br/>Without<br/>Fear.
        </h1>
      </div>

      <p style={{...fU(.35),fontSize:17,color:T.muted,maxWidth:460,lineHeight:1.75,marginBottom:44,fontWeight:300}}>
        The first anonymous civic evidence platform — anyone reports, Claude AI verifies, police respond. Your identity stays safe.
      </p>

      <div style={{...fU(.5),display:'flex',gap:14,flexWrap:'wrap'}}>
        <Btn onClick={()=>setScreen(SCREENS.CHOOSE)}>Submit a Report →</Btn>
        <Btn variant="ghost" onClick={()=>setScreen(SCREENS.TRACK)}>Track My Report</Btn>
        <Btn variant="outline" onClick={()=>setScreen(SCREENS.STATION_LOGIN)}>Police Login</Btn>
      </div>
    </div>

    {/* TICKER */}
    <div style={{background:T.blue,overflow:'hidden',padding:'13px 0',borderTop:`3px solid ${T.blue2}`}}>
      <div style={{display:'inline-flex',animation:'ticker 20s linear infinite',whiteSpace:'nowrap'}}>
        {['Anonymous Reporting','AI Verification','Real-Time Dispatch','FIR by Victim\'s Choice','Officer Ratings','Token Tracking','Zero Login','Hindi Voice Reports'].flatMap(t=>[
          <span key={t} style={{fontFamily:T.serif,fontSize:12,fontWeight:700,color:'#fff',letterSpacing:'2px',textTransform:'uppercase',padding:'0 28px'}}>✦</span>,
          <span key={t+'t'} style={{fontFamily:T.serif,fontSize:12,fontWeight:600,color:'rgba(255,255,255,.85)',letterSpacing:'2px',textTransform:'uppercase',padding:'0 4px'}}>{t}</span>
        ])}
        {['Anonymous Reporting','AI Verification','Real-Time Dispatch','FIR by Victim\'s Choice','Officer Ratings','Token Tracking','Zero Login','Hindi Voice Reports'].flatMap(t=>[
          <span key={'2'+t} style={{fontFamily:T.serif,fontSize:12,fontWeight:700,color:'#fff',letterSpacing:'2px',textTransform:'uppercase',padding:'0 28px'}}>✦</span>,
          <span key={'2'+t+'t'} style={{fontFamily:T.serif,fontSize:12,fontWeight:600,color:'rgba(255,255,255,.85)',letterSpacing:'2px',textTransform:'uppercase',padding:'0 4px'}}>{t}</span>
        ])}
      </div>
    </div>

    {/* STATS */}
    <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',borderTop:`1px solid ${T.border}`,borderBottom:`1px solid ${T.border}`}}>
      {[
        {n:`${count.a}`, unit:'%', l:'INCIDENTS NEVER REPORTED', col:T.red},
        {n:`${count.b}`, unit:'MIN', l:'AVERAGE POLICE RESPONSE', col:T.ink},
        {n:`${count.c}`, unit:'%', l:'TARGET RESOLUTION RATE', col:T.green},
        {n:`${count.d}`, unit:'MIN', l:'TARGET RESPONSE WITH AI', col:T.blue},
      ].map((s,i)=>(
        <div key={i} style={{...fU(i*.08),padding:'48px 36px',borderRight:i<3?`1px solid ${T.border}`:'none',position:'relative',overflow:'hidden'}}>
          <div style={{position:'relative',display:'flex',alignItems:'flex-start',gap:2,marginBottom:16,lineHeight:1}}>
            <span style={{
              fontFamily:"'Bebas Neue','Impact','Arial Black',sans-serif",
              fontSize:'min(7vw,80px)',
              fontWeight:900,
              color:s.col,
              letterSpacing:'2px',
              lineHeight:.9,
            }}>{s.n}</span>
            <span style={{
              fontFamily:"'Bebas Neue','Impact','Arial Black',sans-serif",
              fontSize:'min(3.5vw,40px)',
              fontWeight:900,
              color:s.col,
              opacity:.8,
              letterSpacing:'2px',
              lineHeight:1,
              paddingTop:6,
            }}>{s.unit}</span>
          </div>
          <div style={{width:'100%',height:2,background:`linear-gradient(90deg,${s.col},transparent)`,marginBottom:14,opacity:.25}}/>
          <div style={{
            fontFamily:"'Bebas Neue','Impact','Arial Black',sans-serif",
            fontSize:'min(1.2vw,13px)',
            fontWeight:900,
            color:T.muted,
            letterSpacing:'3px',
            lineHeight:1.5,
            textTransform:'uppercase',
          }}>{s.l}</div>
        </div>
      ))}
    </div>

    {/* FEATURE CARDS */}
    <div style={{padding:'80px 48px'}}>
      <div style={{...fU(0),marginBottom:48}}>
        <p style={{fontSize:10,letterSpacing:'3px',textTransform:'uppercase',color:T.muted,marginBottom:12,display:'flex',alignItems:'center',gap:10}}>
          <span style={{width:20,height:1,background:T.muted,display:'block'}}/>How It Works
        </p>
        <h2 style={{fontFamily:T.serif,fontSize:'min(5vw,52px)',fontWeight:800,letterSpacing:'-1.5px',lineHeight:1.05}}>Built for every situation.</h2>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:1,background:T.border}}>
        {[
          {icon:'👁',title:'Witness Report',tag:'Anonymous',tagColor:T.green,desc:'You saw something happen. Report completely anonymously — no name, no login, ever. Get a token to track and rate.',action:()=>setScreen(SCREENS.WITNESS),cta:'Report as Witness'},
          {icon:'🆘',title:'Victim Report',tag:'Identity to Police',tagColor:'#7c3aed',desc:'It happened to you. Share your identity with the assigned officer only. You decide whether to file an FIR.',action:()=>setScreen(SCREENS.VICTIM),cta:'Report as Victim'},
          {icon:'🔍',title:'Track Your Case',tag:'Token Required',tagColor:T.ink,desc:'Enter your anonymous token and see exactly where your case stands — in real time, from submission to resolution.',action:()=>setScreen(SCREENS.TRACK),cta:'Track Report'},
        ].map((f,i)=>(
          <div key={i} style={{...fU(i*.12),background:T.card,padding:'44px 40px',cursor:'pointer',transition:'background .2s'}}
            onMouseEnter={e=>e.currentTarget.style.background='#faf9f5'}
            onMouseLeave={e=>e.currentTarget.style.background=T.card}
            onClick={f.action}>
            <div style={{fontSize:36,marginBottom:20}}>{f.icon}</div>
            <Badge label={f.tag} color={f.tagColor}/>
            <h3 style={{fontFamily:T.serif,fontSize:22,fontWeight:700,margin:'12px 0 10px',letterSpacing:'-.3px'}}>{f.title}</h3>
            <p style={{fontSize:13,color:T.muted,lineHeight:1.7,fontWeight:300,marginBottom:24}}>{f.desc}</p>
            <span style={{fontSize:13,color:T.blue,fontWeight:600,letterSpacing:'.3px'}}>{f.cta} →</span>
          </div>
        ))}
      </div>
    </div>

    {/* POLICE STATIONS */}
    <div style={{padding:'0 48px 80px'}}>
      <div style={{...fU(0),borderTop:`1px solid ${T.border}`,paddingTop:48,marginBottom:32}}>
        <p style={{fontSize:10,letterSpacing:'3px',textTransform:'uppercase',color:T.muted,marginBottom:12,display:'flex',alignItems:'center',gap:10}}>
          <span style={{width:20,height:1,background:T.muted,display:'block'}}/>Active Stations
        </p>
        <h2 style={{fontFamily:T.serif,fontSize:36,fontWeight:800,letterSpacing:'-1px'}}>3 police stations connected.</h2>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:1,background:T.border}}>
        {Object.values(STATIONS).map((st,i)=>(
          <div key={st.id} style={{...fU(i*.1),background:T.card,padding:'28px 32px',cursor:'pointer',transition:'background .2s'}}
            onMouseEnter={e=>e.currentTarget.style.background='#faf9f5'}
            onMouseLeave={e=>e.currentTarget.style.background=T.card}
            onClick={()=>setScreen(SCREENS.STATION_LOGIN)}>
            <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:14}}>
              <div style={{width:36,height:36,background:st.color,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontFamily:T.serif,fontWeight:800,fontSize:13}}>{st.short}</div>
              <div>
                <div style={{fontSize:14,fontWeight:600,letterSpacing:'-.2px'}}>{st.name}</div>
                <div style={{fontSize:11,color:T.muted}}>{st.area}</div>
              </div>
            </div>
            <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
              <Badge label={`${st.officers.filter(o=>o.status==='On Duty').length} On Duty`} color={T.green} small/>
              <Badge label={`${st.officers.length} Officers`} color={T.blue} small/>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>;
}

// ── CHOOSE ──
function Choose({setScreen}){
  return <div style={{maxWidth:600,margin:'0 auto',padding:'64px 24px'}}>
    <button onClick={()=>setScreen(SCREENS.HOME)} style={{...sL(0),background:'none',border:'none',cursor:'pointer',fontSize:13,color:T.muted,marginBottom:32,display:'flex',alignItems:'center',gap:6,fontFamily:T.sans}}>← Back</button>
    <div style={fU(0)}>
      <p style={{fontSize:10,letterSpacing:'3px',textTransform:'uppercase',color:T.muted,marginBottom:12,display:'flex',alignItems:'center',gap:8}}><span style={{width:18,height:1,background:T.muted,display:'block'}}/>Choose Type</p>
      <h1 style={{fontFamily:T.serif,fontSize:40,fontWeight:800,letterSpacing:'-1.5px',marginBottom:8}}>Who are you?</h1>
      <p style={{fontSize:15,color:T.muted,fontWeight:300,marginBottom:36}}>Your choice determines how your identity is handled.</p>
    </div>
    <div style={{display:'flex',flexDirection:'column',gap:2,background:T.border}}>
      {[
        {icon:'👁',screen:SCREENS.WITNESS,title:'I am a Witness',badge:'Fully Anonymous',badgeColor:T.green,desc:'You saw something happen. Your identity will never be stored, logged, or revealed. You receive an anonymous token.',items:['Zero personal data stored','Anonymous token (CIV-XXXX)','Track status & rate officer']},
        {icon:'🆘',screen:SCREENS.VICTIM,title:'I am a Victim',badge:'Identity to Police Only',badgeColor:'#7c3aed',desc:'It happened to you. Your name and phone are encrypted and shared only with your assigned officer.',items:['Identity encrypted — officer only','FIR decision is entirely yours','Track status & rate officer']},
      ].map((opt,i)=>(
        <div key={i} style={{...fU(i*.12),background:T.card,padding:'36px 40px',cursor:'pointer',transition:'background .18s',display:'flex',gap:20,alignItems:'flex-start'}}
          onMouseEnter={e=>e.currentTarget.style.background='#faf9f5'}
          onMouseLeave={e=>e.currentTarget.style.background=T.card}
          onClick={()=>setScreen(opt.screen)}>
          <div style={{fontSize:32,flexShrink:0,marginTop:2}}>{opt.icon}</div>
          <div style={{flex:1}}>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8,flexWrap:'wrap'}}>
              <span style={{fontFamily:T.serif,fontSize:20,fontWeight:700,letterSpacing:'-.3px'}}>{opt.title}</span>
              <Badge label={opt.badge} color={opt.badgeColor}/>
            </div>
            <p style={{fontSize:13,color:T.muted,fontWeight:300,lineHeight:1.65,marginBottom:14}}>{opt.desc}</p>
            <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
              {opt.items.map(it=><span key={it} style={{fontSize:11,color:opt.badgeColor,fontWeight:500}}>✓ {it}</span>)}
            </div>
          </div>
          <span style={{fontSize:22,color:T.muted,flexShrink:0,marginTop:4}}>→</span>
        </div>
      ))}
    </div>
    <div style={{...fU(.2),marginTop:14,padding:'12px 16px',background:'rgba(26,61,228,.04)',border:`1px solid rgba(26,61,228,.12)`}}>
      <p style={{fontSize:11,color:T.blue,lineHeight:1.65}}>
        <strong>Privacy guarantee:</strong> Witness cases store zero personal data. Victim identity is encrypted at rest and accessible only to the assigned officer's authenticated session.
      </p>
    </div>
  </div>;
}

// ── PROOF THUMBNAIL — handles blob URL rendering safely ──
function ProofThumb({ proof, onRemove }) {
  const [src, setSrc] = useState(null);
  useEffect(() => {
    if (!proof) return;
    // If url already exists use it, else create from file
    if (proof.url) { setSrc(proof.url); return; }
    if (proof.file) {
      const u = URL.createObjectURL(proof.file);
      setSrc(u);
      return () => URL.revokeObjectURL(u);
    }
  }, [proof]);

  const borderColor = proof.fromGallery ? T.amber : T.green;
  const mb = proof.file ? (proof.file.size / 1024 / 1024).toFixed(1) : '?';

  return (
    <div style={{ position: 'relative', border: `1.5px solid ${borderColor}`, background: '#f0efe9', overflow: 'hidden' }}>
      {proof.type === 'image'
        ? (src
            ? <img src={src} alt="evidence" style={{ width: '100%', height: 96, objectFit: 'cover', display: 'block' }}
                onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
              />
            : null)
        : null}
      {proof.type === 'image' && !src && (
        <div style={{ width: '100%', height: 96, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🖼</div>
      )}
      {proof.type === 'video' && (
        <div style={{ width: '100%', height: 96, background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 26 }}>🎬</span>
          {src && <video src={src} style={{ display: 'none' }} />}
        </div>
      )}
      {/* Fallback hidden div for broken images */}
      <div style={{ display: 'none', width: '100%', height: 96, alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🖼</div>
      <div style={{ padding: '4px 7px', background: '#fff', borderTop: `1px solid ${borderColor}33` }}>
        <div style={{ fontSize: 9, color: borderColor, fontWeight: 700 }}>{proof.fromGallery ? '🖼 Gallery' : '📷 Live'}</div>
        <div style={{ fontSize: 8, color: T.muted }}>{mb} MB · {proof.type}</div>
      </div>
      <button onClick={onRemove}
        style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,.65)', border: 'none', color: '#fff', width: 22, height: 22, fontSize: 11, cursor: 'pointer', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
        ✕
      </button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// EVIDENCE STEP — Camera / Gallery / AI Tagging / Multi-file
// ══════════════════════════════════════════════════════════
const MAX_TOTAL_MB = 200;
const MAX_TOTAL_BYTES = MAX_TOTAL_MB * 1024 * 1024;
const MAX_PHOTOS = 5;
const MAX_VIDEOS = 2;

function stamped(canvas, ctx, label, gpsLabel, w, h) {
  ctx.fillStyle = 'rgba(0,0,0,0.62)';
  ctx.fillRect(0, h - 56, w, 56);
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${Math.max(13, w * 0.025)}px monospace`;
  ctx.fillText('📍 ' + gpsLabel, 10, h - 34);
  ctx.font = `${Math.max(11, w * 0.020)}px monospace`;
  ctx.fillText('🕐 ' + label, 10, h - 14);
}

function EvidenceStep({ form, setF, ac, gps, isVictim, nearestStation, onBack, onNext }) {
  const [mode, setMode] = useState(null);
  const [camStream, setCamStream] = useState(null);
  const [camMode, setCamMode] = useState('photo');
  const [flash, setFlash] = useState(false);
  const [recording, setRecording] = useState(false);
  const [mediaRec, setMediaRec] = useState(null);
  const [sizeErr, setSizeErr] = useState('');
  const [limitErr, setLimitErr] = useState('');
  const videoRef = useRef();
  const canvasRef = useRef();
  const galleryPhotoRef = useRef();
  const galleryVideoRef = useRef();

  // Auto-fill time of incident when step loads (current time)
  useEffect(() => {
    if (!form.time) {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2,'0');
      const mm = String(now.getMinutes()).padStart(2,'0');
      setF('time')(`${hh}:${mm}`);
    }
    // Store current GPS coords as incident coords if not already set
    if (!form.incidentCoords && gps.coords) {
      setF('incidentCoords')(gps.coords);
    }
  }, [gps.coords]);

  // proofs = [{file, url, type:'image'|'video', stamp, fromGallery}]
  const proofs = form.proofs || [];
  const photoCount = proofs.filter(p => p.type === 'image').length;
  const videoCount = proofs.filter(p => p.type === 'video').length;
  const totalBytes = proofs.reduce((s, p) => s + (p.file?.size || 0), 0);
  const totalMB = (totalBytes / 1024 / 1024).toFixed(1);

  const nowStamp = () => {
    const d = new Date();
    return d.toLocaleDateString('en-IN') + ' ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  function addProof(entry) {
    setF('proofs')(prev => {
      const cur = Array.isArray(prev) ? prev : [];
      const pCount = cur.filter(p => p.type === 'image').length;
      const vCount = cur.filter(p => p.type === 'video').length;
      const usedBytes = cur.reduce((s, p) => s + (p.file?.size || 0), 0);
      if (entry.type === 'image' && pCount >= MAX_PHOTOS) { setTimeout(()=>setLimitErr(`Max ${MAX_PHOTOS} photos allowed.`),0); return cur; }
      if (entry.type === 'video' && vCount >= MAX_VIDEOS) { setTimeout(()=>setLimitErr(`Max ${MAX_VIDEOS} videos allowed.`),0); return cur; }
      if (usedBytes + (entry.file?.size || 0) > MAX_TOTAL_BYTES) { setTimeout(()=>setLimitErr(`Total size exceeds ${MAX_TOTAL_MB} MB.`),0); return cur; }
      setTimeout(()=>{ setLimitErr(''); setF('proof')(entry.file || null); }, 0);
      return [...cur, entry];
    });
    return true;
  }

  function removeProof(idx) {
    setF('proofs')(prev => {
      const cur = Array.isArray(prev) ? prev : [];
      const newProofs = cur.filter((_, i) => i !== idx);
      setTimeout(() => { setF('proof')(newProofs[0]?.file || null); setLimitErr(''); }, 0);
      return newProofs;
    });
  }

  async function openCamera() {
    setMode('camera');
    try {
      const constraints = { video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }, audio: camMode === 'video' };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setCamStream(stream);
      if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); }
    } catch (e) {
      setMode('chooser');
      alert('Camera access denied or not available.');
    }
  }

  function stopCamera() {
    if (camStream) camStream.getTracks().forEach(t => t.stop());
    setCamStream(null); setMode(null); setRecording(false);
  }

  function capturePhoto() {
    const v = videoRef.current; const c = canvasRef.current;
    if (!v || !c) return;
    c.width = v.videoWidth; c.height = v.videoHeight;
    const ctx = c.getContext('2d');
    ctx.drawImage(v, 0, 0);
    const stamp = nowStamp();
    stamped(c, ctx, stamp, gps.label, c.width, c.height);
    c.toBlob(blob => {
      const file = new File([blob], `civicshield_${Date.now()}.jpg`, { type: 'image/jpeg' });
      const url = URL.createObjectURL(blob);
      const ok = addProof({ file, url, type: 'image', stamp, gpsLabel: gps.label, capturedAt: new Date(), fromGallery: false });
      if (ok) stopCamera();
    }, 'image/jpeg', 0.92);
  }

  function startRecording() {
    const chunks = [];
    const mr = new MediaRecorder(camStream, { mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : 'video/webm' });
    mr.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
    mr.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const file = new File([blob], `civicshield_video_${Date.now()}.webm`, { type: 'video/webm' });
      const stamp = nowStamp();
      const url = URL.createObjectURL(blob);
      const ok = addProof({ file, url, type: 'video', stamp, gpsLabel: gps.label, capturedAt: new Date(), fromGallery: false });
      stopCamera();
    };
    mr.start(); setMediaRec(mr); setRecording(true);
  }

  function stopRecording() { if (mediaRec) { mediaRec.stop(); setRecording(false); } }

  async function handleGalleryFile(e, mediaType) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setSizeErr(''); setLimitErr('');
    for (const file of files) {
      const stamp = nowStamp();
      if (file.type.startsWith('image/')) {
        await new Promise(res => {
          const url = URL.createObjectURL(file);
          const img = new Image();
          img.onload = () => {
            try {
              const c2 = document.createElement('canvas');
              c2.width = img.naturalWidth || 800;
              c2.height = img.naturalHeight || 600;
              const ctx = c2.getContext('2d');
              ctx.drawImage(img, 0, 0);
              stamped(c2, ctx, stamp, gps.label, c2.width, c2.height);
              c2.toBlob(blob => {
                if (!blob) { addProof({ file, url, type: 'image', stamp, gpsLabel: gps.label, capturedAt: new Date(), fromGallery: true }); res(); return; }
                const stFile = new File([blob], file.name, { type: 'image/jpeg' });
                const stUrl = URL.createObjectURL(blob);
                URL.revokeObjectURL(url);
                addProof({ file: stFile, url: stUrl, type: 'image', stamp, gpsLabel: gps.label, capturedAt: new Date(), fromGallery: true });
                res();
              }, 'image/jpeg', 0.92);
            } catch(err) {
              // Stamp failed — add original
              addProof({ file, url, type: 'image', stamp, gpsLabel: gps.label, capturedAt: new Date(), fromGallery: true });
              res();
            }
          };
          img.onerror = () => { addProof({ file, url, type: 'image', stamp, gpsLabel: gps.label, capturedAt: new Date(), fromGallery: true }); res(); };
          img.src = url;
        });
      } else {
        const url = URL.createObjectURL(file);
        addProof({ file, url, type: 'video', stamp, gpsLabel: gps.label, capturedAt: new Date(), fromGallery: true });
      }
    }
    setMode(null);
    e.target.value = '';
  }

  const canAddPhoto = photoCount < MAX_PHOTOS && totalBytes < MAX_TOTAL_BYTES;
  const canAddVideo = videoCount < MAX_VIDEOS && totalBytes < MAX_TOTAL_BYTES;

  return (
    <div style={fU(0)}>
      <h2 style={{ fontFamily: T.serif, fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Evidence & details</h2>
      <p style={{ fontSize: 12, color: T.muted, marginBottom: 14, fontWeight: 300 }}>
        Up to {MAX_PHOTOS} photos + {MAX_VIDEOS} videos · Max {MAX_TOTAL_MB} MB total · Live camera scores higher
      </p>

      {/* ── FILE COUNTER ── */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
        {[
          { label: `📷 ${photoCount}/${MAX_PHOTOS} Photos`, ok: photoCount < MAX_PHOTOS },
          { label: `🎬 ${videoCount}/${MAX_VIDEOS} Videos`, ok: videoCount < MAX_VIDEOS },
          { label: `💾 ${totalMB}/${MAX_TOTAL_MB} MB`, ok: totalBytes < MAX_TOTAL_BYTES },
        ].map(({ label, ok }) => (
          <span key={label} style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', background: ok ? 'rgba(10,122,53,.08)' : 'rgba(217,26,26,.08)', color: ok ? T.green : T.red, border: `1px solid ${ok ? 'rgba(10,122,53,.2)' : 'rgba(217,26,26,.2)'}` }}>{label}</span>
        ))}
      </div>

      {/* ── ADD EVIDENCE BUTTON (shows when can add more) ── */}
      {(canAddPhoto || canAddVideo) && mode === null && (
        <div style={{ display: 'flex', gap: 2, background: T.border, marginBottom: 14 }}>
          {[
            { icon: '📷', label: 'Camera', sub: 'Photo + Video · Live', action: () => setMode('chooser') },
            { icon: '🖼', label: 'Gallery', sub: 'From device storage', action: () => setMode('gallery') },
          ].map(opt => (
            <div key={opt.label} onClick={opt.action}
              style={{ flex: 1, background: T.card, padding: '18px 14px', cursor: 'pointer', textAlign: 'center', transition: 'background .15s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#f0f0f0'}
              onMouseLeave={e => e.currentTarget.style.background = T.card}>
              <div style={{ fontSize: 26, marginBottom: 6 }}>{opt.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{opt.label}</div>
              <div style={{ fontSize: 10, color: T.muted }}>{opt.sub}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── CAMERA MODE CHOOSER ── */}
      {mode === 'chooser' && (
        <div style={{ ...sI(0), background: T.card, border: `1px solid ${T.border}`, padding: 18, marginBottom: 14 }}>
          <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: T.muted, marginBottom: 10 }}>Camera Mode</p>
          <div style={{ display: 'flex', gap: 2, background: T.border, marginBottom: 12 }}>
            {[['photo', '📸 Photo'], ['video', '🎬 Video']].map(([m, l]) => (
              <button key={m} onClick={() => setCamMode(m)}
                style={{ flex: 1, padding: '10px', border: 'none', background: camMode === m ? ac : T.card, color: camMode === m ? '#fff' : T.ink, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: T.sans }}>
                {l}
              </button>
            ))}
          </div>
          {camMode === 'photo' && !canAddPhoto && <p style={{ fontSize: 11, color: T.red, marginBottom: 8 }}>Photo limit reached ({MAX_PHOTOS} max).</p>}
          {camMode === 'video' && !canAddVideo && <p style={{ fontSize: 11, color: T.red, marginBottom: 8 }}>Video limit reached ({MAX_VIDEOS} max).</p>}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, padding: '8px 12px', background: 'rgba(26,61,228,.04)', border: '1px solid rgba(26,61,228,.12)' }}>
            <span style={{ fontSize: 12, color: T.blue, flex: 1 }}>⚡ Flashlight</span>
            <div onClick={() => setFlash(f => !f)} style={{ width: 40, height: 22, borderRadius: 11, background: flash ? T.blue : '#ddd', cursor: 'pointer', position: 'relative', transition: 'background .2s' }}>
              <div style={{ position: 'absolute', top: 3, left: flash ? 20 : 3, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left .2s' }} />
            </div>
            <span style={{ fontSize: 11, color: T.muted, width: 28 }}>{flash ? 'ON' : 'OFF'}</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn variant='ghost' onClick={() => setMode(null)} sm>← Back</Btn>
            <Btn onClick={openCamera} disabled={(camMode==='photo'&&!canAddPhoto)||(camMode==='video'&&!canAddVideo)} full>Open Camera →</Btn>
          </div>
        </div>
      )}

      {/* ── LIVE CAMERA ── */}
      {mode === 'camera' && (
        <div style={{ ...sI(0), background: '#000', border: `2px solid ${ac}`, marginBottom: 14, position: 'relative' }}>
          <div style={{ position: 'relative' }}>
            <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', display: 'block', maxHeight: 300, objectFit: 'cover', background: '#111' }} />
            {/* GPS + time overlay — INSIDE video, not blocking buttons */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent,rgba(0,0,0,0.75))', padding: '16px 10px 8px', pointerEvents: 'none' }}>
              <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#fff', opacity: 0.95, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>📍</span> <span>{gps.loading ? 'Getting GPS...' : gps.label}</span>
              </div>
              <LiveClock />
            </div>
            {flash && <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.18)', pointerEvents: 'none' }} />}
          </div>
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          {/* ACTION BUTTONS — always visible, never behind overlay */}
          <div style={{ display: 'flex', gap: 0, background: '#0a0a0a' }}>
            {camMode === 'photo' ? (
              <button onClick={capturePhoto}
                style={{ flex: 1, padding: '16px', background: ac, border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: T.sans, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                📸 Capture Photo
              </button>
            ) : recording ? (
              <button onClick={stopRecording}
                style={{ flex: 1, padding: '16px', background: T.red, border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: T.sans, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, animation: 'pulse2 1s infinite' }}>
                ⏹ Stop Recording
              </button>
            ) : (
              <button onClick={startRecording}
                style={{ flex: 1, padding: '16px', background: T.red, border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: T.sans, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                🔴 Start Recording
              </button>
            )}
            <button onClick={stopCamera}
              style={{ padding: '16px 20px', background: '#222', border: 'none', color: 'rgba(255,255,255,.7)', fontSize: 13, cursor: 'pointer', fontFamily: T.sans, borderLeft: '1px solid rgba(255,255,255,.1)' }}>
              ✕ Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── GALLERY ── */}
      {mode === 'gallery' && (
        <div style={{ ...sI(0), background: T.card, border: `1px solid ${T.border}`, padding: 18, marginBottom: 14 }}>
          <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: T.muted, marginBottom: 10 }}>Choose from Gallery</p>
          <div style={{ display: 'flex', gap: 2, background: T.border, marginBottom: 12 }}>
            <div onClick={() => canAddPhoto && galleryPhotoRef.current.click()}
              style={{ flex: 1, background: T.card, padding: '18px', textAlign: 'center', cursor: canAddPhoto ? 'pointer' : 'not-allowed', opacity: canAddPhoto ? 1 : 0.4 }}
              onMouseEnter={e => canAddPhoto && (e.currentTarget.style.background = '#f5f5f5')}
              onMouseLeave={e => e.currentTarget.style.background = T.card}>
              <div style={{ fontSize: 26, marginBottom: 4 }}>🖼</div>
              <div style={{ fontSize: 12, fontWeight: 600 }}>Photos</div>
              <div style={{ fontSize: 10, color: T.muted }}>{photoCount}/{MAX_PHOTOS} used</div>
            </div>
            <div onClick={() => canAddVideo && galleryVideoRef.current.click()}
              style={{ flex: 1, background: T.card, padding: '18px', textAlign: 'center', cursor: canAddVideo ? 'pointer' : 'not-allowed', opacity: canAddVideo ? 1 : 0.4 }}
              onMouseEnter={e => canAddVideo && (e.currentTarget.style.background = '#f5f5f5')}
              onMouseLeave={e => e.currentTarget.style.background = T.card}>
              <div style={{ fontSize: 26, marginBottom: 4 }}>🎬</div>
              <div style={{ fontSize: 12, fontWeight: 600 }}>Video</div>
              <div style={{ fontSize: 10, color: T.muted }}>{videoCount}/{MAX_VIDEOS} used</div>
            </div>
          </div>
          <div style={{ padding: '7px 10px', background: 'rgba(184,112,0,.05)', border: '1px solid rgba(184,112,0,.18)', marginBottom: 10 }}>
            <p style={{ fontSize: 10, color: T.amber }}>⚠ Max {MAX_TOTAL_MB} MB total · Gallery uploads score lower than live camera</p>
          </div>
          {sizeErr && <p style={{ fontSize: 11, color: T.red, marginBottom: 6 }}>{sizeErr}</p>}
          <Btn variant='ghost' onClick={() => setMode(null)} sm>← Back</Btn>
          <input ref={galleryPhotoRef} type='file' accept='image/*' multiple style={{ display: 'none' }} onChange={e => handleGalleryFile(e, 'image')} />
          <input ref={galleryVideoRef} type='file' accept='video/*' style={{ display: 'none' }} onChange={e => handleGalleryFile(e, 'video')} />
        </div>
      )}

      {/* ── LIMIT ERROR ── */}
      {limitErr && <div style={{ background: 'rgba(217,26,26,.06)', border: '1px solid rgba(217,26,26,.2)', padding: '8px 12px', marginBottom: 10 }}>
        <p style={{ fontSize: 11, color: T.red }}>{limitErr}</p>
      </div>}

      {/* ── EVIDENCE GRID ── */}
      {proofs.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <p style={{ fontSize: 10, letterSpacing: '2px', textTransform: 'uppercase', color: T.muted, marginBottom: 8, fontWeight: 600 }}>
            Attached Evidence ({proofs.length}) — {photoCount} photo{photoCount!==1?'s':''}, {videoCount} video{videoCount!==1?'s':''}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(130px,1fr))', gap: 4 }}>
            {proofs.map((p, i) => <ProofThumb key={i} proof={p} onRemove={()=>removeProof(i)} />)}
          </div>
        </div>
      )}

      {/* ── DESCRIPTION + TIME ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 14 }}>
        <Textarea label='Description' value={form.desc} onChange={setF('desc')} placeholder='Describe what happened — be as specific as possible...' rows={4} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label style={{ fontSize: 10, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: T.muted }}>Time of Incident <span style={{ color: T.green, fontWeight: 400, letterSpacing: 0, fontSize: 9 }}>✓ Auto-filled</span></label>
          <input type='time' value={form.time} onChange={e => setF('time')(e.target.value)}
            style={{ border: `1px solid ${T.border}`, background: T.card, padding: '10px 14px', fontSize: 13, color: T.ink, outline: 'none', fontFamily: T.sans, borderRadius: 0, transition: 'border-color .2s' }}
            onFocus={e => e.target.style.borderColor = ac}
            onBlur={e => e.target.style.borderColor = T.border} />
          <p style={{ fontSize: 10, color: T.muted, marginTop: 2 }}>Adjust if incident happened earlier. Reports filed more than 2 hours after incident are auto-rejected.</p>
        </div>
      </div>

      {/* ── INCIDENT LOCATION + SUBMISSION GPS ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
        <div style={{ background: gps.loading ? 'rgba(184,112,0,.04)' : gps.error ? 'rgba(217,26,26,.04)' : 'rgba(10,122,53,.04)', border: `1px solid ${gps.loading ? 'rgba(184,112,0,.18)' : gps.error ? 'rgba(217,26,26,.18)' : 'rgba(10,122,53,.14)'}`, padding: '10px 13px' }}>
          <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: T.muted, marginBottom: 4 }}>Your Current Location <span style={{ color: T.green, fontWeight: 400, letterSpacing: 0, fontSize: 9 }}>✓ Auto-fetched</span></p>
          <p style={{ fontSize: 11, color: gps.loading ? T.amber : gps.error ? T.red : T.green }}>
            {gps.loading ? '⏳ Getting GPS...' : `📍 ${gps.label}`}
            {!gps.loading && <span style={{ color: T.muted }}>&nbsp;·&nbsp;🏛 {nearestStation.name}</span>}
          </p>
          {gps.error && <p style={{ fontSize: 10, color: T.muted, marginTop: 2 }}>{gps.error}</p>}
        </div>
        <div style={{ background: 'rgba(217,26,26,.04)', border: '1px solid rgba(217,26,26,.12)', padding: '8px 12px' }}>
          <p style={{ fontSize: 10, color: T.red, lineHeight: 1.6 }}>
            ⚠ <strong>Proximity check:</strong> {isVictim ? 'As a victim, you' : 'As a witness, you'} must be within <strong>500m</strong> of the incident location. Reports from further away are auto-rejected.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <Btn variant='ghost' onClick={onBack}>← Back</Btn>
        <Btn onClick={onNext} disabled={!form.desc} full>Next →</Btn>
      </div>
    </div>
  );
}

// Live clock for camera viewfinder
function LiveClock() {
  const [t, setT] = useState(new Date());
  useEffect(() => { const iv = setInterval(() => setT(new Date()), 1000); return () => clearInterval(iv); }, []);
  return <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#fff', opacity: 0.9 }}>
    🕐 {t.toLocaleTimeString('en-IN')}
  </div>;
}

// ── REPORT FORM ──
function ReportForm({type,setCases,setScreen}){
  const demoMode = useDemoMode();
  const isVictim=type==='victim';
  const totalSteps=isVictim?4:3;
  const [step,setStep]=useState(1);
  const [form,setForm]=useState({reportType:'',name:'',phone:'',desc:'',time:'',incidentCoords:null,proof:null,proofs:[]});
  const [submitted,setSubmitted]=useState(false);
  const [token]=useState('CIV-'+Math.floor(1000+Math.random()*8999));
  const [aiResult,setAiResult]=useState(null);
  const [loading,setLoading]=useState(false);
  const [gps,setGps]=useState({label:'Fetching GPS...',coords:null,loading:true,error:null});
  const fileRef=useRef();

  // ── REAL GPS ──
  useEffect(()=>{
    if(!navigator.geolocation){setGps({label:'GPS not available',coords:null,loading:false,error:'unsupported'});return;}
    navigator.geolocation.getCurrentPosition(
      pos=>{
        const {latitude:lat,longitude:lng}=pos.coords;
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
          .then(r=>r.json())
          .then(d=>{
            const addr=d.address||{};
            const label=[addr.suburb||addr.neighbourhood||addr.village,addr.city||addr.town||addr.county].filter(Boolean).join(', ')||d.display_name?.split(',').slice(0,2).join(',')||`${lat.toFixed(4)}, ${lng.toFixed(4)}`;
            setGps({label,coords:{lat,lng},loading:false,error:null});
          })
          .catch(()=>setGps({label:`${lat.toFixed(4)}, ${lng.toFixed(4)}`,coords:{lat,lng},loading:false,error:null}));
      },
      err=>{
        const msg=err.code===1?'Location denied — using default':'Location unavailable';
        setGps({label:'Indore, Madhya Pradesh',coords:null,loading:false,error:msg});
      },
      {timeout:8000,enableHighAccuracy:true}
    );
  },[]);

  // Pick nearest station based on GPS (simple match by area keyword, else default)
  const nearestStation=Object.values(STATIONS).find(s=>gps.label.toLowerCase().includes(s.area.split(',')[0].toLowerCase()))||Object.values(STATIONS)[0];
  const ac=isVictim?'#7c3aed':T.blue;
  const al=isVictim?'rgba(124,58,237,.06)':'rgba(26,61,228,.06)';
  const ab=isVictim?'rgba(124,58,237,.15)':'rgba(26,61,228,.15)';

  const setF = k => v => setForm(p => ({...p, [k]: typeof v === 'function' ? v(p[k]) : v}));

  async function submit(){
    setLoading(true);
    let result=null;

    // ── HAVERSINE distance in meters ──
    function haversine(lat1,lng1,lat2,lng2){
      const R=6371000, dLat=(lat2-lat1)*Math.PI/180, dLng=(lng2-lng1)*Math.PI/180;
      const a=Math.sin(dLat/2)**2+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
      return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
    }

    // ── EVIDENCE metadata ──
    const proofs = form.proofs || [];
    const hasEvidence = proofs.length > 0;
    const liveProofs = proofs.filter(p => !p.fromGallery);
    const galleryProofs = proofs.filter(p => p.fromGallery);
    const fromGallery = liveProofs.length === 0 && galleryProofs.length > 0;
    const hasLiveCam = liveProofs.length > 0;

    const reportSubmitTime = new Date();
    const allCaptureTimes = proofs.map(p => p.capturedAt).filter(Boolean).map(t => new Date(t));
    const earliestCapture = allCaptureTimes.length > 0 ? new Date(Math.min(...allCaptureTimes)) : null;
    const captureToSubmitMins = earliestCapture ? Math.round((reportSubmitTime - earliestCapture) / 60000) : null;

    // ── TIME OF INCIDENT vs. SUBMISSION TIME gap ──
    // form.time is auto-filled as HH:MM at step load, so we can parse it
    let incidentVsSubmitMins = null;
    if(form.time){
      try{
        const [hh,mm] = form.time.replace(/\s*(AM|PM)\s*/i,'').split(':').map(Number);
        const inc = new Date(reportSubmitTime);
        inc.setHours(hh, mm||0, 0, 0);
        // if incident time > submit time, assume previous day
        if(inc > reportSubmitTime) inc.setDate(inc.getDate()-1);
        incidentVsSubmitMins = Math.round((reportSubmitTime - inc) / 60000);
      }catch(e){}
    }

    // ── PROXIMITY CHECK ──
    const reporterCoords = gps.coords; // {lat, lng} of person right now
    const incidentCoords = form.incidentCoords; // set from EvidenceStep GPS tag
    let proximityMeters = null;
    if(reporterCoords && incidentCoords){
      proximityMeters = Math.round(haversine(reporterCoords.lat, reporterCoords.lng, incidentCoords.lat, incidentCoords.lng));
    }

    // Hard rejection flags
    const tooFarFlag = proximityMeters !== null && proximityMeters > 500
      ? `Reporter is ${proximityMeters}m from incident location — exceeds 500m threshold.`
      : null;
    const tooLateFlag = incidentVsSubmitMins !== null && incidentVsSubmitMins > 120
      ? `Incident reported ${Math.floor(incidentVsSubmitMins/60)}h ${incidentVsSubmitMins%60}m after incident time — exceeds 2 hour window.`
      : null;
    const hardReject = tooFarFlag || tooLateFlag;

    const evidenceGPS = proofs[0]?.gpsLabel || gps.label;
    const locationConsistent = !proofs.length || proofs.every(p => !p.gpsLabel || p.gpsLabel === gps.label);

    const delayFlag = captureToSubmitMins !== null && captureToSubmitMins > 60
      ? `Evidence captured ${captureToSubmitMins} min before submission — significant delay.`
      : captureToSubmitMins !== null && captureToSubmitMins > 20
        ? `Evidence captured ${captureToSubmitMins} min before submission — moderate delay.`
        : null;

    const evidenceSummary = !hasEvidence ? 'NO evidence uploaded'
      : `${proofs.length} file(s): ${proofs.filter(p=>p.type==='image').length} photo(s), ${proofs.filter(p=>p.type==='video').length} video(s). Sources: ${hasLiveCam?`${liveProofs.length} LIVE CAMERA`:''}${hasLiveCam&&galleryProofs.length?' + ':''}${galleryProofs.length?`${galleryProofs.length} GALLERY`:''}`;

    const incidentTimeStr = form.time || 'NOT PROVIDED';

    // Category-specific scoring rules
    const CATEGORY_RULES = {
      Crime: `CRIME-SPECIFIC RULES:
- description_coherence needs: suspect description (clothing/vehicle/direction) for 15+. Vague "I saw someone" = max 7.
- evidence_quality: video preferred for crime (captures movement/faces). Live camera = 18-20, gallery = max 12.
- Minimum threshold for VERIFIED: score ≥ 72 (crime needs higher confidence).
- Key identifiers: vehicle color/type/plate, suspect clothing, escape direction, weapon if any.`,
      Accident: `ACCIDENT-SPECIFIC RULES:
- description_coherence: vehicle types, direction of impact, injury count needed for 15+.
- time_plausibility: accidents can happen anytime — don't penalize odd hours.
- evidence_quality: photo of scene/damage is critical. No evidence for accident = major gap.
- Victim reporting accident (isVictim): slightly more lenient — they may be injured/shaken.
- Minimum threshold for VERIFIED: score ≥ 65 (accidents often reported in shock).
- 500m proximity rule relaxed for VICTIM type accident (victim may have been taken to hospital).`,
      Harassment: `HARASSMENT-SPECIFIC RULES:
- description_coherence: pattern/time/location more important than physical description.
- evidence_quality: harassment often has NO physical evidence — don't heavily penalize no-photo.
- Victim (isVictim=true) reporting harassment: max evidence_quality gap score = 8 even without evidence.
- Repeated harassment (daily pattern) increases credibility even without photo.
- Minimum threshold for VERIFIED: score ≥ 60 (harassment is often evidence-light but real).`,
      Hazard: `HAZARD-SPECIFIC RULES:
- description_coherence: location + type of hazard + risk level needed.
- evidence_quality: photo strongly preferred for hazards (verifiable).
- time_plausibility: hazards persist — time window is less strict (up to 6 hours is ok).
- Minimum threshold for VERIFIED: score ≥ 62.`,
      Infrastructure: `INFRASTRUCTURE-SPECIFIC RULES:
- description_coherence: location + specific problem (pothole/broken light/open drain) needed.
- evidence_quality: photo very important for infrastructure complaints.
- time_plausibility: infrastructure issues persist — time gap less relevant.
- Proximity rule relaxed: infrastructure reporter may spot it while driving past.
- Minimum threshold for VERIFIED: score ≥ 60.`,
      Other: `OTHER CATEGORY RULES:
- Evaluate based on description quality and evidence alone.
- Be moderately lenient — 'Other' is used for unusual incidents.
- Minimum threshold for VERIFIED: score ≥ 65.`,
    };
    const categoryRule = CATEGORY_RULES[form.reportType] || CATEGORY_RULES.Other;

    const STRICT_PROMPT=`You are CivicShield AI — a strict but fair credibility scoring engine for civic incident reports in India.

REPORT TO ANALYZE:
- Reporter Type: ${type} (${isVictim?'VICTIM — real identity provided to police':'WITNESS — fully anonymous'})
- Incident Category: ${form.reportType}
- Description: "${form.desc}"
- Time of Incident (auto-captured): ${incidentTimeStr}
- Report Submitted At: ${reportSubmitTime.toLocaleTimeString('en-IN')}
${incidentVsSubmitMins!==null?`- Time Since Incident: ${incidentVsSubmitMins} minutes`:''}
- Evidence: ${evidenceSummary}
${captureToSubmitMins!=null?`- Evidence Capture Delay: ${captureToSubmitMins} min before submission`:''}
${delayFlag?`- DELAY FLAG: ⚠ ${delayFlag}`:''}
- Reporter GPS (current): ${gps.label}
- Incident GPS (from evidence): ${evidenceGPS}
- Location Consistent: ${locationConsistent?'YES':'NO — mismatch'}
${proximityMeters!==null?`- Reporter Distance from Incident: ${proximityMeters}m`:''}
${tooFarFlag?`- PROXIMITY VIOLATION: ⛔ ${tooFarFlag}`:''}
${tooLateFlag?`- TIME VIOLATION: ⛔ ${tooLateFlag}`:''}

${hardReject?`⛔ HARD REJECTION TRIGGER ACTIVE:\n${tooFarFlag||''}\n${tooLateFlag||''}\nScore MUST be below 35. Verdict MUST be REJECTED.`:''}

CATEGORY-SPECIFIC SCORING RULES FOR "${form.reportType}":
${categoryRule}

GENERAL SCORING RULES:
1. description_coherence (0–20): vague/fake/test=0–4, very vague=5–9, some detail=10–14, specific identifiers=15–20
2. location_match (0–18): mismatch=0–5, plausible=6–11, perfect fit=12–18
3. time_plausibility (0–15): not provided=0–3, suspicious=4–8, logical match=9–15
4. evidence_quality (0–20): none+vague=0–3, no evidence+some detail=4–8, gallery-only max 13, live+gallery=14–17, all-live=18–20
5. corroboration_potential (0–12): isolated=0–3, semi-public=4–8, busy area=9–12
6. category_match (0–15): no match=0–5, loose=6–10, clear match=11–15
${isVictim?'VICTIM BONUS: +up to 8 ONLY if base > 45 and credible.':''}

RULES:
- TEMPORAL: >2 hours from incident → hard reject (score < 35). >60 min evidence delay → deduct 8–15. 20–60 min → deduct 3–7.
- PROXIMITY: Reporter >500m from incident → hard reject (score < 35). Exception: Accident victim type.
- FAKE/TEST: description <5 words or gibberish → score below 25.
- Use category-specific threshold above (not one-size-fits-all 70).

Respond ONLY with valid JSON, no markdown:
{"score":number,"verdict":"VERIFIED or REVIEW or REJECTED","summary":"2 sentences explaining verdict with category-specific reasoning","signals":{"description_coherence":{"score":number,"max":20,"status":"STRONG or MODERATE or WEAK","note":"reason"},"location_match":{"score":number,"max":18,"status":"STRONG or MODERATE or WEAK","note":"reason"},"time_plausibility":{"score":number,"max":15,"status":"STRONG or MODERATE or WEAK","note":"reason"},"evidence_quality":{"score":number,"max":20,"status":"STRONG or MODERATE or WEAK","note":"source type + category context"},"corroboration_potential":{"score":number,"max":12,"status":"STRONG or MODERATE or WEAK","note":"reason"},"category_match":{"score":number,"max":15,"status":"STRONG or MODERATE or WEAK","note":"reason"}},"police_action":"specific action for this category","weak_points":["gap1","gap2"]}`;

    try{
      const res=await fetch('https://api.anthropic.com/v1/messages',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          model:'claude-sonnet-4-20250514',
          max_tokens:1000,
          system:"You are a strict civic report credibility engine. Score honestly. Hard-reject reports where the reporter is >500m from incident or filed >2 hours after the incident. Penalize gallery evidence and late submissions. Always respond with valid JSON only.",
          messages:[{role:'user',content:STRICT_PROMPT}]
        })
      });
      const data=await res.json();
      if(data.error) throw new Error(data.error.message);
      const txt=data.content?.map(b=>b.type==='text'?b.text:'').join('')||'';
      const clean=txt.replace(/```json|```/g,'').trim();
      result=JSON.parse(clean);
      result.score=Math.max(0,Math.min(100,Math.round(result.score)));
      // Enforce hard reject locally too
      if(hardReject) result.score=Math.min(result.score,34);
      if(hardReject) result.verdict='REJECTED';
    }catch(e){
      const dl=form.desc.trim().length;
      const words=form.desc.trim().split(/\s+/).filter(Boolean).length;
      const ht=!!form.time;
      const isFake=words<5||/^(test|abc|xyz|asdf|fake|hello|hi|ok|nothing|idk|n\/a)$/i.test(form.desc.trim());
      // Category-specific evidence penalty — harassment/infra don't need photo as much
      const easyEvidCats = ['Harassment','Infrastructure','Other'];
      const strictEvidCats = ['Crime','Accident'];
      const ds=isFake?2:words>50?17:words>25?13:words>10?8:4;
      const basePs = !hasEvidence
        ? (easyEvidCats.includes(form.reportType)?6:3)
        : hasLiveCam?Math.min(20,14+liveProofs.length):Math.min(13,10+galleryProofs.length);
      const ps = basePs;
      const delayPenalty = captureToSubmitMins>60?12:captureToSubmitMins>20?5:0;
      const ts=ht?12:3;
      const ls=locationConsistent?14:7;
      const cs=7; const ms=isFake?3:10;
      const b=isVictim&&!isFake&&(ds+ps+ts+ls+cs+ms)>45?6:0;
      let tot=Math.min(100,Math.max(0,ds+ps+ts+ls+cs+ms+b-delayPenalty));
      if(hardReject) tot=Math.min(tot,34);
      // Category-specific pass threshold
      const catThreshold = demoMode ? 0 : {Crime:72,Accident:65,Harassment:60,Hazard:62,Infrastructure:60,Other:65}[form.reportType]||65;
      result={
        score:tot,
        verdict:hardReject&&!demoMode?'REJECTED':tot>=catThreshold?'VERIFIED':tot>=(catThreshold-20)?'REVIEW':'REJECTED',
        summary:hardReject
          ? (tooFarFlag?`Reporter is ${proximityMeters}m from incident location — exceeds 500m limit. Report automatically rejected.`
            :`Incident reported more than 2 hours after it occurred. Report automatically rejected.`)
          :isFake?'Report appears to be a test or contains no real incident information. Cannot be verified.'
          :tot>=70?`Report contains ${hasLiveCam?'live camera evidence and ':''}specific incident details. Recommended for police review.`
          :`Report lacks sufficient detail for confident verification.`,
        signals:{
          description_coherence:{score:ds,max:20,status:ds>=15?'STRONG':ds>=8?'MODERATE':'WEAK',note:isFake?'No real incident.':words>50?'Good specific details.':words>25?'Moderate detail.':words>10?'Brief, missing identifiers.':'Too vague.'},
          location_match:{score:hardReject&&tooFarFlag?2:ls,max:18,status:tooFarFlag?'WEAK':ls>=12?'STRONG':'MODERATE',note:tooFarFlag?`Reporter is ${proximityMeters}m from incident — exceeds 500m limit.`:locationConsistent?'GPS consistent.':'GPS mismatch.'},
          time_plausibility:{score:hardReject&&tooLateFlag?1:ts,max:15,status:tooLateFlag?'WEAK':ht?'STRONG':'WEAK',note:tooLateFlag?`Reported ${incidentVsSubmitMins} min after incident — too late.`:ht?'Incident time provided.':'Incident time missing.'},
          evidence_quality:{score:Math.max(0,ps-Math.round(delayPenalty/2)),max:20,status:hasLiveCam?'STRONG':hasEvidence?'MODERATE':'WEAK',note:!hasEvidence?'No evidence.':hasLiveCam?`${liveProofs.length} live camera file(s).`:`${galleryProofs.length} gallery file(s).`},
          corroboration_potential:{score:cs,max:12,status:'MODERATE',note:'Depends on location and time.'},
          category_match:{score:ms,max:15,status:isFake?'WEAK':ms>=12?'STRONG':'MODERATE',note:isFake?'No real incident.':'Matches category.'},
        },
        police_action:hardReject?'AUTO-REJECTED. Do not dispatch.'
          :isFake?'Invalid test submission. Do not dispatch.'
          :tot>=70?'Dispatch officer to GPS location. Process evidence.'
          :'Manual review. Request more evidence.',
        weak_points:[
          tooFarFlag?`⛔ PROXIMITY VIOLATION: ${tooFarFlag}`:null,
          tooLateFlag?`⛔ TIME VIOLATION: ${tooLateFlag}`:null,
          isFake?'Fake/test submission':null,
          !hasEvidence?'No evidence uploaded':null,
          !ht?'Incident time not specified':null,
          delayFlag||null,
          fromGallery?'Gallery evidence — lower credibility than live camera':null,
          !locationConsistent?'GPS mismatch between evidence and reporter':null,
          words<10?'Description too brief':null,
        ].filter(Boolean),
      };
    }
    setAiResult(result);

    // Generate meaningful title from description
    const descWords=form.desc.trim().split(/\s+/);
    const rawTitle=descWords.length>10?descWords.slice(0,9).join(' ')+'...':form.desc.trim();
    const titleMap={'Crime':'Crime incident','Accident':'Road accident','Harassment':'Harassment case','Hazard':'Hazard reported','Infrastructure':'Infrastructure issue','Other':'Incident'};
    const autoTitle=form.desc.trim().length<8?(titleMap[form.reportType]||'New report'):rawTitle;

    const evidenceSourceLabel = !hasEvidence ? null : hasLiveCam ? 'live-camera' : 'gallery';
    // Demo mode bypasses threshold — everything passes
    const catPass = demoMode ? 0 : {Crime:72,Accident:65,Harassment:60,Hazard:62,Infrastructure:60,Other:65}[form.reportType]||65;
    if(result.score >= catPass && (demoMode || result.verdict !== 'REJECTED')) {
      setCases(prev=>[{
        id:'RPT-'+Math.floor(1000+Math.random()*8999),token,type,
        reportType:form.reportType,
        title:autoTitle,
        description:form.desc,
        location:gps.label,
        time:new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})+' · Today',
        score:result.score,status:'Pending',stationId:nearestStation.id,
        assignedOfficer:null,
        proof:proofs.length?`${proofs.length} file(s) attached`:null,
        proofFile:proofs[0]?.file||null,
        proofFiles:proofs,
        evidenceSource:evidenceSourceLabel,
        evidenceGPS:gps.label,
        identity:isVictim?{name:form.name,phone:form.phone}:null,
        firDecision:null,rating:null,aiAnalysis:result,
      },...prev]);
    }
    setLoading(false); setSubmitted(true);
  }

  if(submitted) {
    // Demo mode: nothing is rejected
    const catThreshold = demoMode ? 0 : {Crime:72,Accident:65,Harassment:60,Hazard:62,Infrastructure:60,Other:65}[form.reportType]||65;
    const isRejected = !demoMode && (!aiResult || aiResult.score < catThreshold || aiResult.verdict==='REJECTED');

    // REJECTED — score too low
    if(isRejected) return (
      <div style={{maxWidth:480,margin:'60px auto',padding:'0 24px'}}>
        <div style={{...sI(0),background:T.card,border:`2px solid ${T.red}`,padding:'40px'}}>
          <div style={{textAlign:'center',marginBottom:24}}>
            <div style={{fontSize:64,marginBottom:12,lineHeight:1}}>❌</div>
            <h2 style={{fontFamily:T.serif,fontSize:26,fontWeight:800,letterSpacing:'-.5px',marginBottom:6,color:T.red}}>Report Rejected</h2>
            <p style={{fontSize:13,color:T.muted,fontWeight:300,lineHeight:1.7}}>Your report did not meet the minimum credibility threshold and has not been forwarded to police.</p>
          </div>

          {/* Score */}
          <div style={{background:'rgba(217,26,26,.06)',border:'1px solid rgba(217,26,26,.2)',padding:'16px 20px',marginBottom:20,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <div>
              <p style={{fontSize:10,letterSpacing:'2px',textTransform:'uppercase',color:T.muted,marginBottom:4,fontWeight:600}}>AI Credibility Score</p>
              <p style={{fontSize:11,color:T.muted}}>Minimum required: <strong>{demoMode?'0 (Demo Mode)':catThreshold+'/100'}</strong> for {form.reportType}</p>
            </div>
            <div style={{textAlign:'center'}}>
              <div style={{fontFamily:T.serif,fontSize:40,fontWeight:800,color:T.red,lineHeight:1}}>{aiResult?.score||0}</div>
              <div style={{fontSize:10,color:T.muted}}>/100</div>
            </div>
          </div>

          {/* Why rejected */}
          {aiResult?.summary&&<div style={{background:'rgba(217,26,26,.04)',border:'1px solid rgba(217,26,26,.15)',padding:'14px 16px',marginBottom:16}}>
            <p style={{fontSize:10,letterSpacing:'2px',textTransform:'uppercase',color:T.red,marginBottom:8,fontWeight:600}}>Why was it rejected?</p>
            <p style={{fontSize:13,color:T.ink,lineHeight:1.7,fontWeight:300}}>{aiResult.summary}</p>
          </div>}

          {/* Weak points */}
          {aiResult?.weak_points?.filter(Boolean).length>0&&<div style={{marginBottom:20}}>
            <p style={{fontSize:10,letterSpacing:'2px',textTransform:'uppercase',color:T.muted,marginBottom:10,fontWeight:600}}>Gaps found</p>
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              {aiResult.weak_points.filter(Boolean).map((p,i)=>(
                <div key={i} style={{display:'flex',gap:8,alignItems:'flex-start',padding:'8px 12px',background:'rgba(217,26,26,.04)',border:'1px solid rgba(217,26,26,.1)'}}>
                  <span style={{color:T.red,fontSize:12,flexShrink:0}}>⚠</span>
                  <span style={{fontSize:12,color:T.ink,fontWeight:300,lineHeight:1.5}}>{p}</span>
                </div>
              ))}
            </div>
          </div>}

          {/* How to improve */}
          <div style={{background:'rgba(26,61,228,.04)',border:'1px solid rgba(26,61,228,.12)',padding:'14px 16px',marginBottom:24}}>
            <p style={{fontSize:10,letterSpacing:'2px',textTransform:'uppercase',color:T.blue,marginBottom:8,fontWeight:600}}>How to improve your report</p>
            <div style={{display:'flex',flexDirection:'column',gap:5}}>
              {[
                '📸 Add live camera photo or video from the scene',
                '📝 Include specific details — vehicle color/type, clothing, direction',
                '🕐 Mention the exact time the incident occurred',
                '📍 Report immediately — delay lowers credibility score',
              ].map((tip,i)=><p key={i} style={{fontSize:12,color:T.ink,fontWeight:300,lineHeight:1.6}}>{tip}</p>)}
            </div>
          </div>

          <div style={{display:'flex',gap:8}}>
            <Btn variant='ghost' onClick={()=>{
              setSubmitted(false);
              setAiResult(null);
              setForm(p=>({...p,desc:'',time:'',proof:null,proofs:[]}));
              setStep(isVictim?3:2);
            }} full>← Improve & Retry</Btn>
            <Btn onClick={()=>setScreen(SCREENS.HOME)} full>Home →</Btn>
          </div>
        </div>
      </div>
    );

    // VERIFIED / REVIEW — score >= 70, show token
    return (
      <div style={{maxWidth:480,margin:'60px auto',padding:'0 24px'}}>
        <div style={{...sI(0),background:T.card,border:`1px solid ${T.border}`,padding:'40px'}}>
          <div style={{textAlign:'center',marginBottom:28}}>
            <div style={{fontSize:52,marginBottom:12}}>{aiResult?.verdict==='VERIFIED'?'✅':'⏳'}</div>
            <h2 style={{fontFamily:T.serif,fontSize:24,fontWeight:800,letterSpacing:'-.5px',marginBottom:6}}>Report Submitted</h2>
            <p style={{fontSize:13,color:T.muted,fontWeight:300}}>{aiResult?.summary||'Your report has been submitted to the police station.'}</p>
          </div>
          <div style={{background:al,border:`1px solid ${ab}`,padding:'20px',marginBottom:18,textAlign:'center'}}>
            <p style={{fontSize:10,letterSpacing:'2px',textTransform:'uppercase',color:T.muted,marginBottom:8,fontWeight:600}}>Your Tracking Token</p>
            <p style={{fontFamily:'monospace',fontSize:28,fontWeight:700,color:ac,letterSpacing:'4px'}}>{token}</p>
            <p style={{fontSize:11,color:T.muted,marginTop:6,fontWeight:300}}>Save this — use it to track status and rate the officer.</p>
          </div>
          {aiResult&&<div style={{display:'flex',justifyContent:'space-between',padding:'12px 0',borderBottom:`1px solid ${T.border}`,marginBottom:12}}>
            <span style={{fontSize:12,color:T.muted}}>AI Credibility Score</span>
            <ScoreBadge score={aiResult.score}/>
          </div>}
          <div style={{background:'rgba(10,122,53,.06)',border:'1px solid rgba(10,122,53,.18)',padding:'12px 14px',marginBottom:20}}>
            <p style={{fontSize:12,color:T.green,lineHeight:1.65}}>🏛 Case sent to <strong>{nearestStation.name}</strong>. Station has been notified.</p>
          </div>
          <div style={{display:'flex',gap:8}}>
            <Btn variant='ghost' onClick={()=>setScreen(SCREENS.TRACK)} full>Track Report</Btn>
            <Btn onClick={()=>setScreen(SCREENS.HOME)} full>Home →</Btn>
          </div>
        </div>
      </div>
    );
  }

  const categories=[['Crime','🚨'],['Accident','🚗'],['Harassment','😰'],['Hazard','🔥'],['Infrastructure','🏗'],['Other','❓']];

  return (
    <div style={{maxWidth:560,margin:'0 auto',padding:'40px 24px 80px'}}>
      <button onClick={()=>setScreen(SCREENS.CHOOSE)} style={{...sL(0),background:'none',border:'none',cursor:'pointer',fontSize:13,color:T.muted,marginBottom:28,display:'flex',alignItems:'center',gap:6,fontFamily:T.sans}}>← Back</button>
      <div style={fU(0)}>
        <Badge label={isVictim?'Victim Report — Identity to Police':'Witness Report — Fully Anonymous'} color={ac}/>
        <h1 style={{fontFamily:T.serif,fontSize:30,fontWeight:800,letterSpacing:'-1px',margin:'14px 0 6px'}}>
          {isVictim?'Report an incident':'Report anonymously'}
        </h1>
      </div>
      <ProgressBar steps={totalSteps} current={step} color={ac}/>

      {/* STEP 1 */}
      {step===1&&<div style={fU(0)}>
        <h2 style={{fontFamily:T.serif,fontSize:20,fontWeight:700,marginBottom:20}}>What happened?</h2>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:2,background:T.border,marginBottom:20}}>
          {categories.map(([lb,ic])=>(
            <div key={lb} onClick={()=>setF('reportType')(lb)}
              style={{background:form.reportType===lb?al:T.card,padding:'16px 18px',cursor:'pointer',display:'flex',alignItems:'center',gap:10,borderLeft:form.reportType===lb?`3px solid ${ac}`:'3px solid transparent',transition:'all .15s'}}
              onMouseEnter={e=>{ if(form.reportType!==lb) e.currentTarget.style.background='#faf9f5'; }}
              onMouseLeave={e=>{ if(form.reportType!==lb) e.currentTarget.style.background=T.card; }}>
              <span style={{fontSize:20}}>{ic}</span>
              <span style={{fontSize:13,fontWeight:form.reportType===lb?600:400,color:form.reportType===lb?ac:T.ink}}>{lb}</span>
            </div>
          ))}
        </div>
        <Btn onClick={()=>setStep(2)} disabled={!form.reportType} full>Next →</Btn>
      </div>}

      {/* STEP 2 (victim identity) */}
      {step===2&&isVictim&&<div style={fU(0)}>
        <h2 style={{fontFamily:T.serif,fontSize:20,fontWeight:700,marginBottom:6}}>Your identity</h2>
        <p style={{fontSize:13,color:T.muted,fontWeight:300,marginBottom:20}}>Shared only with your assigned officer. Encrypted at rest.</p>
        <div style={{display:'flex',flexDirection:'column',gap:14,marginBottom:20}}>
          <Input label='Full Name' value={form.name} onChange={setF('name')} placeholder='Your full name'/>
          <div style={{display:'flex',flexDirection:'column',gap:5}}>
            <label style={{fontSize:10,fontWeight:600,letterSpacing:'1.5px',textTransform:'uppercase',color:T.muted}}>Phone Number</label>
            <input
              type='tel' value={form.phone}
              onChange={e=>{
                const val=e.target.value.replace(/\D/g,'').slice(0,10);
                setF('phone')(val);
              }}
              placeholder='10-digit mobile number'
              maxLength={10}
              style={{border:`1px solid ${form.phone&&form.phone.length!==10?T.red:form.phone.length===10&&/^[6-9]\d{9}$/.test(form.phone)?T.green:T.border}`,background:T.card,padding:'10px 14px',fontSize:13,color:T.ink,outline:'none',fontFamily:T.sans,borderRadius:0,letterSpacing:'1px',transition:'border-color .2s'}}
              onFocus={e=>e.target.style.borderColor='#7c3aed'}
              onBlur={e=>{
                if(form.phone&&form.phone.length===10&&/^[6-9]\d{9}$/.test(form.phone)) e.target.style.borderColor=T.green;
                else if(form.phone) e.target.style.borderColor=T.red;
                else e.target.style.borderColor=T.border;
              }}
            />
            {form.phone&&form.phone.length>0&&form.phone.length<10&&<p style={{fontSize:10,color:T.amber}}>⚠ Enter all 10 digits ({10-form.phone.length} remaining)</p>}
            {form.phone&&form.phone.length===10&&!/^[6-9]\d{9}$/.test(form.phone)&&<p style={{fontSize:10,color:T.red}}>❌ Invalid Indian mobile number. Must start with 6, 7, 8, or 9.</p>}
            {form.phone&&form.phone.length===10&&/^[6-9]\d{9}$/.test(form.phone)&&<p style={{fontSize:10,color:T.green}}>✓ Valid Indian mobile number</p>}
          </div>
        </div>
        <div style={{background:'rgba(124,58,237,.06)',border:'1px solid rgba(124,58,237,.15)',padding:'12px 14px',marginBottom:20}}>
          <p style={{fontSize:11,color:'#7c3aed',lineHeight:1.65}}>🔒 Your information is encrypted. Only the assigned officer can access it — never the public or the accused.</p>
        </div>
        <div style={{display:'flex',gap:8}}>
          <Btn variant='ghost' onClick={()=>setStep(1)}>← Back</Btn>
          <Btn onClick={()=>setStep(3)} disabled={!(form.name&&form.phone&&form.phone.length===10&&/^[6-9]\d{9}$/.test(form.phone))} full>Next →</Btn>
        </div>
      </div>}

      {/* STEP: EVIDENCE (witness=2, victim=3) */}
      {((step===2&&!isVictim)||(step===3&&isVictim))&&<EvidenceStep
        form={form} setF={setF} ac={ac} gps={gps} isVictim={isVictim}
        nearestStation={nearestStation}
        onBack={()=>setStep(isVictim?2:1)}
        onNext={()=>setStep(isVictim?4:3)}
      />}

      {/* FINAL STEP */}
      {((step===3&&!isVictim)||(step===4&&isVictim))&&<div style={fU(0)}>
        <h2 style={{fontFamily:T.serif,fontSize:20,fontWeight:700,marginBottom:20}}>Review & submit</h2>
        {[
          ['Case Type',isVictim?'Victim — Identity shared with police':'Witness — Fully anonymous'],
          ...(isVictim?[['Name',form.name],['Phone',form.phone]]:[]),
          ['Report Type',form.reportType],
          ['Evidence',form.proof?.name||'Not uploaded'],
          ['Station',nearestStation.name],
          ['Location',gps.label],
        ].map(([k,v])=>(
          <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:`1px solid ${T.border}`}}>
            <span style={{fontSize:12,color:T.muted}}>{k}</span>
            <span style={{fontSize:12,fontWeight:500,maxWidth:'55%',textAlign:'right'}}>{v}</span>
          </div>
        ))}
        <div style={{background:al,border:`1px solid ${ab}`,padding:'12px 14px',margin:'16px 0'}}>
          <p style={{fontSize:11,color:ac,lineHeight:1.65}}>{isVictim?'📋 The FIR decision is entirely yours. The officer will ask you in person.':'🔒 No personal data will be stored. Encrypted fingerprint only — accessible via court order.'}</p>
        </div>
        <div style={{display:'flex',gap:8}}>
          <Btn variant='ghost' onClick={()=>setStep(isVictim?3:2)}>← Back</Btn>
          <Btn onClick={submit} disabled={loading} full style={{background:ac}}>{loading?'AI Analyzing...':'Submit Report →'}</Btn>
        </div>
      </div>}
    </div>
  );
}

// ── TRACK ──
function Track({cases}){
  const [token,setToken]=useState('');
  const [result,setResult]=useState(null);
  const [ratingVal,setRatingVal]=useState(0);
  const [feedback,setFeedback]=useState('');
  const [rated,setRated]=useState(false);
  const [showRating,setShowRating]=useState(false);

  function search(){
    const found=cases.find(r=>r.token===token.trim().toUpperCase());
    setResult(found||'notfound');
    setRated(false); setShowRating(false); setRatingVal(0); setFeedback('');
  }

  const station=result&&result!=='notfound'?STATIONS[result.stationId]:null;

  return <div style={{maxWidth:660,margin:'0 auto',padding:'48px 24px 80px'}}>
    <div style={fU(0)}>
      <p style={{fontSize:10,letterSpacing:'3px',textTransform:'uppercase',color:T.muted,marginBottom:12,display:'flex',alignItems:'center',gap:8}}><span style={{width:18,height:1,background:T.muted,display:'block'}}/>Track Report</p>
      <h1 style={{fontFamily:T.serif,fontSize:36,fontWeight:800,letterSpacing:'-1px',marginBottom:6}}>Track your case.</h1>
      <p style={{fontSize:14,color:T.muted,fontWeight:300,marginBottom:28}}>Enter your anonymous token to see real-time status.</p>
    </div>

    <div style={{...fU(.1),background:T.card,border:`1px solid ${T.border}`,padding:'28px',marginBottom:16}}>
      <Input label='Your Token' value={token} onChange={setToken} placeholder='CIV-XXXX' mono/>
      <div style={{marginTop:12,marginBottom:14,display:'flex',gap:6,flexWrap:'wrap',alignItems:'center'}}>
        <span style={{fontSize:11,color:T.muted}}>Demo tokens:</span>
        {cases.slice(0,4).map(r=>(
          <button key={r.token} onClick={()=>setToken(r.token)}
            style={{background:'rgba(26,61,228,.06)',border:'none',padding:'4px 10px',fontSize:11,color:T.blue,cursor:'pointer',fontFamily:T.sans,fontWeight:500,letterSpacing:'1px'}}>{r.token}</button>
        ))}
      </div>
      <Btn onClick={search} full>Search →</Btn>
    </div>

    {result==='notfound'&&<div style={{...sI(0),background:'#fdeaea',border:`1px solid rgba(217,26,26,.18)`,padding:'16px 20px',color:T.red,fontSize:13}}>Token not found. Please check and try again.</div>}

    {result&&result!=='notfound'&&<div style={{...sI(0),background:T.card,border:`1px solid ${T.border}`,padding:'28px'}}>
      {/* Header */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:20,gap:10}}>
        <div>
          <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:8}}>
            <Badge label={result.type==='victim'?'Victim Case':'Witness Case'} color={result.type==='victim'?'#7c3aed':T.green}/>
            <Badge label={result.reportType} color={T.blue}/>
            <ScoreBadge score={result.score}/>
          </div>
          <h2 style={{fontFamily:T.serif,fontSize:18,fontWeight:700,letterSpacing:'-.3px',marginBottom:4}}>{result.title}</h2>
          <p style={{fontSize:12,color:T.muted}}>📍 {result.location} &nbsp;·&nbsp; {result.time}</p>
        </div>
        <StatusChip status={result.status}/>
      </div>

      {/* Timeline */}
      <div style={{background:'#faf9f5',border:`1px solid ${T.border}`,padding:'20px',marginBottom:18}}>
        <p style={{fontSize:10,letterSpacing:'2px',textTransform:'uppercase',color:T.muted,marginBottom:16,fontWeight:600}}>Case Progress</p>
        <CaseTimeline status={result.status}/>
      </div>

      {/* Station */}
      {station&&<div style={{background:'rgba(26,61,228,.04)',border:'1px solid rgba(26,61,228,.12)',padding:'14px 16px',marginBottom:12}}>
        <p style={{fontSize:10,letterSpacing:'2px',textTransform:'uppercase',color:T.muted,marginBottom:4,fontWeight:600}}>Assigned Station</p>
        <p style={{fontSize:14,fontWeight:600,color:T.blue}}>🏛 {station.name}</p>
        <p style={{fontSize:11,color:T.muted,marginTop:2}}>{station.area}</p>
      </div>}

      {/* Officer */}
      {result.assignedOfficer?(
        <div style={{display:'flex',alignItems:'center',gap:12,background:'rgba(124,58,237,.05)',border:'1px solid rgba(124,58,237,.12)',padding:'14px 16px',marginBottom:12}}>
          <AvatarCircle name={result.assignedOfficer.name} bg='#7c3aed' size={40}/>
          <div>
            <p style={{fontSize:14,fontWeight:600,color:'#3b0764'}}>{result.assignedOfficer.name}</p>
            <p style={{fontSize:11,color:'#6d28d9'}}>{result.assignedOfficer.post} &nbsp;·&nbsp; {result.assignedOfficer.id}</p>
          </div>
        </div>
      ):(
        <div style={{background:'rgba(184,112,0,.06)',border:'1px solid rgba(184,112,0,.18)',padding:'12px 14px',marginBottom:12}}>
          <p style={{fontSize:12,color:T.amber}}>⏳ Officer assignment pending — station is reviewing your case.</p>
        </div>
      )}

      {/* FIR */}
      {result.type==='victim'&&result.firDecision!==null&&(
        <div style={{background:result.firDecision?'rgba(10,122,53,.06)':'#f8fafc',border:`1px solid ${result.firDecision?'rgba(10,122,53,.2)':T.border}`,padding:'12px 14px',marginBottom:12}}>
          <p style={{fontSize:10,letterSpacing:'2px',textTransform:'uppercase',color:T.muted,marginBottom:4,fontWeight:600}}>FIR Status</p>
          <p style={{fontSize:13,fontWeight:600,color:result.firDecision?T.green:T.muted}}>{result.firDecision?'✅ FIR Filed — you chose to file a First Information Report.':'❌ No FIR — you chose not to file a report.'}</p>
        </div>
      )}

      {/* Rating */}
      {result.status==='Complete'&&!rated&&!result.rating&&(
        showRating?(
          <div style={{background:'rgba(245,158,11,.06)',border:'1px solid rgba(245,158,11,.2)',padding:'18px'}}>
            <p style={{fontSize:14,fontWeight:600,marginBottom:4}}>Rate the officer's response</p>
            <p style={{fontSize:12,color:T.muted,marginBottom:14,fontWeight:300}}>Anonymous — appears on police dashboard.</p>
            <Stars value={ratingVal} onChange={setRatingVal} size={26}/>
            <div style={{marginTop:12,marginBottom:12}}>
              <Textarea value={feedback} onChange={setFeedback} placeholder='Optional feedback...' rows={2}/>
            </div>
            <div style={{display:'flex',gap:8}}>
              <Btn variant='ghost' onClick={()=>setShowRating(false)} sm>Cancel</Btn>
              <Btn onClick={()=>{setRated(true);setShowRating(false);}} disabled={!ratingVal} full>Submit Rating ⭐</Btn>
            </div>
          </div>
        ):(
          <button onClick={()=>setShowRating(true)}
            style={{width:'100%',padding:'12px',background:'rgba(245,158,11,.08)',border:'1px solid rgba(245,158,11,.2)',color:'#92400e',fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:T.sans,letterSpacing:'.3px'}}>
            ⭐ Rate Police Response
          </button>
        )
      )}
      {(rated||(result.rating&&result.status==='Complete'))&&(
        <div style={{background:'rgba(10,122,53,.06)',border:'1px solid rgba(10,122,53,.2)',padding:'14px',textAlign:'center'}}>
          <p style={{fontSize:13,fontWeight:600,color:T.green,marginBottom:6}}>Rating submitted. Thank you.</p>
          <Stars value={ratingVal||result.rating} readonly size={20}/>
        </div>
      )}
    </div>}
  </div>;
}

// ── STATION LOGIN ──
function StationLogin({setLoggedStation,setScreen}){
  const [sel,setSel]=useState('');
  const [pass,setPass]=useState('');
  const [err,setErr]=useState('');

  function login(){
    const st=STATIONS[sel];
    if(!st){setErr('Please select a police station.');return;}
    if(st.pass===pass){setLoggedStation(st);setScreen(SCREENS.POLICE);}
    else setErr('Incorrect password.');
  }

  return <div style={{maxWidth:420,margin:'80px auto',padding:'0 24px'}}>
    <div style={{...sI(0),background:T.card,border:`1px solid ${T.border}`,padding:'40px'}}>
      <div style={{textAlign:'center',marginBottom:28}}>
        <div style={{fontSize:44,marginBottom:12}}>🏛</div>
        <h1 style={{fontFamily:T.serif,fontSize:26,fontWeight:800,letterSpacing:'-.5px',marginBottom:6}}>Station Login</h1>
        <p style={{fontSize:13,color:T.muted,fontWeight:300}}>Authorized personnel only</p>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:14,marginBottom:16}}>
        <Select label='Police Station' value={sel} onChange={setSel} options={[['','-- Select Station --'],...Object.values(STATIONS).map(s=>[s.id,s.name])]}/>
        {sel&&<div style={{background:'rgba(26,61,228,.04)',border:'1px solid rgba(26,61,228,.12)',padding:'10px 13px'}}>
          <p style={{fontSize:11,color:T.blue}}>📍 {STATIONS[sel].area} · {STATIONS[sel].officers.length} officers</p>
        </div>}
        <Input label='Station Password' type='password' value={pass} onChange={setPass} placeholder='Enter password'/>
      </div>
      {err&&<p style={{fontSize:12,color:T.red,marginBottom:12,textAlign:'center'}}>{err}</p>}
      <Btn onClick={login} full>Login to Dashboard →</Btn>
      <div style={{marginTop:16,padding:'12px',background:'#faf9f5',border:`1px solid ${T.border}`}}>
        <p style={{fontSize:10,letterSpacing:'1.5px',textTransform:'uppercase',color:T.muted,marginBottom:6,fontWeight:600}}>Demo Credentials</p>
        {[['Vijay Nagar PS','vjn@2026'],['MG Road PS','mgr@2026'],['Palasia PS','pal@2026']].map(([n,p])=>(
          <p key={n} style={{fontSize:11,color:T.muted,marginBottom:2,fontWeight:300}}>{n}: <strong style={{color:T.ink,fontFamily:'monospace'}}>{p}</strong></p>
        ))}
      </div>
    </div>
  </div>;
}

// ── SCORE DETAIL MODAL ──
function ScoreDetailModal({caseData,onClose}){
  const ai=caseData.aiAnalysis;
  const score=caseData.score;
  const sc=score>=70?'#4ade80':score>=40?'#fbbf24':'#f87171';
  const SIGS=[
    {key:'description_coherence',label:'Description Quality',icon:'📝'},
    {key:'location_match',label:'Location Match',icon:'📍'},
    {key:'time_plausibility',label:'Time Plausibility',icon:'🕐'},
    {key:'evidence_quality',label:'Evidence Quality',icon:'📸'},
    {key:'corroboration_potential',label:'Corroboration',icon:'👥'},
    {key:'category_match',label:'Category Match',icon:'🏷'},
  ];
  const SC={STRONG:'#4ade80',MODERATE:'#fbbf24',WEAK:'#f87171'};
  return(
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.85)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:200,padding:16}} onClick={onClose}>
      <div style={{...sI(0),background:'#111122',border:'1px solid rgba(255,255,255,.1)',width:'100%',maxWidth:540,maxHeight:'90vh',overflowY:'auto'}} onClick={e=>e.stopPropagation()}>
        <div style={{padding:'18px 20px',borderBottom:'1px solid rgba(255,255,255,.07)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <div style={{fontSize:9,letterSpacing:'2px',textTransform:'uppercase',color:'rgba(240,237,232,.3)',marginBottom:3}}>AI Credibility Analysis</div>
            <div style={{fontFamily:T.serif,fontSize:15,fontWeight:700,color:'#f0ede8'}}>{caseData.title}</div>
          </div>
          <button onClick={onClose} style={{background:'rgba(255,255,255,.07)',border:'none',width:28,height:28,color:'rgba(240,237,232,.5)',cursor:'pointer',fontSize:14}}>✕</button>
        </div>
        <div style={{padding:'18px 20px'}}>
          {/* Score */}
          <div style={{display:'flex',gap:16,alignItems:'center',padding:14,background:'rgba(255,255,255,.04)',border:`1px solid ${sc}22`,marginBottom:14}}>
            <div style={{textAlign:'center',flexShrink:0}}>
              <div style={{fontFamily:T.serif,fontSize:46,fontWeight:800,color:sc,lineHeight:1,letterSpacing:'-2px'}}>{score}</div>
              <div style={{fontSize:9,letterSpacing:'2px',color:'rgba(240,237,232,.25)',marginTop:2}}>/100</div>
            </div>
            <div style={{flex:1}}>
              <div style={{height:5,background:'rgba(255,255,255,.08)',marginBottom:8,overflow:'hidden'}}>
                <div style={{height:'100%',width:`${score}%`,background:sc}}/>
              </div>
              <div style={{fontSize:11,fontWeight:700,color:sc,letterSpacing:'1px',marginBottom:4}}>{caseData.aiAnalysis?.verdict||(score>=70?'VERIFIED':score>=40?'REVIEW':'REJECTED')}</div>
              <div style={{fontSize:11,color:'rgba(240,237,232,.4)',lineHeight:1.6,fontWeight:300}}>{ai?.summary||'Analysis unavailable for this case.'}</div>
            </div>
          </div>
          {/* Signals */}
          {ai?.signals&&<>
            <div style={{fontSize:9,letterSpacing:'2px',textTransform:'uppercase',color:'rgba(240,237,232,.25)',marginBottom:8,fontWeight:500}}>Signal Breakdown</div>
            <div style={{display:'flex',flexDirection:'column',gap:5,marginBottom:14}}>
              {SIGS.map(({key,label,icon})=>{
                const sig=ai.signals[key]; if(!sig) return null;
                const pct=(sig.score/sig.max)*100; const c2=SC[sig.status]||'#fbbf24';
                return(
                  <div key={key} style={{background:'rgba(255,255,255,.04)',padding:'10px 12px',border:'1px solid rgba(255,255,255,.05)'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:5}}>
                      <div style={{display:'flex',gap:7,alignItems:'center'}}>
                        <span style={{fontSize:13}}>{icon}</span>
                        <span style={{fontSize:12,fontWeight:500,color:'#f0ede8'}}>{label}</span>
                      </div>
                      <div style={{display:'flex',gap:7,alignItems:'center'}}>
                        <span style={{fontSize:9,fontWeight:700,color:c2,letterSpacing:'1px',background:`${c2}14`,padding:'2px 6px'}}>{sig.status}</span>
                        <span style={{fontFamily:'monospace',fontSize:12,fontWeight:700,color:c2}}>{sig.score}/{sig.max}</span>
                      </div>
                    </div>
                    <div style={{height:3,background:'rgba(255,255,255,.07)',overflow:'hidden',marginBottom:4}}>
                      <div style={{height:'100%',width:`${pct}%`,background:c2}}/>
                    </div>
                    <div style={{fontSize:11,color:'rgba(240,237,232,.35)',lineHeight:1.5,fontWeight:300}}>{sig.note}</div>
                  </div>
                );
              })}
            </div>
          </>}
          {ai?.weak_points?.filter(Boolean).length>0&&<div style={{background:'rgba(248,113,113,.06)',border:'1px solid rgba(248,113,113,.18)',padding:'10px 12px',marginBottom:12}}>
            <div style={{fontSize:9,letterSpacing:'2px',color:'rgba(248,113,113,.5)',marginBottom:6,fontWeight:600,textTransform:'uppercase'}}>Gaps in this report</div>
            {ai.weak_points.filter(Boolean).map((p,i)=><div key={i} style={{fontSize:11,color:'#fca5a5',marginBottom:3,display:'flex',gap:6}}><span>⚠</span>{p}</div>)}
          </div>}
          {ai?.police_action&&<div style={{background:'rgba(96,165,250,.06)',border:'1px solid rgba(96,165,250,.16)',padding:'10px 12px'}}>
            <div style={{fontSize:9,letterSpacing:'2px',color:'rgba(96,165,250,.5)',marginBottom:4,fontWeight:600,textTransform:'uppercase'}}>Recommended Action</div>
            <div style={{fontSize:11,color:'#93c5fd',lineHeight:1.6,fontWeight:300}}>{ai.police_action}</div>
          </div>}
        </div>
      </div>
    </div>
  );
}

// ── EVIDENCE MODAL ──
function EvidenceModal({caseData,onClose}){
  const proofFiles = caseData.proofFiles || (caseData.proofFile ? [{file:caseData.proofFile, type:caseData.proofFile?.type?.startsWith('image/')?'image':'video', fromGallery: caseData.evidenceSource==='gallery', url:null}] : []);
  return(
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.9)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:200,padding:16}} onClick={onClose}>
      <div style={{...sI(0),background:'#0c0c14',border:'1px solid rgba(255,255,255,.1)',width:'100%',maxWidth:640,maxHeight:'90vh',overflowY:'auto'}} onClick={e=>e.stopPropagation()}>
        <div style={{padding:'16px 20px',borderBottom:'1px solid rgba(255,255,255,.07)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <div style={{fontSize:9,letterSpacing:'2px',textTransform:'uppercase',color:'rgba(240,237,232,.25)',marginBottom:3}}>Evidence Viewer</div>
            <div style={{fontSize:14,fontWeight:600,color:'#f0ede8'}}>{caseData.title}</div>
          </div>
          <button onClick={onClose} style={{background:'rgba(255,255,255,.07)',border:'none',width:28,height:28,color:'rgba(240,237,232,.5)',cursor:'pointer',fontSize:14}}>✕</button>
        </div>
        <div style={{padding:18}}>
          {/* Case metadata */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,marginBottom:14}}>
            {[
              ['Case ID',caseData.id],['Token',caseData.token],
              ['Type',caseData.type==='victim'?'Victim':'Witness'],['Category',caseData.reportType],
              ['Location',caseData.location],['Time',caseData.time],
              ['Evidence Source',caseData.evidenceSource==='live-camera'?'📷 Live Camera':caseData.evidenceSource==='gallery'?'🖼 Gallery Upload':caseData.proof?'📎 Attached':'—'],
              ['Files',proofFiles.length?`${proofFiles.length} file(s)`:'None'],
            ].map(([k,v])=>(
              <div key={k} style={{background:'rgba(255,255,255,.04)',padding:'7px 10px'}}>
                <div style={{fontSize:9,letterSpacing:'1px',textTransform:'uppercase',color:'rgba(240,237,232,.22)',marginBottom:2}}>{k}</div>
                <div style={{fontSize:11,color:'#f0ede8',fontWeight:500}}>{v}</div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div style={{background:'rgba(255,255,255,.04)',padding:'10px 13px',marginBottom:14,borderLeft:'3px solid rgba(96,165,250,.4)'}}>
            <div style={{fontSize:9,letterSpacing:'2px',textTransform:'uppercase',color:'rgba(240,237,232,.25)',marginBottom:5}}>Description</div>
            <div style={{fontSize:12,color:'rgba(240,237,232,.75)',lineHeight:1.7,fontWeight:300}}>{caseData.description}</div>
          </div>

          {/* Evidence files */}
          <div style={{fontSize:9,letterSpacing:'2px',textTransform:'uppercase',color:'rgba(240,237,232,.25)',marginBottom:8,fontWeight:500}}>
            Evidence Files ({proofFiles.length})
          </div>
          {proofFiles.length > 0 ? (
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))',gap:6,marginBottom:14}}>
              {proofFiles.map((p, i) => <PoliceEvidenceThumb key={i} proof={p} />)}
            </div>
          ) : (
            <div style={{padding:'28px',textAlign:'center',background:'rgba(255,255,255,.03)',border:'1px dashed rgba(255,255,255,.1)',marginBottom:14}}>
              {caseData.proof
                ? <><div style={{fontSize:24,marginBottom:6}}>📎</div><div style={{fontSize:12,color:'rgba(240,237,232,.4)',marginBottom:3}}>{caseData.proof}</div><div style={{fontSize:10,color:'rgba(240,237,232,.2)',fontWeight:300}}>Preview unavailable for demo data</div></>
                : <><div style={{fontSize:24,marginBottom:6}}>📭</div><div style={{fontSize:12,color:'rgba(240,237,232,.25)'}}>No evidence uploaded</div></>
              }
            </div>
          )}

          {/* Victim identity */}
          {caseData.type==='victim'&&caseData.identity&&(
            <div style={{background:'rgba(192,132,252,.07)',border:'1px solid rgba(192,132,252,.18)',padding:'10px 13px'}}>
              <div style={{fontSize:9,letterSpacing:'2px',textTransform:'uppercase',color:'rgba(192,132,252,.4)',marginBottom:5}}>Victim Identity — Confidential</div>
              <div style={{fontSize:14,fontWeight:700,color:'#e9d5ff'}}>{caseData.identity.name}</div>
              <div style={{fontSize:12,color:'rgba(192,132,252,.6)',marginTop:2}}>{caseData.identity.phone}</div>
              <div style={{fontSize:9,color:'rgba(192,132,252,.35)',marginTop:5,fontWeight:300}}>⚠ Do not share outside this case file.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Police dashboard evidence thumbnail — creates blob URL from file
function PoliceEvidenceThumb({ proof }) {
  const [src, setSrc] = useState(proof.url || null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (proof.url) { setSrc(proof.url); return; }
    if (proof.file) {
      const u = URL.createObjectURL(proof.file);
      setSrc(u);
      return () => URL.revokeObjectURL(u);
    }
  }, [proof]);

  const borderColor = proof.fromGallery ? '#fbbf24' : '#4ade80';

  return (
    <>
      <div onClick={() => src && setExpanded(true)}
        style={{ border: `1.5px solid ${borderColor}`, background: '#111', overflow: 'hidden', cursor: src ? 'pointer' : 'default', position: 'relative' }}>
        {proof.type === 'image' && src
          ? <img src={src} alt="evidence" style={{ width: '100%', height: 110, objectFit: 'cover', display: 'block' }} />
          : proof.type === 'video' && src
            ? <video src={src} style={{ width: '100%', height: 110, objectFit: 'cover', display: 'block' }} />
            : <div style={{ width: '100%', height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
                {proof.type === 'video' ? '🎬' : '🖼'}
              </div>
        }
        <div style={{ padding: '4px 8px', background: '#0c0c14' }}>
          <div style={{ fontSize: 9, color: borderColor, fontWeight: 700 }}>{proof.fromGallery ? '🖼 Gallery' : '📷 Live Camera'}</div>
          {proof.stamp && <div style={{ fontSize: 8, color: 'rgba(240,237,232,.3)', marginTop: 1 }}>{proof.stamp}</div>}
          {proof.file && <div style={{ fontSize: 8, color: 'rgba(240,237,232,.25)' }}>{(proof.file.size/1024/1024).toFixed(1)} MB</div>}
        </div>
        {src && <div style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,.6)', padding: '2px 6px', fontSize: 9, color: '#fff' }}>🔍 View</div>}
      </div>

      {/* Expanded lightbox */}
      {expanded && src && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.95)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          onClick={() => setExpanded(false)}>
          {proof.type === 'image'
            ? <img src={src} alt="evidence full" style={{ maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain' }} onClick={e=>e.stopPropagation()} />
            : <video src={src} controls autoPlay style={{ maxWidth: '100%', maxHeight: '90vh' }} onClick={e=>e.stopPropagation()} />
          }
          <button onClick={() => setExpanded(false)}
            style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,.15)', border: 'none', color: '#fff', width: 36, height: 36, fontSize: 16, cursor: 'pointer', borderRadius: '50%' }}>✕</button>
        </div>
      )}
    </>
  );
}

// ── POLICE DASHBOARD ──
function PoliceDashboard({station,cases,setCases,setScreen}){
  const [tab,setTab]=useState('cases');
  const [officers,setOfficers]=useState(station.officers);
  const [assignModal,setAssignModal]=useState(null);
  const [firModal,setFirModal]=useState(null);
  const [scoreModal,setScoreModal]=useState(null);
  const [evidenceModal,setEvidenceModal]=useState(null);
  const myCases=cases.filter(c=>c.stationId===station.id);

  function assignOfficer(caseId,officer){
    setCases(p=>p.map(c=>c.id===caseId?{...c,assignedOfficer:{id:officer.id,name:officer.name,post:officer.post},status:'In Process'}:c));
    setOfficers(p=>p.map(o=>o.id===officer.id?{...o,cases:o.cases+1}:o));
    setAssignModal(null);
  }
  function handleFIR(id,dec){
    setCases(p=>p.map(c=>c.id===id?{...c,firDecision:dec,status:'Complete'}:c));
    setFirModal(null);
  }
  function markComplete(id){
    setCases(p=>p.map(c=>c.id===id?{...c,status:'Complete'}:c));
  }

  const tabs=[['cases','Cases'],['officers','Officers'],['ratings','Ratings']];

  return <div style={{minHeight:'100vh',background:'#0c0c14',color:'#f0ede8'}}>
    {/* Station Header */}
    <div style={{background:'#111122',borderBottom:'1px solid rgba(255,255,255,.07)',padding:'16px 32px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <div style={{width:38,height:38,background:station.color,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontFamily:T.serif,fontWeight:800,fontSize:13}}>{station.short}</div>
        <div>
          <div style={{fontFamily:T.serif,fontWeight:700,fontSize:16,letterSpacing:'-.3px'}}>{station.name}</div>
          <div style={{fontSize:11,color:'rgba(240,237,232,.4)',marginTop:1}}>{station.area} · {station.id}</div>
        </div>
      </div>
      <button onClick={()=>setScreen(SCREENS.STATION_LOGIN)}
        style={{background:'transparent',border:'1px solid rgba(255,255,255,.12)',padding:'7px 16px',color:'rgba(240,237,232,.5)',fontSize:12,cursor:'pointer',fontFamily:T.sans}}>Logout</button>
    </div>

    <div style={{padding:'24px 32px'}}>
      {/* Stat cards */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:2,background:'rgba(255,255,255,.06)',marginBottom:20}}>
        {[
          {n:myCases.length,l:'Total',c:'#60a5fa'},
          {n:myCases.filter(c=>c.status==='Pending').length,l:'Pending',c:'#fbbf24'},
          {n:myCases.filter(c=>c.status==='In Process').length,l:'In Process',c:'#38bdf8'},
          {n:myCases.filter(c=>c.status==='Complete').length,l:'Complete',c:'#4ade80'},
          {n:officers.filter(o=>o.status==='On Duty').length,l:'On Duty',c:'#c084fc'},
        ].map((s,i)=>(
          <div key={i} style={{background:'#0c0c14',padding:'18px 20px',textAlign:'center'}}>
            <div style={{fontFamily:T.serif,fontSize:28,fontWeight:800,color:s.c,letterSpacing:'-1px'}}>{s.n}</div>
            <div style={{fontSize:10,color:'rgba(240,237,232,.3)',marginTop:3,letterSpacing:'1px',textTransform:'uppercase',fontWeight:500}}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{display:'flex',gap:2,marginBottom:16,background:'rgba(255,255,255,.04)'}}>
        {tabs.map(([id,l])=>(
          <button key={id} onClick={()=>setTab(id)}
            style={{padding:'10px 20px',fontSize:12,fontWeight:600,letterSpacing:'.5px',cursor:'pointer',fontFamily:T.sans,border:'none',background:tab===id?station.color:'transparent',color:tab===id?'#fff':'rgba(240,237,232,.4)',transition:'all .2s'}}>
            {l}
          </button>
        ))}
      </div>

      {/* CASES */}
      {tab==='cases'&&<div>
        <div style={{fontSize:10,letterSpacing:'2px',textTransform:'uppercase',color:'rgba(240,237,232,.3)',marginBottom:12,fontWeight:500}}>
          All Cases — {station.name}
        </div>
        {myCases.length===0&&<div style={{textAlign:'center',color:'rgba(240,237,232,.3)',padding:'48px',fontSize:13}}>No cases assigned to this station yet.</div>}
        <div style={{display:'flex',flexDirection:'column',gap:2}}>
          {myCases.map((c,i)=>(
            <div key={c.id} style={{...fU(i*.05),background:'#111122',border:'1px solid rgba(255,255,255,.06)',padding:'18px 20px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10,gap:10}}>
                <div>
                  <div style={{display:'flex',gap:6,marginBottom:7,flexWrap:'wrap',alignItems:'center'}}>
                    {/* CLICKABLE SCORE BADGE */}
                    <button onClick={()=>setScoreModal(c)} title="Click for AI analysis details"
                      style={{background:c.score>=70?'rgba(74,222,128,.15)':c.score>=40?'rgba(251,191,36,.15)':'rgba(248,113,113,.15)',color:c.score>=70?'#4ade80':c.score>=40?'#fbbf24':'#f87171',border:c.score>=70?'1px solid rgba(74,222,128,.3)':c.score>=40?'1px solid rgba(251,191,36,.3)':'1px solid rgba(248,113,113,.3)',padding:'4px 10px',fontSize:11,fontWeight:700,cursor:'pointer',fontFamily:T.sans,display:'flex',alignItems:'center',gap:5,transition:'all .15s'}}
                      onMouseEnter={e=>e.currentTarget.style.transform='scale(1.04)'}
                      onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}>
                      {c.score}/100
                      <span style={{fontSize:9,opacity:.7}}>▸ Analysis</span>
                    </button>
                    <Badge label={c.type==='victim'?'Victim':'Witness'} color={c.type==='victim'?'#a78bfa':'#34d399'} bg='rgba(255,255,255,.07)'/>
                    <Badge label={c.reportType} color='#60a5fa' bg='rgba(255,255,255,.07)'/>
                    {/* Evidence indicator */}
                    {c.proof&&<span style={{fontSize:9,color:'rgba(240,237,232,.4)',background:'rgba(255,255,255,.05)',padding:'3px 8px',letterSpacing:'.5px'}}>📎 {c.proof}</span>}
                  </div>
                  <div style={{fontWeight:600,fontSize:14,color:'#f0ede8',letterSpacing:'-.2px'}}>{c.title}</div>
                  <div style={{fontSize:11,color:'rgba(240,237,232,.35)',marginTop:3}}>📍 {c.location} · {c.time}</div>
                  {c.type==='victim'&&c.identity&&(
                    <div style={{fontSize:11,color:'#c084fc',marginTop:5,background:'rgba(192,132,252,.1)',display:'inline-block',padding:'3px 10px'}}>
                      👤 {c.identity.name} · {c.identity.phone}
                    </div>
                  )}
                </div>
                <StatusChip status={c.status}/>
              </div>

              {c.assignedOfficer&&(
                <div style={{display:'flex',alignItems:'center',gap:10,background:'rgba(192,132,252,.07)',padding:'9px 12px',marginBottom:10}}>
                  <div style={{width:28,height:28,borderRadius:'50%',background:'#7c3aed',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:10,fontWeight:700,flexShrink:0}}>{initials(c.assignedOfficer.name)}</div>
                  <div>
                    <div style={{fontSize:12,fontWeight:600,color:'#e9d5ff'}}>{c.assignedOfficer.name}</div>
                    <div style={{fontSize:10,color:'rgba(192,132,252,.6)'}}>{c.assignedOfficer.post} · {c.assignedOfficer.id}</div>
                  </div>
                </div>
              )}

              <div style={{display:'flex',gap:6,flexWrap:'wrap',alignItems:'center'}}>
                {c.status==='Pending'&&<button onClick={()=>setAssignModal(c.id)} style={{background:'#7c3aed',border:'none',padding:'7px 14px',color:'#fff',fontSize:11,fontWeight:600,cursor:'pointer',fontFamily:T.sans}}>👮 Assign Officer</button>}
                {c.status==='In Process'&&c.type==='victim'&&c.firDecision===null&&<button onClick={()=>setFirModal(c.id)} style={{background:T.blue,border:'none',padding:'7px 14px',color:'#fff',fontSize:11,fontWeight:600,cursor:'pointer',fontFamily:T.sans}}>📋 Record FIR Decision</button>}
                {c.status==='In Process'&&(c.type==='witness'||(c.type==='victim'&&c.firDecision!==null))&&<button onClick={()=>markComplete(c.id)} style={{background:'#0a7a35',border:'none',padding:'7px 14px',color:'#fff',fontSize:11,fontWeight:600,cursor:'pointer',fontFamily:T.sans}}>✅ Mark Complete</button>}
                {c.status==='Complete'&&<span style={{fontSize:12,color:'#4ade80',display:'flex',alignItems:'center',gap:4,fontWeight:500}}>✅ Closed · {c.firDecision?'FIR Filed':'No FIR'}</span>}
                {/* EVIDENCE BUTTON - always show */}
                <button onClick={()=>setEvidenceModal(c)}
                  style={{background:'rgba(96,165,250,.1)',border:'1px solid rgba(96,165,250,.2)',padding:'6px 13px',color:'#93c5fd',fontSize:11,fontWeight:500,cursor:'pointer',fontFamily:T.sans,marginLeft:'auto',display:'flex',alignItems:'center',gap:5,transition:'background .15s'}}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(96,165,250,.18)'}
                  onMouseLeave={e=>e.currentTarget.style.background='rgba(96,165,250,.1)'}>
                  🔍 View Evidence
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>}

      {/* OFFICERS */}
      {tab==='officers'&&<div>
        <div style={{fontSize:10,letterSpacing:'2px',textTransform:'uppercase',color:'rgba(240,237,232,.3)',marginBottom:12,fontWeight:500}}>Officer Roster — {station.name}</div>
        <div style={{display:'flex',flexDirection:'column',gap:2}}>
          {officers.map((o,i)=>(
            <div key={o.id} style={{...fU(i*.06),background:'#111122',border:'1px solid rgba(255,255,255,.06)',padding:'18px 20px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14}}>
                <div style={{display:'flex',gap:12,alignItems:'center'}}>
                  <AvatarCircle name={o.name} bg={station.color} size={44} textColor='#fff'/>
                  <div>
                    <div style={{fontWeight:600,fontSize:14,color:'#f0ede8'}}>{o.name}</div>
                    <div style={{fontSize:12,color:'rgba(240,237,232,.4)'}}>{o.post}</div>
                    <div style={{fontSize:10,color:'rgba(240,237,232,.25)',marginTop:2,letterSpacing:'1px'}}>ID: {o.id}</div>
                  </div>
                </div>
                <span style={{background:o.status==='On Duty'?'rgba(74,222,128,.12)':'rgba(255,255,255,.06)',color:o.status==='On Duty'?'#4ade80':'rgba(240,237,232,.3)',fontSize:10,fontWeight:700,padding:'4px 11px',letterSpacing:'1px',textTransform:'uppercase'}}>{o.status}</span>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:2,background:'rgba(255,255,255,.04)',marginBottom:10}}>
                {[['Active',o.cases],['Resolved',o.resolved],['Rating',o.rating+'⭐'],['Station',station.id]].map(([l,v])=>(
                  <div key={l} style={{background:'#0c0c14',padding:'10px',textAlign:'center'}}>
                    <div style={{fontSize:16,fontWeight:700,color:'#f0ede8',fontFamily:T.serif}}>{v}</div>
                    <div style={{fontSize:9,color:'rgba(240,237,232,.3)',marginTop:2,letterSpacing:'1px',textTransform:'uppercase'}}>{l}</div>
                  </div>
                ))}
              </div>
              <div style={{height:3,background:'rgba(255,255,255,.06)',overflow:'hidden'}}>
                <div style={{height:'100%',width:`${(o.rating/5)*100}%`,background:o.rating>=4.5?'#4ade80':o.rating>=3.5?'#fbbf24':'#f87171',transition:'width .8s ease'}}/>
              </div>
            </div>
          ))}
        </div>
      </div>}

      {/* RATINGS */}
      {tab==='ratings'&&<div>
        <div style={{fontSize:10,letterSpacing:'2px',textTransform:'uppercase',color:'rgba(240,237,232,.3)',marginBottom:12,fontWeight:500}}>Citizen Ratings — Performance Overview</div>
        <div style={{display:'flex',flexDirection:'column',gap:2,marginBottom:16}}>
          {myCases.filter(c=>c.status==='Complete').map((c,i)=>(
            <div key={c.id} style={{...fU(i*.06),background:'#111122',border:'1px solid rgba(255,255,255,.06)',padding:'14px 18px',display:'flex',justifyContent:'space-between',alignItems:'center',gap:10}}>
              <div>
                <div style={{fontWeight:500,fontSize:13,color:'#f0ede8'}}>{c.title}</div>
                <div style={{fontSize:11,color:'rgba(240,237,232,.3)',marginTop:2}}>
                  {c.assignedOfficer?`${c.assignedOfficer.name} · ${c.assignedOfficer.id}`:'No officer assigned'}
                </div>
                <div style={{fontSize:10,color:'rgba(240,237,232,.2)',marginTop:2,letterSpacing:'1px'}}>Token: {c.token} · {c.type==='victim'?'Victim':'Witness'}</div>
              </div>
              {c.rating?<div style={{textAlign:'right',flexShrink:0}}>
                <Stars value={c.rating} readonly size={16}/>
                <div style={{fontSize:10,color:'rgba(240,237,232,.3)',marginTop:4}}>Citizen rating</div>
              </div>:<span style={{background:'rgba(251,191,36,.1)',color:'#fbbf24',fontSize:10,fontWeight:700,padding:'4px 10px',letterSpacing:'1px',flexShrink:0}}>PENDING</span>}
            </div>
          ))}
          {myCases.filter(c=>c.status==='Complete').length===0&&<div style={{textAlign:'center',color:'rgba(240,237,232,.3)',padding:'32px',fontSize:13}}>No completed cases yet.</div>}
        </div>

        <div style={{background:'#111122',border:'1px solid rgba(255,255,255,.06)',padding:'20px'}}>
          <div style={{fontSize:10,letterSpacing:'2px',textTransform:'uppercase',color:'rgba(240,237,232,.3)',marginBottom:14,fontWeight:500}}>Average Ratings by Officer</div>
          {officers.map(o=>(
            <div key={o.id} style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
              <div style={{fontSize:12,color:'#f0ede8',flex:1,fontWeight:500}}>{o.name} <span style={{color:'rgba(240,237,232,.35)',fontWeight:300,fontSize:11}}>({o.post})</span></div>
              <Stars value={Math.round(o.rating)} readonly size={14}/>
              <span style={{fontSize:13,fontWeight:700,color:station.color,minWidth:28}}>{o.rating}</span>
            </div>
          ))}
        </div>
      </div>}
    </div>

    {/* SCORE DETAIL MODAL */}
    {scoreModal&&<ScoreDetailModal caseData={scoreModal} onClose={()=>setScoreModal(null)}/>}

    {/* EVIDENCE MODAL */}
    {evidenceModal&&<EvidenceModal caseData={evidenceModal} onClose={()=>setEvidenceModal(null)}/>}

    {/* ASSIGN MODAL */}
    {assignModal&&<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.75)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:100}} onClick={()=>setAssignModal(null)}>
      <div style={{...sI(0),background:'#111122',border:'1px solid rgba(255,255,255,.1)',padding:'28px',width:420,maxWidth:'90vw'}} onClick={e=>e.stopPropagation()}>
        <h3 style={{fontFamily:T.serif,fontSize:18,fontWeight:700,color:'#f0ede8',marginBottom:4}}>Assign an Officer</h3>
        <p style={{fontSize:12,color:'rgba(240,237,232,.4)',marginBottom:16}}>Select from on-duty officers</p>
        <div style={{display:'flex',flexDirection:'column',gap:2,marginBottom:14}}>
          {officers.filter(o=>o.status==='On Duty').map(o=>(
            <div key={o.id} onClick={()=>assignOfficer(assignModal,o)}
              style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 14px',background:'rgba(255,255,255,.04)',cursor:'pointer',transition:'background .15s',border:'1px solid transparent'}}
              onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,.08)';e.currentTarget.style.borderColor='rgba(255,255,255,.1)'}}
              onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,.04)';e.currentTarget.style.borderColor='transparent'}}>
              <div style={{display:'flex',gap:10,alignItems:'center'}}>
                <AvatarCircle name={o.name} bg={station.color} size={34} textColor='#fff'/>
                <div>
                  <div style={{fontSize:13,fontWeight:600,color:'#f0ede8'}}>{o.name}</div>
                  <div style={{fontSize:11,color:'rgba(240,237,232,.4)'}}>{o.post} · {o.id}</div>
                </div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:11,color:'rgba(240,237,232,.4)'}}>{o.cases} active</div>
                <div style={{fontSize:11,color:'#fbbf24'}}>{o.rating}⭐</div>
              </div>
            </div>
          ))}
        </div>
        <button onClick={()=>setAssignModal(null)} style={{width:'100%',padding:'10px',background:'transparent',border:'1px solid rgba(255,255,255,.12)',color:'rgba(240,237,232,.5)',fontSize:12,cursor:'pointer',fontFamily:T.sans}}>Cancel</button>
      </div>
    </div>}

    {/* FIR MODAL */}
    {firModal&&<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.75)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:100}} onClick={()=>setFirModal(null)}>
      <div style={{...sI(0),background:'#111122',border:'1px solid rgba(255,255,255,.1)',padding:'32px',width:400,maxWidth:'90vw',textAlign:'center'}} onClick={e=>e.stopPropagation()}>
        <div style={{fontSize:40,marginBottom:14}}>📋</div>
        <h3 style={{fontFamily:T.serif,fontSize:20,fontWeight:700,color:'#f0ede8',marginBottom:8}}>Record FIR Decision</h3>
        <p style={{fontSize:13,color:'rgba(240,237,232,.5)',lineHeight:1.7,marginBottom:20}}>The officer has met the victim and asked:<br/><strong style={{color:'#f0ede8'}}>"Do you wish to file an FIR?"</strong><br/><span style={{fontSize:11}}>The victim's decision is final.</span></p>
        <div style={{display:'flex',gap:8}}>
          <button onClick={()=>handleFIR(firModal,true)} style={{flex:1,padding:'12px',background:'#0a7a35',border:'none',color:'#fff',fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:T.sans}}>✅ Yes — File FIR</button>
          <button onClick={()=>handleFIR(firModal,false)} style={{flex:1,padding:'12px',background:'transparent',border:'1px solid rgba(255,255,255,.15)',color:'rgba(240,237,232,.6)',fontSize:13,fontWeight:500,cursor:'pointer',fontFamily:T.sans}}>❌ No FIR</button>
        </div>
      </div>
    </div>}
  </div>;
}

// ══════════════════════════════════════════════════════════
// NAV
// ══════════════════════════════════════════════════════════
function Nav({screen,setScreen,isPolice,demoMode,setDemoMode}){
  const [scrolled,setScrolled]=useState(false);
  useEffect(()=>{
    const fn=()=>setScrolled(window.scrollY>60);
    window.addEventListener('scroll',fn);
    return ()=>window.removeEventListener('scroll',fn);
  },[]);

  if(isPolice) return null;

  const navBg = screen===SCREENS.HOME
    ? (scrolled?'rgba(246,244,239,.95)':'transparent')
    : 'rgba(246,244,239,.97)';

  return <>
    <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:400,padding:'16px 40px',display:'flex',alignItems:'center',justifyContent:'space-between',background:navBg,backdropFilter:scrolled?'blur(12px)':'none',borderBottom:scrolled?`1px solid ${T.border}`:'none',transition:'all .25s'}}>
      <button onClick={()=>setScreen(SCREENS.HOME)} style={{fontFamily:T.serif,fontWeight:800,fontSize:18,letterSpacing:'-.3px',color:T.ink,background:'none',border:'none',cursor:'pointer'}}>
        Civic<span style={{color:T.blue}}>Shield</span>
      </button>
      <div style={{display:'flex',gap:6,alignItems:'center'}}>
        {[[SCREENS.CHOOSE,'Report'],[SCREENS.TRACK,'Track'],[SCREENS.STATION_LOGIN,'Police']].map(([s,l])=>(
          <button key={s} onClick={()=>setScreen(s)}
            style={{background:screen===s?T.ink:'transparent',color:screen===s?T.paper:T.muted,border:`1px solid ${screen===s?T.ink:T.border}`,padding:'7px 16px',fontSize:12,fontWeight:screen===s?600:400,cursor:'pointer',fontFamily:T.sans,transition:'all .15s',letterSpacing:'.2px'}}>
            {l}
          </button>
        ))}
        {/* DEMO MODE TOGGLE */}
        <div onClick={()=>setDemoMode(d=>!d)}
          title={demoMode?'Demo Mode ON — all reports pass':'Demo Mode OFF — real AI scoring'}
          style={{display:'flex',alignItems:'center',gap:6,padding:'6px 12px',background:demoMode?'rgba(234,179,8,.12)':'rgba(12,12,20,.04)',border:`1px solid ${demoMode?'rgba(234,179,8,.4)':T.border}`,cursor:'pointer',transition:'all .2s',marginLeft:4}}>
          <div style={{width:28,height:16,borderRadius:8,background:demoMode?'#ca8a04':'#d1d5db',position:'relative',transition:'background .2s',flexShrink:0}}>
            <div style={{position:'absolute',top:2,left:demoMode?12:2,width:12,height:12,borderRadius:'50%',background:'#fff',transition:'left .2s',boxShadow:'0 1px 3px rgba(0,0,0,.2)'}}/>
          </div>
          <span style={{fontSize:10,fontWeight:700,letterSpacing:'1px',textTransform:'uppercase',color:demoMode?'#92400e':T.muted,whiteSpace:'nowrap'}}>
            {demoMode?'🧪 Demo ON':'Demo'}
          </span>
        </div>
      </div>
    </nav>
    {/* Demo mode banner */}
    {demoMode&&<div style={{position:'fixed',top:56,left:0,right:0,zIndex:399,background:'#fef08a',borderBottom:'2px solid #ca8a04',padding:'6px 40px',display:'flex',alignItems:'center',gap:10}}>
      <span style={{fontSize:11,fontWeight:700,color:'#78350f',letterSpacing:'1px',textTransform:'uppercase'}}>🧪 Demo Mode Active</span>
      <span style={{fontSize:11,color:'#92400e'}}>— AI threshold set to 0. All reports will be accepted regardless of score. Toggle off for real scoring.</span>
    </div>}
  </>;
}

// ══════════════════════════════════════════════════════════
// DEMO MODE CONTEXT
// ══════════════════════════════════════════════════════════
import { createContext, useContext } from "react";
const DemoCtx = createContext(false);
const useDemoMode = () => useContext(DemoCtx);

// ══════════════════════════════════════════════════════════
// ROOT APP
// ══════════════════════════════════════════════════════════
export default function App(){
  useEffect(()=>injectGlobalCSS(),[]);
  const [screen,setScreen]=useState(SCREENS.HOME);
  const [cases,setCases]=useState(INIT_CASES);
  const [loggedStation,setLoggedStation]=useState(null);
  const [demoMode,setDemoMode]=useState(false);
  const isPolice=screen===SCREENS.POLICE&&loggedStation;

  useEffect(()=>{ window.scrollTo({top:0,behavior:'smooth'}); },[screen]);

  return (
    <DemoCtx.Provider value={demoMode}>
      <div style={{minHeight:'100vh',background:isPolice?'#0c0c14':T.paper,paddingTop:isPolice?0:64}}>
        <Nav screen={screen} setScreen={setScreen} isPolice={!!isPolice} demoMode={demoMode} setDemoMode={setDemoMode}/>
        {screen===SCREENS.HOME           &&<Home setScreen={setScreen}/>}
        {screen===SCREENS.CHOOSE         &&<Choose setScreen={setScreen}/>}
        {screen===SCREENS.WITNESS        &&<ReportForm type='witness' setCases={setCases} setScreen={setScreen}/>}
        {screen===SCREENS.VICTIM         &&<ReportForm type='victim'  setCases={setCases} setScreen={setScreen}/>}
        {screen===SCREENS.TRACK          &&<Track cases={cases}/>}
        {screen===SCREENS.STATION_LOGIN  &&<StationLogin setLoggedStation={setLoggedStation} setScreen={setScreen}/>}
        {isPolice&&<PoliceDashboard station={loggedStation} cases={cases} setCases={setCases} setScreen={setScreen}/>}
      </div>
    </DemoCtx.Provider>
  );
}
