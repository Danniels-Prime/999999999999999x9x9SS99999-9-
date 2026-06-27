import Anthropic from '@anthropic-ai/sdk';

export interface MnemonicContent {
  phoneticHook: string;
  imageConcepts: string[];
  imagePrompt: string;
  contextSentence: { ru: string; en: string };
}

const PROMPT_TEMPLATE = (word: string, translation: string, romanization: string) => `
You are a mnemonic content generator for a Russian language learning app. Your goal is absurdity and memorability — the weirder and more visceral the image, the better it sticks.

Russian word: "${word}"
English meaning: "${translation}"
Romanization: "${romanization}"

Generate the following as valid JSON (no markdown, no explanation, just the JSON object):
{
  "phoneticHook": "A single sentence showing how the Russian pronunciation sounds like English words and creates a vivid, ridiculous image. Example: 'SPAH-see-ba → a SPA where a SEEBA seal slaps you with a towel'",
  "imageConcepts": [
    "Concept 1: A surreal exaggerated visual scenario encoding the meaning through the phonetic hook",
    "Concept 2: An alternative surreal scenario, different emotional tone",
    "Concept 3: A third option, maximally absurd"
  ],
  "imagePrompt": "The single strongest concept as a Midjourney-style image generation prompt, vivid and cinematic",
  "contextSentence": {
    "ru": "A natural Russian sentence using ${word} in context",
    "en": "English translation of the sentence"
  }
}
`.trim();

export async function generateMnemonicContent(
  word: string,
  translation: string,
  romanization: string
): Promise<MnemonicContent> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{ role: 'user', content: PROMPT_TEMPLATE(word, translation, romanization) }],
  });

  const text = message.content.find((b) => b.type === 'text')?.text ?? '';

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON found in Claude response');

  return JSON.parse(jsonMatch[0]) as MnemonicContent;
}
