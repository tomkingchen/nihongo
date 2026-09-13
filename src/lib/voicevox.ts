export class VoicevoxError extends Error {}

export interface VoicevoxSpeakerStyle {
  id: number
  name: string
}

export interface VoicevoxSpeaker {
  name: string
  speakerUuid: string
  styles: VoicevoxSpeakerStyle[]
}

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.trim().replace(/\/+$/, '')
}

function unreachableMessage(baseUrl: string): string {
  return (
    `Could not reach the VOICEVOX engine at ${baseUrl}. Make sure the VOICEVOX app is running and, ` +
    "if it's on a different origin/port than this page, that it was started with a CORS setting " +
    'allowing this origin (see README).'
  )
}

export async function fetchVoicevoxSpeakers(baseUrl: string): Promise<VoicevoxSpeaker[]> {
  const base = normalizeBaseUrl(baseUrl)
  let response: Response
  try {
    response = await fetch(`${base}/speakers`)
  } catch {
    throw new VoicevoxError(unreachableMessage(baseUrl))
  }
  if (!response.ok) {
    throw new VoicevoxError(`VOICEVOX /speakers request failed (${response.status}).`)
  }
  const data = (await response.json()) as Array<{
    name: string
    speaker_uuid: string
    styles: Array<{ id: number; name: string }>
  }>
  return data.map((speaker) => ({
    name: speaker.name,
    speakerUuid: speaker.speaker_uuid,
    styles: speaker.styles.map((style) => ({ id: style.id, name: style.name })),
  }))
}

export async function synthesizeVoicevox(text: string, baseUrl: string, speakerId: number): Promise<Blob> {
  const base = normalizeBaseUrl(baseUrl)

  let queryResponse: Response
  try {
    queryResponse = await fetch(`${base}/audio_query?speaker=${speakerId}&text=${encodeURIComponent(text)}`, {
      method: 'POST',
    })
  } catch {
    throw new VoicevoxError(unreachableMessage(baseUrl))
  }
  if (!queryResponse.ok) {
    throw new VoicevoxError(`VOICEVOX audio_query request failed (${queryResponse.status}).`)
  }
  const audioQuery = await queryResponse.json()

  let synthesisResponse: Response
  try {
    synthesisResponse = await fetch(`${base}/synthesis?speaker=${speakerId}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(audioQuery),
    })
  } catch {
    throw new VoicevoxError(unreachableMessage(baseUrl))
  }
  if (!synthesisResponse.ok) {
    throw new VoicevoxError(`VOICEVOX synthesis request failed (${synthesisResponse.status}).`)
  }
  return await synthesisResponse.blob()
}
