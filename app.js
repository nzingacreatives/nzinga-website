/* =====================================================
   NZINGA CREATIVES — APP
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    console.log("Nzinga Creatives iniciada.");

    iniciarAno();
    iniciarNavegacao();
    iniciarPrecos();

});


/* =====================================================
   ANO AUTOMÁTICO
   ===================================================== */

function iniciarAno() {

    const elementos =
        document.querySelectorAll("[data-year]");

    elementos.forEach(elemento => {

        elemento.textContent =
            new Date().getFullYear();

    });

}


/* =====================================================
   NAVEGAÇÃO
   ===================================================== */

function iniciarNavegacao() {

    const links =
        document.querySelectorAll("[data-link]");

    links.forEach(link => {

        link.addEventListener("click", evento => {

            const destino =
                link.getAttribute("data-link");

            if (!destino) return;

            window.location.href = destino;

        });

    });

}


/* =====================================================
   PREÇOS
   ===================================================== */

function iniciarPrecos() {

    if (
        typeof NZINGA === "undefined" ||
        !NZINGA.servicos
    ) {
        return;
    }

    const elementos =
        document.querySelectorAll("[data-service-price]");

    elementos.forEach(elemento => {

        const id =
            elemento.getAttribute(
                "data-service-price"
            );

        const servico =
            NZINGA.servicos.find(
                item => item.id === id
            );

        if (!servico) return;

        elemento.textContent =
            formatarPreco(servico.preco);


        elemento.style.display = "block";

    });

}


/* =====================================================
   FORMATAR KWANZA
   ===================================================== */

function formatarPreco(valor) {

    return new Intl.NumberFormat(
        "pt-AO"
    ).format(valor) + " Kz";

}


/* =====================================================
   PROCURAR SERVIÇO
   ===================================================== */

function obterServico(id) {

    if (
        typeof NZINGA === "undefined" ||
        !NZINGA.servicos
    ) {
        return null;
    }

    return NZINGA.servicos.find(
        servico => servico.id === id
    ) || null;

}


/* =====================================================
   ADICIONAR AO CARRINHO
   ===================================================== */

function adicionarAoCarrinho(id) {

    const servico =
        obterServico(id);

    if (!servico) {

        console.error(
            "Serviço não encontrado:",
            id
        );

        return;

    }


    let carrinho =
        JSON.parse(
            localStorage.getItem(
                "nzinga_carrinho"
            )
        ) || [];


    const existente =
        carrinho.find(
            item => item.id === id
        );


    if (existente) {

        existente.quantidade += 1;

    } else {

        carrinho.push({

            id: servico.id,

            nome: servico.nome,

            preco: servico.preco,

            quantidade: 1

        });

    }


    localStorage.setItem(
        "nzinga_carrinho",
        JSON.stringify(carrinho)
    );


    atualizarContadorCarrinho();

}


/* =====================================================
   CONTADOR DO CARRINHO
   ===================================================== */

function atualizarContadorCarrinho() {

    const carrinho =
        JSON.parse(
            localStorage.getItem(
                "nzinga_carrinho"
            )
        ) || [];


    const total =
        carrinho.reduce(
            (soma, item) =>
                soma + item.quantidade,
            0
        );


    document
        .querySelectorAll(
            "[data-cart-count]"
        )
        .forEach(elemento => {

            elemento.textContent = total;

        });

}


/* =====================================================
   UTILIZADOR
   ===================================================== */

function obterUtilizador() {

    return JSON.parse(
        localStorage.getItem(
            "nzinga_utilizador"
        )
    ) || null;

}


/* =====================================================
   TERMINAR SESSÃO
   ===================================================== */

function terminarSessao() {

    localStorage.removeItem(
        "nzinga_utilizador"
    );

    window.location.href =
        "index.html";

}


/* =====================================================
   EXPOR FUNÇÕES
   ===================================================== */

window.NzingaApp = {

    formatarPreco,

    obterServico,

    adicionarAoCarrinho,

    atualizarContadorCarrinho,

    obterUtilizador,

    terminarSessao

};