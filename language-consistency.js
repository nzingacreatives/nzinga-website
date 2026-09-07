/* Nzinga Creatives — mantém uma única língua por página */
(()=>{'use strict';
const KEY='nzinga-language';
const valid=['pt','en','fr','es','it'];
const get=()=>valid.includes(localStorage.getItem(KEY))?localStorage.getItem(KEY):'pt';
let bootLang=get();
function loadAccessibility(){if(document.querySelector('script[data-nzinga-accessibility]'))return;const s=document.createElement('script');s.src='accessibility-contrast.js?v=1';s.defer=true;s.dataset.nzingaAccessibility='1';document.head.appendChild(s)}
function reload(){const next=get();if(next!==bootLang){bootLang=next;location.reload()}}
// A mudança de idioma é global: recarrega a página a partir do HTML original para impedir mistura de idiomas.
document.addEventListener('click',e=>{const el=e.target.closest?.('[data-lang]');if(!el)return;const next=el.getAttribute('data-lang');if(!valid.includes(next))return;e.preventDefault();e.stopImmediatePropagation();localStorage.setItem(KEY,next);location.reload()},true);
window.addEventListener('storage',e=>{if(e.key===KEY)reload()});
loadAccessibility();
setInterval(reload,500);
})();