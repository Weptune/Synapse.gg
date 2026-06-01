const QUESTIONS = require('../backend/questions.js');

let totalQuestions = 0;
let duplicateQuestionsCount = 0;

for (const [category, list] of Object.entries(QUESTIONS)) {
  list.forEach((q, idx) => {
    totalQuestions++;
    
    // Check if options have duplicates
    const uniqueOptions = new Set(q.options.map(opt => opt.trim().toLowerCase()));
    if (uniqueOptions.size < 4) {
      duplicateQuestionsCount++;
      console.log(`\nDuplicate found in Category: "${category}" (Idx: ${idx})`);
      console.log(`Prompt: "${q.prompt}"`);
      console.log(`Options:`, JSON.stringify(q.options));
    }
  });
}

console.log(`\nScanning complete:`);
console.log(`- Total questions analyzed: ${totalQuestions}`);
console.log(`- Questions with duplicate options: ${duplicateQuestionsCount}`);
