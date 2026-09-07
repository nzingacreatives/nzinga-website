/* Nzinga Creatives — mantém uma única língua por página */
(()=>{'use strict';
const KEY='nzinga-language';
const valid=['pt','en','fr','es','it'];
const get=()=>valid.includes(localStorage.getItem(KEY))?localStorage.getItem(KEY):'pt';
const isSettings=()=>location.pathname.endsWith('settings.html');
let bootLang=get();
function reload(){const next=get();if(next!==bootLang){bootLang=next;location.reload()}}
// A mudança de idioma é uma mudança global, nunca apenas um repaint da página atual.
document.addEventListener('click',e=>{const el=e.target.closest?.('[data-lang]');if(!el)return;const next=el.getAttribute('data-lang');if(!valid.includes(next))return;e.preventDefault();e.stopImmediatePropagation();localStorage.setItem(KEY,next);location.reload()},true);
window.addEventListener('storage',e=>{if(e.key===KEY)reload()});
setInterval(reload,500);
})();