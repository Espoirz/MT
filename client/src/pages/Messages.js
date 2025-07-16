import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaEnvelope, FaEnvelopeOpen, FaArchive, FaTrash, FaReply, FaUser, FaCog, FaExclamationTriangle } from 'react-icons/fa';
import api from '../services/api';

const MessagesContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  color: white;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const MessageLayout = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 1.5rem;
  height: fit-content;
`;

const SidebarItem = styled.div`
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: ${props => props.active ? '#667eea' : 'transparent'};
  color: ${props => props.active ? 'white' : '#4a5568'};
  
  &:hover {
    background: ${props => props.active ? '#667eea' : '#f7fafc'};
  }
`;

const BadgeCount = styled.span`
  background: #e53e3e;
  color: white;
  border-radius: 50%;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  margin-left: auto;
`;

const MessagesMain = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 1.5rem;
  min-height: 600px;
`;

const MessagesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MessageItem = styled.div`
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.unread ? '#f0f9ff' : 'white'};
  border-left: 4px solid ${props => props.unread ? '#667eea' : 'transparent'};
  
  &:hover {
    background: #f7fafc;
    border-color: #cbd5e0;
  }
`;

const MessageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
`;

const MessageIcon = styled.div`
  font-size: 1.2rem;
  color: ${props => props.unread ? '#667eea' : '#718096'};
`;

const MessageInfo = styled.div`
  flex: 1;
  
  h4 {
    margin: 0;
    color: #4a5568;
    font-weight: ${props => props.unread ? 'bold' : 'normal'};
  }
  
  p {
    margin: 0;
    color: #718096;
    font-size: 0.9rem;
  }
`;

const MessageMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.8rem;
  color: #718096;
`;

const MessagePreview = styled.div`
  color: #718096;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const MessageActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &.primary {
    background: #667eea;
    color: white;
    
    &:hover {
      background: #5a67d8;
    }
  }
  
  &.secondary {
    background: #f7fafc;
    color: #4a5568;
    
    &:hover {
      background: #edf2f7;
    }
  }
  
  &.danger {
    background: #fed7d7;
    color: #c53030;
    
    &:hover {
      background: #feb2b2;
    }
  }
`;

const ComposeButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #718096;
  
  h3 {
    margin-bottom: 1rem;
    color: #4a5568;
  }
`;

const PriorityIcon = styled.div`
  color: ${props => {
    switch (props.priority) {
      case 'high': return '#ed8936';
      case 'urgent': return '#e53e3e';
      default: return '#718096';
    }
  }};
