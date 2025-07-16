import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const ShelterContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h1`
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
`;

const UserStats = styled.div`
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 15px;
`;

const StatCard = styled.div`
  text-align: center;
  padding: 15px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #3498db;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #7f8c8d;
`;

const FilterSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const FilterInput = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
`;

const FilterSelect = styled.select`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
`;

const DogsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const DogCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const DogHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const DogName = styled.h3`
  color: #2c3e50;
  margin: 0;
`;

const RarityBadge = styled.span`
  display: inline-block;
  padding: 3px 10px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: bold;
  color: white;
  background: ${props => {
    switch (props.rarity) {
      case 'legendary': return '#e74c3c';
      case 'epic': return '#9b59b6';
      case 'rare': return '#3498db';
      case 'uncommon': return '#2ecc71';
      default: return '#95a5a6';
    }
  }};
`;

const DogInfo = styled.div`
  margin-bottom: 15px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 5px 0;
  padding: 5px 0;
  border-bottom: 1px solid #ecf0f1;
`;

const HealthIssues = styled.div`
  background: #ffe6e6;
  padding: 10px;
  border-radius: 8px;
  margin: 10px 0;
  border-left: 4px solid #e74c3c;
`;

const SpecialTitle = styled.div`
  background: #fff3cd;
  padding: 10px;
  border-radius: 8px;
  margin: 10px 0;
  border-left: 4px solid #f39c12;
  font-weight: bold;
`;

const AdoptionFee = styled.div`
  text-align: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: #27ae60;
  margin: 15px 0;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`;

const AdoptButton = styled.button`
  flex: 1;
  background: linear-gradient(135deg, #27ae60, #2ecc71);
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  }
  
  &:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
    transform: none;
  }
`;

const SponsorButton = styled.button`
  flex: 1;
  background: linear-gradient(135deg, #f39c12, #e67e22);
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  }
  
  &:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
    transform: none;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 30px;
`;

const PageButton = styled.button`
  padding: 10px 15px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 5px;
  
  &:hover {
    background: #f8f9fa;
  }
  
  ${props => props.active && `
    background: #3498db;
    color: white;
    border-color: #3498db;
  `}
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 50px;
  font-size: 1.2rem;
  color: #7f8c8d;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 50px;
  color: #7f8c8d;
  
  h3 {
    margin-bottom: 10px;
  }
