const fs = require('fs');
const path = require('path');

const DATA_DIR = './data';
const BASE_FILE = 'odds_29.json'; // Futebol (referência)

// Mapeamento de IDs para nomes de esportes
const sportNames = {
  3: "Baseball",
  4: "Basketball",
  6: "Boxing",
  8: "Cricket",
  9: "Curling",
  10: "Darts",
  15: "Football",
  17: "Golf",
  18: "Handball",
  19: "Hockey",
  22: "MMA",
  24: "Politics",
  26: "Rugby League",
  27: "Rugby Union",
  28: "Snooker",
  33: "Tennis",
  34: "Volleyball",
  44: "Formula 1"
};

function loadJSON(filename) {
  try {
    const raw = fs.readFileSync(path.join(DATA_DIR, filename), 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    console.warn(`⚠️ Erro ao ler ${filename}:`, e.message);
    return null;
  }
}

function getPeriodStructure(odds) {
  const league = odds?.leagues?.[0];
  const event = league?.events?.[0];
  const period = event?.periods?.[0];
  if (!period) return null;

  const structure = {};
  for (const key in period) {
    structure[key] = typeof period[key];
  }
  return structure;
}

function compareStructures(base, other) {
  const diff = [];

  for (const key in base) {
    if (!(key in other)) {
      diff.push(`❌ Faltando: ${key}`);
    } else if (base[key] !== other[key]) {
      diff.push(`⚠️ Tipo diferente: ${key} (esperado: ${base[key]}, encontrado: ${other[key]})`);
    }
  }

  for (const key in other) {
    if (!(key in base)) {
      diff.push(`➕ Extra: ${key}`);
    }
  }

  return diff.length ? diff : ['✅ Estrutura igual'];
}

function main() {
  const report = [];
  const baseOdds = loadJSON(BASE_FILE);
  const baseStruct = getPeriodStructure(baseOdds);
  if (!baseStruct) return console.error('❌ Estrutura base (futebol) inválida!');

  const files = fs.readdirSync(DATA_DIR).filter(f => /^odds_\d+\.json$/.test(f) && f !== BASE_FILE);

  for (const file of files) {
    const sportId = parseInt(file.match(/odds_(\d+)\.json/)[1], 10);
    const sportName = sportNames[sportId] || 'Desconhecido';

    const odds = loadJSON(file);
    const struct = getPeriodStructure(odds);
    if (!struct) {
      report.push(`## ${file} (${sportName})\n⚠️ Sem dados válidos para comparação (sem periods)\n`);
      continue;
    }

    const diffs = compareStructures(baseStruct, struct);
    report.push(`## ${file} (${sportName})\n${diffs.map(d => `- ${d}`).join('\n')}\n`);
  }

  fs.writeFileSync('odds_diff_report.md', report.join('\n'));
  console.log('✅ Relatório gerado: odds_diff_report.md');
}

main();
