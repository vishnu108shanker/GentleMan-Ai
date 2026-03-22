
import 'dotenv/config'
import express from "express"
import cors from "cors"
import { GoogleGenAI } from "@google/genai"
import mongoose from 'mongoose'
import chatRoutes from "./routes/chat.js"
import getGeminAiResponse from './utils/gemini.js'

const app = express()
app.use(cors())
app.use(express.json())
app.use("/", chatRoutes) ;
 

// const ai = new GoogleGenAI(process.env.gemini_api_key)



 // MongoDB connection established using Mongoose
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};


 
// app.post("/chat", getGeminAiResponse) ; 
  // async (req, res) => {
//   const { message } = req.body

//   try {
//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash",
//       contents:[{
//         text: message,
//         role: "user" ,
        
//       }]
//     })

//   //  const data = await res.json({ reply: response.text })
//   const reply = response.candidates[0].content.parts[0].text;
//     res.send(reply)

//   } catch (error) {
//     res.status(500).json({ error: "AI request failed" })
//   }
// })
// ✅ Correct way — DB connects FIRST, then server starts
connectDB().then(() => {
    app.listen(8000, () => {
        console.log("Server running on port 8000")
    })
})