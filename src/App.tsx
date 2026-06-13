import { useState } from 'react';
import { Dumbbell, Plus, Trash2, ChevronDown, ChevronUp, Trophy, X } from 'lucide-react';
import { format } from 'date-fns';
const AC='#ef4444';
const SAVE='wlo_v1';
interface Set { reps:number; weight:number; }
interface Exercise { name:string; sets:Set[]; }
interface Workout { id:string; date:string; name:string; exercises:Exercise[]; duration:number; }
const load=():Workout[]=>{try{return JSON.parse(localStorage.getItem(SAVE)||'[]')}catch{return[]}};
const EXERCISES=['Bench Press','Squat','Deadlift','Pull-ups','Push-ups','Shoulder Press','Bicep Curl','Tricep Dip','Lat Pulldown','Leg Press','Lunges','Plank'];
export default function App() {
  const [workouts,setWorkouts]=useState<Workout[]>(load);
  const [view,setView]=useState<'list'|'active'>('list');
  const [current,setCurrent]=useState<Workout|null>(null);
  const [expanded,setExpanded]=useState<string|null>(null);
  const save=(w:Workout[])=>{setWorkouts(w);localStorage.setItem(SAVE,JSON.stringify(w));};
  const newWorkout=()=>{const w:Workout={id:crypto.randomUUID(),date:format(new Date(),'yyyy-MM-dd'),name:'Workout '+format(new Date(),'MMM d'),exercises:[],duration:0};setCurrent(w);setView('active');};
  const finishWorkout=()=>{if(!current)return;const w=[current,...workouts];save(w);setCurrent(null);setView('list');};
  const addExercise=(name:string)=>{if(!current)return;setCurrent({...current,exercises:[...current.exercises,{name,sets:[{reps:10,weight:0}]}]});};
  const addSet=(ei:number)=>{if(!current)return;const e=[...current.exercises];e[ei]={...e[ei],sets:[...e[ei].sets,{reps:10,weight:0}]};setCurrent({...current,exercises:e});};
  const updateSet=(ei:number,si:number,field:'reps'|'weight',val:number)=>{if(!current)return;const e=[...current.exercises];e[ei].sets[si]={...e[ei].sets[si],[field]:val};setCurrent({...current,exercises:e});};
  const getPR=(name:string)=>workouts.flatMap(w=>w.exercises.filter(e=>e.name===name).flatMap(e=>e.sets)).reduce((m,s)=>Math.max(m,s.weight),0);
  const inp=(w='60px')=>({width:w,background:'#180808',border:'1px solid #2d1010',borderRadius:'8px',padding:'7px',color:'white',fontSize:'14px',fontWeight:'600',outline:'none',textAlign:'center' as const,fontFamily:'Inter'});
  if(view==='active'&&current) return (
    <div style={{minHeight:'100vh',background:'#080808',display:'flex',flexDirection:'column'}}>
      <div style={{padding:'14px 20px',borderBottom:'1px solid #1a0000',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <input value={current.name} onChange={e=>setCurrent({...current,name:e.target.value})} style={{background:'transparent',border:'none',color:'white',fontSize:'16px',fontWeight:'700',outline:'none',fontFamily:'Inter'}}/>
        <button onClick={finishWorkout} style={{padding:'8px 16px',borderRadius:'9px',background:AC,border:'none',color:'white',fontSize:'13px',fontWeight:'600',cursor:'pointer',fontFamily:'Inter'}}>Finish</button>
      </div>
      <div style={{flex:1,overflow:'auto',padding:'14px 20px',display:'flex',flexDirection:'column',gap:'10px'}}>
        {current.exercises.map((ex,ei)=>(
          <div key={ei} style={{background:'#100808',border:'1px solid #1a0000',borderRadius:'12px',padding:'14px'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'10px'}}>
              <span style={{color:'white',fontSize:'14px',fontWeight:'600'}}>{ex.name}</span>
              <div style={{fontSize:'11px',color:'#ef4444',background:'#ef444415',padding:'2px 8px',borderRadius:'4px'}}>PR: {getPR(ex.name)>0?`${getPR(ex.name)}kg`:'—'}</div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'auto 1fr 1fr auto',gap:'8px',fontSize:'11px',color:'#7f1d1d',marginBottom:'8px',padding:'0 4px'}}>
              <span>Set</span><span style={{textAlign:'center'}}>Weight(kg)</span><span style={{textAlign:'center'}}>Reps</span><span/>
            </div>
            {ex.sets.map((set,si)=>(
              <div key={si} style={{display:'grid',gridTemplateColumns:'auto 1fr 1fr auto',gap:'8px',alignItems:'center',marginBottom:'6px'}}>
                <span style={{color:'#7f1d1d',fontSize:'13px',width:'24px',textAlign:'center'}}>{si+1}</span>
                <input type="number" value={set.weight} onChange={e=>updateSet(ei,si,'weight',+e.target.value)} style={inp()} onFocus={e=>e.target.style.borderColor=AC} onBlur={e=>e.target.style.borderColor='#2d1010'}/>
                <input type="number" value={set.reps} onChange={e=>updateSet(ei,si,'reps',+e.target.value)} style={inp()} onFocus={e=>e.target.style.borderColor=AC} onBlur={e=>e.target.style.borderColor='#2d1010'}/>
                <button onClick={()=>{const e=[...current.exercises];e[ei]={...e[ei],sets:e[ei].sets.filter((_,i)=>i!==si)};setCurrent({...current,exercises:e});}} style={{padding:'6px',background:'none',border:'none',cursor:'pointer',color:'#7f1d1d'}}><X size={12}/></button>
              </div>
            ))}
            <button onClick={()=>addSet(ei)} style={{display:'flex',alignItems:'center',gap:'5px',padding:'5px 10px',borderRadius:'7px',background:'transparent',border:'1px dashed #1a0000',color:'#7f1d1d',fontSize:'12px',cursor:'pointer',fontFamily:'Inter',marginTop:'4px'}}>
              <Plus size={11}/> Add set
            </button>
          </div>
        ))}
        <div style={{background:'#100808',border:'1px dashed #1a0000',borderRadius:'12px',padding:'14px'}}>
          <div style={{fontSize:'12px',color:'#7f1d1d',fontWeight:'600',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'10px'}}>Add Exercise</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:'6px'}}>
            {EXERCISES.map(e=><button key={e} onClick={()=>addExercise(e)}
              style={{padding:'6px 12px',borderRadius:'20px',border:'1px solid #1a0000',background:'transparent',color:'#ef4444',fontSize:'12px',cursor:'pointer',fontFamily:'Inter',transition:'all 0.2s'}}
              onMouseEnter={el=>el.currentTarget.style.background='#ef444415'} onMouseLeave={el=>el.currentTarget.style.background='transparent'}>{e}</button>)}
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <div style={{minHeight:'100vh',background:'#080808',display:'flex',flexDirection:'column'}}>
      <header style={{padding:'16px 20px',borderBottom:'1px solid #1a0000',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
          <div style={{width:'36px',height:'36px',borderRadius:'10px',background:`linear-gradient(135deg,${AC},#b91c1c)`,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`0 4px 14px ${AC}30`}}><Dumbbell size={16} color="white"/></div>
          <div style={{fontWeight:'700',fontSize:'16px',color:'white'}}>Workout Log Pro</div>
        </div>
        <button onClick={newWorkout} style={{display:'flex',alignItems:'center',gap:'5px',padding:'8px 14px',borderRadius:'9px',background:AC,border:'none',color:'white',fontSize:'13px',fontWeight:'600',cursor:'pointer',fontFamily:'Inter',boxShadow:`0 4px 12px ${AC}30`}}>
          <Plus size={13}/> Start Workout
        </button>
      </header>
      <div style={{flex:1,overflow:'auto',padding:'14px 20px'}}>
        {workouts.length===0?(
          <div style={{textAlign:'center',padding:'60px 20px'}}>
            <div style={{fontSize:'52px',marginBottom:'16px'}}>💪</div>
            <h3 style={{fontSize:'20px',fontWeight:'700',color:'white',marginBottom:'8px'}}>No workouts yet</h3>
            <p style={{color:'#7f1d1d',fontSize:'14px',marginBottom:'24px',lineHeight:'1.6',maxWidth:'240px',margin:'0 auto 24px'}}>Start your first workout. Track every set. Build your personal records.</p>
            <button onClick={newWorkout} style={{padding:'12px 24px',borderRadius:'10px',background:AC,border:'none',color:'white',fontSize:'14px',fontWeight:'600',cursor:'pointer',fontFamily:'Inter',boxShadow:`0 4px 16px ${AC}30`}}>Start first workout</button>
          </div>
        ):(
          <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
            {workouts.map(w=>{
              const totalSets=w.exercises.reduce((s,e)=>s+e.sets.length,0);
              const isExp=expanded===w.id;
              return <div key={w.id} style={{background:'#100808',border:'1px solid #1a0000',borderRadius:'12px',overflow:'hidden'}}>
                <div style={{padding:'14px',display:'flex',alignItems:'center',justifyContent:'space-between',cursor:'pointer'}} onClick={()=>setExpanded(isExp?null:w.id)}>
                  <div>
                    <div style={{color:'white',fontSize:'14px',fontWeight:'500'}}>{w.name}</div>
                    <div style={{color:'#7f1d1d',fontSize:'11px',marginTop:'2px'}}>{format(new Date(w.date),'EEE MMM d')} · {w.exercises.length} exercises · {totalSets} sets</div>
                  </div>
                  <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
                    {isExp?<ChevronUp size={14} style={{color:'#7f1d1d'}}/>:<ChevronDown size={14} style={{color:'#7f1d1d'}}/>}
                    <button onClick={e=>{e.stopPropagation();save(workouts.filter(x=>x.id!==w.id));}} style={{padding:'4px',background:'none',border:'none',cursor:'pointer',color:'#7f1d1d'}}><Trash2 size={13}/></button>
                  </div>
                </div>
                {isExp&&<div style={{borderTop:'1px solid #1a0000',padding:'12px 14px',display:'flex',flexDirection:'column',gap:'8px'}}>
                  {w.exercises.map((ex,i)=>(
                    <div key={i}>
                      <div style={{color:'#ef4444',fontSize:'12px',fontWeight:'600',marginBottom:'4px'}}>{ex.name}</div>
                      <div style={{display:'flex',flexWrap:'wrap',gap:'6px'}}>
                        {ex.sets.map((s,j)=><span key={j} style={{fontSize:'12px',padding:'3px 8px',borderRadius:'6px',background:'#1a0000',color:'#fca5a5'}}>{s.weight>0?`${s.weight}kg × `:''}{s.reps} reps</span>)}
                      </div>
                    </div>
                  ))}
                </div>}
              </div>;
            })}
          </div>
        )}
      </div>
    </div>
  );
}