
import 'dotenv/config'
import { GoogleGenAI } from "@google/genai"
 const ai = new GoogleGenAI(process.env.gemini_api_key)

const getGeminAiResponse = async (message) => {
  // const { message } = req.body

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents:[{
        text: message,
        role: "user" ,
        
      }]
    })

  //  const data = await res.json({ reply: response.text })
  const reply = response.candidates[0].content.parts[0].text;
    // res.send(response) ;
    return reply ;
//  res.status(200).json({ reply: reply }) ;
  } catch (error) {
    // ✅ throw instead of res
    if (error.status === 429) throw new Error("Rate limit hit, please wait and try again")
    throw new Error("AI request failed")
  }
 }

 export default getGeminAiResponse ;