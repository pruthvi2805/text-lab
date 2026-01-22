"use client";

import { useState, useCallback, useMemo } from "react";
import { ToolLayout } from "@/components/tools";

interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  nonEmptyLines: number;
  avgWordLength: number;
  avgSentenceLength: number;
  readingTimeMinutes: number;
  speakingTimeMinutes: number;
  uniqueWords: number;
  topWords: { word: string; count: number }[];
}

function analyzeText(text: string): TextStats {
  if (!text.trim()) {
    return {
      characters: 0,
      charactersNoSpaces: 0,
      words: 0,
      sentences: 0,
      paragraphs: 0,
      lines: 0,
      nonEmptyLines: 0,
      avgWordLength: 0,
      avgSentenceLength: 0,
      readingTimeMinutes: 0,
      speakingTimeMinutes: 0,
      uniqueWords: 0,
      topWords: [],
    };
  }

  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;

  // Words: split by whitespace and filter empty
  const wordMatches = text.match(/\b[\w']+\b/g) || [];
  const words = wordMatches.length;

  // Sentences: split by .!? followed by space or end
  const sentenceMatches = text.match(/[^.!?]*[.!?]+/g) || [];
  const sentences = sentenceMatches.length || (text.trim() ? 1 : 0);

  // Paragraphs: split by double newline
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim()).length || (text.trim() ? 1 : 0);

  // Lines
  const allLines = text.split("\n");
  const lines = allLines.length;
  const nonEmptyLines = allLines.filter((l) => l.trim()).length;

  // Average word length
  const totalWordLength = wordMatches.reduce((sum, word) => sum + word.length, 0);
  const avgWordLength = words > 0 ? totalWordLength / words : 0;

  // Average sentence length (in words)
  const avgSentenceLength = sentences > 0 ? words / sentences : 0;

  // Reading time (200 words per minute average)
  const readingTimeMinutes = words / 200;

  // Speaking time (150 words per minute average)
  const speakingTimeMinutes = words / 150;

  // Unique words and frequency
  const wordFrequency: Record<string, number> = {};
  wordMatches.forEach((word) => {
    const lower = word.toLowerCase();
    wordFrequency[lower] = (wordFrequency[lower] || 0) + 1;
  });

  const uniqueWords = Object.keys(wordFrequency).length;

  // Top 10 most frequent words (excluding common stop words)
  const stopWords = new Set([
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "as", "is", "was", "are", "were", "been",
    "be", "have", "has", "had", "do", "does", "did", "will", "would",
    "could", "should", "may", "might", "must", "it", "its", "this", "that",
    "these", "those", "i", "you", "he", "she", "we", "they", "what", "which",
    "who", "whom", "when", "where", "why", "how", "not", "no", "yes",
  ]);

  const topWords = Object.entries(wordFrequency)
    .filter(([word]) => !stopWords.has(word) && word.length > 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }));

  return {
    characters,
    charactersNoSpaces,
    words,
    sentences,
    paragraphs,
    lines,
    nonEmptyLines,
    avgWordLength,
    avgSentenceLength,
    readingTimeMinutes,
    speakingTimeMinutes,
    uniqueWords,
    topWords,
  };
}

function formatTime(minutes: number): string {
  if (minutes < 1) {
    const seconds = Math.round(minutes * 60);
    return `${seconds} sec`;
  }
  const mins = Math.floor(minutes);
  const secs = Math.round((minutes - mins) * 60);
  if (secs === 0) return `${mins} min`;
  return `${mins} min ${secs} sec`;
}

export default function TextStatsPage() {
  const [input, setInput] = useState("");

  const stats = useMemo(() => analyzeText(input), [input]);

  const output = useMemo(() => {
    if (!input.trim()) return "";

    const lines = [
      "═══════════════════════════════════════",
      "                TEXT STATISTICS",
      "═══════════════════════════════════════",
      "",
      "CHARACTERS",
      `  Total:              ${stats.characters.toLocaleString()}`,
      `  Without spaces:     ${stats.charactersNoSpaces.toLocaleString()}`,
      "",
      "WORDS & STRUCTURE",
      `  Words:              ${stats.words.toLocaleString()}`,
      `  Unique words:       ${stats.uniqueWords.toLocaleString()}`,
      `  Sentences:          ${stats.sentences.toLocaleString()}`,
      `  Paragraphs:         ${stats.paragraphs.toLocaleString()}`,
      `  Lines:              ${stats.lines.toLocaleString()} (${stats.nonEmptyLines} non-empty)`,
      "",
      "AVERAGES",
      `  Avg word length:    ${stats.avgWordLength.toFixed(1)} characters`,
      `  Avg sentence:       ${stats.avgSentenceLength.toFixed(1)} words`,
      "",
      "READING TIME",
      `  Reading (~200 wpm): ${formatTime(stats.readingTimeMinutes)}`,
      `  Speaking (~150 wpm): ${formatTime(stats.speakingTimeMinutes)}`,
    ];

    if (stats.topWords.length > 0) {
      lines.push("");
      lines.push("TOP KEYWORDS");
      stats.topWords.forEach((item, i) => {
        const bar = "█".repeat(Math.min(item.count, 20));
        lines.push(`  ${(i + 1).toString().padStart(2)}. ${item.word.padEnd(15)} ${item.count.toString().padStart(3)}  ${bar}`);
      });
    }

    lines.push("");
    lines.push("═══════════════════════════════════════");

    return lines.join("\n");
  }, [input, stats]);

  const handleInputChange = useCallback((value: string) => {
    setInput(value);
  }, []);

  return (
    <ToolLayout
      input={input}
      output={output}
      onInputChange={handleInputChange}
      inputPlaceholder="Paste or type text to analyze..."
      outputPlaceholder="→ Text statistics will appear here"
      options={
        <div className="flex flex-wrap items-center gap-4 text-xs text-text-secondary">
          <span>
            <strong className="text-text-primary">{stats.words.toLocaleString()}</strong> words
          </span>
          <span>
            <strong className="text-text-primary">{stats.characters.toLocaleString()}</strong> chars
          </span>
          <span>
            <strong className="text-text-primary">{stats.sentences.toLocaleString()}</strong> sentences
          </span>
          <span>
            ~<strong className="text-text-primary">{formatTime(stats.readingTimeMinutes)}</strong> read
          </span>
        </div>
      }
    />
  );
}
