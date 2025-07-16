import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaHorse, FaPlus, FaSearch, FaFilter, FaTrophy, FaHeart } from 'react-icons/fa';
import api from '../services/api';

const HorsesContainer = styled.div`
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

const HorseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
`;

const HorseCard = styled.div`
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

const HorseHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const HorseIcon = styled.div`
  font-size: 2rem;
  color: #667eea;
`;

const HorseInfo = styled.div`
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

const HorseActions = styled.div`
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

const Horses = () => {
  const [horses, setHorses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredHorses, setFilteredHorses] = useState([]);

  useEffect(() => {
    loadHorses();
  }, []);

  useEffect(() => {
    filterHorses();
  }, [horses, searchTerm]);

  const loadHorses = async () => {
    try {
      const response = await api.get('/horses');
      setHorses(response.data.data);
    } catch (error) {
      console.error('Error loading horses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterHorses = () => {
    if (!searchTerm) {
      setFilteredHorses(horses);
      return;
    }
    
    const filtered = horses.filter(horse =>
      horse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      horse.breed.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredHorses(filtered);
  };

  const getOverallRating = (horse) => {
    const stats = horse.stats;
    const total = stats.speed + stats.endurance + stats.agility + stats.strength + 
                  stats.intelligence + stats.obedience + stats.temperament + stats.reflexes;
    return Math.round(total / 8);
  };

  return (
    <HorsesContainer>
      <Header>
        <Title>My Horses</Title>
        <p>Manage your stable and track your horses' progress</p>
      </Header>

      <Controls>
        <SearchBox>
          <SearchIcon>
            <FaSearch />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search horses by name or breed..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBox>
        
        <FilterButton>
          <FaFilter />
          Filters
        </FilterButton>
        
        <AddButton onClick={() => window.location.href = '/horses/add'}>
          <FaPlus />
          Add Horse
        </AddButton>
      </Controls>

      {loading ? (
        <LoadingSpinner>Loading horses...</LoadingSpinner>
      ) : filteredHorses.length === 0 ? (
        <EmptyState>
          <h3>No horses found</h3>
          <p>Start building your stable by adding your first horse!</p>
        </EmptyState>
      ) : (
        <HorseGrid>
          {filteredHorses.map(horse => (
            <HorseCard key={horse._id}>
              <HorseHeader>
                <HorseIcon>
                  <FaHorse />
                </HorseIcon>
                <HorseInfo>
                  <h3>{horse.name}</h3>
                  <p>{horse.breed} • {horse.gender}</p>
                  <p>{horse.age} years old • {horse.height} hh</p>
                </HorseInfo>
                <RarityBadge rarity={horse.rarity}>
                  {horse.rarity}
                </RarityBadge>
              </HorseHeader>

              <StatsGrid>
                <StatItem>
                  <span>Speed</span>
                  <span>{horse.stats.speed}</span>
                </StatItem>
                <StatItem>
                  <span>Endurance</span>
                  <span>{horse.stats.endurance}</span>
                </StatItem>
                <StatItem>
                  <span>Agility</span>
                  <span>{horse.stats.agility}</span>
                </StatItem>
                <StatItem>
                  <span>Overall</span>
                  <span>{getOverallRating(horse)}</span>
                </StatItem>
              </StatsGrid>

              <HorseActions>
                <ActionButton 
                  className="primary"
                  onClick={() => window.location.href = `/horses/${horse._id}`}
                >
                  View Details
                </ActionButton>
                <ActionButton 
                  className="secondary"
                  onClick={() => window.location.href = `/horses/${horse._id}/train`}
                >
                  <FaTrophy />
                  Train
                </ActionButton>
                <ActionButton 
                  className="secondary"
                  onClick={() => window.location.href = `/breeding?horse=${horse._id}`}
                >
                  <FaHeart />
                  Breed
                </ActionButton>
              </HorseActions>
            </HorseCard>
          ))}
        </HorseGrid>
      )}
    </HorsesContainer>
  );
};

export default Horses;
