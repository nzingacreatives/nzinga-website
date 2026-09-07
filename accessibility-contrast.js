/* Nzinga Creatives — contraste e legibilidade global */
(()=>{'use strict';
if(document.getElementById('nzinga-accessibility-style'))return;
const s=document.createElement('style');s.id='nzinga-accessibility-style';s.textContent=`
html[data-nzinga-theme="light"] body{background:#f5f2ec!important;color:#151515!important}
html[data-nzinga-theme="light"] main,html[data-nzinga-theme="light"] section,html[data-nzinga-theme="light"] article{color:#151515}
html[data-nzinga-theme="light"] h1,html[data-nzinga-theme="light"] h2,html[data-nzinga-theme="light"] h3,html[data-nzinga-theme="light"] h4,html[data-nzinga-theme="light"] strong,html[data-nzinga-theme="light"] b{color:#111!important}
html[data-nzinga-theme="light"] p,html[data-nzinga-theme="light"] li,html[data-nzinga-theme="light"] small,html[data-nzinga-theme="light"] label{color:#333!important}
html[data-nzinga-theme="light"] a{color:#111}
html[data-nzinga-theme="light"] input,html[data-nzinga-theme="light"] textarea,html[data-nzinga-theme="light"] select{background:#fff!important;color:#111!important;border:2px solid #111!important}
html[data-nzinga-theme="light"] button{color:#111;border-color:#111}
html[data-nzinga-theme="light"] button.button-main,html[data-nzinga-theme="light"] .button-main{background:#c91510!important;color:#fff!important;border-color:#111!important}
html[data-nzinga-theme="light"] .card,html[data-nzinga-theme="light"] .panel,html[data-nzinga-theme="light"] .stat,html[data-nzinga-theme="light"] .market-card,html[data-nzinga-theme="light"] .product,html[data-nzinga-theme="light"] .rating,html[data-nzinga-theme="light"] .auth-box{background:#fff!important;color:#111!important;border-color:#111!important}
html[data-nzinga-theme="light"] .muted,html[data-nzinga-theme="light"] .secondary,html[data-nzinga-theme="light"] .subtitle{color:#444!important}
html[data-nzinga-theme="light"] .eyebrow{color:#9e0d09!important}
html[data-nzinga-theme="light"] .proverb-bar{background:#fff!important;color:#111!important;border-color:#111!important}
html[data-nzinga-theme="light"] footer{background:#111!important;color:#fff!important}
html[data-nzinga-theme="light"] footer *{color:#fff!important}
html[data-nzinga-theme="dark"] body{background:#101010!important;color:#f5f5f5!important}
html[data-nzinga-theme="dark"] h1,html[data-nzinga-theme="dark"] h2,html[data-nzinga-theme="dark"] h3,html[data-nzinga-theme="dark"] h4,html[data-nzinga-theme="dark"] p,html[data-nzinga-theme="dark"] li,html[data-nzinga-theme="dark"] label,html[data-nzinga-theme="dark"] small{color:#f1f1f1!important}
html[data-nzinga-theme="dark"] input,html[data-nzinga-theme="dark"] textarea,html[data-nzinga-theme="dark"] select{background:#181818!important;color:#fff!important;border-color:#eee!important}
html[data-nzinga-theme="dark"] .card,html[data-nzinga-theme="dark"] .panel,html[data-nzinga-theme="dark"] .stat,html[data-nzinga-theme="dark"] .market-card,html[data-nzinga-theme="dark"] .product,html[data-nzinga-theme="dark"] .rating,html[data-nzinga-theme="dark"] .auth-box{background:#181818!important;color:#fff!important;border-color:#eee!important}
/* NzingaGPT: no modo escuro, bolhas e conteúdo do chat mantêm contraste próprio. */
html[data-nzinga-theme="dark"] .nz-chat .bubble.assistant,
html[data-nzinga-theme="dark"] .nz-chat .bubble.assistant *{background:#fff!important;color:#111!important}
html[data-nzinga-theme="dark"] .nz-chat .bubble.user,
html[data-nzinga-theme="dark"] .nz-chat .bubble.user *{background:#111!important;color:#fff!important}
html[data-nzinga-theme="dark"] .nz-chat .starter,
html[data-nzinga-theme="dark"] .nz-chat .starter *{background:#fff!important;color:#111!important}
html[data-nzinga-theme="dark"] .nz-chat .starter:hover,
html[data-nzinga-theme="dark"] .nz-chat .starter:hover *{background:#f2c000!important;color:#111!important}
html[data-nzinga-theme="dark"] .nz-chat .bubble.assistant a{color:#9e0d09!important}
html[data-nzinga-theme="dark"] .nz-chat .bubble.assistant blockquote{color:#333!important}
html[data-nzinga-theme="dark"] .nz-chat .bubble.assistant code{background:#e9e9e9!important;color:#111!important}
:focus-visible{outline:4px solid #f2c000!important;outline-offset:3px!important}
@media(max-width:600px){body{font-size:16px!important}.settings-page p,.settings-card p{line-height:1.7!important}.settings-option{font-size:1rem!important}}
`;
document.head.appendChild(s);
})();