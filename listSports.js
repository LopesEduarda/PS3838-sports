const fs = require('fs');
const axios = require('axios');
require('dotenv').config();

const API_BASE = process.env.API_BASE;
const AUTH = {
  username: process.env.API_USERNAME,
  password: process.env.API_PASSWORD,
};


async function listSports() {
  try {
    const { data } = await axios.get(`${API_BASE}/sports`, { auth: AUTH });

    console.log('🔍 Conteúdo retornado da API:', data);

    const formatted = data.sports.map(sport => {
    return `ID: ${sport.id.toString().padEnd(4)} | Nome: ${sport.name.padEnd(20)} | hasOfferings: ${sport.hasOfferings ? '✅' : '❌'}`;
    });

    const output = formatted.join('\n');
    fs.writeFileSync('./sports_list.txt', output);
    console.log('✅ Arquivo "sports_list.txt" criado com sucesso!');
    console.log(output);
  } catch (err) {
    console.error('❌ Erro ao buscar esportes:', err.message);
  }
}

listSports();
