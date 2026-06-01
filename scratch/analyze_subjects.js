const QUESTIONS = require('../backend/questions.js');

const minPoolSize = 10;
const subjectsWithFewQuestions = [];

for (const [subject, list] of Object.entries(QUESTIONS)) {
  const filtered = list.filter((q) => {
    const wordCounts = q.options.map(opt => opt.trim().split(/\s+/).filter(Boolean).length);
    const ansIdx = q.answer;
    const ansWords = wordCounts[ansIdx];
    
    const otherWords = wordCounts.filter((_, i) => i !== ansIdx);
    const maxOtherWords = Math.max(...otherWords);
    const minOtherWords = Math.min(...otherWords);
    
    // Return true if it's NOT strictly longest and NOT strictly shortest
    return ansWords <= maxOtherWords && ansWords >= minOtherWords;
  });
  
  if (filtered.length < minPoolSize) {
    subjectsWithFewQuestions.push({
      subject,
      original: list.length,
      filtered: filtered.length
    });
  }
}

console.log(`Subjects with less than ${minPoolSize} questions after filtering:`, subjectsWithFewQuestions.length);
if (subjectsWithFewQuestions.length > 0) {
  console.log(subjectsWithFewQuestions);
}
