import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";
const BASE_URL = import.meta.env.VITE_API_URL;

function Sidebar() {
    const {
        allThreads, setAllThreads,
        currentthreadId, setNewChat,
        setPrompt, setReply, setThreadId, setPrevChats
    } = useContext(MyContext);

    const getAllThreads = async () => {
        try {
            const response = await fetch(`${BASE_URL}/thread`);
            const res = await response.json();
            const filteredData = res.map(thread => ({
                threadId: thread.threadId,
                title: thread.title
            }));
            setAllThreads(filteredData);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getAllThreads();
    }, [currentthreadId]);

    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setThreadId(uuidv1());
        setPrevChats([]);
    };

    const changeThread = async (newThreadId) => {
        setThreadId(newThreadId);
        try {
            const response = await fetch(`${BASE_URL}/thread/${newThreadId}`);
            const res = await response.json();
            setPrevChats(res);
            setNewChat(false);
            setReply(null);
        } catch (err) {
            console.log(err);
        }
    };

    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(`${BASE_URL}/thread/${threadId}`, { method: "DELETE" });
            await response.json();
            setAllThreads(prev => prev.filter(t => t.threadId !== threadId));
            if (threadId === currentthreadId) {
                createNewChat();
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <section className="sidebar">

            {/* Brand Header */}
            <div className="sidebar-brand">
                <div className="brand-icon">G</div>
                <span className="brand-name">Gentleman</span>
            </div>

            {/* New Chat Button */}
            <button id="new-chat-button" className="new-chat-btn" onClick={createNewChat}>
                <i className="fa-solid fa-plus"></i>
                New Conversation
            </button>

            {/* Thread History */}
            {allThreads?.length > 0 && (
                <p className="history-label">Recent Chats</p>
            )}

            <ul className="history">
                {allThreads?.length === 0 && (
                    <p className="history-empty">
                        No conversations yet.<br />Start one below ↓
                    </p>
                )}
                {allThreads?.map((thread) => (
                    <li
                        key={thread.threadId}
                        id={`thread-${thread.threadId}`}
                        onClick={() => changeThread(thread.threadId)}
                        className={thread.threadId === currentthreadId ? "highlighted" : ""}
                    >
                        <span className="thread-title">{thread.title}</span>
                        <button
                            className="delete-btn"
                            title="Delete conversation"
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteThread(thread.threadId);
                            }}
                        >
                            <i className="fa-solid fa-trash"></i>
                        </button>
                    </li>
                ))}
            </ul>

            {/* Footer */}
            <div className="sidebar-footer">
<p>
  By{" "}
  <a 
    style={{ color: "blue" }}
    href="https://github.com/vishnu108shanker" 
    target="_blank" 
    rel="noopener noreferrer"
  >
    @the_evil_lord
  </a>{" "}
  ♥
</p>            </div>
        </section>
    );
}

export default Sidebar;