`;

const Messages = () => {
  const [activeFolder, setActiveFolder] = useState('inbox');
  const [messages, setMessages] = useState({});
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadMessages();
    loadUnreadCount();
  }, [activeFolder]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      if (activeFolder === 'unread') {
        params.append('isRead', 'false');
      } else if (activeFolder === 'archived') {
        params.append('folder', 'archived');
      } else if (activeFolder !== 'inbox') {
        params.append('type', activeFolder);
      }
      
      const response = await api.get(`/messages?${params}`);
      setMessages(response.data.data);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const response = await api.get('/messages/unread-count');
      setUnreadCount(response.data.data.unreadCount);
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  const toggleMessageRead = async (messageId) => {
    try {
      await api.put(`/messages/${messageId}/read`);
      loadMessages();
      loadUnreadCount();
    } catch (error) {
      console.error('Error toggling message read status:', error);
    }
  };

  const toggleMessageArchive = async (messageId) => {
    try {
      await api.put(`/messages/${messageId}/archive`);
      loadMessages();
    } catch (error) {
      console.error('Error toggling message archive status:', error);
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      await api.delete(`/messages/${messageId}`);
      loadMessages();
      loadUnreadCount();
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const getMessageIcon = (type) => {
    const icons = {
      user: <FaUser />,
      system: <FaCog />,
      vet: <FaExclamationTriangle />,
      trainer: <FaUser />,
      event: <FaExclamationTriangle />,
      marketplace: <FaUser />,
      breeding: <FaUser />
    };
    return icons[type] || <FaEnvelope />;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 86400000) { // Less than 24 hours
      return date.toLocaleTimeString();
    } else if (diff < 604800000) { // Less than 7 days
      return date.toLocaleDateString();
    } else {
      return date.toLocaleDateString();
    }
  };

  const folders = [
    { id: 'inbox', label: 'Inbox', icon: <FaEnvelope />, count: unreadCount },
    { id: 'unread', label: 'Unread', icon: <FaEnvelopeOpen />, count: unreadCount },
    { id: 'system', label: 'System', icon: <FaCog /> },
    { id: 'vet', label: 'Veterinary', icon: <FaExclamationTriangle /> },
    { id: 'trainer', label: 'Training', icon: <FaUser /> },
    { id: 'event', label: 'Events', icon: <FaExclamationTriangle /> },
    { id: 'archived', label: 'Archived', icon: <FaArchive /> }
  ];

  return (
    <MessagesContainer>
      <Header>
        <Title>Messages</Title>
        <p>Stay connected with your breeding community</p>
      </Header>

      <MessageLayout>
        <Sidebar>
          <ComposeButton onClick={() => window.location.href = '/messages/compose'}>
            <FaReply /> Compose
          </ComposeButton>
          
          {folders.map(folder => (
            <SidebarItem
              key={folder.id}
              active={activeFolder === folder.id}
              onClick={() => setActiveFolder(folder.id)}
            >
              {folder.icon}
              <span>{folder.label}</span>
              {folder.count > 0 && <BadgeCount>{folder.count}</BadgeCount>}
            </SidebarItem>
          ))}
        </Sidebar>

        <MessagesMain>
          {loading ? (
            <EmptyState>
              <h3>Loading messages...</h3>
            </EmptyState>
          ) : Object.keys(messages).length === 0 ? (
            <EmptyState>
              <h3>No messages found</h3>
              <p>Your {activeFolder} is empty</p>
            </EmptyState>
          ) : (
            <MessagesList>
              {Object.entries(messages).map(([type, typeMessages]) =>
                typeMessages.map(message => (
                  <MessageItem
                    key={message._id}
                    unread={!message.isRead}
                    onClick={() => window.location.href = `/messages/${message._id}`}
                  >
                    <MessageHeader>
                      <MessageIcon unread={!message.isRead}>
                        {getMessageIcon(message.type)}
                      </MessageIcon>
                      <MessageInfo unread={!message.isRead}>
                        <h4>{message.subject}</h4>
                        <p>
                          From: {message.sender?.username || 'System'}
                        </p>
                      </MessageInfo>
                      <MessageMeta>
                        <PriorityIcon priority={message.priority}>
                          {message.priority === 'high' && <FaExclamationTriangle />}
                          {message.priority === 'urgent' && <FaExclamationTriangle />}
                        </PriorityIcon>
                        <span>{formatDate(message.createdAt)}</span>
                      </MessageMeta>
                    </MessageHeader>
                    
                    <MessagePreview>
                      {message.content.length > 100 
                        ? message.content.substring(0, 100) + '...'
                        : message.content
                      }
                    </MessagePreview>
                    
                    <MessageActions>
                      <ActionButton
                        className={message.isRead ? 'secondary' : 'primary'}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMessageRead(message._id);
                        }}
                      >
                        {message.isRead ? <FaEnvelope /> : <FaEnvelopeOpen />}
                        {message.isRead ? 'Mark Unread' : 'Mark Read'}
                      </ActionButton>
                      
                      <ActionButton
                        className="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMessageArchive(message._id);
                        }}
                      >
                        <FaArchive />
                        {message.isArchived ? 'Unarchive' : 'Archive'}
                      </ActionButton>
                      
                      <ActionButton
                        className="danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteMessage(message._id);
                        }}
                      >
                        <FaTrash />
                        Delete
                      </ActionButton>
                    </MessageActions>
                  </MessageItem>
                ))
              )}
            </MessagesList>
          )}
        </MessagesMain>
      </MessageLayout>
    </MessagesContainer>
  );
};

export default Messages;
