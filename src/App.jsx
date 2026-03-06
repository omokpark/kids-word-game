import { useState, useEffect, useRef } from "react";

function playDrum(type="tick") {
  try {
    const ctx=new(window.AudioContext||window.webkitAudioContext)();
    if(type==="tick"){
      const buf=ctx.createBuffer(1,ctx.sampleRate*0.08,ctx.sampleRate);
      const d=buf.getChannelData(0);
      for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,8);
      const src=ctx.createBufferSource();src.buffer=buf;
      const g=ctx.createGain();g.gain.setValueAtTime(0.6,0);g.gain.exponentialRampToValueAtTime(0.001,0.08);
      src.connect(g);g.connect(ctx.destination);src.start();
    } else if(type==="boom"){
      const osc=ctx.createOscillator();const g=ctx.createGain();
      osc.type="sine";osc.frequency.setValueAtTime(180,ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40,ctx.currentTime+0.3);
      g.gain.setValueAtTime(1,ctx.currentTime);g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.4);
      osc.connect(g);g.connect(ctx.destination);osc.start();osc.stop(ctx.currentTime+0.4);
    }
  } catch(e){}
}

const WORLDS=[
  {id:1,name:"Farm",label:"농장 세계",emoji:"🌾",color:"#FF9F43",
   bg:"linear-gradient(160deg,#FFF3E0 0%,#FFE0B2 100%)",
   cardBg:"#FFF8F0",accent:"#E8820C",light:"#FFF3E0",
   stages:[
     {stage:1,label:"아기 동물들",words:[
       {word:"COW",emoji:"🐄",hint:"음매~ 소",sentence:"The COW says MOO!"},
       {word:"PIG",emoji:"🐷",hint:"꿀꿀 돼지",sentence:"The PIG is pink."},
       {word:"HEN",emoji:"🐔",hint:"꼭꼭 닭",sentence:"The HEN lays eggs."},
     ]},
     {stage:2,label:"농장 친구들",words:[
       {word:"DUCK",emoji:"🦆",hint:"꽥꽥 오리",sentence:"The DUCK can swim!"},
       {word:"GOAT",emoji:"🐐",hint:"메에 염소",sentence:"The GOAT eats grass."},
       {word:"LAMB",emoji:"🐑",hint:"메에 양",sentence:"The LAMB is soft."},
     ]},
     {stage:3,label:"농장 탐험",words:[
       {word:"HORSE",emoji:"🐴",hint:"히힝 말",sentence:"The HORSE runs fast!"},
       {word:"SHEEP",emoji:"🐑",hint:"양털 양",sentence:"The SHEEP has wool."},
       {word:"CHICK",emoji:"🐥",hint:"삐약 병아리",sentence:"The CHICK is tiny."},
     ]},
   ]},
  {id:2,name:"Ocean",label:"바다 세계",emoji:"🌊",color:"#48CAE4",
   bg:"linear-gradient(160deg,#E0F7FA 0%,#B2EBF2 100%)",
   cardBg:"#F0FBFF",accent:"#0797B0",light:"#E0F7FA",
   stages:[
     {stage:1,label:"바다 친구들",words:[
       {word:"COD",emoji:"🐟",hint:"대구 물고기",sentence:"The COD lives here."},
       {word:"RAY",emoji:"🐡",hint:"가오리",sentence:"The RAY can fly!"},
       {word:"EEL",emoji:"🐍",hint:"뱀장어",sentence:"The EEL is long."},
     ]},
     {stage:2,label:"깊은 바다",words:[
       {word:"CRAB",emoji:"🦀",hint:"집게 게",sentence:"The CRAB has claws!"},
       {word:"FISH",emoji:"🐠",hint:"알록달록 물고기",sentence:"The FISH is colorful."},
       {word:"SEAL",emoji:"🦭",hint:"물개",sentence:"The SEAL loves fish."},
     ]},
     {stage:3,label:"바다 탐험",words:[
       {word:"SHARK",emoji:"🦈",hint:"무서운 상어",sentence:"The SHARK is big!"},
       {word:"WHALE",emoji:"🐋",hint:"거대한 고래",sentence:"The WHALE is huge!"},
       {word:"SQUID",emoji:"🦑",hint:"오징어",sentence:"The SQUID has arms."},
     ]},
   ]},
  {id:3,name:"Fruits",label:"과일 나라",emoji:"🍎",color:"#FF6B9D",
   bg:"linear-gradient(160deg,#FCE4EC 0%,#F8BBD0 100%)",
   cardBg:"#FFF0F5",accent:"#C9185B",light:"#FCE4EC",
   stages:[
     {stage:1,label:"달콤한 과일",words:[
       {word:"FIG",emoji:"🍈",hint:"무화과",sentence:"I like FIG jam!"},
       {word:"YAM",emoji:"🍠",hint:"고구마",sentence:"YAM is so sweet!"},
       {word:"PEA",emoji:"🫛",hint:"완두콩",sentence:"PEA is round."},
     ]},
     {stage:2,label:"과일 바구니",words:[
       {word:"PEAR",emoji:"🍐",hint:"배",sentence:"The PEAR is green."},
       {word:"PLUM",emoji:"🍑",hint:"자두",sentence:"The PLUM is soft."},
       {word:"LIME",emoji:"🍋",hint:"라임",sentence:"LIME tastes sour!"},
     ]},
     {stage:3,label:"과일 왕국",words:[
       {word:"MANGO",emoji:"🥭",hint:"망고",sentence:"I love MANGO!"},
       {word:"GRAPE",emoji:"🍇",hint:"포도",sentence:"GRAPE is purple."},
       {word:"LEMON",emoji:"🍋",hint:"레몬",sentence:"LEMON is yellow!"},
     ]},
   ]},
  {id:4,name:"Vehicles",label:"탈것 모험",emoji:"🚗",color:"#A78BFA",
   bg:"linear-gradient(160deg,#EDE9FE 0%,#DDD6FE 100%)",
   cardBg:"#F5F3FF",accent:"#6D28D9",light:"#EDE9FE",
   stages:[
     {stage:1,label:"도로 위에서",words:[
       {word:"CAR",emoji:"🚗",hint:"자동차",sentence:"The CAR is red!"},
       {word:"BUS",emoji:"🚌",hint:"버스",sentence:"I ride the BUS."},
       {word:"VAN",emoji:"🚐",hint:"밴",sentence:"The VAN is big."},
     ]},
     {stage:2,label:"하늘과 바다",words:[
       {word:"BOAT",emoji:"⛵",hint:"돛단배",sentence:"The BOAT sails fast!"},
       {word:"TRAM",emoji:"🚋",hint:"트램",sentence:"The TRAM is slow."},
       {word:"JEEP",emoji:"🚙",hint:"지프차",sentence:"The JEEP is strong."},
     ]},
     {stage:3,label:"대모험 출발!",words:[
       {word:"TRAIN",emoji:"🚂",hint:"기차",sentence:"The TRAIN is fast!"},
       {word:"PLANE",emoji:"✈️",hint:"비행기",sentence:"The PLANE flies high!"},
       {word:"TRUCK",emoji:"🚚",hint:"트럭",sentence:"The TRUCK is heavy."},
     ]},
   ]},
];

