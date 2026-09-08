/* Nzinga Creatives — preços comerciais por mercado
   IMPORTANTE: os preços internacionais são INDEPENDENTES dos preços de Angola.
   Não existe conversão automática de AOA para outra moeda.

   Para definir um preço real para um mercado, acrescenta-o aqui:
   'Nome do serviço|Nível': valor

   Exemplo:
   'Logotipo|NORMAL': 120
   para Portugal significa €120, porque o mercado PT usa EUR.
*/
(()=>{'use strict';
const MARKETS={
 AO:{currency:'AOA',symbol:'Kz',locale:'pt-AO'},
 PT:{currency:'EUR',symbol:'€',locale:'pt-PT'},
 BR:{currency:'BRL',symbol:'R$',locale:'pt-BR'},
 MZ:{currency:'MZN',symbol:'MT',locale:'pt-MZ'},
 FR:{currency:'EUR',symbol:'€',locale:'fr-FR'},
 BE:{currency:'EUR',symbol:'€',locale:'fr-BE'},
 CH:{currency:'CHF',symbol:'CHF',locale:'de-CH'},
 CA:{currency:'CAD',symbol:'CA$',locale:'en-CA'},
 ES:{currency:'EUR',symbol:'€',locale:'es-ES'},
 AR:{currency:'ARS',symbol:'AR$',locale:'es-AR'},
 MX:{currency:'MXN',symbol:'MX$',locale:'es-MX'},
 CO:{currency:'COP',symbol:'$',locale:'es-CO'},
 CL:{currency:'CLP',symbol:'$',locale:'es-CL'},
 IT:{currency:'EUR',symbol:'€',locale:'it-IT'},
 SM:{currency:'EUR',symbol:'€',locale:'it-IT'},
 VA:{currency:'EUR',symbol:'€',locale:'it-IT'}
};

/* Apenas preços comerciais explicitamente definidos entram aqui.
   Não preencher automaticamente com câmbio. */
const PRICES={
  /* PT:{'Logotipo|NORMAL':120}, */
  /* BR:{'Logotipo|NORMAL':650}, */
  /* MZ:{'Logotipo|NORMAL':8500} */
};

function getMarket(){return localStorage.getItem('nzinga-country')||'AO'}
function getPrice(service,tier,market=getMarket()){
  const m=PRICES[market];
  if(!m)return null;
  const value=m[`${service}|${tier}`];
  return Number.isFinite(Number(value))?Number(value):null;
}
function setPrice(market,service,tier,value){
  if(!MARKETS[market])throw new Error('Mercado inválido');
  const n=Number(value);
  if(!Number.isFinite(n)||n<0)throw new Error('Preço inválido');
  PRICES[market]||(PRICES[market]={});
  PRICES[market][`${service}|${tier}`]=n;
  return n;
}
window.NZINGA_MARKET_PRICES={MARKETS,PRICES,getMarket,getPrice,setPrice};
})();
