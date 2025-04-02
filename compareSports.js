const fs = require('fs');
const axios = require('axios');
require('dotenv').config();

const API_BASE = process.env.API_BASE;
const AUTH = {
  username: process.env.API_USERNAME,
  password: process.env.API_PASSWORD,
};


const FOOTBALL_ID = 29;

async function getActiveSports() {
  const { data } = await axios.get(`${API_BASE}/sports`, { auth: AUTH });

  // Se os esportes vierem como { sports: [...] }
  const sports = data.sports || data; // segurança para ambos formatos

  // Filtra os que têm hasOfferings = true (menos o futebol)
  return sports
    .filter(s => s.hasOfferings && s.id !== FOOTBALL_ID)
    .map(s => ({ id: s.id, name: s.name }));
}

async function fetchAndSave(endpoint, params, filename) {
  try {
    const { data } = await axios.get(`${API_BASE}/${endpoint}`, {
      auth: AUTH,
      params,
    });
    fs.writeFileSync(`./data/${filename}`, JSON.stringify(data, null, 2));
    console.log(`✅ Saved ${filename}`);
  } catch (err) {
    console.error(`❌ Error fetching ${endpoint} for sportId ${params.sportId}:`, err.message);
  }
}

async function main() {
  if (!fs.existsSync('./data')) fs.mkdirSync('./data');

  const activeSports = await getActiveSports();
  console.log(`🏟️ Esportes ativos encontrados:`, activeSports.map(s => `${s.name} (${s.id})`).join(', '));

  for (const sport of [ { id: FOOTBALL_ID, name: 'Soccer' }, ...activeSports ]) {
    console.log(`\n🔍 Coletando dados do esporte: ${sport.name} (ID ${sport.id})`);
    await fetchAndSave('leagues', { sportId: sport.id }, `leagues_${sport.id}.json`);
    await fetchAndSave('fixtures', { sportId: sport.id }, `fixtures_${sport.id}.json`);
    await fetchAndSave('odds', { sportId: sport.id }, `odds_${sport.id}.json`);
  }

  console.log('\n🎯 Comparação concluída! Dados salvos em /data');
}

main();