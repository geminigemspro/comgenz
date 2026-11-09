import React, { useState, useEffect } from 'react';
import './Conversation.css';

// Import Supabase service
import { conversationService, userService } from '../services/supabaseService';

const Conversation = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [conversationId, setConversationId] = useState('conv-1'); // Mock conversation ID

  // Mock conversation data
  const [conversation, setConversation] = useState({
    id: 'conv-1',
    user: {
      id: 'user-123',
      email: 'john.doe@example.com',
      displayName: 'John Doe'
    },
    admin: {
      id: 'admin-456',
      email: 'support@example.com',
      displayName: 'Support Team'
    }
  });

  // Load messages when component mounts
  useEffect(() => {
    const loadMessages = async () => {
      try {
        setIsLoading(true);
        
        // In a real implementation, we would fetch from Supabase
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock messages data
        const mockMessages = [
          {
            id: 'msg-1',
            senderId: 'user-123',
            content: 'Hello, I need help with my account.',
            sentAt: '2023-05-15T10:30:00Z',
            status: 'sent'
          },
          {
            id: 'msg-2',
            senderId: 'admin-456',
            content: 'Hi John, I\'ll look into this right away.',
            sentAt: '2023-05-15T10:32:00Z',
            status: 'sent'
          },
          {
            id: 'msg-3',
            senderId: 'user-123',
            content: 'Thank you for your prompt response.',
            sentAt: '2023-05-15T10:35:00Z',
            status: 'sent'
          }
        ];
        
        setMessages(mockMessages);
      } catch (err) {
        setError('Failed to load messages');
        console.error('Error loading messages:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    try {
      // In a real implementation, we would send to Supabase
      const messageData = {
        id: `msg-${Date.now()}`,
        senderId: 'user-123', // This would be the current user ID
        content: newMessage,
        sentAt: new Date().toISOString(),
        status: 'sending'
      };
      
      // Add to UI immediately
      setMessages(prev => [...prev, messageData]);
      setNewMessage('');
      
      // Simulate sending to backend
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update status after successful send
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageData.id ? { ...msg, status: 'sent' } : msg
        )
      );
    } catch (err) {
      setError('Failed to send message');
      console.error('Error sending message:', err);
      
      // Remove failed message from UI
      setMessages(prev => prev.filter(msg => msg.id !== messageData.id));
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isCurrentUser = (senderId) => {
    // In a real implementation, this would compare with current user ID
    return senderId === 'user-123';
  };

  if (isLoading) {
    return (
      <div className="conversation-container">
        <div className="loading">Loading conversation...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="conversation-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="conversation-container">
      <div className="conversation-header">
        <h2>{conversation.user.displayName}</h2>
        <div className="conversation-info">
          <span>Support: {conversation.admin.displayName}</span>
        </div>
      </div>
      
      <div className="messages-container">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`message ${isCurrentUser(message.senderId) ? 'message-current-user' : 'message-other-user'}`}
          >
            <div className="message-content">
              <p>{message.content}</p>
            </div>
            <div className="message-footer">
              <span className="message-time">{formatTime(message.sentAt)}</span>
              {isCurrentUser(message.senderId) && (
                <span className={`message-status ${message.status}`}>
                  {message.status === 'sending' ? 'Sending...' : '✓'}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <form className="message-form" onSubmit={handleSendMessage}>
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          rows="3"
        />
        <button type="submit" disabled={!newMessage.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Conversation;