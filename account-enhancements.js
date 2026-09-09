/* Minha Nzinga — settings shortcut and account polish. */
(function(){
'use strict';
function ready(fn){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fn,{once:true});else fn()}
ready(function(){
if(!location.pathname.endsWith('minha-nzinga.html'))return;
var grid=document.getElementById('accountGrid');if(!grid||document.getElementById('accountSettingsCard'))return;
var card=document.createElement('section');card.id='accountSettingsCard';card.className='panel account-settings-card';card.innerHTML='<p class="eyebrow">CONTA</p><h2>Definições</h2><p>Preferências da tua experiência Nzinga, acessibilidade e opções da conta.</p><div class="button-row"><a class="button button-main" href="settings.html">Abrir definições →</a></div>';
var rating=grid.querySelector('.rating');if(rating)grid.insertBefore(card,rating);else grid.appendChild(card);
var s=document.createElement('style');s.textContent='.account-settings-card{grid-column:1/-1}.account-settings-card p:not(.eyebrow){max-width:680px;line-height:1.6;color:var(--muted)}html[data-nzinga-theme="dark"] .account-settings-card p:not(.eyebrow){color:#dce4f2}@media(max-width:800px){.account-settings-card{grid-column:auto}}';document.head.appendChild(s);
});
})();
