# 📄 Análise de Estrutura de Odds por Esporte (Base: PS3838 API)

## ✅ Objetivo do Documento

Este documento tem como objetivo comparar a estrutura de retorno do endpoint `GET /odds` da API da PS3838 entre o futebol (sportId = 29) e outros esportes ativos com `hasOfferings: true`. O foco é identificar **diferenças estruturais** que impactam diretamente a lógica atual de geração de apostas no back-end Node.js da aplicação.

---

## 📌 Base de comparação

- **Esporte base:** Futebol (⚽ sportId = 29)
- **API utilizada:** `https://api.ps3838.com/v1/odds`
- **Campos de interesse:** `leagues[].events[].periods[]`
- Foram analisados os campos presentes no `periods[]`, pois é onde estão as informações dos mercados de apostas (spread, moneyline, totals, etc.)

---

## 🧰 Metodologia

1. Os arquivos `odds_<sportId>.json` foram obtidos a partir de chamadas à API para cada esporte com `hasOfferings = true`.
2. A resposta do futebol foi usada como base (`odds_29.json`).
3. Foi criado um script em Node.js que percorre todos os arquivos e compara campo a campo o conteúdo de `periods[0]`.
4. Foram listados:
   - ❌ Campos ausentes em relação ao futebol
   - ➕ Campos extras existentes apenas no outro esporte
   - ⚠️ Campos com tipos diferentes (quando aplicável)
5. O resultado gerou um relatório detalhado (`odds_diff_report.md`), transcrito abaixo.

---

## 🎯 Por que apenas esses esportes?

A API da PS3838 disponibiliza uma lista completa de esportes em `GET /sports`. No entanto, apenas os esportes com `hasOfferings: true` foram considerados — ou seja, esportes que atualmente possuem mercados ativos para apostas.  
**Total analisado:** 20 esportes (além do futebol)

---

## 📂 Esportes analisados

| sportId | Nome do Esporte   |
|---------|-------------------|
| 3       | Baseball          |
| 4       | Basketball        |
| 6       | Boxing            |
| 8       | Cricket           |
| 9       | Curling           |
| 10      | Darts             |
| 15      | Football (⚽ base)|
| 17      | Golf              |
| 18      | Handball          |
| 19      | Hockey            |
| 22      | MMA               |
| 24      | Politics          |
| 26      | Rugby League      |
| 27      | Rugby Union       |
| 28      | Snooker           |
| 33      | Tennis            |
| 34      | Volleyball        |
| 44      | Formula 1         |

---

## 🧩 Relatório de diferenças estruturais (`periods[]`)

> Para cada esporte, foi comparado com o `odds_29.json` (futebol)

```md
## odds_3.json (Baseball)
- ❌ Faltando: teamTotalUpdatedAt
- ➕ Extra: maxSpread
- ➕ Extra: maxMoneyline
- ➕ Extra: maxTotal
- ➕ Extra: spreads
- ➕ Extra: moneyline
- ➕ Extra: totals

## odds_4.json (Basketball)
...
