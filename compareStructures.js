const fs = require('fs');
const path = require('path');

const FOOTBALL_ID = 29;
const DATA_FOLDER = './data';
const FILE_TYPES = ['fixtures', 'leagues', 'odds'];

function loadJSON(filePath) {
  try {
    const content = fs.readFileSync(filePath);
    return JSON.parse(content);
  } catch (err) {
    console.error(`Erro ao ler ${filePath}:`, err.message);
    return null;
  }
}

function getStructure(obj) {
  if (Array.isArray(obj)) {
    return obj.length ? getStructure(obj[0]) : {};
  } else if (typeof obj === 'object' && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, typeof v === 'object' ? getStructure(v) : typeof v])
    );
  } else {
    return typeof obj;
  }
}

function compareStructures(base, other) {
  const diffs = [];
  for (const key in base) {
    if (!(key in other)) {
      diffs.push(`❌ Campo "${key}" está **faltando** no outro esporte`);
    } else if (JSON.stringify(base[key]) !== JSON.stringify(other[key])) {
      diffs.push(`⚠️ Campo "${key}" tem estrutura diferente`);
    }
  }

  for (const key in other) {
    if (!(key in base)) {
      diffs.push(`➕ Campo "${key}" está **extra** no outro esporte`);
    }
  }

  return diffs.length ? diffs : ['✅ Estrutura igual'];
}

function runComparison() {
  const report = [];

  const files = fs.readdirSync(DATA_FOLDER);
  const sportIds = [...new Set(
    files
      .map(f => f.match(/_(\d+)\.json/))
      .filter(Boolean)
      .map(m => Number(m[1]))
      .filter(id => id !== FOOTBALL_ID)
  )];

  for (const sportId of sportIds) {
    report.push(`## Esporte ID ${sportId} vs Futebol (ID 29)\n`);

    for (const type of FILE_TYPES) {
      const baseFile = path.join(DATA_FOLDER, `${type}_29.json`);
      const compareFile = path.join(DATA_FOLDER, `${type}_${sportId}.json`);

      const baseData = loadJSON(baseFile);
      const otherData = loadJSON(compareFile);

      if (!baseData || !otherData) {
        report.push(`### ${type.toUpperCase()}: Arquivo ausente\n`);
        continue;
      }

      const baseStruct = getStructure(baseData);
      const otherStruct = getStructure(otherData);

      const diffs = compareStructures(baseStruct, otherStruct);
      report.push(`### ${type.toUpperCase()}:\n${diffs.map(d => `- ${d}`).join('\n')}\n`);
    }

    report.push('\n---\n');
  }

  fs.writeFileSync('diff_report.md', report.join('\n'));
  console.log('✅ Relatório gerado em: diff_report.md');
}

runComparison();
