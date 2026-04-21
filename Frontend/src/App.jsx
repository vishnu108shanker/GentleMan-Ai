import { useState } from 'react'
import './App.css'
import ChatWindow from './ChatWindow';
import Sidebar from './Sidebar';
import { MyContext } from './MyContext';
import { v1 as uuidv1 } from 'uuid';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  const [prompt, setPrompt] = useState("");          // earlier it was just()
  const [reply, setReply] = useState(null);          // earlier it was just()
  const [currentthreadId, setThreadId] = useState(uuidv1());
  const [newChat, setNewChat] = useState(true); // it will be used to trigger useEffect in chatwindow to create new thread when user clicks on new chat button in sidebar
  const [prevChats, setPrevChats] = useState([]) ; //it will store the chats of the same thread
  const [previousThreads, setPreviousThreads] = useState([]) ; // it will store the list of threads with their latest message and threadId
  const [latestReply, setLatestReply] = useState(null) ; // it will be used to show the reply in typewriter effect in chat component
  const [allThreads, setAllThreads] = useState([]);

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currentthreadId, setThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    previousThreads, setPreviousThreads,
    latestReply, setLatestReply,
    allThreads, setAllThreads
  };

  return (
    <div className='app'>
      <MyContext.Provider value={providerValues}>
        <Sidebar />
        <ChatWindow />
      </MyContext.Provider>
    </div>
  );
}

export default App;
