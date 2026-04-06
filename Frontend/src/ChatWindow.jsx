import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState } from "react";
const BASE_URL = import.meta.env.VITE_API_URL;

export default function ChatWindow() {
    const {
        prompt, setPrompt,
        reply, setReply,
        currentthreadId,
        setPrevChats,
        setNewChat
    } = useContext(MyContext);

    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // the get reply function is here .
    const getReply = async () => {
        if (!prompt || !prompt.trim()) return;

        const currentPrompt = prompt;
        setPrompt("");
        setLoading(true);
        setIsOpen(false); // close dropdown if open

        const options = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                threadId: currentthreadId,
                message: currentPrompt   // ✅ fixed: use saved prompt
            })
        };

        try {
            const response = await fetch(`${BASE_URL}/chat`, options);
            const data = await response.json();

            // guard: if backend returned no reply (e.g. Gemini failed), show error msg
            const replyText = data.reply || "Sorry, I couldn't get a response. Please try again.";

            setReply(replyText);
            setNewChat(false);
            setPrevChats(prev => [
                ...prev,
                { role: "user", content: currentPrompt },
                { role: "assistant", content: replyText }
            ]);
        } catch (error) {
            console.log(error);
            setReply("Sorry, something went wrong. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            getReply();
        }
    };

    return (
        <div className="chatWindow">

            {/* Navbar */}
            <div className="navbar">
                <span className="navbar-title">GentlemanAI</span>
                <div className="navbar-right">
                    <div className="userIconDiv" onClick={() => setIsOpen(!isOpen)}>
                        <span className="userIcon">
                            <i className="fa-solid fa-user"></i>
                        </span>
                    </div>
                </div>
            </div>

            {/* Profile Dropdown */}
            {isOpen && (
                <div className="dropDown">
                    <div className="dropDownItem">
                        <i className="fa-solid fa-gear"></i>
                        Settings
                    </div>
                    <div className="dropDownItem">
                        <i className="fa-solid fa-cloud-arrow-up"></i>
                        Upgrade Plan
                    </div>
                    <div className="dropDown-divider"></div>
                    <div className="dropDownItem">
                        <i className="fa-solid fa-arrow-right-from-bracket"></i>
                        Log out
                    </div>
                </div>
            )}

            {/* Chat Messages */}
            <Chat loading={loading} />

            {/* Custom Loading indicator */}
            {loading && (
                <div className="loading-wrapper">
                    <div className="loading-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Gentleman Soch raha hai ...</span>
                </div>
            )}

            {/* Input Area */}
            <div className="chatInput">
                <div className="inputBox">
                    <input
                        id="chat-input"
                        placeholder="Ask the Gentleman anything..."
                        value={prompt || ""}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={loading}
                        autoComplete="off"
                    />
                    <button
                        id="submit"
                        onClick={getReply}
                        disabled={loading || !prompt?.trim()}
                        title="Send message"
                    >
                        <i className="fa-solid fa-paper-plane"></i>
                    </button>
                </div>
                <p className="info">
                    GentlemanAI is still too young to be an AI , have Patience and talk with him gently .
                </p>
            </div>
        </div>
    );
}