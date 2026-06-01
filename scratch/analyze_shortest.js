const QUESTIONS = require('../backend/questions.js');

let totalQuestions = 0;
let longestCulprits = 0;
let shortestCulprits = 0;
let exactMatches = 0;

for (const [category, list] of Object.entries(QUESTIONS)) {
  list.forEach((q) => {
    totalQuestions++;
    const wordCounts = q.options.map(opt => opt.trim().split(/\s+/).filter(Boolean).length);
    const ansIdx = q.answer;
    const ansWords = wordCounts[ansIdx];
    
    const otherWords = wordCounts.filter((_, i) => i !== ansIdx);
    const maxOtherWords = Math.max(...otherWords);
    const minOtherWords = Math.min(...otherWords);
    
    if (ansWords > maxOtherWords) {
      longestCulprits++;
    } else if (ansWords < minOtherWords) {
      shortestCulprits++;
    }
    
    const allSame = wordCounts.every(w => w === ansWords);
    if (allSame) {
      exactMatches++;
    }
  });
}

console.log(`Total questions: ${totalQuestions}`);
console.log(`Strictly longest culprits: ${longestCulprits} (${(longestCulprits/totalQuestions*100).toFixed(1)}%)`);
console.log(`Strictly shortest culprits: ${shortestCulprits} (${(shortestCulprits/totalQuestions*100).toFixed(1)}%)`);
console.log(`Perfect word-count match (all 4 options same word count): ${exactMatches} (${(exactMatches/totalQuestions*100).toFixed(1)}%)`);