`;

function DogShelter() {
  const { user } = useAuth();
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    breed: '',
    rarity: '',
    maxAge: ''
  });
  const [userStats, setUserStats] = useState({
    coins: 0,
    shelterReputation: 0,
    sponsoredAnimals: 0,
    membershipTier: 'basic'
  });

  useEffect(() => {
    loadShelterDogs();
    loadUserStats();
  }, [currentPage]);

  const loadShelterDogs = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/dogs/shelter?page=${currentPage}&limit=12`);
      setDogs(response.data.data);
      setTotalPages(response.data.pagination.total);
    } catch (error) {
      console.error('Error loading shelter dogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserStats = async () => {
    try {
      const response = await api.get('/api/auth/me');
      const userData = response.data.data;
      setUserStats({
        coins: userData.coins,
        shelterReputation: userData.shelterReputation || 0,
        sponsoredAnimals: userData.sponsoredAnimals ? userData.sponsoredAnimals.length : 0,
        membershipTier: userData.membershipTier || 'basic'
      });
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const handleAdopt = async (dogId, adoptionFee) => {
    if (userStats.coins < adoptionFee) {
      alert('Insufficient coins for adoption fee');
      return;
    }

    try {
      const response = await api.post(`/api/dogs/adopt/${dogId}`);
      alert(response.data.message);
      loadShelterDogs();
      loadUserStats();
    } catch (error) {
      console.error('Error adopting dog:', error);
      alert(error.response?.data?.message || 'Adoption failed');
    }
  };

  const handleSponsor = async (dogId) => {
    if (userStats.coins < 500) {
      alert('Insufficient coins for sponsorship (500 coins required)');
      return;
    }

    if (userStats.membershipTier !== 'premium') {
      alert('Premium membership required for sponsorship');
      return;
    }

    try {
      const response = await api.post(`/api/dogs/sponsor/${dogId}`);
      alert(response.data.message);
      loadUserStats();
    } catch (error) {
      console.error('Error sponsoring dog:', error);
      alert(error.response?.data?.message || 'Sponsorship failed');
    }
  };

  const filteredDogs = dogs.filter(dog => {
    if (filters.breed && !dog.breed.toLowerCase().includes(filters.breed.toLowerCase())) {
      return false;
    }
    if (filters.rarity && dog.rarity !== filters.rarity) {
      return false;
    }
    if (filters.maxAge && dog.age > parseInt(filters.maxAge)) {
      return false;
    }
    return true;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getReputationLevel = (reputation) => {
    if (reputation < 50) return 'Newcomer';
    if (reputation < 100) return 'Helper';
    if (reputation < 200) return 'Supporter';
    if (reputation < 500) return 'Advocate';
    return 'Champion';
  };

  return (
    <ShelterContainer>
      <Title>Dog Shelter</Title>
      
      <UserStats>
        <StatCard>
          <StatValue>💰 {userStats.coins.toLocaleString()}</StatValue>
          <StatLabel>Coins</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>⭐ {userStats.shelterReputation}</StatValue>
          <StatLabel>Reputation ({getReputationLevel(userStats.shelterReputation)})</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>🐕 {userStats.sponsoredAnimals}</StatValue>
          <StatLabel>Sponsored Animals</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{userStats.membershipTier === 'premium' ? '👑' : '🎫'}</StatValue>
          <StatLabel>{userStats.membershipTier.charAt(0).toUpperCase() + userStats.membershipTier.slice(1)} Member</StatLabel>
        </StatCard>
      </UserStats>

      <FilterSection>
        <FilterInput
          type="text"
          placeholder="Search by breed..."
          value={filters.breed}
          onChange={(e) => setFilters({...filters, breed: e.target.value})}
        />
        <FilterSelect
          value={filters.rarity}
          onChange={(e) => setFilters({...filters, rarity: e.target.value})}
        >
          <option value="">All Rarities</option>
          <option value="common">Common</option>
          <option value="uncommon">Uncommon</option>
          <option value="rare">Rare</option>
          <option value="epic">Epic</option>
          <option value="legendary">Legendary</option>
        </FilterSelect>
        <FilterSelect
          value={filters.maxAge}
          onChange={(e) => setFilters({...filters, maxAge: e.target.value})}
        >
          <option value="">All Ages</option>
          <option value="2">Under 2 years</option>
          <option value="5">Under 5 years</option>
          <option value="8">Under 8 years</option>
        </FilterSelect>
      </FilterSection>

      {loading ? (
        <LoadingSpinner>Loading shelter dogs...</LoadingSpinner>
      ) : filteredDogs.length === 0 ? (
        <EmptyState>
          <h3>No dogs found</h3>
          <p>Try adjusting your filters or check back later for new arrivals.</p>
        </EmptyState>
      ) : (
        <DogsGrid>
          {filteredDogs.map((dog) => (
            <DogCard key={dog._id}>
              <DogHeader>
                <DogName>{dog.breed}</DogName>
                <RarityBadge rarity={dog.rarity}>
                  {dog.rarity.toUpperCase()}
                </RarityBadge>
              </DogHeader>
              
              <DogInfo>
                <InfoRow>
                  <span>Gender:</span>
                  <span>{dog.gender}</span>
                </InfoRow>
                <InfoRow>
                  <span>Age:</span>
                  <span>{dog.age} years</span>
                </InfoRow>
                <InfoRow>
                  <span>Capture Location:</span>
                  <span>{dog.captureLocation}</span>
                </InfoRow>
                <InfoRow>
                  <span>Shelter Entry:</span>
                  <span>{formatDate(dog.shelterEntry)}</span>
                </InfoRow>
                <InfoRow>
                  <span>Taming Difficulty:</span>
                  <span>{dog.tamingDifficulty}</span>
                </InfoRow>
              </DogInfo>

              {dog.specialTitle && (
                <SpecialTitle>
                  🏆 {dog.specialTitle}
                </SpecialTitle>
              )}

              {dog.hiddenDisorders && dog.hiddenDisorders.length > 0 && (
                <HealthIssues>
                  <strong>Health Issues:</strong> {dog.hiddenDisorders.join(', ')}
                </HealthIssues>
              )}

              <AdoptionFee>
                Adoption Fee: {dog.adoptionFee?.toLocaleString() || 'N/A'} coins
              </AdoptionFee>

              <ActionButtons>
                <AdoptButton
                  onClick={() => handleAdopt(dog._id, dog.adoptionFee)}
                  disabled={userStats.coins < dog.adoptionFee}
                >
                  Adopt
                </AdoptButton>
                <SponsorButton
                  onClick={() => handleSponsor(dog._id)}
                  disabled={userStats.coins < 500 || userStats.membershipTier !== 'premium'}
                >
                  Sponsor
                </SponsorButton>
              </ActionButtons>
            </DogCard>
          ))}
        </DogsGrid>
      )}

      <Pagination>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <PageButton
            key={page}
            active={page === currentPage}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </PageButton>
        ))}
      </Pagination>
    </ShelterContainer>
  );
}

export default DogShelter;
