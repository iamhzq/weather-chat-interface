import React from 'react';
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
        // Disable button if loading or input is empty/just whitespace
        disabled={isLoading || !value.trim()}
        className="send-button"
      >
        Send
      </button>
    </div>
  );
}

export default MessageInput;