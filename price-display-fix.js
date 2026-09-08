/* Nzinga Creatives — preços comerciais por mercado
   NÃO converte preços entre moedas.
   Angola mantém os valores publicados em Kz.
   Cada outro mercado só mostra um preço quando esse preço foi definido
   explicitamente em market-prices.js.
*/
(()=>{'use strict';
const COUNTRY='nzinga-country';
const BASE='data-nzinga-base-aoa';
const READY='data-nzinga-price-ready';
let busy=false,timer=0;

function country(){return localStorage.getItem(COUNTRY)||'AO'}
function loadConfig(done){
 if(window.NZINGA_MARKET_PRICES){done();return}
 if(document.querySelector('script[data-nzinga-market-prices]'))return;
 const s=document.createElement('script');
 s.src='market-prices.js?v=3';
 s.defer=true;
 s.dataset.nzingaMarketPrices='1';
 s.onload=done;
 s.onerror=done;
 document.head.appendChild(s);
}
function parseBase(text){
 const m=String(text||'').match(/(?<![\d.,])([\d][\d\s.,]*)\s*(?:Kz|AOA)\b/i);
 if(!m)return null;
 const n=m[1].replace(/\s/g,'').replace(/\.(?=\d{3}(?:\D|$))/g,'').replace(/,(?=\d{3}(?:\D|$))/g,'');
 const v=Number(n);
 return Number.isFinite(v)&&v>0?v:null;
}
function remember(root=document){
 root.querySelectorAll?.('body *').forEach(el=>{
   if(el.children.length||el.hasAttribute(BASE))return;
   const v=parseBase(el.textContent);
   if(v!==null)el.setAttribute(BASE,String(v));
 });
}
function preparePriceMeta(){
 document.querySelectorAll('.service-card .mini-price').forEach(box=>{
   const price=box.querySelector('b');
   const service=box.closest('.service-card')?.querySelector('h3')?.textContent.trim()||'';
   const tier=box.querySelector('small')?.textContent.trim().toUpperCase()||'';
   if(!price||!service||!tier)return;
   if(!price.hasAttribute(BASE)){
     const base=parseBase(price.textContent);
     if(base!==null)price.setAttribute(BASE,String(base));
   }
   price.dataset.nzingaService=service;
   price.dataset.nzingaTier=tier;
   price.setAttribute(READY,'1');
 });
}
function formatAO(base){return `${new Intl.NumberFormat('pt-AO',{maximumFractionDigits:0}).format(base)} Kz`}
function formatMarket(value,market){
 const info=window.NZINGA_MARKET_PRICES?.MARKETS?.[market];
 if(!info)return null;
 return new Intl.NumberFormat(info.locale,{style:'currency',currency:info.currency,maximumFractionDigits:0,minimumFractionDigits:0}).format(value);
}
function render(){
 if(busy)return;
 busy=true;
 try{
   preparePriceMeta();
   const market=country();
   const api=window.NZINGA_MARKET_PRICES;
   document.querySelectorAll(`[${READY}]`).forEach(el=>{
     const base=Number(el.getAttribute(BASE));
     if(!Number.isFinite(base))return;
     const service=el.dataset.nzingaService||'';
     const tier=el.dataset.nzingaTier||'';
     let price=null;
     if(market==='AO')price=formatAO(base);
     else if(api){
       const value=api.getPrice(service,tier,market);
       price=value===null?'Preço não definido':formatMarket(value,market);
     }else price='Preço não definido';
     el.textContent=price||'Preço não definido';
   });
 }finally{busy=false}
}
function schedule(){clearTimeout(timer);timer=setTimeout(render,0)}
function boot(){
 loadConfig(()=>{
   remember();
   render();
   new MutationObserver(m=>{
     let relevant=false;
     m.forEach(x=>{x.addedNodes.forEach(n=>{if(n.nodeType===1){relevant=true;remember(n)}});if(x.type==='childList')relevant=true});
     if(relevant)schedule();
   }).observe(document.body,{childList:true,subtree:true});
   window.addEventListener('storage',e=>{if(e.key===COUNTRY)schedule()});
   document.addEventListener('nzinga:country',schedule);
   const api=window.NZINGA_MARKET_PRICES;
   window.NZINGA_PRICE={refresh:render,remember,MARKETS:api?.MARKETS||{},PRICES:api?.PRICES||{}};
 });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
