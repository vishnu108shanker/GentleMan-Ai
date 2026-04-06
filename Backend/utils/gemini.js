
import 'dotenv/config'
import { GoogleGenAI } from "@google/genai"

// Support both naming conventions
const GEMINI_KEY = process.env.GEMINI_API_KEY || process.env.gemini_api_key;

// Debug: print first 8 chars to confirm key is loaded (safe to log)
console.log("🔑 gemini_api_key starts with:", process.env.gemini_api_key?.substring(0, 8) ?? "UNDEFINED");
console.log("🔑 GEMINI_API_KEY starts with:", process.env.GEMINI_API_KEY?.substring(0, 8) ?? "UNDEFINED");
console.log("🔑 Final GEMINI_KEY starts with:", GEMINI_KEY?.substring(0, 8) ?? "UNDEFINED ❌");

const ai = new GoogleGenAI({
  apiKey: GEMINI_KEY
});
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
    // Log full error for debugging in Render logs
    console.error("Gemini API error details:", {
      message: error.message,
      status: error.status,
      statusText: error.statusText,
      stack: error.stack,
    });
    if (error.status === 429) throw new Error("Rate limit hit, please wait and try again");
    throw new Error(`AI request failed: ${error.message}`);
  }
 }

 export default getGeminAiResponse ;