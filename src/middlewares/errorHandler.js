// Wrapper para garantir que nenhum erro em rota/controller derrube o servidor
const safeHandler = (fn) => (req, res, next) => {
  try {
    Promise.resolve(fn(req, res, next)).catch(next);
  } catch (err) {
    next(err);
  }
};

// Middleware centralizado de resposta formal de erro
const globalErrorHandler = (err, req, res, next) => {
  // Erro de sintaxe no JSON enviado pelo cliente
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      status: 'erro',
      codigo: 400,
      mensagem: 'JSON malformado na requisicao. Verifique aspas, virgulas e use ponto para decimais.'
    });
  }

  // Erro de payload muito grande
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      status: 'erro',
      codigo: 413,
      mensagem: 'O corpo da requisicao excede o tamanho maximo permitido (100kb).'
    });
  }

  // Erro customizado com status HTTP definido
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      status: 'erro',
      codigo: err.statusCode,
      mensagem: err.message
    });
  }

  // Qualquer outra falha inesperada (nunca derruba o servidor)
  console.error(`[ERRO INTERNO ${new Date().toISOString()}]:`, err.message);
  return res.status(500).json({
    status: 'erro',
    codigo: 500,
    mensagem: 'Ocorreu uma falha interna tratada pelo servidor. O servico continua operacional.'
  });
};

module.exports = { safeHandler, globalErrorHandler };
