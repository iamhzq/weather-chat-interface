import React from 'react';
import './MessageBubble.css'; // Import component-specific CSS


function MessageBubble({ message, showSpinner }) {
  const isUser = message.role === 'user';
  const isAgent = message.role === 'agent';
  const isSystem = message.role === 'system'; // For error/info messages

  // Determine heading label
  let heading = '';
  if (isUser) heading = 'You';
  else if (isAgent) heading = 'Weather Agent';
  else if (isSystem) heading = '';

  return (
    <div className={`message-bubble-wrapper ${isUser ? 'user-message-wrapper' : 'agent-message-wrapper'}`}>
      <div className={`message-bubble ${isUser ? 'user-message' : isAgent ? 'agent-message' : 'system-message'}`}>
        {/* Heading/label above the message */}
        {heading && (
          <div className={`message-heading ${isUser ? 'user-heading' : 'agent-heading'}`}>{heading}</div>
        )}
        <p className="message-content">
          {message.content}
          {showSpinner && (
            <span className="buffering-spinner" style={{ marginLeft: 8, verticalAlign: 'middle' }} />
          )}
        </p>
        {/* Display timestamp only if available and not a system message */}
        {message.timestamp && !isSystem && (
          <div className="message-timestamp">
            {message.timestamp}
          </div>
        )}
      </div>
    </div>
  );
}

export default MessageBubble;