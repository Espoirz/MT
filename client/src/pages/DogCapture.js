import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const CaptureContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h1`
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
`;

const LocationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const LocationCard = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px;
  padding: 25px;
  color: white;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
  
  ${props => props.selected && `
    transform: scale(1.05);
    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  `}
  
  ${props => !props.accessible && `
    background: linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%);
    cursor: not-allowed;
    opacity: 0.7;
  `}
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0,0,0,0.2);
  }
`;

const LocationName = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const PremiumBadge = styled.span`
  background: #f39c12;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
`;

const LocationDescription = styled.p`
  margin-bottom: 15px;
  opacity: 0.9;
  font-size: 0.95rem;
`;

const CostSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
`;

const Cost = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,0.2);
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.9rem;
`;

const BreedList = styled.div`
  margin-top: 10px;
  font-size: 0.85rem;
  opacity: 0.8;
`;

const SpecialEffects = styled.div`
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
`;

const EffectTag = styled.span`
  background: rgba(255,255,255,0.3);
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 0.75rem;
`;

const CaptureSection = styled.div`
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  margin-bottom: 30px;
`;

const CaptureButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 25px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  margin-top: 20px;
  
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

const UserResources = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
`;

const Resource = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 15px;
  background: white;
  border-radius: 8px;
  font-weight: bold;
`;

const ResultModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ResultContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 15px;
  max-width: 500px;
  width: 90%;
  text-align: center;
`;

const DogDisplay = styled.div`
  background: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  margin: 20px 0;
`;

const DogStat = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 5px 0;
  padding: 5px 10px;
  background: white;
  border-radius: 5px;
`;

const RarityBadge = styled.span`
  display: inline-block;
  padding: 5px 15px;
  border-radius: 20px;
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

