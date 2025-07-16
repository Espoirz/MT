import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaHorse, FaCoins, FaGem, FaArrowLeft, FaInfoCircle } from 'react-icons/fa';
import api from '../services/api';

const CaptureContainer = styled.div`
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

const BackButton = styled.button`
  position: absolute;
  top: 2rem;
  left: 2rem;
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

const CaptureContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  color: white;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const BiomeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const BiomeCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid ${props => props.selected ? '#667eea' : 'transparent'};
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
`;

const BiomeHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const BiomeIcon = styled.div`
  font-size: 1.5rem;
`;

const BiomeName = styled.h3`
  margin: 0;
  font-size: 1.2rem;
`;

const BiomeDescription = styled.p`
  margin: 0.5rem 0;
  font-size: 0.9rem;
  opacity: 0.9;
`;

const BiomeCost = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const MaturityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const MaturityCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid ${props => props.selected ? '#667eea' : 'transparent'};
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
`;

const MaturityName = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
`;

const MaturityAge = styled.p`
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  opacity: 0.8;
`;

const MaturityDescription = styled.p`
  margin: 0;
  font-size: 0.85rem;
  opacity: 0.9;
`;

const PaymentSection = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  color: white;
  margin-bottom: 2rem;
`;

const PaymentOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const PaymentCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid ${props => props.selected ? '#667eea' : 'transparent'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  
  &:hover {
    background: ${props => props.disabled ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)'};
    transform: ${props => props.disabled ? 'none' : 'translateY(-2px)'};
  }
`;

const PaymentIcon = styled.div`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const PaymentName = styled.h3`
  margin: 0;
  font-size: 1.1rem;
`;

const PaymentCost = styled.p`
  margin: 0.5rem 0;
  font-size: 0.9rem;
`;

const PaymentBalance = styled.p`
  margin: 0;
  font-size: 0.85rem;
  opacity: 0.8;
`;

const CaptureButton = styled.button`
  width: 100%;
  padding: 1rem 2rem;
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  opacity: ${props => props.disabled ? 0.5 : 1};
  
  &:hover {
    transform: ${props => props.disabled ? 'none' : 'translateY(-2px)'};
    box-shadow: ${props => props.disabled ? 'none' : '0 10px 25px rgba(0, 0, 0, 0.2)'};
  }
`;

const InfoBox = styled.div`
  background: rgba(54, 162, 235, 0.1);
  border-left: 4px solid #36a2eb;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 0 8px 8px 0;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: white;
  font-size: 1.2rem;
`;

const WildHorseCapture = () => {
  const [biomes, setBiomes] = useState([]);
  const [maturityStages, setMaturityStages] = useState({});
  const [selectedBiome, setSelectedBiome] = useState(null);
  const [selectedMaturity, setSelectedMaturity] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [capturing, setCapturing] = useState(false);
  const [captureResult, setCaptureResult] = useState(null);

  useEffect(() => {
    loadCaptureData();
    loadUserInfo();
  }, []);

  const loadCaptureData = async () => {
    try {
      const response = await api.get('/horses/capture/biomes');
      setBiomes(response.data.data.biomes);
      setMaturityStages(response.data.data.maturityStages);
    } catch (error) {
      console.error('Error loading capture data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserInfo = async () => {
    try {
      const response = await api.get('/auth/me');
      setUserInfo(response.data.data);
    } catch (error) {
      console.error('Error loading user info:', error);
    }
  };

  const handleCapture = async () => {
    if (!selectedBiome || !selectedMaturity || !selectedPayment) {
      alert('Please select a biome, maturity stage, and payment method');
      return;
    }

    setCapturing(true);
    try {
      const response = await api.post('/horses/capture', {
        biome: selectedBiome.id,
        maturityStage: selectedMaturity,
        paymentMethod: selectedPayment
      });
      
      setCaptureResult(response.data);
      // Refresh user info to update balances
      await loadUserInfo();
    } catch (error) {
      console.error('Error capturing horse:', error);
      alert(error.response?.data?.message || 'Error capturing horse');
    } finally {
      setCapturing(false);
    }
  };

  const getBiomeIcon = (biomeId) => {
    const icons = {
      plains: '🌾',
      beach: '🏖️',
      hilltops: '⛰️',
      desert: '🏜️',
      snowfield: '❄️',
      volcanic_ridge: '🌋'
    };
    return icons[biomeId] || '🌍';
  };

  const getPaymentIcon = (paymentType) => {
    const icons = {
      coins: <FaCoins />,
      gems: <FaGem />,
      rope: '🪢',
      cotton: '🧵',
      nylon: '🧶',
      leather: '🔗',
      wool: '🐑',
      gold: '✨'
    };
    return icons[paymentType] || '💰';
  };

  const canAfford = (cost, type) => {
    if (!userInfo) return false;
    
    if (type === 'coins') return userInfo.coins >= cost;
    if (type === 'gems') return userInfo.gems >= cost;
    if (userInfo.lassos && userInfo.lassos[type]) return userInfo.lassos[type] >= cost;
    return false;
  };

  const getUserBalance = (type) => {
    if (!userInfo) return 0;
    
    if (type === 'coins') return userInfo.coins;
    if (type === 'gems') return userInfo.gems;
    if (userInfo.lassos && userInfo.lassos[type]) return userInfo.lassos[type];
    return 0;
  };

  if (loading) {
    return (
      <CaptureContainer>
        <LoadingSpinner>Loading capture data...</LoadingSpinner>
      </CaptureContainer>
    );
  }

  if (captureResult) {
    return (
      <CaptureContainer>
        <Header>
          <Title>🎉 Capture Successful!</Title>
          <p>{captureResult.message}</p>
        </Header>
        
        <Section>
          <SectionTitle>Your New Horse</SectionTitle>
          <div style={{ textAlign: 'center' }}>
            <h3>{captureResult.data.horse.name}</h3>
            <p>{captureResult.data.horse.breed} • {captureResult.data.horse.gender}</p>
            <p>Age: {captureResult.data.horse.age} months</p>
            <p>Maturity: {captureResult.data.horse.maturityStage}</p>
            <p>Rarity: {captureResult.data.horse.rarity}</p>
            <p>Experience gained: {captureResult.data.experienceGained}</p>
            {captureResult.data.levelUp && (
              <p style={{ color: '#ffd700' }}>🎊 Level Up! New level: {captureResult.data.newLevel}</p>
            )}
          </div>
          
          <CaptureButton onClick={() => window.location.href = '/horses'}>
            View My Horses
          </CaptureButton>
        </Section>
      </CaptureContainer>
    );
  }

  return (
    <CaptureContainer>
      <BackButton onClick={() => window.location.href = '/horses'}>
        <FaArrowLeft />
        Back to Horses
      </BackButton>
      
      <Header>
        <Title>Wild Horse Capture</Title>
        <p>Venture into different biomes to capture wild horses with unique traits</p>
      </Header>

      <InfoBox>
        <FaInfoCircle style={{ marginRight: '0.5rem' }} />
        Different biomes offer horses with unique characteristics, stats, and rarity modifiers. 
        Choose your biome and maturity stage carefully for the best results!
      </InfoBox>

      <CaptureContent>
        <Section>
          <SectionTitle>Select Biome</SectionTitle>
          <BiomeGrid>
            {biomes.map(biome => (
              <BiomeCard 
                key={biome.id}
                selected={selectedBiome?.id === biome.id}
                onClick={() => biome.isActive && setSelectedBiome(biome)}
                style={{ opacity: biome.isActive ? 1 : 0.5 }}
              >
                <BiomeHeader>
                  <BiomeIcon>{getBiomeIcon(biome.id)}</BiomeIcon>
                  <BiomeName>{biome.name}</BiomeName>
                </BiomeHeader>
                <BiomeDescription>{biome.description}</BiomeDescription>
                <BiomeCost>
                  💰 {biome.costs.coins} coins
                  {Object.keys(biome.costs).filter(k => k !== 'coins').map(key => (
                    <span key={key}> or {getPaymentIcon(key)} {biome.costs[key]} {key}</span>
                  ))}
                </BiomeCost>
                {!biome.isActive && (
                  <p style={{ color: '#ff6b6b', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                    Currently inactive
                  </p>
                )}
              </BiomeCard>
            ))}
          </BiomeGrid>
        </Section>

        <Section>
          <SectionTitle>Select Maturity Stage</SectionTitle>
          <MaturityGrid>
            {Object.entries(maturityStages).map(([key, stage]) => (
              <MaturityCard 
                key={key}
                selected={selectedMaturity === key}
                onClick={() => setSelectedMaturity(key)}
              >
                <MaturityName>{stage.name}</MaturityName>
                <MaturityAge>{stage.ageRange.min}-{stage.ageRange.max} months</MaturityAge>
                <MaturityDescription>{stage.description}</MaturityDescription>
              </MaturityCard>
            ))}
          </MaturityGrid>
        </Section>
      </CaptureContent>

      {selectedBiome && (
        <PaymentSection>
          <SectionTitle>Select Payment Method</SectionTitle>
          <PaymentOptions>
            <PaymentCard
              selected={selectedPayment === 'coins'}
              onClick={() => setSelectedPayment('coins')}
              disabled={!canAfford(selectedBiome.costs.coins, 'coins')}
            >
              <PaymentIcon><FaCoins /></PaymentIcon>
              <PaymentName>Coins</PaymentName>
              <PaymentCost>Cost: {selectedBiome.costs.coins}</PaymentCost>
              <PaymentBalance>Balance: {getUserBalance('coins')}</PaymentBalance>
            </PaymentCard>
            
            {selectedBiome.costs.gems && (
              <PaymentCard
                selected={selectedPayment === 'gems'}
                onClick={() => setSelectedPayment('gems')}
                disabled={!canAfford(selectedBiome.costs.gems, 'gems')}
              >
                <PaymentIcon><FaGem /></PaymentIcon>
                <PaymentName>Gems</PaymentName>
                <PaymentCost>Cost: {selectedBiome.costs.gems}</PaymentCost>
                <PaymentBalance>Balance: {getUserBalance('gems')}</PaymentBalance>
              </PaymentCard>
            )}
            
            {Object.keys(selectedBiome.costs).filter(k => k !== 'coins' && k !== 'gems').map(lassoType => (
              <PaymentCard
                key={lassoType}
                selected={selectedPayment === lassoType}
                onClick={() => setSelectedPayment(lassoType)}
                disabled={!canAfford(selectedBiome.costs[lassoType], lassoType)}
              >
                <PaymentIcon>{getPaymentIcon(lassoType)}</PaymentIcon>
                <PaymentName>{lassoType.charAt(0).toUpperCase() + lassoType.slice(1)} Lasso</PaymentName>
                <PaymentCost>Cost: {selectedBiome.costs[lassoType]}</PaymentCost>
                <PaymentBalance>Balance: {getUserBalance(lassoType)}</PaymentBalance>
              </PaymentCard>
            ))}
          </PaymentOptions>
          
          <CaptureButton 
            onClick={handleCapture}
            disabled={!selectedBiome || !selectedMaturity || !selectedPayment || capturing}
          >
            {capturing ? 'Capturing...' : 'Capture Wild Horse'}
          </CaptureButton>
        </PaymentSection>
      )}
    </CaptureContainer>
  );
};

export default WildHorseCapture;
