const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, '../backend/questions.js');
const progressPath = path.join(__dirname, 'refactor_progress.json');

const groqKey = process.env.GROQ_API_KEY;
if (!groqKey) {
  console.error('Error: GROQ_API_KEY environment variable is not set!');
  process.exit(1);
}

// Word-count adjustment helper
function adjustWordCount(str, target) {
  let words = str.trim().split(/\s+/).filter(Boolean);
  let current = words.length;
  
  if (current === target) {
    return str;
  }
  
  if (current < target) {
    let diff = target - current;
    // We ONLY attempt to pad if the difference is exactly 1 word
    if (diff === 1) {
      const prefixes = ["the", "a", "an", "its", "to", "their", "our", "this", "that", "any", "all", "some"];
      let resultWords = [...words];
      
      const firstWord = resultWords[0].toLowerCase();
      
      // If it doesn't already start with a common prefix/article/pronoun, prepend a natural prefix
      if (!prefixes.includes(firstWord)) {
        const verbLikeWords = ["store", "generate", "increase", "reduce", "maintain", "produce", "provide", "improve", "optimize", "eliminate", "prevent", "support"];
        if (verbLikeWords.includes(firstWord)) {
          resultWords.unshift("to");
        } else {
          resultWords.unshift("the");
        }
      } else {
        // Fallback: Return original; let the strict validator skip it to prevent bad phrasing
        return str;
      }
      
      if (str[0] === str[0].toUpperCase()) {
        resultWords[0] = resultWords[0].charAt(0).toUpperCase() + resultWords[0].slice(1);
      }
      return resultWords.join(" ");
    }
    return str; // Safe skip if diff > 1
  } else {
    return str; // Safe skip if too long
  }
}

// Parse lines to find all questions and culprits
const lines = fs.readFileSync(srcPath, 'utf8').split('\n');
const culprits = [];

let currentCategory = '';
let questionIdxInCategory = 0;

lines.forEach((line, lineIdx) => {
  const trimmed = line.trim();
  
  // Track category changes in the file
  if (trimmed.startsWith('//') && trimmed.includes('CATEGORY:')) {
    // A comment like // CATEGORY: Common / First Year
    // But categories are actually keys in the QUESTIONS object
  }
  
  // Check if line contains a category key start
  // e.g., "Accounting for Engineers": [
  const catMatch = line.match(/^\s*"([^"]+)"\s*:\s*\[/);
  if (catMatch) {
    currentCategory = catMatch[1];
    questionIdxInCategory = 0;
  }
  
  if (trimmed.startsWith('{') && trimmed.includes('prompt:') && trimmed.includes('options:') && trimmed.includes('answer:')) {
    try {
      let evalLine = trimmed;
      if (evalLine.endsWith(',')) {
        evalLine = evalLine.slice(0, -1);
      }
      const q = eval(`(${evalLine})`);
      
      const options = q.options;
      const ansIdx = q.answer;
      
      const wordCounts = options.map(opt => opt.trim().split(/\s+/).filter(Boolean).length);
      const ansWords = wordCounts[ansIdx];
      const otherWords = wordCounts.filter((_, i) => i !== ansIdx);
      const maxOtherWords = Math.max(...otherWords);
      
      // Culprit: Correct answer is strictly the longest option by word count
      if (ansWords > maxOtherWords) {
        culprits.push({
          lineIdx,
          category: currentCategory,
          index: questionIdxInCategory,
          prompt: q.prompt,
          options: q.options,
          answer: q.answer,
          difficulty: q.difficulty,
          timeLimit: q.timeLimit
        });
      }
      
      questionIdxInCategory++;
    } catch (err) {
      console.error(`Failed to parse question on line ${lineIdx + 1}: ${err.message}`);
    }
  }
});

console.log(`Total culprits found: ${culprits.length}`);

// Initialize or load progress
let progress = {
  processedLineIndices: {},
  completedCount: 0
};

if (fs.existsSync(progressPath)) {
  progress = JSON.parse(fs.readFileSync(progressPath, 'utf8'));
  console.log(`Resuming from progress. Already processed: ${progress.completedCount} culprits.`);
}

const pendingCulprits = culprits.filter(c => !progress.processedLineIndices[c.lineIdx]);
console.log(`Pending culprits to process: ${pendingCulprits.length}`);

if (pendingCulprits.length === 0) {
  console.log('No pending culprits to process. We are done!');
  process.exit(0);
}

const systemPrompt = `You are an expert engineering professor and multiple-choice question editor.
You will be given a list of questions. For each question:
1. One option (the correct answer, specified by "answer" index) is longer than the other distractors. This creates length bias.
2. Your task is to rewrite the other three options (the distractors) so they make complete academic, scientific, or engineering sense in context, are grammatically flawless, natural-sounding, and have the EXACT SAME WORD COUNT.
3. CRITICAL RULES:
   - Every single option in the output array MUST have EXACTLY the same number of words. Count the words very carefully.
   - DO NOT under any circumstances use generic, repetitive, or obviously artificial filler phrases (such as "and other factors", "in some materials", "always", "in systems", "here", "by design", "consistently", "reliably") to pad the word counts.
   - TECHNICAL QUALIFIER INSTRUCTION: Symmetrically balance word counts by adding precise, contextually appropriate technical qualifiers, adjectives, or nouns to shorter options so they become detailed and professional. For example:
     * To pad "Atomic mass" (2 words) to 3 words, change it to "Relative atomic mass" or "Atomic mass value".
     * To pad "Crystal shape" (2 words) to 3 words, change it to "Crystal lattice shape" or "Internal crystal structure".
     * To pad "Generate current" (2 words) to 3 words, change it to "Generate electrical current" or "Generate circuit current".
     * To pad "Reduce resistance" (2 words) to 3 words, change it to "Reduce circuit resistance" or "Reduce electrical resistance".
     * To pad "Store electric energy" (3 words) to 4 words, change it to "Store electric potential energy" or "Store capacitive electric energy".
     This ensures all options are detailed, challenging, highly professional, and perfectly balanced without any robotic templates!
4. If necessary, you can slightly rewrite all four options (including the correct answer, as long as it retains its exact meaning and accuracy) so that they are all of equal detail, high quality, and have the EXACT SAME WORD COUNT.
5. Output the result as a JSON array of objects, where each object has:
  - "lineIdx": the line index of the question (must match the input exactly)
  - "options": the new array of 4 options (each having the exact same word count)
  - "answer": the index of the correct answer (must remain the same as the input)

Ensure the output is ONLY valid JSON, wrapped in a single root object: { "questions": [...] }. No other text.`;

