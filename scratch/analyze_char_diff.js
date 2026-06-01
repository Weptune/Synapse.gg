const QUESTIONS = require('../backend/questions.js');

let totalQuestions = 0;
const diffBuckets = {};

for (const [subject, list] of Object.entries(QUESTIONS)) {
  list.forEach((q) => {
    totalQuestions++;
    const charLengths = q.options.map(opt => opt.length);
    const maxLen = Math.max(...charLengths);
    const minLen = Math.min(...charLengths);
    const diff = maxLen - minLen;
    
    const bucket = Math.floor(diff / 5) * 5;
    diffBuckets[bucket] = (diffBuckets[bucket] || 0) + 1;
  });
}

console.log(`Total questions: ${totalQuestions}`);
console.log('Character length difference distribution (max - min):');
Object.keys(diffBuckets).sort((a,b) => a-b).forEach(b => {
  console.log(`Diff ${b} to ${Number(b)+4} chars: ${diffBuckets[b]} questions (${(diffBuckets[b]/totalQuestions*100).toFixed(1)}%)`);
});
