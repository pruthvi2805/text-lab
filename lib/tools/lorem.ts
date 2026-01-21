export type LoremUnit = "words" | "sentences" | "paragraphs";

export interface LoremOptions {
  count: number;
  unit: LoremUnit;
  startWithLorem: boolean;
}

export interface LoremResult {
  text: string;
  wordCount: number;
  sentenceCount: number;
  paragraphCount: number;
}

// Classic Lorem Ipsum words
const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint",
  "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia",
  "deserunt", "mollit", "anim", "id", "est", "laborum", "at", "vero", "eos",
  "accusamus", "iusto", "odio", "dignissimos", "ducimus", "blanditiis",
  "praesentium", "voluptatum", "deleniti", "atque", "corrupti", "quos",
  "dolores", "quas", "molestias", "excepturi", "obcaecati", "cupiditate",
  "provident", "similique", "mollitia", "animi", "quasi", "architecto",
  "beatae", "vitae", "dicta", "explicabo", "nemo", "ipsam", "quia", "voluptas",
  "aspernatur", "odit", "fugit", "consequuntur", "magni", "dolorem", "porro",
  "quisquam", "nihil", "ipsa", "quae", "ab", "illo", "inventore", "veritatis",
  "accusantium", "doloremque", "laudantium", "totam", "rem", "aperiam", "eaque",
  "cumque", "harum", "rerum", "hic", "tenetur", "sapiente", "delectus", "aut",
  "reiciendis", "voluptatibus", "maiores", "alias", "perferendis", "doloribus",
  "asperiores", "repellat", "temporibus", "autem", "quibusdam", "officiis",
  "debitis", "necessitatibus", "saepe", "eveniet", "voluptates", "repudiandae",
  "recusandae", "itaque", "earum", "horum", "maxime", "placeat", "facere",
  "possimus", "omnis", "assumenda", "repellendus", "perspiciatis", "unde",
];

// The classic opening phrase
const LOREM_OPENING = "Lorem ipsum dolor sit amet, consectetur adipiscing elit";

/**
 * Generate Lorem Ipsum text
 */
export function generateLorem(options: LoremOptions): LoremResult {
  const { count, unit, startWithLorem } = options;

  let text: string;
  let wordCount: number;
  let sentenceCount: number;
  let paragraphCount: number;

  switch (unit) {
    case "words":
      text = generateWords(count, startWithLorem);
      wordCount = count;
      sentenceCount = Math.max(1, Math.ceil(count / 10));
      paragraphCount = 1;
      break;

    case "sentences":
      text = generateSentences(count, startWithLorem);
      wordCount = countWords(text);
      sentenceCount = count;
      paragraphCount = Math.max(1, Math.ceil(count / 5));
      break;

    case "paragraphs":
      text = generateParagraphs(count, startWithLorem);
      wordCount = countWords(text);
      sentenceCount = countSentences(text);
      paragraphCount = count;
      break;

    default:
      text = generateWords(50, startWithLorem);
      wordCount = 50;
      sentenceCount = 5;
      paragraphCount = 1;
  }

  return {
    text,
    wordCount,
    sentenceCount,
    paragraphCount,
  };
}

/**
 * Generate random words
 */
function generateWords(count: number, startWithLorem: boolean): string {
  if (count <= 0) return "";

  const words: string[] = [];
  let currentSentenceLength = 0;
  const avgSentenceLength = 10;

  for (let i = 0; i < count; i++) {
    let word: string;

    if (startWithLorem && i < 8) {
      // Use the classic opening words
      const openingWords = LOREM_OPENING.replace(/[,\.]/g, "").toLowerCase().split(" ");
      word = openingWords[i] || getRandomWord();
    } else {
      word = getRandomWord();
    }

    // Capitalize first word of sentence
    if (currentSentenceLength === 0) {
      word = capitalize(word);
    }

    words.push(word);
    currentSentenceLength++;

    // End sentence randomly around avgSentenceLength
    if (
      currentSentenceLength >= avgSentenceLength - 3 &&
      (Math.random() < 0.3 || currentSentenceLength >= avgSentenceLength + 5)
    ) {
      if (i < count - 1) {
        words[words.length - 1] += ".";
        currentSentenceLength = 0;
      }
    }
    // Add comma sometimes
    else if (currentSentenceLength > 3 && Math.random() < 0.1) {
      words[words.length - 1] += ",";
    }
  }

  // End with period
  let text = words.join(" ");
  if (!text.endsWith(".")) {
    text += ".";
  }

  return text;
}

/**
 * Generate random sentences
 */
function generateSentences(count: number, startWithLorem: boolean): string {
  if (count <= 0) return "";

  const sentences: string[] = [];

  for (let i = 0; i < count; i++) {
    const wordCount = randomBetween(8, 15);
    let sentence: string;

    if (startWithLorem && i === 0) {
      sentence = LOREM_OPENING + ".";
    } else {
      const words: string[] = [];
      for (let j = 0; j < wordCount; j++) {
        let word = getRandomWord();
        if (j === 0) word = capitalize(word);
        words.push(word);

        // Add comma sometimes in middle of sentence
        if (j > 2 && j < wordCount - 2 && Math.random() < 0.15) {
          words[words.length - 1] += ",";
        }
      }
      sentence = words.join(" ") + ".";
    }

    sentences.push(sentence);
  }

  return sentences.join(" ");
}

/**
 * Generate random paragraphs
 */
function generateParagraphs(count: number, startWithLorem: boolean): string {
  if (count <= 0) return "";

  const paragraphs: string[] = [];

  for (let i = 0; i < count; i++) {
    const sentenceCount = randomBetween(4, 8);
    const paragraph = generateSentences(sentenceCount, startWithLorem && i === 0);
    paragraphs.push(paragraph);
  }

  return paragraphs.join("\n\n");
}

/**
 * Get a random word from the word list
 */
function getRandomWord(): string {
  return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
}

/**
 * Capitalize first letter
 */
function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

/**
 * Random number between min and max (inclusive)
 */
function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Count words in text
 */
function countWords(text: string): number {
  return text.split(/\s+/).filter((w) => w.length > 0).length;
}

/**
 * Count sentences in text
 */
function countSentences(text: string): number {
  return (text.match(/[.!?]+/g) || []).length;
}

/**
 * Format result for display
 */
export function formatLoremOutput(result: LoremResult): string {
  const stats = [
    `Words: ${result.wordCount}`,
    `Sentences: ${result.sentenceCount}`,
    `Paragraphs: ${result.paragraphCount}`,
  ].join(" | ");

  return `${result.text}\n\n---\n${stats}`;
}

export const loremUnits: { value: LoremUnit; label: string }[] = [
  { value: "words", label: "Words" },
  { value: "sentences", label: "Sentences" },
  { value: "paragraphs", label: "Paragraphs" },
];

export const loremPresets: { count: number; unit: LoremUnit; label: string }[] = [
  { count: 50, unit: "words", label: "50 Words" },
  { count: 100, unit: "words", label: "100 Words" },
  { count: 5, unit: "sentences", label: "5 Sentences" },
  { count: 10, unit: "sentences", label: "10 Sentences" },
  { count: 1, unit: "paragraphs", label: "1 Paragraph" },
  { count: 3, unit: "paragraphs", label: "3 Paragraphs" },
  { count: 5, unit: "paragraphs", label: "5 Paragraphs" },
];
