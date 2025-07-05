import React, { useState, useEffect } from 'react';
import ChatWindow from './components/ChatWindow';
import './App.css';

function App() {
  // Theme state: 'light' | 'dark'
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.body.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <div className="app-container">
      <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
        <button onClick={toggleTheme} className="clear-chat-button">
          {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </div>
      <ChatWindow />
    </div>
  );
}

export default App;