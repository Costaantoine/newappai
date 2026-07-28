// Service de traduction automatique
export async function translateText(text: string, targetLang: string): Promise<string> {
  try {
    // Utilisation de l'API de traduction gratuite (MyMemory)
    const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=fr|${targetLang}`)
    
    if (!response.ok) {
      throw new Error('Translation API error')
    }
    
    const data = await response.json()
    
    if (data.responseStatus === 200 && data.responseData.translatedText) {
      return data.responseData.translatedText
    }
    
    // Fallback: retourne le texte original si la traduction échoue
    return text
  } catch (error) {
    console.error('Translation error:', error)
    return text // Fallback
  }
}

export async function translateToAllLanguages(frenchText: string): Promise<{
  fr: string
  en: string
  pt: string
  es: string
}> {
  const [en, pt, es] = await Promise.all([
    translateText(frenchText, 'en'),
    translateText(frenchText, 'pt'),
    translateText(frenchText, 'es')
  ])
  
  return {
    fr: frenchText,
    en,
    pt,
    es
  }
}
