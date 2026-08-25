/* =====================================================
   NZINGA — BASE DE DADOS INICIAL
   ===================================================== */

const NZINGA = {

    marca: {
        nome: "Nzinga Creatives",
        moeda: "Kz",
        pais: "Angola"
    },


    /* ================================================
       SERVIÇOS
       ================================================ */

    servicos: [

        {
            id: "logotipo",
            nome: "Logotipo",
            categoria: "Design",
            preco: 15000,
            especial: 15000,
            descricao:
                "Criação de um logotipo profissional, simples, memorável e adaptado à identidade do projeto."
        },

        {
            id: "isotipo",
            nome: "Isotipo",
            categoria: "Design",
            preco: 12000,
            especial: 12000,
            descricao:
                "Símbolo visual independente para representar uma marca."
        },

        {
            id: "monograma",
            nome: "Monograma",
            categoria: "Design",
            preco: 12000,
            especial: 12000,
            descricao:
                "Criação de símbolo baseado em iniciais ou letras da marca."
        },

        {
            id: "flyer",
            nome: "Flyer Digital",
            categoria: "Design",
            preco: 7500,
            especial: 7500,
            descricao:
                "Flyer digital profissional para divulgação de produtos, serviços ou eventos."
        },

        {
            id: "cartaz",
            nome: "Cartaz",
            categoria: "Design",
            preco: 9000,
            especial: 9000,
            descricao:
                "Criação de cartaz visual para campanhas, eventos ou divulgação."
        },

        {
            id: "banner",
            nome: "Banner",
            categoria: "Design",
            preco: 8500,
            especial: 8500,
            descricao:
                "Banner digital adaptado às necessidades da marca."
        },

        {
            id: "certificado",
            nome: "Certificado",
            categoria: "Documentos",
            preco: 6000,
            especial: 6000,
            descricao:
                "Certificado personalizado para eventos, cursos, instituições ou atividades."
        },

        {
            id: "menu-digital",
            nome: "Menu Digital",
            categoria: "Design",
            preco: 10000,
            especial: 10000,
            descricao:
                "Menu digital organizado e visualmente atrativo."
        },

        {
            id: "pack-posts-7",
            nome: "Pack de Posts — 7 dias",
            categoria: "Conteúdo",
            preco: 22000,
            especial: 22000,
            descricao:
                "Pack de conteúdos estáticos para uma semana de comunicação."
        },

        {
            id: "pack-posts-30",
            nome: "Pack de Posts — Mensal",
            categoria: "Conteúdo",
            preco: 65000,
            especial: 65000,
            descricao:
                "Pacote mensal de conteúdos para redes sociais."
        },

        {
            id: "kit-marca",
            nome: "Kit de Marca",
            categoria: "Branding",
            preco: 45000,
            especial: 45000,
            descricao:
                "Conjunto de elementos essenciais para uma identidade visual consistente."
        },

        {
            id: "identidade-marca",
            nome: "Identidade de Marca",
            categoria: "Branding",
            preco: 85000,
            especial: 85000,
            descricao:
                "Construção completa da identidade visual e direção da marca."
        },

{
    id: "branding-completo",
    nome: "Branding Completo",
    categoria: "Branding",
    preco: 110000,
    especial: 110000,
    descricao:
        "Solução completa para construir, organizar e apresentar uma marca."
},

        {
            id: "roteiro",
            nome: "Roteiro",
            categoria: "Conteúdo",
            preco: 15000,
            especial: 15000,
            descricao:
                "Criação de roteiro estruturado para vídeos, apresentações ou projetos."
        },

        {
            id: "video-promocional",
            nome: "Vídeo Promocional",
            categoria: "Vídeo",
            preco: 35000,
            especial: 35000,
            descricao:
                "Produção de conceito e edição de vídeo promocional."
        },

        {
            id: "apresentacao",
            nome: "Apresentação",
            categoria: "Documentos",
            preco: 12000,
            especial: 12000,
            descricao:
                "Apresentação visual para trabalhos, aulas, projetos ou negócios."
        }

    ],


    /* ================================================
       NZINGAGPT
       ================================================ */

    nzingaGPT: {

        normal: {
            nome: "NzingaGPT",
            preco: 0,
            limite: "Limitado",
            descricao:
                "Assistente inteligente para ideias, textos, estudos, empreendedorismo e produtividade."
        },

        premium: {
            nome: "NzingaGPT Premium",
            preco: 0,
            limite: "Ampliado",
            descricao:
                "Versão avançada com limites maiores e funcionalidades adicionais."
        }

    },


    /* ================================================
       PROMOÇÃO
       ================================================ */

    promocao: {

        primeiraSemana: true,

        descontoMaximo: 50,

        descricao:
            "Novos utilizadores podem receber até 50% de desconto durante a primeira semana."
    }

};


/*
   Disponibiliza os dados para outras páginas.
*/

if (typeof window !== "undefined") {
    window.NZINGA = NZINGA;
}