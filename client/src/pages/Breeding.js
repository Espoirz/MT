import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaHeart, FaSearch, FaFilter, FaVenus, FaMars, FaCalendarAlt, FaStar } from 'react-icons/fa';
import api from '../services/api';

const BreedingContainer = styled.div`
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

const BreedingSection = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  color: #4a5568;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const BreedingForm = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: start;
`;

const AnimalSelector = styled.div`
  border: 2px dashed #e2e8f0;
  border-radius: 10px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #667eea;
  }
`;

const SelectedAnimal = styled.div`
  background: #f7fafc;
  border-radius: 10px;
  padding: 1.5rem;
  text-align: center;
  border: 2px solid #667eea;
`;

const AnimalCard = styled.div`
  text-align: center;
  
  h3 {
    color: #4a5568;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #718096;
    margin: 0.25rem 0;
  }
`;

const GenderIcon = styled.div`
  font-size: 2rem;
  color: ${props => props.gender === 'male' ? '#4299e1' : '#ed64a6'};
  margin-bottom: 1rem;
`;

const SelectButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 1rem;
  
  &:hover {
    background: #5a67d8;
  }
`;

const BreedButton = styled.button`
  grid-column: span 2;
  padding: 1rem 2rem;
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 500;
  margin-top: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  }
  
  &:disabled {
    background: #a0aec0;
    cursor: not-allowed;
    transform: none;
  }
`;

const BreedingHistory = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const HistoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
`;

const HistoryCard = styled.div`
  background: #f7fafc;
  border-radius: 10px;
  padding: 1.5rem;
  border-left: 4px solid #667eea;
`;

const HistoryHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 1rem;
`;

const HistoryDate = styled.div`
  color: #718096;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const HistoryStatus = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  background: ${props => {
    switch (props.status) {
      case 'successful': return '#48bb78';
      case 'failed': return '#f56565';
      case 'pending': return '#ed8936';
      default: return '#718096';
    }
  }};
  color: white;
`;

const ParentInfo = styled.div`
  margin-bottom: 1rem;
  
  h4 {
    color: #4a5568;
    margin: 0.5rem 0 0.25rem 0;
    font-size: 1rem;
  }
  
  p {
    color: #718096;
    margin: 0;
    font-size: 0.9rem;
  }
`;

const OffspringInfo = styled.div`
  background: white;
  border-radius: 6px;
  padding: 1rem;
  margin-top: 1rem;
  
  h4 {
    color: #4a5568;
    margin: 0 0 0.5rem 0;
  }
  
  p {
    color: #718096;
    margin: 0;
    font-size: 0.9rem;
  }
`;

const AvailableAnimals = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 2rem;
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
  border: 1px solid #e2e8f0;
  border-radius: 25px;
  background: white;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
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
  background: #f7fafc;
  color: #4a5568;
  border: 1px solid #e2e8f0;
  border-radius: 25px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: #edf2f7;
  }
`;

const AnimalsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
`;

const AnimalBreedingCard = styled.div`
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  border: 2px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #667eea;
    transform: translateY(-2px);
  }
  
  &.selected {
    border-color: #667eea;
    background: #f7fafc;
  }
`;

const AnimalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const AnimalName = styled.h3`
  color: #4a5568;
  margin: 0;
`;

const AnimalStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  margin-top: 1rem;
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  background: #f7fafc;
  border-radius: 6px;
  font-size: 0.9rem;
`;

