/* Nzinga Admin — single navigation + icons. */
(function(){
'use strict';
function start(){
 if(!/admin\.html$/i.test(location.pathname))return;
 var nav=document.querySelector('.side-nav');if(!nav||document.getElementById('nz-admin-center-ready'))return;
 var marker=document.createElement('span');marker.id='nz-admin-center-ready';marker.hidden=true;document.body.appendChild(marker);
 var s=document.createElement('style');s.id='nzinga-admin-center-style';s.textContent=':root{--admin-accent:#d71920;--admin-yellow:#f2c400}.side-nav button{gap:11px!important}.nz-admin-nav-icon{width:20px;height:20px;display:grid;place-items:center;flex:none}.nz-admin-nav-icon svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}.side-nav button.active{box-shadow:4px 4px 0 #d71920!important}.side-nav button[data-tab="overview"]{border-left:3px solid #f2c400}.nz-admin-delete:focus-visible,.admin-actions button:focus-visible,.admin-actions select:focus-visible{outline:3px solid #f2c400;outline-offset:2px}';document.head.appendChild(s);
 var icons={overview:'<svg viewBox="0 0 24 24"><path d="M4 5h6v6H4zM14 5h6v6h-6zM4 15h6v6H4zM14 15h6v6h-6z"/></svg>',products:'<svg viewBox="0 0 24 24"><path d="M4 8h16l-1 12H5L4 8Z"/><path d="M8 8a4 4 0 0 1 8 0"/></svg>',orders:'<svg viewBox="0 0 24 24"><path d="M6 4h12v16H6zM9 8h6M9 12h6M9 16h4"/></svg>',reviews:'<svg viewBox="0 0 24 24"><path d="m12 4 2.2 4.5 4.8.7-3.5 3.4.8 4.8-4.3-2.3-4.3 2.3.8-4.8L5 9.2l4.8-.7z"/></svg>',users:'<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3"/><path d="M5 20c.8-3.5 3.2-5 7-5s6.2 1.5 7 5"/></svg>',team:'<svg viewBox="0 0 24 24"><path d="m12 3 2 5 5 .5-3.8 3.2 1.2 5-4.4-2.7L7.6 17l1.2-5L5 8.5 10 8z"/></svg>',audit:'<svg viewBox="0 0 24 24"><path d="M4 5h16v14H4zM8 9h8M8 13h6M8 17h4"/></svg>'};
 var labels={overview:'Tudo',products:'Market',orders:'Pedidos',reviews:'Avaliações',users:'Utilizadores',team:'Equipa',audit:'Atividades'};
 function ensureOverview(){if(nav.querySelector('button[data-tab="overview"]'))return;var b=document.createElement('button');b.type='button';b.dataset.tab='overview';b.innerHTML='<span class="nz-admin-nav-icon" aria-hidden="true">'+icons.overview+'</span><span>Tudo</span>';nav.insertBefore(b,nav.firstChild);}
 function normalize(){ensureOverview();Object.keys(icons).forEach(function(k){var b=nav.querySelector('button[data-tab="'+k+'"]');if(b)b.innerHTML='<span class="nz-admin-nav-icon" aria-hidden="true">'+icons[k]+'</span><span>'+labels[k]+'</span>'});nav.querySelectorAll('button').forEach(function(b){b.title=b.textContent.trim();b.setAttribute('aria-label',b.textContent.trim())})}
 normalize();new MutationObserver(normalize).observe(nav,{childList:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();