const QWERTY=[
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L"],
  ["Z","X","C","V","B","N","M"],
];

function speak(text,mode="word"){
  if(!("speechSynthesis" in window))return;
  window.speechSynthesis.cancel();
  const voices=window.speechSynthesis.getVoices();
  const preferred=voices.find(v=>v.lang==="en-US"&&/female|zira|samantha|karen|victoria|susan/i.test(v.name))
    ||voices.find(v=>v.lang==="en-US")||voices[0];
  const u=new SpeechSynthesisUtterance(text);
  u.lang="en-US";
  if(mode==="word"){u.rate=0.55;u.pitch=1.4;}
  if(mode==="letter"){u.rate=0.7;u.pitch=1.3;}
  if(mode==="cheer"){u.rate=0.8;u.pitch=1.5;}
  if(mode==="sentence"){u.rate=0.6;u.pitch=1.3;}
  if(preferred)u.voice=preferred;
  window.speechSynthesis.speak(u);
}
if("speechSynthesis" in window){
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged=()=>window.speechSynthesis.getVoices();
}

function SentenceDisplay({sentence,keyword,accent}){
  const parts=sentence.split(new RegExp(`(${keyword})`,"gi"));
  return(
    <div style={{fontSize:"1.7rem",fontWeight:900,lineHeight:1.7,color:"#333",letterSpacing:1}}>
      {parts.map((p,i)=>
        p.toUpperCase()===keyword.toUpperCase()
          ?<span key={i} style={{color:accent,background:accent+"22",borderRadius:10,padding:"0 8px"}}>{p}</span>
          :<span key={i}>{p}</span>
      )}
    </div>
  );
}

function Stars({n,size="1.8rem"}){
  return(
    <div style={{display:"flex",gap:6,justifyContent:"center"}}>
      {[1,2,3].map(i=>(
        <span key={i} style={{fontSize:size,filter:i<=n?"none":"grayscale(1) opacity(0.25)"}} >⭐</span>
      ))}
    </div>
  );
}

