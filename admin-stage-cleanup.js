/* Nzinga Admin — acabamento visual da etapa 1. Não cria navegação nem substitui conteúdo das secções. */
(function(){
'use strict';
function start(){
 if(!/admin\.html$/i.test(location.pathname))return;
 var style=document.getElementById('nzinga-admin-stage1-style');
 if(style)return;
 style=document.createElement('style');style.id='nzinga-admin-stage1-style';style.textContent=''+
  'body{background:#f3f0ea!important;color:#171717!important}'+
  'body.admin-theme-dark{background:#101010!important;color:#f5f5f5!important}'+
  '.admin-side,.admin-content{background:#fff!important}body.admin-theme-dark .admin-side,body.admin-theme-dark .admin-content{background:#171717!important}'+
  '.admin-top h1,.panel-head h2{color:#d71920!important}.eyebrow{color:#d71920!important;opacity:1!important}'+
  '.admin-actions button.approve,.market-create button,.market-tools button,.orders-tools button,.reviews-tools button,.users-tools button,.team-form .approve{background:#f2c400!important;color:#171717!important;border-color:#d6a900!important;font-weight:900}'+
  '.admin-actions button.danger,.nz-admin-delete{background:#d71920!important;color:#fff!important;border-color:#d71920!important}'+
  '.admin-actions button:not(.approve):not(.danger):not(.nz-admin-delete),.team-form button:not(.approve),.team-refresh{background:#fff!important;color:#171717!important;border-color:#bbb!important}'+
  '.admin-form input,.admin-form textarea,.admin-form select,.market-tools input,.market-tools select,.orders-tools input,.orders-tools select,.reviews-tools input,.reviews-tools select,.users-tools input,.users-tools select,.team-form select{background:#fff!important;color:#171717!important;border-color:#c9c9c9!important}'+
  '.side-nav button.active{background:#171717!important;color:#fff!important;box-shadow:4px 4px 0 #d71920!important}body.admin-theme-dark .side-nav button.active{background:#fff!important;color:#111!important}'+
  '.panel-head{border-bottom-color:#d71920!important}.admin-card{border-bottom-color:rgba(215,25,32,.16)!important}.admin-card h2{color:#171717}.admin-theme-dark .admin-card h2{color:#fff}.status{color:#d71920!important}'+
  '@media(max-width:650px){.admin-actions button,.admin-actions select{min-height:42px}}';document.head.appendChild(style);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();