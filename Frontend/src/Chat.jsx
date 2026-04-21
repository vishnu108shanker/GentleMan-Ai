import './Chat.css';
import { useContext, useEffect, useRef } from 'react';
import { MyContext } from './MyContext';
import rehypeHighlight from 'rehype-highlight';
import ReactMarkdown from 'react-markdown';
import "highlight.js/styles/github-dark.css";

const SUGGESTIONS = [
    "What if i could be what i always wanted to be ",
    "Is RD Sharma of Class 10th the goated book of all time ",
    "Help me plan a productive morning",
    "Tell me something that even you don't know  ",
];

export default function Chat({ loading }) {
    const { newChat, reply, prevChats, setPrompt } = useContext(MyContext);
    const { latestReply, setLatestReply } = useContext(MyContext);
    const bottomRef = useRef(null);

    // Typewriter effect
    useEffect(() => {
        // guard against null AND undefined (backend may return undefined if response is bad)
        if (!reply || typeof reply !== "string") {
            setLatestReply(null);
            return;
        }
        if (!prevChats?.length) return;

        const content = reply.split(" ");
        let idx = 0;

        const interval = setInterval(() => {
            setLatestReply(content.slice(0, idx + 1).join(" "));
            idx++;
            if (idx >= content.length) clearInterval(interval);
        }, 35);

        return () => clearInterval(interval);
    }, [prevChats, reply]);

    // Auto-scroll to bottom on new messages or typewriter updates
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [prevChats, latestReply, loading]);

    const handleSuggestion = (text) => {
        setPrompt(text);
    };

    // ===== WELCOME SCREEN =====
    // show only when no messages exist yet
    if (prevChats?.length === 0) {
        return (
            <div className="chats">
                <div className="welcome-screen">
                    <div className="welcome-icon">
                        <i className="fa-solid fa-crown"></i>
                    </div>
                    <h1>Good day, friend.<br />I am <span>GentlemanAI</span>.</h1>
                    <p>Ask me anything , from anywhere about anyone  </p>
                    <div className="welcome-suggestions">
                        {SUGGESTIONS.map((s, i) => (
                            <div
                                key={i}
                                className="suggestion-chip"
                                onClick={() => handleSuggestion(s)}
                            >
                                {s}
                            </div>
                        ))}
                    </div>
                </div>
                <div ref={bottomRef} />
            </div>
        );
    }

    // ===== CHAT MESSAGES =====
    // renders all messages cleanly — no IIFE, no fragile slice logic
    return (
        <div className="chats">
            {prevChats?.map((chat, index) => {

                const isLast = index === prevChats.length - 1;
                const isAssistant = chat.role === "assistant";

                // render user message
                if (chat.role === "user") {
                    return (
                        <div key={index} className="userDiv">
                            <p className="userMessage">{chat.content}</p>
                        </div>
                    );
                }

                // render assistant message
                // if it's the last message, apply typewriter (latestReply)
                // if it's a history message (not last), show full content as-is
                const displayContent = isLast
                    ? (latestReply !== null ? latestReply : chat.content)
                    : chat.content;

                return (
                    <div key={index} className="gentlemanDiv">
                        <div className="assistant-header">
                            <div className="assistant-avatar">G</div>
                            <span className="assistant-name">Gentleman</span>
                        </div>
                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                            {displayContent}
                        </ReactMarkdown>
                    </div>
                );
            })}

            <div ref={bottomRef} />
        </div>
    );
}