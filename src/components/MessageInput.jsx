import React from 'react';
import sendImg from '../assets/send.jpg';
import './MessageInput.css'; // Import component-specific CSS

function MessageInput({ value, onChange, onSend, isLoading }) {
  const handleKeyPress = (e) => {
    // Send message on Enter key press, but allow Shift+Enter for new line (if input was a textarea)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent default Enter behavior (e.g., form submission)
      onSend(); // Trigger the send message function
    }
  };

  return (
    <div className="message-input-container">
      <input
        type="text"
        className="message-input-field"
        placeholder={isLoading ? "Sending message..." : "Type your message..."}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={isLoading} /* Disable input when loading */
      />
      <button
        onClick={onSend}
        disabled={isLoading || !value.trim()}
        className="send-button"
        style={{ padding: 0, background: 'transparent', border: 'none', boxShadow: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <img src={sendImg} alt="Send" style={{ width: 28, height: 28, objectFit: 'contain', filter: isLoading || !value.trim() ? 'grayscale(80%) opacity(0.5)' : 'none' }} />
      </button>
    </div>
  );
}

export default MessageInput;