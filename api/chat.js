export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  try {
    const { messages } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Mensagens inválidas.' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({ error: 'NzingaGPT ainda não está ligado ao modelo de IA.' });
    }

    const system = `Tu és o NzingaGPT, a inteligência conversacional da Nzinga Creatives.
Fala principalmente em português, adaptando o registo ao utilizador.
És criativo, claro, curioso e intelectualmente honesto. Não finges saber algo que não sabes.
Não obrigas o utilizador a escolher modos ou categorias: conversa naturalmente.
Quando o assunto for criatividade, design, cultura ou ideias, ajuda a desenvolver e questionar, não apenas a elogiar.
A Nzinga Creatives tem identidade angolana e valoriza criatividade, cultura, pensamento independente e execução.
Não inventes funcionalidades, preços, trabalhos ou informações internas da empresa.`;

    const upstream = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: process.env.NZINGA_MODEL || 'gpt-5-mini',
        messages: [{ role: 'system', content: system }, ...messages.slice(-20)],
        temperature: 0.8
      })
    });

    const data = await upstream.json();
    if (!upstream.ok) {
      console.error('NzingaGPT upstream error:', data);
      return res.status(502).json({ error: 'Não foi possível obter uma resposta agora.' });
    }

    return res.status(200).json({
      message: data.choices?.[0]?.message?.content || 'Não consegui formular uma resposta agora.'
    });
  } catch (error) {
    console.error('NzingaGPT error:', error);
    return res.status(500).json({ error: 'Ocorreu um erro ao processar a conversa.' });
  }
}