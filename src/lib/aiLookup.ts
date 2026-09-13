import { getApiKey } from './settings'

export interface LookupResult {
  reading: string
  romaji?: string
  english: string
  chinese: string
}

export class AiLookupError extends Error {}

const MODEL = 'claude-opus-5'
const API_URL = 'https://api.anthropic.com/v1/messages'
const TOOL_NAME = 'provide_lookup'

function buildToolSchema(includeRomaji: boolean) {
  const properties: Record<string, unknown> = {
    reading: { type: 'string', description: 'Hiragana reading of the written text.' },
    english: { type: 'string', description: 'English translation.' },
    chinese: { type: 'string', description: 'Chinese translation.' },
  }
  const required = ['reading', 'english', 'chinese']
  if (includeRomaji) {
    properties.romaji = {
      type: 'string',
      description:
        'The romaji a Japanese IME keyboard user would type to produce this text — handle small ' +
        'っ consonant-doubling, ん, and long vowels correctly. Not naive letter-by-letter romanization.',
    }
    required.push('romaji')
  }
  return {
    type: 'object',
    properties,
    required,
    additionalProperties: false,
  }
}

export async function lookupJapanese(written: string, kind: 'vocab' | 'sentence'): Promise<LookupResult> {
  const apiKey = getApiKey()
  if (!apiKey) {
    throw new AiLookupError('No Anthropic API key configured. Add one in Settings.')
  }

  const includeRomaji = kind === 'vocab'
  const prompt =
    kind === 'vocab'
      ? `Look up the Japanese word or phrase "${written}". Provide its hiragana reading, the romaji ` +
        'you would type on a Japanese IME keyboard to produce this text (handling small っ ' +
        'consonant-doubling, ん, and long vowels correctly — not naive letter-by-letter romanization), ' +
        'an English translation, and a Chinese translation.'
      : `Look up the Japanese sentence "${written}". Provide its hiragana reading, an English ` +
        'translation, and a Chinese translation.'

  let response: Response
  try {
    response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        tools: [
          {
            name: TOOL_NAME,
            description: 'Provide the structured lookup result for a Japanese word or sentence.',
            input_schema: buildToolSchema(includeRomaji),
          },
        ],
        tool_choice: { type: 'tool', name: TOOL_NAME },
        messages: [{ role: 'user', content: prompt }],
      }),
    })
  } catch {
    throw new AiLookupError('Network error contacting the Anthropic API. Check your connection.')
  }

  if (!response.ok) {
    if (response.status === 401) throw new AiLookupError('Invalid API key. Check it in Settings.')
    if (response.status === 429) throw new AiLookupError('Rate limited by the Anthropic API. Try again shortly.')
    let detail = ''
    try {
      const body = await response.json()
      detail = body?.error?.message ?? ''
    } catch {
      // ignore unparsable error body
    }
    throw new AiLookupError(`Anthropic API error (${response.status})${detail ? `: ${detail}` : '.'}`)
  }

  const data = await response.json()
  const toolUse = (data.content ?? []).find((block: { type: string }) => block.type === 'tool_use')
  if (!toolUse) {
    throw new AiLookupError('Unexpected response from the Anthropic API (no suggestion returned).')
  }

  const input = toolUse.input as Record<string, unknown>
  return {
    reading: String(input.reading ?? ''),
    romaji: includeRomaji ? String(input.romaji ?? '') : undefined,
    english: String(input.english ?? ''),
    chinese: String(input.chinese ?? ''),
  }
}
