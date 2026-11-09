import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard = ({ user, onLogout }) => {
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('inbox');

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call to fetch conversations
    const fetchConversations = async () => {
      setIsLoading(true);
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock conversation data based on user role
        const mockConversations = [
          {
            id: 'conv-1',
            userId: 'user-123',
            userName: 'John Doe',
            lastMessage: 'Hello, I need help with my account.',
            timestamp: '2023-05-15T10:30:00Z',
            unreadCount: 2,
            isAdmin: user?.role === 'admin' || user?.role === 'superadmin'
          },
          {
            id: 'conv-2',
            userId: 'user-456',
            userName: 'Jane Smith',
            lastMessage: 'Thank you for your prompt response.',
            timestamp: '2023-05-14T14:15:00Z',
            unreadCount: 0,
            isAdmin: user?.role === 'admin' || user?.role === 'superadmin'
          }
        ];
        
        setConversations(mockConversations);
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, [user]);

  const handleConversationClick = (conversationId) => {
    // In a real app, this would navigate to the conversation page
    console.log('Opening conversation:', conversationId);
  };

  const renderDashboardContent = () => {
    if (isLoading) {
      return <div className="loading">Loading conversations...</div>;
    }

    if (conversations.length === 0) {
      return (
        <div className="no-conversations">
          <p>No conversations found.</p>
        </div>
      );
    }

    return (
      <div className="conversation-list">
        {conversations.map((conversation) => (
          <div 
            key={conversation.id} 
            className="conversation-item"
            onClick={() => handleConversationClick(conversation.id)}
          >
            <div className="conversation-header">
              <h3>{conversation.userName}</h3>
              {conversation.unreadCount > 0 && (
                <span className="unread-count">{conversation.unreadCount}</span>
              )}
            </div>
            <p className="last-message">{conversation.lastMessage}</p>
            <p className="timestamp">
              {new Date(conversation.timestamp).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <div className="user-info">
          <span>Welcome, {user?.email}</span>
        </div>
      </div>
      
      <div className="dashboard-content">
        <div className="tabs">
          <button 
            className={activeTab === 'inbox' ? 'active' : ''}
            onClick={() => setActiveTab('inbox')}
          >
            Inbox
          </button>
          {user?.role === 'superadmin' && (
            <button 
              className={activeTab === 'admins' ? 'active' : ''}
              onClick={() => setActiveTab('admins')}
            >
              Admins
            </button>
          )}
          {user?.role === 'admin' && (
            <button 
              className={activeTab === 'users' ? 'active' : ''}
              onClick={() => setActiveTab('users')}
            >
              Users
            </button>
          )}
        </div>
        
        <div className="content-area">
          {renderDashboardContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;