function FloatingStars(){
  return(
    <div style={{position:"fixed",top:0,left:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:200}}>
      {Array.from({length:24}).map((_,i)=>(
        <span key={i} style={{position:"absolute",fontSize:`${1.2+Math.random()*2.2}rem`,top:`${10+Math.random()*75}%`,left:`${Math.random()*92}%`,animation:`floatUp ${0.7+Math.random()*0.9}s ease-out forwards`,animationDelay:`${i*0.04}s`}}>
          {["⭐","✨","🌟","💫"][i%4]}
        </span>
      ))}
    </div>
  );
}

function TapButton({onClick,children,style={},bg,color="#fff",shadow}){
  return(
    <button
      style={{border:"none",borderRadius:999,cursor:"pointer",fontWeight:900,WebkitTapHighlightColor:"transparent",userSelect:"none",touchAction:"manipulation",transition:"transform 0.12s",background:bg||"linear-gradient(135deg,#a78bfa,#7c3aed)",color,boxShadow:shadow||"0 6px 20px rgba(0,0,0,0.1)",padding:"15px 36px",fontSize:"1.2rem",...style}}
      onPointerDown={e=>e.currentTarget.style.transform="scale(0.93)"}
      onPointerUp={e=>{e.currentTarget.style.transform="scale(1)";onClick&&onClick();}}
      onPointerCancel={e=>e.currentTarget.style.transform="scale(1)"}
    >{children}</button>
  );
}

// -- 이름 입력 --
function NameEntry({onStart}){
  const [name,setName]=useState("");
  return(
    <div style={{textAlign:"center",maxWidth:400,width:"100%",padding:"0 8px"}}>
      <div style={{fontSize:"5rem",animation:"bounce 1.5s ease-in-out infinite",display:"inline-block",marginBottom:8}}>
        <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
          <ellipse cx="45" cy="32" rx="28" ry="30" fill="#2C1810"/>
          <ellipse cx="45" cy="28" rx="22" ry="22" fill="#2C1810"/>
          <ellipse cx="18" cy="30" rx="8" ry="10" fill="#2C1810"/>
          <ellipse cx="72" cy="30" rx="8" ry="10" fill="#2C1810"/>
          <ellipse cx="45" cy="46" rx="22" ry="24" fill="#FDDBB4"/>
          <ellipse cx="37" cy="44" rx="4" ry="3" fill="#2C1810"/>
          <ellipse cx="53" cy="44" rx="4" ry="3" fill="#2C1810"/>
          <circle cx="38.5" cy="43" r="1.2" fill="white"/>
          <circle cx="54.5" cy="43" r="1.2" fill="white"/>
          <ellipse cx="33" cy="50" rx="5" ry="3" fill="#FFB3B3" opacity="0.6"/>
          <ellipse cx="57" cy="50" rx="5" ry="3" fill="#FFB3B3" opacity="0.6"/>
          <path d="M39 55 Q45 60 51 55" stroke="#E07070" strokeWidth="2" strokeLinecap="round" fill="none"/>
          <ellipse cx="18" cy="28" rx="6" ry="4" fill="#FF6B9D" transform="rotate(-20 18 28)"/>
          <ellipse cx="18" cy="28" rx="6" ry="4" fill="#FF6B9D" transform="rotate(20 18 28)"/>
          <circle cx="18" cy="28" r="3" fill="#FF9EC4"/>
        </svg>
      </div>
      <div style={{fontSize:"2.2rem",fontWeight:900,color:"#3D2C8D",marginBottom:8}}>
        안녕! 나는 누구? 🌟
      </div>
      <div style={{color:"#64748B",fontSize:"1.15rem",marginBottom:28,fontWeight:600}}>이름을 알려줘요 😊</div>
      <input
        value={name} onChange={e=>setName(e.target.value)}
        onKeyDown={e=>e.key==="Enter"&&name.trim()&&onStart(name.trim())}
        placeholder="이름을 입력하세요" maxLength={10}
        style={{width:"100%",padding:"18px 22px",fontSize:"1.5rem",fontWeight:900,borderRadius:999,border:"3px solid rgba(255,255,255,0.7)",background:"rgba(255,255,255,0.95)",color:"#333",textAlign:"center",outline:"none",marginBottom:18,boxSizing:"border-box",fontFamily:"-apple-system,'Segoe UI',sans-serif",boxShadow:"0 4px 20px rgba(0,0,0,0.08)"}}
        autoFocus
      />
      <TapButton
        onClick={()=>name.trim()&&onStart(name.trim())}
        bg={name.trim()?"linear-gradient(135deg,#f9a8d4,#f472b6)":"rgba(200,200,200,0.5)"}
        color={name.trim()?"white":"#aaa"}
        style={{width:"100%",borderRadius:999,fontSize:"1.3rem",padding:"16px"}}
        shadow="0 8px 24px rgba(244,114,182,0.35)"
      >시작하기 🚀</TapButton>
    </div>
  );
}

