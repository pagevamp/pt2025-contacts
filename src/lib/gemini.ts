import fetch from 'node-fetch'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp' 
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`

export interface IUserAdventure {
  adventure: string
  secret_skill: string
  advice: string
}

export async function generateUserAdventure(
  description: string,
  owes_me: string,
  username: string
): Promise<IUserAdventure | null> {
  if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not set in environment variables')
    throw new Error('GEMINI_API_KEY is not set!')
  }

  const prompt = `

You are a flamboyant, witty, and slightly mischievous con-man fortune teller. Your task is to create a playful reading for ${username}, who is described as "${description}" and owes ${owes_me}.  

Your response should include three parts:

1. **Funny Advice:**  
   Give ${username} absurd, hilarious, and slightly misleading advice. It should be based on their personality and debt, relevant but clearly over-the-top and entertaining. Think like a fraudulent fortune teller who makes mundane situations sound mysterious and important. Do not make it more than 1 line 

2. **Secret Skill:**  
   Invent a ridiculous secret skill for ${username}. The skill should be a pun or playful twist inspired by their username, debt, or personality description.  Do not make it more than 1 line 

3. **Mini Tale of Adventure:**  
   Create a short, 2 line story of a future adventure for ${username}. It should be absurd, funny, and highlight their unique traits. Think of it as a tiny, charming escapade that could happen to them soon. 

**Tone & Style:**  
- Witty, over-the-top, and playful.  
- Never rude or mean-spirited.  

Return JSON in this format:
{
  "adventure": "story here",

  "secret_skill": "skill here", 
  
  "advice": "advice here"
}

Return ONLY JSON, no other text.
`

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ],
    generation_config: {
      response_mime_type: 'application/json',
      temperature: 0.7,
      max_output_tokens: 5000,
      top_p: 0.9,
    },
    safety_settings: [
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
    ],
  }

  try {
    console.log(`Calling Gemini API for user: ${username}`)

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('Gemini API HTTP error:', response.status, errText)
      throw new Error(`Gemini API error: ${response.status} - ${errText}`)
    }

    const rawJson: unknown = await response.json()
    console.log('Raw API response structure received')

    const responseJson = rawJson as {
      candidates?: Array<{
        content?: {
          parts?: Array<{
            text?: string
          }>
        }
        finishReason?: string
      }>
      promptFeedback?: {
        blockReason?: string
      }
    }

    // Check for blocking issues
    if (responseJson.promptFeedback?.blockReason) {
      console.error(
        'Content was blocked:',
        responseJson.promptFeedback.blockReason
      )
      return null
    }

    const candidate = responseJson.candidates?.[0]

    if (candidate?.finishReason) {
      console.log('Generation finished with reason:', candidate.finishReason)

      if (candidate.finishReason === 'MAX_TOKENS') {
        console.log('Warning: Response was truncated due to token limit')
      } else if (candidate.finishReason !== 'STOP') {
        console.error('Generation failed with reason:', candidate.finishReason)
        return null
      }
    }

    const replyText = candidate?.content?.parts?.[0]?.text

    if (!replyText) {
      console.error('No text found in response')
      console.log('Full response:', JSON.stringify(rawJson, null, 2))
      return null
    }

    console.log('Raw text response length:', replyText.length)
    console.log('Raw text preview:', replyText.substring(0, 200) + '...')

    const cleanText = replyText
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .trim()

    try {
      const parsed = JSON.parse(cleanText) as IUserAdventure

      if (!parsed.adventure || !parsed.secret_skill || !parsed.advice) {
        console.error('Missing required fields in parsed JSON:', {
          hasAdventure: !!parsed.adventure,
          hasSecretSkill: !!parsed.secret_skill,
          hasAdvice: !!parsed.advice,
          parsed,
        })
        return null
      }

      console.log('Successfully parsed adventure response')
      return parsed
    } catch (parseErr) {
      console.error('JSON parse error:', parseErr)
      console.error('Text that failed to parse:', cleanText)

      // Try to extract JSON if it's wrapped in other text
      const jsonMatch = cleanText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        console.log('Attempting to extract JSON from text...')
        try {
          const extracted = JSON.parse(jsonMatch[0]) as IUserAdventure
          if (
            extracted.adventure &&
            extracted.secret_skill &&
            extracted.advice
          ) {
            console.log('Successfully extracted JSON from text')
            return extracted
          }
        } catch (extractErr) {
          console.error('Failed to parse extracted JSON:', extractErr)
        }
      }

      return null
    }
  } catch (err) {
    console.error('Unexpected error in generateUserAdventure:', err)
    return null
  }
}
