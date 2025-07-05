import React, { useState, useRef, useEffect, useCallback } from 'react';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import { streamWeatherAgentResponse } from '../services/weatherApi';
import './ChatWindow.css'; // Import component-specific CSS
import botLogo from '../assets/7133364.png'; // or .svg

function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const chatEndRef = useRef(null);

  // IMPORTANT: Replace with your actual college roll number for threadId
  const COLLEGE_ROLL_NUMBER = "A16";

  // Auto-scroll to the bottom of the chat whenever messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = useCallback(async () => {
    // Prevent sending empty messages or multiple messages while loading
    if (!inputMessage.trim() || isLoading) {
      return;
    }

    // Prepare user message with unique ID and timestamp
    const userMessage = {
      id: Date.now() + '-user',
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Add user message to the chat history
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputMessage(''); // Clear the input field
    setIsLoading(true); // Set loading state
    setError(null); // Clear any previous errors

    // Add a placeholder message for the agent's response
    // Its content will be updated as streaming data arrives
    const agentPlaceholder = {
      id: Date.now() + '-agent-placeholder',
      role: 'agent',
      content: '', // This will be filled by streaming data
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isStreaming: true, // Flag to indicate it's still streaming
    };
    setMessages((prevMessages) => [...prevMessages, agentPlaceholder]);

    try {
      // Call the API streaming function
      const streamingResponseGenerator = streamWeatherAgentResponse(userMessage.content, COLLEGE_ROLL_NUMBER);
      let fullAgentResponse = '';

      // Loop through the streamed chunks
      for await (const chunk of streamingResponseGenerator) {
        fullAgentResponse += chunk; // Append the new chunk to the full response
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          const lastMessageIndex = updatedMessages.length - 1;

          // Update the content of the last agent message (the placeholder)
          if (updatedMessages[lastMessageIndex].role === 'agent' && updatedMessages[lastMessageIndex].id === agentPlaceholder.id) {
            updatedMessages[lastMessageIndex].content = fullAgentResponse;
          }
          return updatedMessages;
        });
      }

      // After streaming is complete, ensure the isStreaming flag is false for the final message
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        const lastMessageIndex = updatedMessages.length - 1;
        if (updatedMessages[lastMessageIndex].role === 'agent' && updatedMessages[lastMessageIndex].id === agentPlaceholder.id) {
          updatedMessages[lastMessageIndex].isStreaming = false;
        }
        return updatedMessages;
      });

    } catch (err) {
      console.error("API Streaming Error:", err);
      // Display a user-friendly error message
      setError("Failed to get response from agent. Please check your network and try again.");
      // Remove the incomplete agent placeholder message if an error occurred during streaming
      setMessages((prevMessages) => prevMessages.filter(msg => msg.id !== agentPlaceholder.id));
    } finally {
      setIsLoading(false); // End loading state regardless of success or failure
    }
  }, [inputMessage, isLoading, COLLEGE_ROLL_NUMBER]); // Dependencies for useCallback

  // Function to clear all messages from the chat
  const handleClearChat = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <div className="chat-window">
      {/* Chat Header */}
      <div className="chat-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src={botLogo} alt="Bot Logo" style={{ width: 36, height: 36, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }} />
          <h1 className="chat-title" style={{ margin: 0 }}>Weather Agent</h1>
        </div>
        <button onClick={handleClearChat} className="clear-chat-button">
          Clear Chat
        </button>
      </div>

      {/* Message Display Area */}
      <div className="messages-display">
        {messages.length === 0 && (
          <div className="empty-chat-message">
            Start by asking about the weather!<br />
            <span style={{fontSize: '0.95em', color: '#888'}}>E.g., "What's the weather in London?"<br />"Will it rain in Mumbai tomorrow?"<br />"Forecast for Paris next week?"</span>
          </div>
        )}
        {messages.map((msg, idx) => {
  const isStreamingAgent =
    msg.role === 'agent' && msg.isStreaming && isLoading && idx === messages.length - 1;
  return (
    <MessageBubble
      key={msg.id}
      message={{
        ...msg,
        content:
          msg.role === 'agent' && typeof msg.content === 'string'
            ? msg.content.replace(/\s*\n+\s*/g, ' ').replace(/\s+/g, ' ').trim()
            : msg.content,
      }}
      showSpinner={isStreamingAgent}
    />
  );
})}
        {/* Display general error messages */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        <div ref={chatEndRef} /> {/* This div is used for auto-scrolling */}
      </div>

      {/* Message Input Area */}
      <div className="message-input-area">
        <MessageInput
          value={inputMessage}
          onChange={setInputMessage}
          onSend={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

export default ChatWindow;