// -- 월드 맵 --
function WorldSelect({progress,onSelect,name}){
  return(
    <div style={{width:"100%",maxWidth:560,padding:"0 4px"}}>
      <div style={{textAlign:"center",marginBottom:24}}>
        <div style={{fontSize:"2.6rem",fontWeight:900,color:"#3D2C8D"}}>🌍 World Map</div>
        <div style={{color:"#64748B",fontSize:"1.15rem",marginTop:6,fontWeight:700}}>{name}의 세계 탐험 🗺️</div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        {WORLDS.map((w,wi)=>{
          const wp=progress[w.id]||{};
          const locked=wi>0&&!(progress[WORLDS[wi-1].id]?.[3]!==undefined);
          return(
            <button key={w.id}
              style={{background:locked?"rgba(255,255,255,0.5)":"white",border:`3px solid ${locked?"#e5e7eb":w.accent+"55"}`,borderRadius:28,padding:"18px 22px",cursor:locked?"not-allowed":"pointer",display:"flex",alignItems:"center",gap:16,boxShadow:locked?"none":`0 6px 24px ${w.accent}33`,opacity:locked?0.6:1,WebkitTapHighlightColor:"transparent",touchAction:"manipulation",transition:"transform 0.12s"}}
              onPointerDown={e=>!locked&&(e.currentTarget.style.transform="scale(0.97)")}
              onPointerUp={e=>{e.currentTarget.style.transform="scale(1)";if(!locked)onSelect(w.id);}}
              onPointerCancel={e=>e.currentTarget.style.transform="scale(1)"}
            >
              <div style={{width:64,height:64,borderRadius:20,background:locked?"#f3f4f6":w.accent+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"2.6rem",flexShrink:0}}>
                {locked?"🔒":w.emoji}
              </div>
              <div style={{flex:1,textAlign:"left"}}>
                <div style={{fontWeight:900,fontSize:"1.2rem",color:locked?"#bbb":w.accent}}>World {w.id} — {w.name}</div>
                <div style={{color:"#94A3B8",fontSize:"0.95rem",marginTop:2,fontWeight:600}}>{w.label}</div>
                <div style={{display:"flex",gap:6,marginTop:8}}>
                  {[1,2,3].map(s=>(
                    <span key={s} style={{fontSize:"0.85rem",fontWeight:700,background:wp[s]!==undefined?w.accent+"22":"#f5f5f5",borderRadius:999,padding:"3px 10px",color:wp[s]!==undefined?w.accent:"#ccc"}}>
                      {wp[s]!==undefined?`S${s} ${"⭐".repeat(wp[s])}`:`S${s}`}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// -- 스테이지 선택 --
function StageSelect({world,progress,onSelect,onBack}){
  const wp=progress[world.id]||{};
  return(
    <div style={{width:"100%",maxWidth:520}}>
      <TapButton onClick={onBack} bg="rgba(255,255,255,0.7)" color="#3D2C8D" style={{marginBottom:22,borderRadius:999,padding:"10px 22px",fontSize:"1rem",border:"2px solid rgba(255,255,255,0.9)",boxShadow:"none"}}>
        ← 월드 맵
      </TapButton>
      <div style={{textAlign:"center",marginBottom:22}}>
        <div style={{fontSize:"4.5rem",animation:"bounce 2s ease-in-out infinite",display:"inline-block"}}>{world.emoji}</div>
        <div style={{fontSize:"1.9rem",fontWeight:900,color:"#3D2C8D",marginTop:4}}>{world.name}</div>
        <div style={{color:"#64748B",fontSize:"1.05rem",fontWeight:600}}>{world.label}</div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        {world.stages.map((st,si)=>{
          const locked=si>0&&wp[si]===undefined;
          const stars=wp[st.stage];
          return(
            <button key={st.stage}
              style={{background:locked?"rgba(255,255,255,0.5)":"white",border:`3px solid ${locked?"#e5e7eb":world.accent+"44"}`,borderRadius:24,padding:"18px 22px",cursor:locked?"not-allowed":"pointer",display:"flex",alignItems:"center",gap:14,boxShadow:locked?"none":`0 6px 20px ${world.accent}28`,opacity:locked?0.6:1,WebkitTapHighlightColor:"transparent",touchAction:"manipulation"}}
              onPointerDown={e=>!locked&&(e.currentTarget.style.transform="scale(0.97)")}
              onPointerUp={e=>{e.currentTarget.style.transform="scale(1)";if(!locked)onSelect(st.stage);}}
              onPointerCancel={e=>e.currentTarget.style.transform="scale(1)"}
            >
              <div style={{width:56,height:56,borderRadius:18,flexShrink:0,background:locked?"#f3f4f6":world.accent+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:locked?"1.8rem":"1.4rem",fontWeight:900,color:locked?"#ccc":world.accent}}>
                {locked?"🔒":`${st.stage}단계`}
              </div>
              <div style={{flex:1,textAlign:"left"}}>
                <div style={{fontWeight:900,fontSize:"1.15rem",color:locked?"#bbb":world.accent}}>{st.label}</div>
                <div style={{color:"#94A3B8",fontSize:"0.9rem",marginTop:2,fontWeight:600}}>{st.words.length}개 단어</div>
              </div>
              {stars!==undefined&&<Stars n={stars} size="1.4rem"/>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// -- 게임 플레이 --
function GamePlay({world,stage,onClear,onBack,name}){
  const words=stage.words;
  const [wi,setWi]=useState(0);
  const [typed,setTyped]=useState([]);
  const [phase,setPhase]=useState("show");
  const [wrong,setWrong]=useState(false);
  const [shakeBtn,setShakeBtn]=useState(null);
  const [mistakes,setMistakes]=useState(0);
  const [burst,setBurst]=useState(false);
  const [countdown,setCountdown]=useState(null);
  const shownRef=useRef(false);
  const current=words[wi];
  const prog=(typed.length/current.word.length)*100;
  const {accent,cardBg,light}=world;

  useEffect(()=>{
    if(phase==="show"&&!shownRef.current){shownRef.current=true;speak(current.word,"word");}
  },[phase,current]);

  function startTyping(){setPhase("type");setTyped([]);speak(current.word,"word");}

  function handleLetter(l){
    if(phase!=="type")return;
    if(l===current.word[typed.length]){
      const nt=[...typed,l];setTyped(nt);speak(l,"letter");
      if(nt.length===current.word.length){
        setPhase("counting");
        ["3","2","1","🎉"].forEach((v,i)=>setTimeout(()=>{setCountdown(v);playDrum(v==="🎉"?"boom":"tick");},i*500));
        setTimeout(()=>{setCountdown(null);setPhase("done");setBurst(true);speak(current.word,"word");setTimeout(()=>setBurst(false),1800);},2100);
      }
    } else {
      setMistakes(m=>m+1);setWrong(true);setShakeBtn(l);speak("Try again!","cheer");
      setTimeout(()=>{setWrong(false);setShakeBtn(null);},500);
    }
  }

  function goNext(){
    if(wi+1<words.length){setWi(wi+1);setTyped([]);setPhase("show");shownRef.current=false;}
    else onClear(mistakes===0?3:mistakes<=3?2:1);
  }

  return(
    <div style={{width:"100%",maxWidth:540,display:"flex",flexDirection:"column",gap:0}}>
      {burst&&<FloatingStars/>}

      {/* 상단 바 */}
      <div style={{display:"flex",alignItems:"center",marginBottom:14,gap:10}}>
        <TapButton onClick={onBack} bg="rgba(255,255,255,0.75)" color="#3D2C8D" style={{borderRadius:999,padding:"10px 18px",fontSize:"1rem",boxShadow:"none",border:"2px solid rgba(255,255,255,0.9)"}}>
          ← 뒤로
        </TapButton>
        <div style={{flex:1,textAlign:"center",color:"#3D2C8D",fontWeight:900,fontSize:"1.1rem"}}>
          {world.emoji} {world.name} · {stage.stage}단계
        </div>
        <div style={{background:"rgba(255,255,255,0.75)",borderRadius:999,padding:"8px 16px",color:"#3D2C8D",fontWeight:900,fontSize:"1rem",border:"2px solid rgba(255,255,255,0.9)"}}>
          {wi+1}/{words.length}
        </div>
      </div>

      {/* 메인 카드 */}
      <div style={{background:cardBg,borderRadius:36,padding:"28px 22px 24px",boxShadow:`0 20px 60px ${accent}28,0 4px 16px rgba(0,0,0,0.06)`,border:`3px solid ${accent}33`,textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-30,right:-30,width:100,height:100,borderRadius:"50%",background:accent+"14",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:-20,left:-20,width:80,height:80,borderRadius:"50%",background:accent+"10",pointerEvents:"none"}}/>

        {/* 카운트다운 */}
        {countdown!==null&&(
          <div style={{position:"absolute",inset:0,borderRadius:34,background:accent+"EE",display:"flex",alignItems:"center",justifyContent:"center",zIndex:10}}>
            <span key={countdown} style={{fontSize:countdown==="🎉"?"6rem":"8rem",fontWeight:900,color:"white",textShadow:"0 4px 24px rgba(0,0,0,0.2)",display:"inline-block",animation:"popBig 0.25s ease-out"}}>
              {countdown}
            </span>
          </div>
        )}

        {/* 이모지 */}
        <div className="emoji-float" style={{fontSize:"8rem",lineHeight:1,marginBottom:4,cursor:"pointer",WebkitTapHighlightColor:"transparent",display:"inline-block"}} onPointerUp={()=>speak(current.word,"word")}>
          {current.emoji}
        </div>

        {/* 힌트 태그 */}
        <div style={{display:"inline-block",background:accent+"18",borderRadius:999,padding:"6px 18px",fontSize:"1rem",fontWeight:700,color:accent,marginBottom:20}}>
          {current.hint}
        </div>

        {/* 글자 박스 */}
        {phase!=="sentence"&&(
          <div style={{display:"flex",justifyContent:"center",gap:10,marginBottom:16}}>
            {current.word.split("").map((ch,i)=>{
              const done=phase==="show"||phase==="counting"||phase==="done"||i<typed.length;
              const isNext=phase==="type"&&i===typed.length;
              return(
                <div key={i} style={{width:60,height:68,border:`3px solid ${done?accent:isNext?accent+"88":"#e5e7eb"}`,borderRadius:18,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"2.4rem",fontWeight:900,color:accent,background:done?accent+"18":isNext?accent+"0A":"white",boxShadow:done?`0 4px 12px ${accent}28`:"none",transition:"all 0.25s"}}>
                  {done?ch:""}
                </div>
              );
            })}
          </div>
        )}

        {/* 스펠 힌트 + 진행바 */}
        {phase==="type"&&(
          <>
            <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:14}}>
              {current.word.split("").map((ch,i)=>{
                const done=i<typed.length;const isNext=i===typed.length;
                return(
                  <div key={i} style={{width:42,height:42,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.3rem",fontWeight:900,background:done?"#d1fae5":isNext?accent+"22":light,color:done?"#059669":isNext?accent:"#bbb",border:`2.5px solid ${done?"#6ee7b7":isNext?accent:"#e5e7eb"}`,transition:"all 0.25s",boxShadow:isNext?`0 3px 10px ${accent}33`:"none"}}>
                    {ch}
                  </div>
                );
              })}
            </div>
            <div style={{background:"#f3f4f6",borderRadius:999,height:10,marginBottom:16,overflow:"hidden",border:`2px solid ${accent}22`}}>
              <div style={{width:`${prog}%`,height:"100%",background:`linear-gradient(90deg,${accent}88,${accent})`,borderRadius:999,transition:"width 0.3s"}}/>
            </div>
          </>
        )}

        {/* SHOW */}
        {phase==="show"&&(
          <div style={{paddingBottom:4}}>
            <p style={{color:"#94A3B8",fontWeight:700,marginBottom:18,fontSize:"1.05rem"}}>🔊 잘 듣고 따라해 봐요!</p>
            <TapButton onClick={startTyping} bg={`linear-gradient(135deg,${accent}CC,${accent})`} shadow={`0 8px 24px ${accent}44`} style={{width:"100%",borderRadius:999,fontSize:"1.25rem",padding:"16px"}}>
              타이핑 해볼게요! ✏️
            </TapButton>
          </div>
        )}

        {/* TYPE */}
        {phase==="type"&&(
          <div>
            <p style={{color:"#94A3B8",fontWeight:700,fontSize:"1rem",marginBottom:12}}>📝 순서대로 눌러보세요!</p>
            <div style={{display:"flex",flexDirection:"column",gap:7,alignItems:"center",width:"100%"}}>
              {QWERTY.map((row,ri)=>(
                <div key={ri} style={{display:"flex",gap:5,justifyContent:"center",width:"100%"}}>
                  {row.map(l=>{
                    const isNext=l===current.word[typed.length];
                    const isShake=shakeBtn===l;
                    return(
                      <button key={l}
                        style={{width:44,height:48,border:`2.5px solid ${isNext?accent:wrong&&isShake?"#fca5a5":"#e5e7eb"}`,borderRadius:14,fontSize:"1.1rem",fontWeight:900,cursor:"pointer",background:isNext?accent+"18":wrong&&isShake?"#fee2e2":"white",color:isNext?accent:"#555",animation:isShake?"shake 0.3s":"none",boxShadow:isNext?`0 4px 12px ${accent}44`:"0 2px 4px rgba(0,0,0,0.05)",WebkitTapHighlightColor:"transparent",touchAction:"manipulation",transition:"background 0.15s"}}
                        onPointerDown={e=>e.currentTarget.style.transform="scale(0.88)"}
                        onPointerUp={e=>{e.currentTarget.style.transform="scale(1)";handleLetter(l);}}
                        onPointerCancel={e=>e.currentTarget.style.transform="scale(1)"}
                      >{l}</button>
                    );
                  })}
                </div>
              ))}
            </div>
            <button style={{marginTop:14,background:"none",border:`2.5px solid ${accent}`,borderRadius:999,padding:"10px 24px",color:accent,fontSize:"1rem",cursor:"pointer",fontWeight:800,WebkitTapHighlightColor:"transparent"}}
              onPointerUp={()=>speak(current.word,"word")}>🔊 다시 듣기</button>
          </div>
        )}

        {/* DONE */}
        {phase==="done"&&(
          <div style={{paddingBottom:4,animation:"popIn 0.4s ease-out"}}>
            <div style={{fontSize:"3.5rem",marginBottom:6,animation:"bounce 0.8s ease-in-out 3"}}>🎉</div>
            <div style={{color:accent,fontSize:"1.8rem",fontWeight:900,marginBottom:4}}>{name} 최고! 🌟</div>
            <div style={{display:"inline-block",background:accent+"18",borderRadius:999,padding:"6px 20px",fontSize:"1.05rem",fontWeight:700,color:accent,marginBottom:22}}>
              <strong>{current.word}</strong> 완성!
            </div>
            <div style={{display:"flex",justifyContent:"center",gap:12,flexWrap:"wrap"}}>
              <TapButton bg="white" color={accent} style={{borderRadius:999,padding:"13px 22px",fontSize:"1rem",border:`2.5px solid ${accent}`,boxShadow:`0 4px 14px ${accent}28`}} onClick={()=>speak(current.word,"word")}>
                🔊 다시 듣기
              </TapButton>
              <TapButton bg={`linear-gradient(135deg,${accent}CC,${accent})`} shadow={`0 6px 20px ${accent}44`} style={{borderRadius:999,padding:"13px 26px",fontSize:"1.05rem"}} onClick={()=>{setPhase("sentence");speak(current.sentence,"sentence");}}>
                ✨ 문장 보기
              </TapButton>
            </div>
          </div>
        )}

        {/* SENTENCE */}
        {phase==="sentence"&&(
          <div style={{animation:"popIn 0.4s ease-out"}}>
            <div style={{background:`linear-gradient(135deg,${accent}15,${accent}08)`,borderRadius:24,padding:"22px 18px",marginBottom:20,border:`2.5px solid ${accent}33`}}>
              <div style={{fontSize:"1rem",fontWeight:700,color:"#94A3B8",marginBottom:10}}>✨ 문장으로 만나요!</div>
              <SentenceDisplay sentence={current.sentence} keyword={current.word} accent={accent}/>
            </div>
            <div style={{display:"flex",justifyContent:"center",gap:12,flexWrap:"wrap"}}>
              <TapButton bg="white" color={accent} style={{borderRadius:999,padding:"13px 22px",fontSize:"1rem",border:`2.5px solid ${accent}`,boxShadow:`0 4px 14px ${accent}28`}} onClick={()=>speak(current.sentence,"sentence")}>
                🔊 다시 듣기
              </TapButton>
              <TapButton bg={`linear-gradient(135deg,${accent}CC,${accent})`} shadow={`0 6px 20px ${accent}44`} style={{borderRadius:999,padding:"13px 26px",fontSize:"1.05rem"}} onClick={goNext}>
                {wi+1<words.length?"다음 단어 →":"스테이지 완료! 🏆"}
              </TapButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// -- 스테이지 클리어 --
function StageClear({world,stage,stars,name,onNext,onWorldMap}){
  const {accent}=world;
  return(
    <div style={{textAlign:"center",maxWidth:420,width:"100%",padding:"0 8px"}}>
      <div style={{fontSize:"6rem",animation:"bounce 1s ease-in-out infinite",display:"inline-block",marginBottom:8}}>🏆</div>
      <div style={{fontSize:"2.4rem",fontWeight:900,color:"#3D2C8D",marginBottom:6}}>Stage Clear!</div>
      <div style={{color:"#64748B",fontSize:"1.1rem",fontWeight:700,marginBottom:24}}>
        {world.name} · {stage.stage}단계 — {stage.label}
      </div>
      <div style={{background:"rgba(255,255,255,0.75)",borderRadius:28,padding:"26px",marginBottom:26,border:"2px solid rgba(255,255,255,0.9)"}}>
        <div style={{fontSize:"1rem",fontWeight:700,marginBottom:12,color:"#64748B"}}>획득 별</div>
        <Stars n={stars} size="2.6rem"/>
        <div style={{marginTop:14,fontSize:"1.2rem",fontWeight:900,color:"#3D2C8D"}}>
          {stars===3?`${name}, 완벽해요! 실수 없음 🌟`:stars===2?`${name}, 훌륭해요! 조금만 더!`:`${name}, 잘했어요! 다시 도전해봐요!`}
        </div>
      </div>
      <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
        <TapButton onClick={onWorldMap} bg="rgba(255,255,255,0.75)" color="#3D2C8D" style={{borderRadius:999,padding:"14px 26px",fontSize:"1rem",border:"2px solid rgba(255,255,255,0.9)",boxShadow:"none"}}>
          🗺️ 월드 맵
        </TapButton>
        {onNext&&(
          <TapButton onClick={onNext} bg={`linear-gradient(135deg,${accent}CC,${accent})`} color="white" style={{borderRadius:999,padding:"14px 26px",fontSize:"1rem",fontWeight:900,boxShadow:`0 6px 20px ${accent}44`}}>
            다음 스테이지 →
          </TapButton>
        )}
      </div>
    </div>
  );
}

// -- MAIN --
export default function App(){
  const [screen,setScreen]=useState("name");
  const [playerName,setPlayerName]=useState("");
  const [selWorld,setSelWorld]=useState(null);
  const [selStage,setSelStage]=useState(null);
  const [clearStars,setClearStars]=useState(0);
  const [progress,setProgress]=useState({});

  const world=selWorld?WORLDS.find(w=>w.id===selWorld):null;
  const stage=(world&&selStage)?world.stages.find(s=>s.stage===selStage):null;
  const bg=world?.bg||"linear-gradient(160deg,#EDE9FE 0%,#DDD6FE 100%)";

  function handleClear(stars){
    setProgress(p=>({...p,[selWorld]:{...(p[selWorld]||{}),[selStage]:Math.max(stars,p[selWorld]?.[selStage]??0)}}));
    setClearStars(stars);setScreen("clear");
  }
  function nextStage(){
    const n=selStage+1;
    if(n<=3){setSelStage(n);setScreen("play");}
    else{
      const ni=WORLDS.findIndex(w=>w.id===selWorld)+1;
      if(ni<WORLDS.length){setSelWorld(WORLDS[ni].id);setSelStage(1);setScreen("play");}
      else setScreen("world");
    }
  }
  const hasNext=selStage<3||WORLDS.findIndex(w=>w.id===selWorld)<WORLDS.length-1;

  return(
    <div style={{minHeight:"100svh",background:bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"-apple-system,'Segoe UI',sans-serif",padding:"20px 16px",transition:"background 0.8s ease",boxSizing:"border-box"}}>
      <style>{`
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
        @keyframes floatUp{0%{opacity:1;transform:translateY(0) scale(1)}100%{opacity:0;transform:translateY(-160px) scale(1.6)}}
        @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-7px)}75%{transform:translateX(7px)}}
        @keyframes emojiFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
        @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes popIn{0%{opacity:0;transform:scale(0.7)}70%{transform:scale(1.1)}100%{opacity:1;transform:scale(1)}}
        @keyframes popBig{0%{opacity:0;transform:scale(0.5)}70%{transform:scale(1.2)}100%{opacity:1;transform:scale(1)}}
        .emoji-float{animation:emojiFloat 2.4s ease-in-out infinite;display:inline-block;}
      `}</style>
      {screen==="name"  &&<NameEntry onStart={n=>{setPlayerName(n);setScreen("world");}}/>}
      {screen==="world" &&<WorldSelect progress={progress} onSelect={id=>{setSelWorld(id);setScreen("stage");}} name={playerName}/>}
      {screen==="stage" &&world&&<StageSelect world={world} progress={progress} onSelect={n=>{setSelStage(n);setScreen("play");}} onBack={()=>setScreen("world")}/>}
      {screen==="play"  &&world&&stage&&<GamePlay world={world} stage={stage} onClear={handleClear} onBack={()=>setScreen("stage")} name={playerName}/>}
      {screen==="clear" &&world&&stage&&<StageClear world={world} stage={stage} stars={clearStars} name={playerName} onNext={hasNext?nextStage:null} onWorldMap={()=>setScreen("world")}/>}
    </div>
  );
}
