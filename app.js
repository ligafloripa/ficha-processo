(function(){
  var IDS=['nome','tarefa','p1','p2','p3','quem'];
  var KEY='ficha-processo-v1';
  var LOGO=document.querySelector('.top img').src;
  var msg=document.getElementById('msg');
  function $(i){return document.getElementById(i)}
  function say(t){msg.textContent=t}
  function load(){try{var d=JSON.parse(localStorage.getItem(KEY)||'{}');IDS.forEach(function(i){if(d[i])$(i).value=d[i]})}catch(e){}}
  function save(){try{var d={};IDS.forEach(function(i){d[i]=$(i).value});localStorage.setItem(KEY,JSON.stringify(d))}catch(e){}}
  IDS.forEach(function(i){$(i).addEventListener('input',save)});
  load();
  $('limpar').addEventListener('click',function(){
    if($('limpar').dataset.arm!=='1'){$('limpar').dataset.arm='1';$('limpar').textContent='Toque de novo para apagar tudo';setTimeout(function(){$('limpar').dataset.arm='';$('limpar').textContent='Limpar campos'},4000);return}
    IDS.forEach(function(i){$(i).value=''});save();$('limpar').dataset.arm='';$('limpar').textContent='Limpar campos';$('prev').classList.remove('on');say('Campos limpos.');
  });
  function val(i){return $(i).value.trim()}
  function loadLogo(){return new Promise(function(res){var im=new Image();im.onload=function(){res(im)};im.onerror=function(){res(null)};im.src=LOGO})}
  async function draw(){
    var S=2,W=900,PAD=44,TW=W-2*PAD;
    var logo=await loadLogo();
    var m=document.createElement('canvas').getContext('2d');
    function lines(t,w,font){m.font=font;var out=[],cur='';(t||'').split(/\n/).forEach(function(par){cur='';par.split(/\s+/).forEach(function(wd){if(!wd)return;var tt=cur?cur+' '+wd:wd;if(m.measureText(tt).width>w&&cur){out.push(cur);cur=wd}else cur=tt});out.push(cur)});return out}
    var F='"DM Sans",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif';
    var fT='500 28px '+F, fL='700 19px '+F, fS='400 21px '+F;
    var LH=36;
    var blocks=[];
    if(val('nome'))blocks.push({k:'t',l:'Nome',t:val('nome')});
    blocks.push({k:'t',l:'Tarefa',t:val('tarefa')});
    [['Primeiro passo','p1'],['Segundo passo','p2'],['Terceiro passo','p3']].forEach(function(a,n){blocks.push({k:'s',n:n+1,l:a[0],t:val(a[1])})});
    blocks.push({k:'t',l:'Quem executa hoje?',t:val('quem')});
    var total=200+20;
    blocks.forEach(function(b){var w=b.k==='s'?TW-84-28:TW-44;b.ls=lines(b.t||' ',w,fT.replace('500','400'));b.h=Math.max(b.k==='s'?96:70,b.ls.length*LH+48);total+=b.h+34});
    var foot=lines('Em fevereiro vamos mostrar como mapear todos os seus processos. Depois de mapeado, você sabe o passo de cada execução e pode colocar tecnologia, IA ou pessoas para fazer.',TW-48,fS);
    var fh=foot.length*30+36;total+=fh+90;
    var c=document.createElement('canvas');c.width=W*S;c.height=total*S;var g=c.getContext('2d');g.scale(S,S);
    g.fillStyle='#fff';g.fillRect(0,0,W,total);
    g.fillStyle='#1b3047';g.fillRect(0,0,W,168);g.fillStyle='#f5a524';g.fillRect(0,168,W,8);
    if(logo){var lh=44,lw=lh*logo.width/logo.height;g.drawImage(logo,PAD,28,lw,lh)}
    g.fillStyle='#e6e0d3';g.font='500 54px '+F;g.fillText('Mapeie um processo',PAD,134);
    var y=220;
    blocks.forEach(function(b){
      if(b.k==='s'){
        g.fillStyle='#e6e0d3';rr(g,PAD,y,TW,b.h,16);g.fill();
        g.fillStyle='#757d8b';g.beginPath();g.arc(PAD+38,y+b.h/2,26,0,6.2832);g.fill();
        g.fillStyle='#fff';g.font='500 30px '+F;g.textAlign='center';g.fillText(String(b.n),PAD+38,y+b.h/2+11);g.textAlign='left';
        g.fillStyle='#8a6a42';g.font=fL;g.fillText(b.l.toUpperCase(),PAD+84,y+34);
        g.fillStyle='#131419';g.font=fT.replace('500','400');b.ls.forEach(function(l,i){g.fillText(l,PAD+84,y+72+i*LH)});
      }else{
        g.fillStyle='#8a6a42';g.font=fL;g.fillText(b.l.toUpperCase(),PAD,y+4);
        g.strokeStyle='#1b3047';g.lineWidth=2;rr(g,PAD,y+16,TW,b.h-16,14);g.stroke();
        g.fillStyle='#131419';g.font=fT.replace('500','400');b.ls.forEach(function(l,i){g.fillText(l,PAD+22,y+56+i*LH)});
      }
      y+=b.h+34;
    });
    y+=6;g.fillStyle='#e6e0d3';rr(g,PAD,y,TW,fh,16);g.fill();
    g.fillStyle='#1b3047';g.font=fS;foot.forEach(function(l,i){g.fillText(l,PAD+24,y+40+i*30)});
    y+=fh+44;
    g.fillStyle='#757d8b';g.font='400 19px '+F;g.fillText('Liga Floripa  ·  @Liga_Floripa  ·  26/11/2026',PAD,y);
    return c.toDataURL('image/png');
  }
  function rr(g,x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()}
  $('gerar').addEventListener('click',async function(){
    var b=$('gerar');b.disabled=true;say('Montando a ficha...');
    try{
      try{if(document.fonts&&document.fonts.ready)await document.fonts.ready}catch(e){}
      $('previmg').src=await draw();$('prev').classList.add('on');say('');
      setTimeout(function(){$('prev').scrollIntoView({behavior:'smooth',block:'start'})},60);
    }catch(e){say('Não consegui montar a ficha. Recarregue a página e tente de novo.')}
    b.disabled=false;
  });
})();
