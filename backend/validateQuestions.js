'use strict';

// P1-11: a question is only safe to serve if it has 4 real options, a valid
// answer index, a difficulty and a positive time limit. A question missing
// `answer` shuffles to a correct index of -1 (nobody can be right) and a
// missing `timeLimit` makes the round timer NaN, firing after ~1ms and
// dealing damage before players see anything. This module finds such
// questions (for CI) and strips them at load (so the server stays safe).

function validateQuestion(q) {
  const problems = [];
  if (!q || typeof q !== 'object') return ['not an object'];
  if (!Array.isArray(q.options) || q.options.length !== 4) {
    problems.push('options must be an array of 4');
  } else {
    if (q.options.some(o => typeof o !== 'string' || o.trim() === '')) {
      problems.push('every option must be a non-empty string');
    }
    if (new Set(q.options.map(o => String(o).trim().toLowerCase())).size !== 4) {
      problems.push('options must be distinct');
    }
  }
  if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer > 3) {
    problems.push('answer must be an integer 0-3');
  }
  if (typeof q.difficulty !== 'number' || !Number.isFinite(q.difficulty)) {
    problems.push('difficulty must be a number');
  }
  if (typeof q.timeLimit !== 'number' || !Number.isFinite(q.timeLimit) || q.timeLimit <= 0) {
    problems.push('timeLimit must be a positive number');
  }
  return problems;
}

// Returns { problems: [{subject, index, problems}], total, bad }
function validateBank(bank) {
  const problems = [];
  let total = 0;
  for (const [subject, list] of Object.entries(bank || {})) {
    if (!Array.isArray(list)) {
      problems.push({ subject, index: -1, problems: ['subject is not an array'] });
      continue;
    }
    list.forEach((q, index) => {
      total++;
      const p = validateQuestion(q);
      if (p.length) problems.push({ subject, index, problems: p });
    });
  }
  return { problems, total, bad: problems.length };
}

// Returns a copy of the bank with invalid questions removed, plus a count.
function sanitizeQuestionBank(bank) {
  const clean = {};
  let removed = 0;
  for (const [subject, list] of Object.entries(bank || {})) {
    if (!Array.isArray(list)) { removed++; continue; }
    const kept = list.filter(q => validateQuestion(q).length === 0);
    removed += list.length - kept.length;
    clean[subject] = kept;
  }
  return { bank: clean, removed };
}

module.exports = { validateQuestion, validateBank, sanitizeQuestionBank };

// CLI: `node validateQuestions.js` → non-zero exit if any question is invalid.
if (require.main === module) {
  const bank = require('./questions');
  const { problems, total, bad } = validateBank(bank);
  if (bad === 0) {
    console.log(`✅ All ${total} questions valid.`);
    process.exit(0);
  }
  console.error(`❌ ${bad} of ${total} questions invalid:`);
  for (const p of problems.slice(0, 100)) {
    console.error(`  ${p.subject}#${p.index}: ${p.problems.join('; ')}`);
  }
  if (problems.length > 100) console.error(`  ...and ${problems.length - 100} more`);
  process.exit(1);
}
