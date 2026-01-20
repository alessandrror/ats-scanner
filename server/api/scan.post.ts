import { z } from 'zod'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { scanBodySchema, scanResponseSchema } from '../../app/utils/scan'

const englishPrompt = (resumeText: string) => `
    You are an expert ATS (Applicant Tracking System) and resume reviewer.
    Analyze the following resume text and provide a detailed review.

    Return the response ONLY as a valid JSON object with the following structure:
    {
      "score": number (0-100),
      "pros": ["string", ...],
      "cons": ["string", ...],
      "structured": {
        "categories": [
          {
            "name": "string (e.g., Formatting, Content, ATS-friendly, Impact)",
            "pros": ["string", ...],
            "cons": ["string", ...]
          },
          ...
        ]
      }
    }

    Ensure the JSON is valid and contains no extra text or markdown formatting.
    The "pros" and "cons" in the root should be the top 3-5 overall points.
    The "structured.categories" should contain 2-4 specific categories.

    Resume Text:
    ${resumeText}
  `

  const spanishPrompt = (resumeText: string) => `
    Eres un experto en ATS (Applicant Tracking System) y revisor de currículos.
    Analiza el siguiente texto del currículum y proporciona una revisión detallada.

    Devuelve la respuesta SOLO como un objeto JSON válido con la siguiente estructura:
    {
      "score": number (0-100),
      "pros": ["string", ...],
      "cons": ["string", ...],
      "structured": {
        "categories": [
          {
            "name": "string (e.g., Formatting, Content, ATS-friendly, Impact)",
            "pros": ["string", ...],
            "cons": ["string", ...]
          },
          ...
        ]
      }
    }

    Asegúrate de que el JSON es válido y no contiene ningún texto extra o formato markdown.
    Los "pros" y "cons" en la raíz deben ser los puntos principales de los 3-5 puntos generales.
    El "structured.categories" debe contener 2-4 categorías específicas.

    Texto del currículum:
    ${resumeText}
  `

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiKey = config.geminiApiKey

  if (!apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Gemini API key is not configured.'
    })
  }

  const body = await readBody(event)
  const result = scanBodySchema.safeParse(body)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body.',
      data: z.treeifyError(result.error)
    })
  }

  const { text, locale } = result.data

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  const prompt = locale === 'en' ? englishPrompt(text) : spanishPrompt(text)

  try {
    const chatResult = await model.generateContent(prompt)
    const responseText = chatResult.response.text().trim()

    // Attempt to extract JSON if Gemini includes markdown blocks
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    const cleanJson = jsonMatch ? jsonMatch[0] : responseText

    const analysis = JSON.parse(cleanJson)
    const validatedAnalysis = scanResponseSchema.safeParse(analysis)

    return validatedAnalysis
  } catch (error: any) {
    console.error('Gemini Analysis Error:', error)
    throw createError({
      statusCode: 502,
      statusMessage: 'Failed to analyze resume with AI.',
      data: error.message
    })
  }
})
