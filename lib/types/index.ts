export type LanguageCode = 'ru' | 'es' | 'fr' | 'de' | 'ja';

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  script: 'cyrillic' | 'latin' | 'kanji';
}

export const LANGUAGES: Record<LanguageCode, Language> = {
  ru: { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', script: 'cyrillic' },
  es: { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', script: 'latin' },
  fr: { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', script: 'latin' },
  de: { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', script: 'latin' },
  ja: { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', script: 'kanji' },
};

export type SRSLevel = 'new' | 'learning' | 'review' | 'mastered';

export type PartOfSpeech = 'noun' | 'verb' | 'adj' | 'adv' | 'phrase' | 'particle' | 'other';

export interface ExampleSentence {
  sentence: string;
  translation: string;
}

export interface VocabCard {
  id: string;
  languageCode: LanguageCode;
  word: string;
  romanization: string;
  translation: string;
  partOfSpeech: PartOfSpeech;
  frequency: number;
  mnemonicStory: string;
  mnemonicImage?: string;
  altMnemonicImage?: string;
  phoneticHook?: string;
  exampleSentences: ExampleSentence[];
  tags: string[];
  // SM-2 SRS fields
  srsLevel: SRSLevel;
  interval: number;
  repetitions: number;
  easeFactor: number;
  dueDate: string; // ISO date YYYY-MM-DD
  lastReviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AudioClip {
  id: string;
  wordId: string;
  contextSentence: string;
  audioUrl: string;
  speedTag: 'natural' | 'slow';
  speakerName?: string;
  createdAt: string;
}

export interface CardReview {
  cardId: string;
  quality: 0 | 2 | 3 | 5;
  responseTimeMs: number;
  previousInterval: number;
  newInterval: number;
}

export interface StudySession {
  id: string;
  languageCode: LanguageCode;
  startedAt: string;
  endedAt?: string;
  cardsReviewed: CardReview[];
  xpEarned: number;
  sessionType: 'neomonix' | 'drills';
}

export type PhraseCategory =
  | 'greetings'
  | 'farewells'
  | 'politeness'
  | 'questions'
  | 'numbers'
  | 'time'
  | 'travel'
  | 'food'
  | 'shopping'
  | 'health'
  | 'emotions'
  | 'family'
  | 'directions'
  | 'weather'
  | 'work'
  | 'social'
  | 'custom';

export const PHRASE_CATEGORIES: Record<PhraseCategory, string> = {
  greetings: 'Greetings',
  farewells: 'Farewells',
  politeness: 'Politeness',
  questions: 'Questions',
  numbers: 'Numbers & Time',
  time: 'Time',
  travel: 'Travel',
  food: 'Food & Drink',
  shopping: 'Shopping',
  health: 'Health',
  emotions: 'Emotions',
  family: 'Family',
  directions: 'Directions',
  weather: 'Weather',
  work: 'Work & Study',
  social: 'Social',
  custom: 'Custom',
};

export interface Phrase {
  id: string;
  languageCode: LanguageCode;
  original: string;
  romanization: string;
  translation: string;
  category: PhraseCategory;
  notes?: string;
  isCustom: boolean;
  sourceVideoId?: string;
  sourceTimestamp?: number;
  drillStatus: 'unstarted' | 'learning' | 'known';
  lastDrilledAt?: string;
  createdAt: string;
}

export type VideoWatchStatus = 'unwatched' | 'in-progress' | 'watched' | 'shadow-complete';

export interface VideoEntry {
  id: string;
  languageCode: LanguageCode;
  url: string;
  youtubeId?: string;
  title: string;
  thumbnailUrl?: string;
  channelName?: string;
  notes?: string;
  tags: string[];
  watchStatus: VideoWatchStatus;
  savedPhraseIds: string[];
  addedAt: string;
  lastOpenedAt?: string;
}

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  content: string;
  affirmationId?: string;
  awarenessPromptId?: string;
  moodScore?: 1 | 2 | 3 | 4 | 5;
  updatedAt: string;
}

export interface Affirmation {
  id: string;
  text: string;
  category: 'confidence' | 'consistency' | 'growth' | 'language';
}

export interface AwarenessPrompt {
  id: string;
  question: string;
  hint?: string;
}

export interface UserSettings {
  showRomanization: boolean;
  dailyGoalXP: number;
  cardsPerSession: number;
  drillsPerSession: number;
}

export interface UserProgress {
  id: 'singleton';
  currentLanguage: LanguageCode;
  streakDays: number;
  lastStudiedDate: string; // YYYY-MM-DD
  totalXP: number;
  totalCardsLearned: number;
  totalSessionsCompleted: number;
  todayXP: number;
  settings: UserSettings;
}

export const DEFAULT_USER_PROGRESS: UserProgress = {
  id: 'singleton',
  currentLanguage: 'ru',
  streakDays: 0,
  lastStudiedDate: '',
  totalXP: 0,
  totalCardsLearned: 0,
  totalSessionsCompleted: 0,
  todayXP: 0,
  settings: {
    showRomanization: true,
    dailyGoalXP: 100,
    cardsPerSession: 20,
    drillsPerSession: 15,
  },
};

export const XP_PER_QUALITY: Record<0 | 2 | 3 | 5, number> = {
  0: 0,
  2: 5,
  3: 10,
  5: 15,
};

export const SESSION_COMPLETION_BONUS = 25;
