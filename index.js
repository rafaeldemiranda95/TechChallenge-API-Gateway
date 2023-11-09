const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// require('dotenv').config();

const app = express();
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const generateToken = (id, email) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

app.post('/auth', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }

  try {
    const client = await pool.connect();
    const { rows } = await client.query('SELECT * FROM Usuario WHERE email = $1', [email]);
    const usuario = rows[0];
    client.release();

    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: 'Senha inválida.' });
    }

    const token = generateToken(usuario.id, usuario.email);
    
    await client.query('UPDATE Usuario SET token = $1 WHERE id = $2', [token, usuario.id]);

    return res.status(200).json({ token });

  } catch (error) {
    console.error('Erro de autenticação:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});


exports.app = app;