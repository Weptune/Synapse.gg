'use strict';

// P1-12: measure the "pick the longest option" giveaway in the question bank.
// This is the acceptance test for rebalancing: a heuristic bot that always
// picks the longest option (and one that picks the shortest) should score near
// 25% in every subject. Anything well above that means the answer can be found
// without reading the question.
//
// Usage:
//   node tools/questionBiasReport.js            # summary + worst 25 subjects
//   node tools/questionBiasReport.js --all      # every subject
//   node tools/questionBiasReport.js --threshold 40   # fail (exit 1) if any
//                                                      # subject's longest-pick
//                                                      # accuracy exceeds 40%

const bank = require('../questions');

function longestIndex(options) {
  let best = -1, bestLen = -1, tie = false;
  options.forEach((o, i) => {
    const len = String(o).length;
    if (len > bestLen) { bestLen = len; best = i; tie = false; }
    else if (len === bestLen) { tie = true; }
  });
  return tie ? -1 : best; // -1 when there's no unique longest
}

function shortestIndex(options) {
  let best = -1, bestLen = Infinity, tie = false;
  options.forEach((o, i) => {
    const len = String(o).length;
    if (len < bestLen) { bestLen = len; best = i; tie = false; }
    else if (len === bestLen) { tie = true; }
  });
  return tie ? -1 : best;
}

function analyze() {
  const rows = [];
  let totalQ = 0, totalLongest = 0, totalShortest = 0;
  for (const [subject, list] of Object.entries(bank)) {
    if (!Array.isArray(list) || list.length === 0) continue;
    let n = 0, longestHits = 0, shortestHits = 0, ratioOver16 = 0;
    for (const q of list) {
      if (!Array.isArray(q.options) || q.options.length !== 4 || !Number.isInteger(q.answer)) continue;
      n++;
      const lens = q.options.map(o => String(o).length);
      const max = Math.max(...lens), min = Math.max(1, Math.min(...lens));
      if (max / min > 1.6) ratioOver16++;
      if (longestIndex(q.options) === q.answer) longestHits++;
      if (shortestIndex(q.options) === q.answer) shortestHits++;
    }
    if (n === 0) continue;
    totalQ += n; totalLongest += longestHits; totalShortest += shortestHits;
    rows.push({
      subject,
      n,
      longestPct: +(100 * longestHits / n).toFixed(1),
      shortestPct: +(100 * shortestHits / n).toFixed(1),
      ratioOver16
    });
  }
  return { rows, totalQ, totalLongest, totalShortest };
}

const args = process.argv.slice(2);
const showAll = args.includes('--all');
const tIdx = args.indexOf('--threshold');
const threshold = tIdx >= 0 ? Number(args[tIdx + 1]) : null;

const { rows, totalQ, totalLongest, totalShortest } = analyze();
rows.sort((a, b) => b.longestPct - a.longestPct);

console.log(`Questions analyzed: ${totalQ} across ${rows.length} subjects`);
console.log(`"Always pick longest option" accuracy: ${(100 * totalLongest / totalQ).toFixed(1)}%  (chance = 25%)`);
console.log(`"Always pick shortest option" accuracy: ${(100 * totalShortest / totalQ).toFixed(1)}%`);
console.log('');
console.log('subject | questions | longest-pick % | shortest-pick % | ratio>1.6');
const shown = showAll ? rows : rows.slice(0, 25);
for (const r of shown) {
  console.log(`${r.subject} | ${r.n} | ${r.longestPct} | ${r.shortestPct} | ${r.ratioOver16}`);
}
if (!showAll && rows.length > 25) console.log(`...and ${rows.length - 25} more (use --all)`);

if (threshold != null) {
  const failing = rows.filter(r => r.longestPct > threshold);
  if (failing.length) {
    console.error(`\n❌ ${failing.length} subject(s) exceed ${threshold}% longest-pick accuracy.`);
    process.exit(1);
  }
  console.log(`\n✅ No subject exceeds ${threshold}% longest-pick accuracy.`);
}
