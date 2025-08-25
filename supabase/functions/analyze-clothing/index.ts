import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')

interface ClothingAnalysisResult {
  isValidClothingItem: boolean
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor'
  confidence: number
  estimatedValue: number
  category: string
  brand: string
  subcategory: string
  material: string
  suggestions: string[]
  conditionDetails: {
    fabricQuality: string
    wearPatterns: string
    stains: string
    overallState: string
  }
  marketInsights: {
    demandLevel: string
    seasonalFactor: string
    priceRange: {
      min: number
      max: number
      optimal: number
    }
  }
  errorMessage?: string
}

const analyzeWithGemini = async (imageBase64: string): Promise<ClothingAnalysisResult> => {
  const prompt = `You are an expert clothing appraiser and resale market specialist. Analyze this image in detail and provide a comprehensive assessment.

CRITICAL VALIDATION RULES:
- ONLY accept images showing: clothing, shoes, bags, jewelry, watches, sunglasses, belts, scarves, hats, or other wearable fashion accessories
- REJECT everything else including: screenshots, webpages, documents, furniture, electronics, food, animals, people (unless clearly focused on clothing), nature, vehicles, etc.
- Be EXTREMELY strict - if there's any doubt, set isValidClothingItem to false
- For screenshots or web pages, always respond with isValidClothingItem: false

If it IS a valid clothing/styling item, provide detailed analysis:

1. CONDITION ASSESSMENT (rate as Excellent/Good/Fair/Poor):
   - Excellent: Like new, no visible wear, perfect condition
   - Good: Minor wear, very good condition, small imperfections
   - Fair: Moderate wear, some visible issues but still sellable
   - Poor: Significant wear, stains, damage, needs repair

2. VALUE ESTIMATION: Provide realistic resale value in USD based on:
   - Item condition and quality
   - Brand recognition and market demand
   - Current fashion trends
   - Typical resale market prices

3. DETAILED ANALYSIS: Examine fabric quality, wear patterns, stains, overall state

4. MARKET INSIGHTS: Consider demand level, seasonal factors, and optimal pricing

5. IMPROVEMENT SUGGESTIONS: Provide 3-5 specific, actionable recommendations

Respond ONLY with valid JSON in this exact format:
{
  "isValidClothingItem": boolean,
  "condition": "Excellent|Good|Fair|Poor",
  "confidence": number (0-100),
  "estimatedValue": number,
  "category": "specific item type (e.g., Men's Cotton T-Shirt)",
  "brand": "brand name or Generic/Unbranded",
  "subcategory": "detailed classification",
  "material": "fabric/material type",
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"],
  "conditionDetails": {
    "fabricQuality": "assessment",
    "wearPatterns": "description",
    "stains": "description",
    "overallState": "summary"
  },
  "marketInsights": {
    "demandLevel": "High/Medium/Low",
    "seasonalFactor": "description",
    "priceRange": {
      "min": number,
      "max": number,
      "optimal": number
    }
  },
  "errorMessage": "error description if not valid clothing item"
}`

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: imageBase64.replace(/^data:image\/[a-z]+;base64,/, '')
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.1,
          topK: 32,
          topP: 1,
          maxOutputTokens: 2048,
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log('Gemini API response:', JSON.stringify(data, null, 2))

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response from Gemini API')
    }

    const textContent = data.candidates[0].content.parts[0].text
    console.log('Gemini raw response:', textContent)

    // Clean up the response text to extract JSON
    const jsonMatch = textContent.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Could not parse JSON from Gemini response')
    }

    const result = JSON.parse(jsonMatch[0])
    console.log('Parsed result:', result)

    return result
  } catch (error) {
    console.error('Error calling Gemini API:', error)
    throw error
  }
}

const validateImage = (imageBase64: string): { isValid: boolean; error?: string } => {
  // Check if it's a valid base64 image
  if (!imageBase64.startsWith('data:image/')) {
    return { isValid: false, error: 'Invalid image format. Please upload a valid image file.' }
  }

  // Check image size (base64 string length roughly correlates to file size)
  const sizeInBytes = (imageBase64.length * 3) / 4
  const maxSizeInMB = 10
  if (sizeInBytes > maxSizeInMB * 1024 * 1024) {
    return { isValid: false, error: `Image too large. Please upload an image smaller than ${maxSizeInMB}MB.` }
  }

  return { isValid: true }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not found in environment variables')
      return new Response(
        JSON.stringify({ error: 'AI service not configured properly' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const { image } = await req.json()

    if (!image) {
      return new Response(
        JSON.stringify({ error: 'No image provided' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Validate the image
    const validation = validateImage(image)
    if (!validation.isValid) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Starting clothing analysis...')
    const analysisResult = await analyzeWithGemini(image)

    // If not a valid clothing item, return error
    if (!analysisResult.isValidClothingItem) {
      return new Response(
        JSON.stringify({ 
          error: analysisResult.errorMessage || 'Please upload an image of clothing or styling accessories. We can analyze shirts, pants, dresses, shoes, bags, jewelry, and other fashion items.'
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Return successful analysis
    return new Response(
      JSON.stringify({ analysis: analysisResult }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in analyze-clothing function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to analyze image. Please try again with a clearer image.',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})