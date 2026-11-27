const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());

app.post('/usuarios', (req, res) => {
  // [FLUXO] entrada de dados: corpo da requisição
  const { nome, email } = req.body;

  // [ERRO] validação crítica: campos obrigatórios (400)
  if (!nome || !email) {
    return res.status(400).json({ erro: 'nome e email são obrigatórios' });
  }

  // [TRANSF] normalização de dados
  const usuario = { nome: nome.trim().toUpperCase(), email: email.toLowerCase() };
  console.log(`[TRANSF] usuario normalizado: ${usuario.email}`);
  res.status(201).json(usuario);
});

app.get('/usuarios', (req, res) => {
  try {
    // [FLUXO] leitura de arquivo
    const bruto = fs.readFileSync('./data/usuarios.json', 'utf8');
    // [TRANSF] parsing + filtro
    const lista = JSON.parse(bruto).filter(u => u.ativo).map(u => u.nome);
    res.json(lista);
  } catch (e) {
    // [ERRO] falha de leitura/parsing (500)
    console.error('[ERRO] falha ao ler usuarios', e.message);
    res.status(500).json({ erro: 'erro interno' });
  }
});

app.listen(3000, () => console.log('[FLUXO] API na porta 3000'));
