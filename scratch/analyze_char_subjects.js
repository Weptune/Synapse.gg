const QUESTIONS = require('../backend/questions.js');

const minPoolSize = 10;
const subjectsWithFewQuestions = [];
const threshold = 3;

for (const [subject, list] of Object.entries(QUESTIONS)) {
  const filtered = list.filter((q) => {
    const charLengths = q.options.map(opt => opt.length);
    const ansIdx = q.answer;
    const ansLen = charLengths[ansIdx];
    const otherLens = charLengths.filter((_, i) => i !== ansIdx);
    const maxOther = Math.max(...otherLens);
    const minOther = Math.min(...otherLens);
    
    if (ansLen > maxOther && (ansLen - maxOther) > threshold) {
      return false;
    }
    if (ansLen < minOther && (minOther - ansLen) > threshold) {
      return false;
    }
    return true;
  });
  
  if (filtered.length < minPoolSize) {
    subjectsWithFewQuestions.push({
      subject,
      original: list.length,
      filtered: filtered.length
    });
  }
}

console.log(`Subjects with less than ${minPoolSize} questions after character filtering:`, subjectsWithFewQuestions.length);
if (subjectsWithFewQuestions.length > 0) {
  console.log(subjectsWithFewQuestions);
}
