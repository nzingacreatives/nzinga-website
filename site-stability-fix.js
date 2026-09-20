(()=>{'use strict';
/* Nzinga stability layer: prevents touch/focus/reveal states from hiding readable content. */
const css=document.createElement('style');
css.id='nzinga-stability-fix';
css.textContent=`
html,body{background:#111;color:#fff}
.nz-reveal,.nz-reveal.nz-visible,.nz-reveal:active,.nz-reveal:focus,.nz-reveal:focus-within{opacity:1!important;visibility:visible!important;transform:none!important}
.service-grid a,.home-cards a,.portfolio-grid a,.home-ecosystem .portfolio-grid a{color:inherit!important;text-decoration:none!important;-webkit-tap-highlight-color:transparent}
.service-grid a:active,.home-cards a:active,.portfolio-grid a:active{color:inherit!important;opacity:1!important}
.home-ecosystem .portfolio-grid a,.home-ecosystem .portfolio-grid a *{color:inherit!important}
.home-ecosystem .portfolio-grid a:nth-child(odd){color:#111!important}
.home-ecosystem .portfolio-grid a:nth-child(even){color:#fff!important}
.home-ai,.home-ai *{color:#fff}
.home-ai .home-ai-copy strong,.home-ai .eyebrow{color:var(--yellow)!important}
.home-ai .button-light{color:#111!important}
`;
document.head.appendChild(css);
})();