function DogCapture() {
  const { user } = useAuth();
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [capturing, setCapturing] = useState(false);
  const [captureResult, setCaptureResult] = useState(null);
  const [userResources, setUserResources] = useState({
    coins: 0,
    leashes: { nylon: 0, leather: 0, slip: 0 }
  });

  useEffect(() => {
    loadLocations();
    loadUserResources();
  }, []);

  const loadLocations = async () => {
    try {
      const response = await api.get('/api/dogs/capture-locations');
      setLocations(response.data.data);
    } catch (error) {
      console.error('Error loading locations:', error);
    }
  };

  const loadUserResources = async () => {
    try {
      const response = await api.get('/api/auth/me');
      setUserResources({
        coins: response.data.data.coins,
        leashes: response.data.data.leashes || { nylon: 0, leather: 0, slip: 0 }
      });
    } catch (error) {
      console.error('Error loading user resources:', error);
    }
  };

  const handleLocationSelect = (location) => {
    if (location.accessible) {
      setSelectedLocation(location);
    }
  };

  const handleCapture = async () => {
    if (!selectedLocation) return;

    setCapturing(true);
    try {
      const response = await api.post('/api/dogs/capture', {
        location: selectedLocation.id
      });
      
      setCaptureResult(response.data.data);
      setUserResources(response.data.data.remainingResources);
    } catch (error) {
      console.error('Error capturing dog:', error);
      alert(error.response?.data?.message || 'Capture failed');
    } finally {
      setCapturing(false);
    }
  };

  const closeCaptureResult = () => {
    setCaptureResult(null);
    setSelectedLocation(null);
  };

  const canAfford = (location) => {
    const costs = location.costs;
    const hasCoins = userResources.coins >= costs.coins;
    const hasLeash = (costs.nylon && userResources.leashes.nylon >= costs.nylon) ||
                     (costs.leather && userResources.leashes.leather >= costs.leather) ||
                     (costs.slip && userResources.leashes.slip >= costs.slip);
    return hasCoins && hasLeash;
  };

  const getLeashRequirement = (costs) => {
    if (costs.nylon) return `${costs.nylon} Nylon Leash`;
    if (costs.leather) return `${costs.leather} Leather Leash`;
    if (costs.slip) return `${costs.slip} Slip Leash`;
    return '';
  };

  const formatSpecialEffect = (effect) => {
    return effect.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <CaptureContainer>
      <Title>Dog Capture Locations</Title>
      
      <UserResources>
        <Resource>
          <span>💰</span>
          <span>{userResources.coins.toLocaleString()} Coins</span>
        </Resource>
        <Resource>
          <span>🟢</span>
          <span>{userResources.leashes.nylon} Nylon</span>
        </Resource>
        <Resource>
          <span>🟤</span>
          <span>{userResources.leashes.leather} Leather</span>
        </Resource>
        <Resource>
          <span>🔴</span>
          <span>{userResources.leashes.slip} Slip</span>
        </Resource>
      </UserResources>

      <LocationGrid>
        {locations.map((location) => (
          <LocationCard
            key={location.id}
            selected={selectedLocation?.id === location.id}
            accessible={location.accessible}
            onClick={() => handleLocationSelect(location)}
          >
            <LocationName>
              {location.name}
              {location.premiumOnly && <PremiumBadge>PREMIUM</PremiumBadge>}
            </LocationName>
            
            <LocationDescription>
              {location.description}
            </LocationDescription>
            
            <BreedList>
              <strong>Common Breeds:</strong> {location.breedPreferences.join(', ')}
            </BreedList>
            
            <SpecialEffects>
              {location.specialEffects.map(effect => (
                <EffectTag key={effect}>{formatSpecialEffect(effect)}</EffectTag>
              ))}
            </SpecialEffects>
            
            <CostSection>
              <Cost>
                <span>💰</span>
                <span>{location.costs.coins.toLocaleString()}</span>
              </Cost>
              <Cost>
                <span>{location.costs.nylon ? '🟢' : location.costs.leather ? '🟤' : '🔴'}</span>
                <span>{getLeashRequirement(location.costs)}</span>
              </Cost>
            </CostSection>
            
            {!location.accessible && (
              <div style={{ marginTop: '10px', textAlign: 'center', opacity: '0.8' }}>
                Premium membership required
              </div>
            )}
          </LocationCard>
        ))}
      </LocationGrid>

      {selectedLocation && (
        <CaptureSection>
          <h3>Capture from {selectedLocation.name}</h3>
          <p>Cost: {selectedLocation.costs.coins.toLocaleString()} coins + {getLeashRequirement(selectedLocation.costs)}</p>
          
          <CaptureButton
            onClick={handleCapture}
            disabled={capturing || !canAfford(selectedLocation)}
          >
            {capturing ? 'Capturing...' : canAfford(selectedLocation) ? 'Capture Dog' : 'Insufficient Resources'}
          </CaptureButton>
        </CaptureSection>
      )}

      {captureResult && (
        <ResultModal onClick={closeCaptureResult}>
          <ResultContent onClick={(e) => e.stopPropagation()}>
            <h2>Capture Successful!</h2>
            
            <DogDisplay>
              <h3>{captureResult.dog.name}</h3>
              <div style={{ marginBottom: '15px' }}>
                <RarityBadge rarity={captureResult.dog.rarity}>
                  {captureResult.dog.rarity.toUpperCase()}
                </RarityBadge>
              </div>
              
              <p><strong>Breed:</strong> {captureResult.dog.breed}</p>
              <p><strong>Gender:</strong> {captureResult.dog.gender}</p>
              <p><strong>Age:</strong> {captureResult.dog.age} years</p>
              <p><strong>Location:</strong> {captureResult.dog.captureLocation}</p>
              
              {captureResult.dog.specialTitle && (
                <p><strong>Special Title:</strong> {captureResult.dog.specialTitle}</p>
              )}
              
              <h4>Stats:</h4>
              {Object.entries(captureResult.dog.stats).map(([stat, value]) => (
                <DogStat key={stat}>
                  <span>{stat.charAt(0).toUpperCase() + stat.slice(1)}</span>
                  <span>{value}</span>
                </DogStat>
              ))}
              
              <p><strong>Taming Difficulty:</strong> {captureResult.dog.tamingDifficulty}</p>
              <p><strong>Bonding Speed:</strong> {captureResult.dog.bondingSpeed}</p>
              <p><strong>Value:</strong> {captureResult.dog.value.toLocaleString()} coins</p>
              
              {captureResult.dog.hiddenDisorders && captureResult.dog.hiddenDisorders.length > 0 && (
                <p><strong>Health Issues:</strong> {captureResult.dog.hiddenDisorders.join(', ')}</p>
              )}
            </DogDisplay>
            
            <CaptureButton onClick={closeCaptureResult}>
              Continue
            </CaptureButton>
          </ResultContent>
        </ResultModal>
      )}
    </CaptureContainer>
  );
}

export default DogCapture;
