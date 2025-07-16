import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaDog, FaPlus, FaSearch, FaFilter, FaTrophy, FaHeart } from 'react-icons/fa';
import api from '../services/api';

const DogsContainer = styled.div`
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

const AddButton = styled.button`
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

const DogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
`;

const DogCard = styled.div`
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

const DogHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const DogIcon = styled.div`
  font-size: 2rem;
  color: #667eea;
`;

const DogInfo = styled.div`
  flex: 1;
  
  h3 {
    margin: 0;
    color: #4a5568;
    font-size: 1.3rem;
  }
  
  p {
    margin: 0.25rem 0;
    color: #718096;
    font-size: 0.9rem;
  }
`;

const RarityBadge = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  background: ${props => {
    switch (props.rarity) {
      case 'legendary': return '#ffd700';
      case 'epic': return '#9f7aea';
      case 'rare': return '#4299e1';
      case 'uncommon': return '#48bb78';
      default: return '#718096';
    }
  }};
  color: white;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  margin: 1rem 0;
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  background: #f7fafc;
  border-radius: 6px;
  font-size: 0.9rem;
`;

const CoatInfo = styled.div`
  background: #f7fafc;
  border-radius: 6px;
  padding: 0.75rem;
  margin: 1rem 0;
`;

const CoatRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const DogActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 0.5rem;
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

const Dogs = () => {
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDogs, setFilteredDogs] = useState([]);

  useEffect(() => {
    loadDogs();
  }, []);

  useEffect(() => {
    filterDogs();
  }, [dogs, searchTerm]);

  const loadDogs = async () => {
    try {
      const response = await api.get('/dogs');
      setDogs(response.data.data);
    } catch (error) {
      console.error('Error loading dogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterDogs = () => {
    if (!searchTerm) {
      setFilteredDogs(dogs);
      return;
    }
    
    const filtered = dogs.filter(dog =>
      dog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dog.breed.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDogs(filtered);
  };

  const getOverallRating = (dog) => {
    const stats = dog.stats;
    const total = stats.speed + stats.endurance + stats.agility + stats.strength + 
                  stats.intelligence + stats.obedience + stats.temperament + stats.reflexes;
    return Math.round(total / 8);
  };

  return (
    <DogsContainer>
      <Header>
        <Title>My Dogs</Title>
        <p>Manage your kennel and track your dogs' progress</p>
      </Header>

      <Controls>
        <SearchBox>
          <SearchIcon>
            <FaSearch />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search dogs by name or breed..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBox>
        
        <FilterButton>
          <FaFilter />
          Filters
        </FilterButton>
        
        <AddButton onClick={() => window.location.href = '/dogs/capture'}>
          <FaPlus />
          Capture Wild Dog
        </AddButton>
        
        <AddButton onClick={() => window.location.href = '/dogs/shelter'}>
          <FaHeart />
          Shelter
        </AddButton>
        
        <AddButton onClick={() => window.location.href = '/dogs/add'}>
          <FaPlus />
          Add Dog
        </AddButton>
      </Controls>

      {loading ? (
        <LoadingSpinner>Loading dogs...</LoadingSpinner>
      ) : filteredDogs.length === 0 ? (
        <EmptyState>
          <h3>No dogs found</h3>
          <p>Start building your kennel by adding your first dog!</p>
        </EmptyState>
      ) : (
        <DogGrid>
          {filteredDogs.map(dog => (
            <DogCard key={dog._id}>
              <DogHeader>
                <DogIcon>
                  <FaDog />
                </DogIcon>
                <DogInfo>
                  <h3>{dog.name}</h3>
                  <p>{dog.breed} • {dog.gender}</p>
                  <p>{dog.age} years old • {dog.weight} lbs</p>
                </DogInfo>
                <RarityBadge rarity={dog.rarity}>
                  {dog.rarity}
                </RarityBadge>
              </DogHeader>

              <StatsGrid>
                <StatItem>
                  <span>Speed</span>
                  <span>{dog.stats.speed}</span>
                </StatItem>
                <StatItem>
                  <span>Endurance</span>
                  <span>{dog.stats.endurance}</span>
                </StatItem>
                <StatItem>
                  <span>Agility</span>
                  <span>{dog.stats.agility}</span>
                </StatItem>
                <StatItem>
                  <span>Overall</span>
                  <span>{getOverallRating(dog)}</span>
                </StatItem>
              </StatsGrid>

              <CoatInfo>
                <CoatRow>
                  <span>Base Color:</span>
                  <span>{dog.genetics.baseColor}</span>
                </CoatRow>
                <CoatRow>
                  <span>Pattern:</span>
                  <span>{dog.genetics.pattern}</span>
                </CoatRow>
                <CoatRow>
                  <span>Markings:</span>
                  <span>{dog.genetics.markings}</span>
                </CoatRow>
              </CoatInfo>

              <DogActions>
                <ActionButton 
                  className="primary"
                  onClick={() => window.location.href = `/dogs/${dog._id}`}
                >
                  View Details
                </ActionButton>
                <ActionButton 
                  className="secondary"
                  onClick={() => window.location.href = `/dogs/${dog._id}/train`}
                >
                  <FaTrophy />
                  Train
                </ActionButton>
                <ActionButton 
                  className="secondary"
                  onClick={() => window.location.href = `/breeding?dog=${dog._id}`}
                >
                  <FaHeart />
                  Breed
                </ActionButton>
              </DogActions>
            </DogCard>
          ))}
        </DogGrid>
      )}
    </DogsContainer>
  );
};

export default Dogs;
