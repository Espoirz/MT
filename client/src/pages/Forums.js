import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaComments, FaHorse, FaDog, FaShoppingCart, FaHeart, FaTrophy, FaBullhorn } from 'react-icons/fa';
import api from '../services/api';

const ForumsContainer = styled.div`
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

const Subtitle = styled.p`
  font-size: 1.2rem;
  opacity: 0.9;
`;

const ForumTabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  overflow-x: auto;
`;

const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.active ? '#4a5568' : 'white'};
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const ForumGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const ForumCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 1.5rem;
  cursor: pointer;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  }
`;

const ForumHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const ForumIcon = styled.div`
  font-size: 2rem;
  color: #667eea;
`;

const ForumInfo = styled.div`
  flex: 1;
  
  h3 {
    margin: 0;
    color: #4a5568;
    font-size: 1.2rem;
  }
  
  p {
    margin: 0.5rem 0 0 0;
    color: #718096;
    font-size: 0.9rem;
  }
`;

const ForumStats = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
  font-size: 0.9rem;
  color: #718096;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LastPost = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
  font-size: 0.8rem;
  color: #718096;
`;

const CreatePostButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: white;
  font-size: 1.2rem;
`;

const Forums = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [forums, setForums] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadForums();
  }, [activeTab]);

  const loadForums = async () => {
    try {
      setLoading(true);
      
      let endpoint = '/forums';
      if (activeTab !== 'all') {
        endpoint = `/forums?category=${activeTab}`;
      }
      
      const response = await api.get(endpoint);
      setForums(response.data.data);
    } catch (error) {
      console.error('Error loading forums:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      breed: <FaHorse />,
      general: <FaComments />,
      marketplace: <FaShoppingCart />,
      announcements: <FaBullhorn />,
      clubs: <FaHeart />,
      events: <FaTrophy />
    };
    return icons[category] || <FaComments />;
  };

  const tabs = [
    { id: 'all', label: 'All Forums' },
    { id: 'breed', label: 'Breed Forums' },
    { id: 'marketplace', label: 'Marketplace' },
    { id: 'general', label: 'General' },
    { id: 'events', label: 'Events' },
    { id: 'announcements', label: 'Announcements' }
  ];

  const formatDate = (dateString) => {
    if (!dateString) return 'No posts yet';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString();
  };

  return (
    <ForumsContainer>
      <Header>
        <Title>Community Forums</Title>
        <Subtitle>
          Connect with fellow breeders, share knowledge, and trade animals
        </Subtitle>
      </Header>

      <ForumTabs>
        {tabs.map(tab => (
          <Tab
            key={tab.id}
            active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </Tab>
        ))}
      </ForumTabs>

      {loading ? (
        <LoadingSpinner>Loading forums...</LoadingSpinner>
      ) : (
        <ForumGrid>
          {Object.entries(forums).map(([category, categoryForums]) => 
            categoryForums.map(forum => (
              <ForumCard key={forum._id} onClick={() => window.location.href = `/forums/${forum._id}`}>
                <ForumHeader>
                  <ForumIcon>{getCategoryIcon(forum.category)}</ForumIcon>
                  <ForumInfo>
                    <h3>{forum.name}</h3>
                    <p>{forum.description}</p>
                    {forum.breed && (
                      <p><strong>Breed:</strong> {forum.breed}</p>
                    )}
                  </ForumInfo>
                </ForumHeader>
                
                <ForumStats>
                  <StatItem>
                    <FaComments />
                    <span>{forum.postCount} posts</span>
                  </StatItem>
                  <StatItem>
                    <span>{forum.viewCount} views</span>
                  </StatItem>
                </ForumStats>
                
                {forum.lastPost && (
                  <LastPost>
                    <strong>Last post:</strong> {forum.lastPost.title}
                    <br />
                    <small>by {forum.lastPost.user?.username} on {formatDate(forum.lastPost.date)}</small>
                  </LastPost>
                )}
              </ForumCard>
            ))
          )}
        </ForumGrid>
      )}

      <CreatePostButton onClick={() => window.location.href = '/forums/new-post'}>
        +
      </CreatePostButton>
    </ForumsContainer>
  );
};

export default Forums;
