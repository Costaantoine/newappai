export interface AssistantRequest {
  message: string
  conversationId?: string
  assistantId?: string
}

export interface AssistantResponse {
  message: string
  conversationId: string
  provider: 'openai' | 'deepseek' | 'gemini'
}

export interface TranslationRequest {
  text: string
  sourceLang?: string
  targetLang: string
}

export interface TranslationResponse {
  translatedText: string
  sourceLang: string
  targetLang: string
}

export interface TTSRequest {
  text: string
  voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'
  speed?: number
}

export interface TTSResponse {
  audio: string // base64 encoded audio
  format: 'mp3' | 'wav'
}

export interface EvaRequest {
  message: string
  context?: Record<string, unknown>
}

export interface EvaResponse {
  message: string
  actions?: Array<{
    type: string
    payload: Record<string, unknown>
  }>
}
