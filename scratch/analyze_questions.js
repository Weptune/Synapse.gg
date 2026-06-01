const QUESTIONS = require('../backend/questions.js');

const categories = Object.keys(QUESTIONS);
console.log(`Total categories: ${categories.length}`);

let totalQuestions = 0;
const culprits = [];

for (const [category, list] of Object.entries(QUESTIONS)) {
  list.forEach((q, idx) => {
    totalQuestions++;
    const wordCounts = q.options.map(opt => opt.trim().split(/\s+/).filter(Boolean).length);
    const ansIdx = q.answer;
    const ansWords = wordCounts[ansIdx];
    
    const otherWords = wordCounts.filter((_, i) => i !== ansIdx);
    const maxOtherWords = Math.max(...otherWords);
    
    if (ansWords > maxOtherWords) {
      culprits.push({
        category,
        index: idx,
        prompt: q.prompt,
        options: q.options,
        answer: ansIdx,
        diff: ansWords - maxOtherWords
      });
    }
  });
}

console.log(`Total questions: ${totalQuestions}`);
console.log(`Culprits (Correct answer strictly longest): ${culprits.length}`);

const diffCounts = {};
culprits.forEach(c => {
  diffCounts[c.diff] = (diffCounts[c.diff] || 0) + 1;
});

console.log('Word difference distribution for culprits:');
console.log(diffCounts);