async function callGroqWithRetry(batch, retries = 5, delayMs = 4000) {
  const batchData = batch.map(c => ({
    lineIdx: c.lineIdx,
    prompt: c.prompt,
    options: c.options,
    answer: c.answer
  }));
  
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          temperature: 0.1,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: JSON.stringify(batchData) }
          ]
        })
      });
      
      if (res.status === 429) {
        console.warn(`Rate limited (429). Retrying in ${delayMs}ms... (Attempt ${i + 1}/${retries})`);
        await new Promise(r => setTimeout(r, delayMs));
        delayMs *= 2.5; // exponential backoff
        continue;
      }
      
      if (!res.ok) {
        throw new Error(`Groq HTTP error: ${res.status}`);
      }
      
      const json = await res.json();
      if (!json.choices || !json.choices[0] || !json.choices[0].message || !json.choices[0].message.content) {
        throw new Error('Malformed completion response structure');
      }
      return JSON.parse(json.choices[0].message.content);
    } catch (err) {
      console.error(`Error on attempt ${i + 1}:`, err.message);
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, delayMs));
      delayMs *= 2.5;
    }
  }
}

async function run() {
  const batchSize = 15;
  let linesArray = [...lines];
  
  for (let i = 0; i < pendingCulprits.length; ) {
    const batch = pendingCulprits.slice(i, i + batchSize);
    console.log(`\nProcessing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(pendingCulprits.length / batchSize)} (${batch.length} questions)...`);
    
    try {
      const startTime = Date.now();
      const result = await callGroqWithRetry(batch);
      console.log(`Received response from Groq in ${((Date.now() - startTime) / 1000).toFixed(2)}s`);
      
      if (result && result.questions) {
        result.questions.forEach(qResult => {
          const original = batch.find(b => b.lineIdx === qResult.lineIdx);
          if (!original) return;
          
          let newOptions = qResult.options;
          const ansIdx = original.answer;
          const targetWordCount = newOptions[ansIdx].trim().split(/\s+/).filter(Boolean).length;
          
          // Force adjust word counts to be exactly equal
          newOptions = newOptions.map(opt => adjustWordCount(opt, targetWordCount));
          
          // Check for duplicate options (uniqueness validation)
          const uniqueOptions = new Set(newOptions.map(o => o.trim().toLowerCase()));
          if (uniqueOptions.size < 4) {
            console.warn(`[WARNING] Skipping line ${original.lineIdx} due to duplicate options: ${JSON.stringify(newOptions)}`);
            return; // Skip updating this line
          }
          
          // Check for exact word count matching across all options
          const hasDifferentWordCounts = newOptions.some(opt => opt.trim().split(/\s+/).filter(Boolean).length !== targetWordCount);
          if (hasDifferentWordCounts) {
            console.warn(`[WARNING] Skipping line ${original.lineIdx} due to mismatched word counts: ${JSON.stringify(newOptions)}`);
            return; // Skip updating this line
          }
          
          // Re-serialize the question line with exact original formatting
          const serializedOptions = newOptions.map(opt => JSON.stringify(opt)).join(', ');
          
          // Preserve other parameters like difficulty and timeLimit
          let serialized = `{ prompt: ${JSON.stringify(original.prompt)}, options: [${serializedOptions}], answer: ${original.answer}, difficulty: ${original.difficulty}, timeLimit: ${original.timeLimit} }`;
          
          const originalLine = linesArray[original.lineIdx];
          if (originalLine.trim().endsWith(',')) {
            serialized += ',';
          }
          
          const leadingWhitespace = originalLine.match(/^\s*/)[0];
          linesArray[original.lineIdx] = leadingWhitespace + serialized;
          
          // Record progress
          progress.processedLineIndices[original.lineIdx] = true;
          progress.completedCount++;
        });
        
        // Symmetrically write updated lines back to backend/questions.js
        fs.writeFileSync(srcPath, linesArray.join('\n'));
        fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2));
        
        console.log(`Saved progress. Total completed: ${progress.completedCount}/${culprits.length}`);
        
        // Cooldown between successful batches to prevent rate limit build-up (6.5s is optimal for Llama 3.3 70B)
        await new Promise(r => setTimeout(r, 6500));
        
        i += batchSize; // Only advance to next batch if successful!
      } else {
        throw new Error('Invalid response structure received from Groq');
      }
      
    } catch (err) {
      console.error(`Failed to process batch: ${err.message}. Retrying this batch in 15 seconds...`);
      await new Promise(r => setTimeout(r, 15000));
    }
  }
  
  console.log('\nAll culprits refactored and finalized successfully with Groq!');
}

run();
