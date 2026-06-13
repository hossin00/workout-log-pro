import { useState } from 'react';
const SLIDES=[{"accent": "#ef4444", "icon": "\ud83d\udcaa", "title": "Log every set\nand rep", "desc": "Track exercises, sets, reps, and weight. Build your complete workout history."}, {"accent": "#dc2626", "icon": "\ud83d\udcc8", "title": "Track your\npersonal records", "desc": "Automatic PR tracking for every exercise. Celebrate every new record."}, {"accent": "#b91c1c", "icon": "\ud83d\udcc5", "title": "Full workout\nhistory", "desc": "Review any past workout and compare progress over time."}];
export function Onboarding({ onDone }: { onDone: () => void }) {
  const [idx,setIdx]=useState(0);
  const slide=SLIDES[idx];
  return (
    <div style={{minHeight:'100vh',display:'flex',flexDirection:'column',background:'#08080f',position:'relative'}}>
      <div style={{position:'absolute',top:'-10%',left:'50%',transform:'translateX(-50%)',width:'350px',height:'350px',borderRadius:'50%',background:slide.accent+'0a',filter:'blur(80px)',pointerEvents:'none'}}/>
      <div style={{padding:'20px 24px',display:'flex',justifyContent:'flex-end'}}>
        <button onClick={onDone} style={{color:'#ef444450',fontSize:'14px',background:'none',border:'none',cursor:'pointer',fontFamily:'Inter'}}>Skip</button>
      </div>
      <div key={idx} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'20px 32px',textAlign:'center',animation:'sIn .35s ease'}}>
        <div style={{width:'100px',height:'100px',borderRadius:'28px',background:slide.accent+'15',border:`1px solid ${slide.accent}30`,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'28px',fontSize:'52px'}}>{slide.icon}</div>
        <h2 style={{fontFamily:'Inter',fontWeight:'700',fontSize:'28px',lineHeight:'1.2',color:'white',marginBottom:'14px',whiteSpace:'pre-line'}}>{slide.title}</h2>
        <p style={{color:'#ef444470',fontSize:'14px',lineHeight:'1.7',maxWidth:'270px'}}>{slide.desc}</p>
      </div>
      <div style={{padding:'14px 24px 44px'}}>
        <div style={{display:'flex',justifyContent:'center',gap:'8px',marginBottom:'18px'}}>
          {SLIDES.map((_,i)=><button key={i} onClick={()=>setIdx(i)} style={{width:i===idx?'24px':'6px',height:'6px',borderRadius:'3px',background:i===idx?slide.accent:'#ffffff15',border:'none',cursor:'pointer',padding:0,transition:'all .3s'}}/>)}
        </div>
        <button onClick={()=>idx===SLIDES.length-1?onDone():setIdx(idx+1)} style={{width:'100%',padding:'16px',background:slide.accent,color:'white',border:'none',borderRadius:'14px',fontSize:'16px',fontWeight:'600',cursor:'pointer',fontFamily:'Inter',boxShadow:`0 8px 24px ${slide.accent}40`}}>
          {idx===SLIDES.length-1?'Get started →':'Continue'}
        </button>
      </div>
      <style>{`@keyframes sIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}`}</style>
    </div>
  );
}
