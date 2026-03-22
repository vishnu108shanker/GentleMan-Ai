import express from "express"
import Thread from "../models/Thread.js"
import getGeminAiResponse from '../utils/gemini.js'


const router = express.Router()

// Create a new thread for testing

router.post("/test", async (req, res) => {
  try {
    const newThread = new Thread({
        threadId: "test-thread-id 2",
        title: "Test Thread 2",
    })
    await newThread.save()
    // res.send("Test thread created successfully") ;
    //
    res.status(201).json({ message: "Test thread created", thread: newThread })
  } catch (error) {
    console.log(error)  // this will show in terminal
    res.send({ message: error.message, name: error.name })
}
})

//route to get al threads

router.get("/thread", async (req, res) => {
    try {
        const threads = await Thread.find().sort({ updatedAt: -1 }) ; 
        res.status(200).json(threads) ;
    } catch (error) {
        console.log(error)  // this will show in terminal
        res.send({ message: error.message, name: error.name })
    }
})


//route to get a specific thread by threadId
router.get("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params ;
    try {
        const thread = await Thread.findOne({ threadId }) ;
        if (!thread) {
            return res.status(404).json({ message: "Thread not found" }) ;
        }
        res.status(200).json(thread.messages) ;
    } catch (error) {
        console.log(error)  // this will show in terminal
        res.send({ message: error.message, name: error.name })
    }
})


// //routeR to update a thread with new messages
// router.post("/thread/:threadId/message", async (req, res) => {
//     const { threadId } = req.params ;
//     const { role, content } = req.body ;
//     try {
//         const thread = await Thread.findOne({ threadId }) ;
//         if (!thread) {
//             return res.status(404).json({ message: "Thread not found" }) ;
//         }
//         thread.messages.push({ role, content }) ;
//         thread.updatedAt = Date.now() ;
//         await thread.save() ;
//         res.status(200).json({ message: "Message added to thread", thread }) ;
//     } catch (error) {

//         console.log(error)  // this will show in terminal
//         res.send({ message: error.message, name: error.name })
//     }
// })


//routeR to delete a thread
router.delete("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params ;
    try {
        const thread = await Thread.findOneAndDelete({threadId }) ;
        if (!thread) {
            return res.status(404).json({ error: "Thread not found" }) ;
        }
        res.status(200).json({ message: "Thread deleted successfully" }) ;
    } catch (error) {
        console.log(error)  // this will show in terminal
        res.send({ message: error.message, name: error.name })
    }
})

//ROUTER FOR a real chat endpoint that will handle incoming messages and thread management (creating new threads, updating existing threads with new messages, etc.)
router.post("/chat", async (req, res) => {
    const { threadId , message} = req.body ;
if(!threadId || !message) {
    return res.status(400).json({ error: "threadId and message are required" }) ;
}
try{
    let thread = await Thread.findOne({ threadId }) ;
    if (!thread) {
        // create a new one If thread doesn't exist
        thread = new Thread({
            threadId,
            title: message.substring(0, 20) + "...", 
            messages: [{ role: "user", content: message }]
        }) ;
    } else {
        // If thread exists, add the new message to it
        thread.messages.push({ role: "user", content: message }) ;
        thread.updatedAt = Date.now() ;
    }         
    
    const assistantreply = await getGeminAiResponse(message) ;
    // const assistantreply = `You said: "${message}"`;
    thread.messages.push({ role: "assistant", content: assistantreply }) ;
    thread.updatedAt = Date.now() ;
    await thread.save() ;
    res.status(200).json({ reply: assistantreply  }) ;
    // res.status(500).json({ error: "Failed to send response" }) ;
  }
catch (error) {
    console.log(error)  // this will show in terminal
    res.send({ message: error.message, name: error.name })
} 
})


export default router   
