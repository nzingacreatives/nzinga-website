/* Nzinga Admin — team controls readability fix. */
(function(){
  'use strict';
  if(!/admin\.html$/i.test(location.pathname))return;
  function apply(){
    if(document.getElementById('nzinga-team-light-fix'))return;
    var s=document.createElement('style');s.id='nzinga-team-light-fix';s.textContent=''
      +'body.admin-theme-light .team-refresh,body.admin-theme-light .team-form button,body.admin-theme-light .team-card .admin-actions button{background:#fff!important;color:#111!important;border:1px solid #aaa!important}'
      +'body.admin-theme-light .team-form button.approve{background:#f7c515!important;color:#111!important;border-color:#111!important}'
      +'body.admin-theme-light .team-form select,body.admin-theme-light .team-card select{background:#fff!important;color:#111!important;border:1px solid #aaa!important}'
      +'body.admin-theme-light .team-add{background:#fff!important;color:#111!important;border-bottom-color:#d3cec5!important}'
      +'body.admin-theme-light .team-add small,body.admin-theme-light .team-status{color:#555!important;opacity:1!important}'
      +'body.admin-theme-light .team-avatar{background:#f4f1eb!important;color:#111!important;border-color:#d3cec5!important}'
      +'body.admin-theme-dark .team-refresh,body.admin-theme-dark .team-form button,body.admin-theme-dark .team-card .admin-actions button{background:#171717!important;color:#fff!important;border-color:#555!important}'
      +'body.admin-theme-dark .team-form select,body.admin-theme-dark .team-card select{background:#0b0b0b!important;color:#fff!important;border-color:#555!important}'
      +'#nz-admin-global-nav .nz-theme-wrap{display:none!important}';document.head.appendChild(s);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
})();
