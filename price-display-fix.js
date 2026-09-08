/* Nzinga Creatives — preços regionais estáveis
   Mantém cada preço com uma base original em AOA e calcula a moeda de exibição
   sempre a partir dessa base. Isto evita conversões repetidas quando o país muda.
*/
(()=>{'use strict';
const COUNTRY='nzinga-country';
const BASE='data-nzinga-base-aoa';
const CURRENCY={
 AO:{code:'AOA',locale:'pt-AO',symbol:'Kz',rate:1},
 PT:{code:'EUR',locale:'pt-PT',symbol:'€',rate:1/1100},
 BR:{code:'BRL',locale:'pt-BR',symbol:'R$',rate:1/180},
 MZ:{code:'MZN',locale:'pt-MZ',symbol:'MT',rate:1/17},
 FR:{code:'EUR',locale:'en-FR',symbol:'€',rate:1/1100},
 BE:{code:'EUR',locale:'en-BE',symbol:'€',rate:1/1100},
 CH:{code:'CHF',locale:'en-CH',symbol:'CHF',rate:1/1250},
 CA:{code:'CAD',locale:'en-CA',symbol:'CA$',rate:1/670},
 ES:{code:'EUR',locale:'en-ES',symbol:'€',rate:1/1100},
 AR:{code:'ARS',locale:'en-AR',symbol:'AR$',rate:1/0.8},
 MX:{code:'MXN',locale:'en-MX',symbol:'MX$',rate:1/53},
 CO:{code:'COP',locale:'en-CO',symbol:'$',rate:1/0.23},
 CL:{code:'CLP',locale:'en-CL',symbol:'$',rate:1/1.02},
 IT:{code:'EUR',locale:'en-IT',symbol:'€',rate:1/1100},
 SM:{code:'EUR',locale:'en-SM',symbol:'€',rate:1/1100},
 VA:{code:'EUR',locale:'en-VA',symbol:'€',rate:1/1100}
};
let busy=false,timer=0;
function country(){return localStorage.getItem(COUNTRY)||'AO'}
function parseBase(text){
 const m=String(text||'').match(/(?<![\d.,])([\d][\d\s.,]*)\s*(?:Kz|AOA)\b/i);
 if(!m)return null;
 const n=m[1].replace(/\s/g,'').replace(/\.(?=\d{3}(?:\D|$))/g,'').replace(/,(?=\d{3}(?:\D|$))/g,'');
 const v=Number(n);
 return Number.isFinite(v)&&v>0?v:null;
}
function remember(root=document){
 root.querySelectorAll?.('body *').forEach(el=>{
   if(el.children.length) return;
   if(el.hasAttribute(BASE)) return;
   const v=parseBase(el.textContent);
   if(v!==null) el.setAttribute(BASE,String(v));
 });
}
function format(base,c){
 if(c.code==='AOA') return `${new Intl.NumberFormat('pt-AO',{maximumFractionDigits:0}).format(base)} Kz`;
 let value=base*c.rate;
 if(!Number.isFinite(value)) value=0;
 return new Intl.NumberFormat(c.locale,{style:'currency',currency:c.code,maximumFractionDigits:0,minimumFractionDigits:0}).format(value);
}
function render(){
 if(busy)return; busy=true;
 try{
   remember();
   const c=CURRENCY[country()]||CURRENCY.AO;
   document.querySelectorAll(`[${BASE}]`).forEach(el=>{
     const base=Number(el.getAttribute(BASE));
     if(!Number.isFinite(base))return;
     const original=el.textContent;
     const price=format(base,c);
     const m=original.match(/(.*?)(\d[\d\s.,]*\s*(?:Kz|AOA|€|R\$|MT|CHF|CA\$|AR\$|MX\$|COP|CLP)?)(.*)/i);
     el.textContent=m?`${m[1]}${price}${m[3]}`:price;
   });
 }finally{busy=false}
}
function schedule(){clearTimeout(timer);timer=setTimeout(render,0)}
function boot(){
 remember(); render();
 new MutationObserver(m=>{
   let relevant=false;
   m.forEach(x=>{x.addedNodes.forEach(n=>{if(n.nodeType===1){remember(n);relevant=true}});if(x.type==='childList')relevant=true});
   if(relevant)schedule();
 }).observe(document.body,{childList:true,subtree:true});
 window.addEventListener('storage',e=>{if(e.key===COUNTRY)schedule()});
 document.addEventListener('nzinga:country',schedule);
 window.NZINGA_PRICE={refresh:render,remember,CURRENCY};
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
