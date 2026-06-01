const QUESTIONS = require('../backend/questions.js');

let totalQuestions = 0;
let keptQuestions = 0;
let filteredLongest = 0;
let filteredShortest = 0;

const threshold = 3; // Max characters difference allowed for strictly longest/shortest correct answer

for (const [subject, list] of Object.entries(QUESTIONS)) {
  list.forEach((q) => {
    totalQuestions++;
    const charLengths = q.options.map(opt => opt.length);
    const ansIdx = q.answer;
    const ansLen = charLengths[ansIdx];
    
    const otherLens = charLengths.filter((_, i) => i !== ansIdx);
    const maxOther = Math.max(...otherLens);
    const minOther = Math.min(...otherLens);
    
    let isOutlier = false;
    
    if (ansLen > maxOther && (ansLen - maxOther) > threshold) {
      filteredLongest++;
      isOutlier = true;
    } else if (ansLen < minOther && (minOther - ansLen) > threshold) {
      filteredShortest++;
      isOutlier = true;
    }
    
    if (!isOutlier) {
      keptQuestions++;
    }
  });
}

console.log(`Total questions: ${totalQuestions}`);
console.log(`Filtered because correct is strictly longest outlier (> ${threshold} chars difference): ${filteredLongest} (${(filteredLongest/totalQuestions*100).toFixed(1)}%)`);
console.log(`Filtered because correct is strictly shortest outlier (> ${threshold} chars difference): ${filteredShortest} (${(filteredShortest/totalQuestions*100).toFixed(1)}%)`);
console.log(`Kept questions: ${keptQuestions} (${(keptQuestions/totalQuestions*100).toFixed(1)}%)`);
