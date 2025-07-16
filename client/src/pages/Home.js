import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaHorse, FaDog, FaTrophy, FaUsers, FaHeart, FaFlask } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const HomeContainer = styled.div`
  min-height: 100vh;
  padding: 2rem;
`;

const Hero = styled.section`
  text-align: center;
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 1rem;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const HeroSubtitle = styled.p`
  font-size: 1.3rem;
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 0.9);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const CTAButton = styled(Link)`
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  padding: 1rem 2rem;
  border-radius: 50px;
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-block;
  margin: 0 1rem;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  }
`;

const FeaturesSection = styled.section`
  max-width: 1200px;
  margin: 4rem auto;
  padding: 2rem;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  color: white;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const FeatureDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  text-align: center;
  color: white;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <FaHorse />,
      title: "Horse Breeding",
      description: "Breed and train horses with realistic genetics, 20+ breeds from Thoroughbreds to Clydesdales with authentic coat colors and patterns."
    },
    {
      icon: <FaDog />,
      title: "Dog Breeding",
      description: "Raise champion dogs with 10 popular breeds, each with unique traits and specialties for different competition events."
    },
    {
      icon: <FaFlask />,
      title: "Realistic Genetics",
      description: "Experience authentic Mendelian genetics with coat colors, patterns, and hereditary health conditions affecting your animals."
    },
    {
      icon: <FaTrophy />,
      title: "Competitions",
      description: "Enter your animals in specialized events like Show Jumping, Agility, Tracking, and more to earn prizes and recognition."
    },
    {
      icon: <FaHeart />,
      title: "Strategic Breeding",
      description: "Plan breeding programs to combine desired traits, improve stats, and create the perfect lineage for competition success."
    },
    {
      icon: <FaUsers />,
      title: "Community",
      description: "Connect with other breeders, trade animals, and compete in seasonal tournaments to become the ultimate breeder."
    }
  ];

  return (
    <HomeContainer>
      <Hero>
        <HeroTitle>Welcome to MT Breeding Game</HeroTitle>
        <HeroSubtitle>
          Experience the ultimate horse and dog breeding simulation with realistic genetics, 
          training systems, and competitive events. Build your legacy as a master breeder!
        </HeroSubtitle>
        {!isAuthenticated ? (
          <div>
            <CTAButton to="/register">Start Breeding</CTAButton>
            <CTAButton to="/login">Login</CTAButton>
          </div>
        ) : (
          <CTAButton to="/dashboard">Go to Dashboard</CTAButton>
        )}
      </Hero>

      <FeaturesSection>
        <SectionTitle>Game Features</SectionTitle>
        <FeaturesGrid>
          {features.map((feature, index) => (
            <FeatureCard key={index}>
              <FeatureIcon>{feature.icon}</FeatureIcon>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </FeaturesSection>
    </HomeContainer>
  );
};

export default Home;
