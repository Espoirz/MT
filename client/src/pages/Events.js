import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTrophy, FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaPlus, FaFilter, FaSearch } from 'react-icons/fa';
import api from '../services/api';

const EventsContainer = styled.div`
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

const Controls = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: center;
  flex-wrap: wrap;
`;

const SearchBox = styled.div`
  flex: 1;
  min-width: 300px;
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: none;
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.95);
  font-size: 1rem;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #718096;
`;

const FilterButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const CreateButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  }
`;

const EventTabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 25px;
  padding: 0.5rem;
`;

const Tab = styled.button`
  flex: 1;
  padding: 0.75rem 1.5rem;
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const EventGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
`;

const EventCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 1.5rem;
  transition: transform 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  }
`;

const EventHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const EventTitle = styled.h3`
  margin: 0;
  color: #4a5568;
  font-size: 1.3rem;
`;

const EventType = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  background: ${props => {
    switch (props.type) {
      case 'Racing': return '#4299e1';
      case 'Jumping': return '#48bb78';
      case 'Dressage': return '#9f7aea';
      case 'Conformation': return '#ed8936';
      default: return '#718096';
    }
  }};
  color: white;
`;

const EventInfo = styled.div`
  margin-bottom: 1rem;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: #718096;
  font-size: 0.9rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const EventDescription = styled.p`
  color: #4a5568;
  margin: 1rem 0;
  line-height: 1.5;
`;

const EventStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin: 1rem 0;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 0.75rem;
  background: #f7fafc;
  border-radius: 6px;
  
  .number {
    font-size: 1.5rem;
    font-weight: bold;
    color: #4a5568;
  }
  
  .label {
    font-size: 0.8rem;
    color: #718096;
    margin-top: 0.25rem;
  }
`;

const EventActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
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
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  background: ${props => {
    switch (props.status) {
      case 'upcoming': return '#4299e1';
      case 'ongoing': return '#48bb78';
      case 'completed': return '#718096';
      case 'cancelled': return '#f56565';
      default: return '#718096';
    }
  }};
  color: white;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: white;
  
  h3 {
    margin-bottom: 1rem;
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

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, activeTab]);

  const loadEvents = async () => {
    try {
      const response = await api.get('/events');
      setEvents(response.data.data);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = events;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(event => event.status === activeTab);
    }

    setFilteredEvents(filtered);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return '#4299e1';
      case 'ongoing': return '#48bb78';
      case 'completed': return '#718096';
      case 'cancelled': return '#f56565';
      default: return '#718096';
    }
  };

  return (
    <EventsContainer>
      <Header>
        <Title>Competition Events</Title>
        <p>Participate in competitions and showcase your animals</p>
      </Header>

      <Controls>
        <SearchBox>
          <SearchIcon>
            <FaSearch />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBox>
        
        <FilterButton>
          <FaFilter />
          Filters
        </FilterButton>
        
        <CreateButton onClick={() => window.location.href = '/events/create'}>
          <FaPlus />
          Create Event
        </CreateButton>
      </Controls>

      <EventTabs>
        <Tab 
          active={activeTab === 'all'}
          onClick={() => setActiveTab('all')}
        >
          All Events
        </Tab>
        <Tab 
          active={activeTab === 'upcoming'}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming
        </Tab>
        <Tab 
          active={activeTab === 'ongoing'}
          onClick={() => setActiveTab('ongoing')}
        >
          Ongoing
        </Tab>
        <Tab 
          active={activeTab === 'completed'}
          onClick={() => setActiveTab('completed')}
        >
          Completed
        </Tab>
      </EventTabs>

      {loading ? (
        <LoadingSpinner>Loading events...</LoadingSpinner>
      ) : filteredEvents.length === 0 ? (
        <EmptyState>
          <h3>No events found</h3>
          <p>Check back later for new competitions!</p>
        </EmptyState>
      ) : (
        <EventGrid>
          {filteredEvents.map(event => (
            <EventCard key={event._id}>
              <EventHeader>
                <EventTitle>{event.name}</EventTitle>
                <EventType type={event.type}>
                  {event.type}
                </EventType>
              </EventHeader>

              <EventInfo>
                <InfoRow>
                  <FaCalendarAlt />
                  <span>
                    {formatDate(event.startDate)} - {formatDate(event.endDate)}
                  </span>
                </InfoRow>
                <InfoRow>
                  <FaMapMarkerAlt />
                  <span>{event.location}</span>
                </InfoRow>
                <InfoRow>
                  <FaUsers />
                  <span>{event.participants?.length || 0} participants</span>
                </InfoRow>
                <InfoRow>
                  <FaTrophy />
                  <StatusBadge status={event.status}>
                    {event.status}
                  </StatusBadge>
                </InfoRow>
              </EventInfo>

              <EventDescription>
                {event.description}
              </EventDescription>

              <EventStats>
                <StatItem>
                  <div className="number">${event.entryFee}</div>
                  <div className="label">Entry Fee</div>
                </StatItem>
                <StatItem>
                  <div className="number">${event.prizePool}</div>
                  <div className="label">Prize Pool</div>
                </StatItem>
              </EventStats>

              <EventActions>
                <ActionButton 
                  className="primary"
                  onClick={() => window.location.href = `/events/${event._id}`}
                >
                  View Details
                </ActionButton>
                {event.status === 'upcoming' && (
                  <ActionButton 
                    className="secondary"
                    onClick={() => window.location.href = `/events/${event._id}/enter`}
                  >
                    Enter Event
                  </ActionButton>
                )}
                {event.status === 'completed' && (
                  <ActionButton 
                    className="secondary"
                    onClick={() => window.location.href = `/events/${event._id}/results`}
                  >
                    View Results
                  </ActionButton>
                )}
              </EventActions>
            </EventCard>
          ))}
        </EventGrid>
      )}
    </EventsContainer>
  );
};

export default Events;
