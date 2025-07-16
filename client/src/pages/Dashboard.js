import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaHorse, FaDog, FaTrophy, FaEnvelope, FaComments, FaHeart, FaCoins, FaGem } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const DashboardContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const WelcomeSection = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  color: white;
  text-align: center;
`;

const WelcomeTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const UserStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.2);
  padding: 1rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StatIcon = styled.div`
  font-size: 2rem;
`;

const StatInfo = styled.div`
  h3 {
    margin: 0;
    font-size: 1.2rem;
  }
  p {
    margin: 0;
    opacity: 0.8;
  }
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
`;

const ActionCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 1.5rem;
  text-align: center;
  transition: transform 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  }
`;

const ActionIcon = styled.div`
  font-size: 3rem;
  color: #667eea;
  margin-bottom: 1rem;
`;

const ActionTitle = styled.h3`
  color: #4a5568;
  margin-bottom: 0.5rem;
`;

const ActionDescription = styled.p`
  color: #718096;
  font-size: 0.9rem;
`;

const RecentActivity = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 1.5rem;
  margin: 2rem 0;
`;

const SectionTitle = styled.h2`
  color: #4a5568;
  margin-bottom: 1rem;
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ActivityItem = styled.div`
  padding: 1rem;
  background: #f7fafc;
  border-radius: 8px;
  border-left: 4px solid #667eea;
`;

const NotificationBadge = styled.span`
  background: #e53e3e;
  color: white;
  border-radius: 50%;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  margin-left: 0.5rem;
`;

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    horses: 0,
    dogs: 0,
    events: 0,
    unreadMessages: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load user's animal counts
      const [horsesRes, dogsRes, messagesRes] = await Promise.all([
        api.get('/horses'),
        api.get('/dogs'),
        api.get('/messages/unread-count')
      ]);

      setStats({
        horses: horsesRes.data.count,
        dogs: dogsRes.data.count,
        events: 0, // TODO: Add participated events count
        unreadMessages: messagesRes.data.data.unreadCount
      });

      // Mock recent activity - replace with real data
      setRecentActivity([
        { type: 'breeding', message: 'New foal born from Arabian mare', time: '2 hours ago' },
        { type: 'training', message: 'Border Collie completed agility training', time: '5 hours ago' },
        { type: 'event', message: 'Placed 2nd in Show Jumping competition', time: '1 day ago' }
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const quickActions = [
    {
      icon: <FaHorse />,
      title: 'Manage Horses',
      description: 'View, train, and breed your horses',
      link: '/horses'
    },
    {
      icon: <FaDog />,
      title: 'Manage Dogs',
      description: 'View, train, and breed your dogs',
      link: '/dogs'
    },
    {
      icon: <FaTrophy />,
      title: 'Competitions',
      description: 'Enter events and view results',
      link: '/events'
    },
    {
      icon: <FaHeart />,
      title: 'Breeding',
      description: 'Plan breeding programs',
      link: '/breeding'
    },
    {
      icon: <FaComments />,
      title: 'Forums',
      description: 'Join breed discussions and marketplace',
      link: '/forums'
    },
    {
      icon: <FaEnvelope />,
      title: 'Messages',
      description: 'Check your mailbox',
      link: '/messages'
    }
  ];

  return (
    <DashboardContainer>
      <WelcomeSection>
        <WelcomeTitle>Welcome back, {user?.username}!</WelcomeTitle>
        <UserStats>
          <StatCard>
            <StatIcon><FaCoins /></StatIcon>
            <StatInfo>
              <h3>{user?.coins || 0}</h3>
              <p>Coins</p>
            </StatInfo>
          </StatCard>
          <StatCard>
            <StatIcon><FaGem /></StatIcon>
            <StatInfo>
              <h3>{user?.gems || 0}</h3>
              <p>Gems</p>
            </StatInfo>
          </StatCard>
          <StatCard>
            <StatIcon><FaHorse /></StatIcon>
            <StatInfo>
              <h3>{stats.horses}</h3>
              <p>Horses</p>
            </StatInfo>
          </StatCard>
          <StatCard>
            <StatIcon><FaDog /></StatIcon>
            <StatInfo>
              <h3>{stats.dogs}</h3>
              <p>Dogs</p>
            </StatInfo>
          </StatCard>
        </UserStats>
      </WelcomeSection>

      <QuickActions>
        {quickActions.map((action, index) => (
          <ActionCard key={index} onClick={() => window.location.href = action.link}>
            <ActionIcon>{action.icon}</ActionIcon>
            <ActionTitle>
              {action.title}
              {action.title === 'Messages' && stats.unreadMessages > 0 && (
                <NotificationBadge>{stats.unreadMessages}</NotificationBadge>
              )}
            </ActionTitle>
            <ActionDescription>{action.description}</ActionDescription>
          </ActionCard>
        ))}
      </QuickActions>

      <RecentActivity>
        <SectionTitle>Recent Activity</SectionTitle>
        <ActivityList>
          {recentActivity.length > 0 ? (
            recentActivity.map((activity, index) => (
              <ActivityItem key={index}>
                <strong>{activity.message}</strong>
                <div style={{ fontSize: '0.8rem', color: '#718096', marginTop: '0.5rem' }}>
                  {activity.time}
                </div>
              </ActivityItem>
            ))
          ) : (
            <ActivityItem>
              <p>No recent activity. Start breeding and training your animals!</p>
            </ActivityItem>
          )}
        </ActivityList>
      </RecentActivity>
    </DashboardContainer>
  );
};

export default Dashboard;
