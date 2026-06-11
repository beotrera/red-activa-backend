import { logger } from '../lib';

export interface SimilarityCandidate {
  personId: string;
  description: string;
}

export interface SimilarityResult {
  personId: string;
  score: number;
  matches: string[];
}

const STOP_WORDS = new Set([
  'de', 'la', 'el', 'en', 'un', 'una', 'con', 'por', 'para', 'que', 'del',
  'los', 'las', 'al', 'se', 'su', 'y', 'a', 'o', 'es', 'no', 'le', 'lo',
  'me', 'mi', 'si', 'ya', 'mas', 'pero', 'sin', 'sobre', 'entre', 'como',
  'muy', 'bien', 'fue', 'son', 'has', 'hay', 'sus', 'este', 'esta', 'esto',
]);

const normalize = (text: string): string =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ');

const tokenize = (text: string): string[] =>
  normalize(text)
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOP_WORDS.has(t));

const buildFreqVector = (tokens: string[]): Map<string, number> => {
  const freq = new Map<string, number>();
  for (const t of tokens) freq.set(t, (freq.get(t) ?? 0) + 1);
  return freq;
};

const cosineSimilarity = (a: Map<string, number>, b: Map<string, number>): number => {
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (const [term, countA] of a) {
    const countB = b.get(term) ?? 0;
    dot += countA * countB;
    normA += countA * countA;
  }
  for (const [, countB] of b) normB += countB * countB;

  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
};

const findMatchingTerms = (queryTokens: string[], candidateTokens: string[]): string[] => {
  const candidateSet = new Set(candidateTokens);
  return [...new Set(queryTokens.filter((t) => candidateSet.has(t)))];
};

const compare = async (
  query: string,
  candidates: SimilarityCandidate[],
): Promise<SimilarityResult[]> => {
  if (candidates.length === 0) return [];

  const queryTokens = tokenize(query);
  const queryVec = buildFreqVector(queryTokens);

  const results: SimilarityResult[] = candidates
    .map((c) => {
      const candidateTokens = tokenize(c.description);
      const candidateVec = buildFreqVector(candidateTokens);
      const score = cosineSimilarity(queryVec, candidateVec);
      const matches = findMatchingTerms(queryTokens, candidateTokens);
      return { personId: c.personId, score: Math.round(score * 100) / 100, matches };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);

  logger.info({ candidates: candidates.length, results: results.length }, 'Local similarity check');

  return results;
};

export const similarityService = { compare };