const Breeding = () => {
  const [selectedMale, setSelectedMale] = useState(null);
  const [selectedFemale, setSelectedFemale] = useState(null);
  const [availableAnimals, setAvailableAnimals] = useState([]);
  const [breedingHistory, setBreedingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [horsesResponse, dogsResponse, historyResponse] = await Promise.all([
        api.get('/horses'),
        api.get('/dogs'),
        api.get('/breeding/history')
      ]);

      const allAnimals = [
        ...horsesResponse.data.data.map(horse => ({ ...horse, type: 'horse' })),
        ...dogsResponse.data.data.map(dog => ({ ...dog, type: 'dog' }))
      ];

      setAvailableAnimals(allAnimals);
      setBreedingHistory(historyResponse.data.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBreeding = async () => {
    if (!selectedMale || !selectedFemale) return;

    try {
      const response = await api.post('/breeding/breed', {
        maleId: selectedMale._id,
        femaleId: selectedFemale._id,
        animalType: selectedMale.type
      });

      // Refresh breeding history
      loadData();
      setSelectedMale(null);
      setSelectedFemale(null);
    } catch (error) {
      console.error('Error breeding animals:', error);
    }
  };

  const filteredAnimals = availableAnimals.filter(animal =>
    animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    animal.breed.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const maleAnimals = filteredAnimals.filter(animal => animal.gender === 'male');
  const femaleAnimals = filteredAnimals.filter(animal => animal.gender === 'female');

  const canBreed = selectedMale && selectedFemale && selectedMale.type === selectedFemale.type;

  return (
    <BreedingContainer>
      <Header>
        <Title>Breeding Program</Title>
        <p>Create the next generation of champions</p>
      </Header>

      <BreedingSection>
        <SectionTitle>
          <FaHeart />
          Select Breeding Pair
        </SectionTitle>
        
        <BreedingForm>
          <div>
            <h3>Male</h3>
            {selectedMale ? (
              <SelectedAnimal>
                <GenderIcon gender="male">
                  <FaMars />
                </GenderIcon>
                <AnimalCard>
                  <h3>{selectedMale.name}</h3>
                  <p>{selectedMale.breed} • {selectedMale.type}</p>
                  <p>{selectedMale.age} years old</p>
                </AnimalCard>
                <SelectButton onClick={() => setSelectedMale(null)}>
                  Change Selection
                </SelectButton>
              </SelectedAnimal>
            ) : (
              <AnimalSelector>
                <GenderIcon gender="male">
                  <FaMars />
                </GenderIcon>
                <p>Select a male animal for breeding</p>
              </AnimalSelector>
            )}
          </div>

          <div>
            <h3>Female</h3>
            {selectedFemale ? (
              <SelectedAnimal>
                <GenderIcon gender="female">
                  <FaVenus />
                </GenderIcon>
                <AnimalCard>
                  <h3>{selectedFemale.name}</h3>
                  <p>{selectedFemale.breed} • {selectedFemale.type}</p>
                  <p>{selectedFemale.age} years old</p>
                </AnimalCard>
                <SelectButton onClick={() => setSelectedFemale(null)}>
                  Change Selection
                </SelectButton>
              </SelectedAnimal>
            ) : (
              <AnimalSelector>
                <GenderIcon gender="female">
                  <FaVenus />
                </GenderIcon>
                <p>Select a female animal for breeding</p>
              </AnimalSelector>
            )}
          </div>

          <BreedButton 
            onClick={handleBreeding}
            disabled={!canBreed}
          >
            {canBreed ? 'Start Breeding' : 'Select breeding pair'}
          </BreedButton>
        </BreedingForm>
      </BreedingSection>

      <AvailableAnimals>
        <SectionTitle>Available Animals</SectionTitle>
        
        <Controls>
          <SearchBox>
            <SearchIcon>
              <FaSearch />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Search animals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBox>
          
          <FilterButton>
            <FaFilter />
            Filters
          </FilterButton>
        </Controls>

        <div style={{ display: 'grid', gap: '2rem' }}>
          <div>
            <h3>Males ({maleAnimals.length})</h3>
            <AnimalsGrid>
              {maleAnimals.map(animal => (
                <AnimalBreedingCard
                  key={animal._id}
                  className={selectedMale?._id === animal._id ? 'selected' : ''}
                  onClick={() => setSelectedMale(animal)}
                >
                  <AnimalHeader>
                    <AnimalName>{animal.name}</AnimalName>
                    <GenderIcon gender="male">
                      <FaMars />
                    </GenderIcon>
                  </AnimalHeader>
                  <p>{animal.breed} • {animal.type}</p>
                  <p>{animal.age} years old</p>
                  <AnimalStats>
                    <StatItem>
                      <span>Speed</span>
                      <span>{animal.stats.speed}</span>
                    </StatItem>
                    <StatItem>
                      <span>Strength</span>
                      <span>{animal.stats.strength}</span>
                    </StatItem>
                  </AnimalStats>
                </AnimalBreedingCard>
              ))}
            </AnimalsGrid>
          </div>

          <div>
            <h3>Females ({femaleAnimals.length})</h3>
            <AnimalsGrid>
              {femaleAnimals.map(animal => (
                <AnimalBreedingCard
                  key={animal._id}
                  className={selectedFemale?._id === animal._id ? 'selected' : ''}
                  onClick={() => setSelectedFemale(animal)}
                >
                  <AnimalHeader>
                    <AnimalName>{animal.name}</AnimalName>
                    <GenderIcon gender="female">
                      <FaVenus />
                    </GenderIcon>
                  </AnimalHeader>
                  <p>{animal.breed} • {animal.type}</p>
                  <p>{animal.age} years old</p>
                  <AnimalStats>
                    <StatItem>
                      <span>Speed</span>
                      <span>{animal.stats.speed}</span>
                    </StatItem>
                    <StatItem>
                      <span>Strength</span>
                      <span>{animal.stats.strength}</span>
                    </StatItem>
                  </AnimalStats>
                </AnimalBreedingCard>
              ))}
            </AnimalsGrid>
          </div>
        </div>
      </AvailableAnimals>

      <BreedingHistory>
        <SectionTitle>Breeding History</SectionTitle>
        
        {breedingHistory.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>No breeding history yet. Start your first breeding!</p>
          </div>
        ) : (
          <HistoryGrid>
            {breedingHistory.map(record => (
              <HistoryCard key={record._id}>
                <HistoryHeader>
                  <HistoryDate>
                    <FaCalendarAlt />
                    {new Date(record.createdAt).toLocaleDateString()}
                  </HistoryDate>
                  <HistoryStatus status={record.status}>
                    {record.status}
                  </HistoryStatus>
                </HistoryHeader>
                
                <ParentInfo>
                  <h4>Parents</h4>
                  <p>{record.maleParent.name} × {record.femaleParent.name}</p>
                  <p>{record.maleParent.breed}</p>
                </ParentInfo>

                {record.offspring && (
                  <OffspringInfo>
                    <h4>Offspring</h4>
                    <p>{record.offspring.name}</p>
                    <p>{record.offspring.breed} • {record.offspring.gender}</p>
                  </OffspringInfo>
                )}
              </HistoryCard>
            ))}
          </HistoryGrid>
        )}
      </BreedingHistory>
    </BreedingContainer>
  );
};

export default Breeding;
