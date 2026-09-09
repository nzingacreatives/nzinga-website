/* Public published reviews block for the homepage. */
(function(){
'use strict';
function ready(fn){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fn,{once:true});else fn()}
ready(async function(){
if(!window.supabase||!window.NZINGA_SUPABASE)return;
var main=document.querySelector('main');if(!main)return;
var sb=window.supabase.createClient(window.NZINGA_SUPABASE.url,window.NZINGA_SUPABASE.publishableKey);
var r=await sb.from('reviews').select('stars,text,created_at').eq('status','published').order('created_at',{ascending:false}).limit(6);if(r.error||!(r.data||[]).length)return;
var sec=document.createElement('section');sec.className='section nz-public-reviews';sec.innerHTML='<div class="section-intro"><p class="eyebrow">06 · AVALIAÇÕES</p><h2>O que estão a dizer.</h2><p>Experiências reais de quem já passou pela Nzinga.</p></div><div class="nz-review-grid"></div>';
var grid=sec.querySelector('.nz-review-grid');grid.innerHTML=(r.data||[]).map(function(x){var n=Math.max(1,Math.min(5,Number(x.stars)||0));var text=String(x.text||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]});return '<article class="nz-public-review"><div class="nz-public-stars">'+('★'.repeat(n))+('☆'.repeat(5-n))+'</div><p>“'+text+'”</p><small>Cliente Nzinga</small></article>'}).join('');
main.insertBefore(sec,main.querySelector('.final-cta')||null);
var style=document.createElement('style');style.textContent='.nz-review-grid{max-width:1180px;margin:auto;display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.nz-public-review{border:3px solid var(--black);background:#fff;padding:24px;min-height:180px;box-shadow:7px 7px 0 var(--yellow)}.nz-public-stars{color:var(--red);letter-spacing:2px}.nz-public-review p{font-family:"Playfair Display",serif;font-size:1.25rem;line-height:1.35}.nz-public-review small{font-weight:700;color:var(--muted)}html[data-nzinga-theme="dark"] .nz-public-review{background:#121826;color:#fff;border-color:#fff}html[data-nzinga-theme="dark"] .nz-public-review p,html[data-nzinga-theme="dark"] .nz-public-review small{color:#fff}@media(max-width:800px){.nz-review-grid{grid-template-columns:1fr 1fr}}@media(max-width:560px){.nz-review-grid{grid-template-columns:1fr}}';document.head.appendChild(style);
});
})();
