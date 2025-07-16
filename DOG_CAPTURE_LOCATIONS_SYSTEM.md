# Dog Capture Locations System

## Overview

The Dog Capture Locations system provides players with the ability to capture wild dogs from three different locations: Park, Streets, and Farm. Each location offers unique breeds, challenges, and rewards, with premium locations requiring a premium membership.

## Locations

### Park (Free Location)
- **Cost**: 4,000 coins + 1 Nylon Leash
- **Description**: Mostly small and companion breeds with friendly temperaments
- **Breeds**: Jack Russell Terrier, Border Collie, Labrador Retriever, Golden Retriever
- **Temperament**: Friendly bias (+15 temperament, +10 obedience)
- **Special Features**: 
  - 25% bonding speed bonus
  - Lower taming difficulty (70% of base)
  - No health disorders
  - Accessible to all players

### Streets (Premium Only)
- **Cost**: 6,000 coins + 1 Leather Leash
- **Description**: Mixed breeds and working breeds, wary but with stronger stats
- **Breeds**: German Shepherd, Rottweiler, Doberman Pinscher, Belgian Malinois
- **Temperament**: Wary bias (-10 temperament, +10 intelligence)
- **Special Features**:
  - 15% stat bonus across all stats
  - Higher taming difficulty (130% of base)
  - 30% chance of hidden health disorders
  - 5% chance of special "Stray Hero" title
  - Stronger survival-based genetics

### Farm (Premium Only)
- **Cost**: 8,000 coins + 1 Slip Leash
- **Description**: High rate of purebred dogs with clean genetics and work focus
- **Breeds**: Border Collie, Australian Shepherd, German Shepherd, Belgian Malinois
- **Temperament**: Obedient bias (+20 obedience, +15 focus)
- **Special Features**:
  - 20% health modifier (cleaner genetics)
  - 10% stat bonus
  - Lower COI (0-15% vs 5-30% park)
  - Higher chance of discipline affinities
  - 60% chance of show discipline affinity

## Capture Mechanics

### Payment System
Players must have sufficient coins AND the correct leash type:
- **Nylon Leash**: Green leash for park captures
- **Leather Leash**: Brown leash for street captures  
- **Slip Leash**: Red leash for farm captures

### Dog Generation
Each captured dog receives:
- **Random breed** (70% chance from location preferences)
- **Random gender** (50/50 male/female)
- **Age**: 1-8 years old
- **Physical traits**: Height (16-28"), weight (25-100 lbs), color
- **Stats**: 10 different stats (30-70 base + location modifiers)
- **Genetics**: Full genetic profile with health genes
- **Rarity**: Common to Legendary (location affects rarity rates)

### Rarity System
- **Common**: 50% base chance
- **Uncommon**: 25% base chance  
- **Rare**: 20% base chance
- **Epic**: 4% base chance
- **Legendary**: 1% base chance

Rarity modifiers:
- Farm: 30% increase in rare+ chances
- Streets: 20% increase in rare+ chances
- Special titles: 2x rarity modifier

## Shelter System

### Shelter Entry
Some wild dogs may enter the shelter system instead of being immediately owned:
- Dogs undergo quarantine period
- Available for adoption by any player
- Adoption fees based on rarity and traits

### Adoption Process
- **Adoption Fee**: Calculated based on rarity, age, health, special titles
- **Reputation Gain**: 10+ points for adopting (bonus for special needs dogs)
- **Immediate Ownership**: Dog becomes yours upon adoption

### Sponsorship (Premium Only)
- **Cost**: 500 coins
- **Requirement**: Premium membership
- **Limit**: 4 sponsored animals maximum
- **Benefits**: 15 reputation points, helps shelter operations
- **Dog stays in shelter** but you support their care

## Health System

### Health Genes
All captured dogs receive genetic testing for:
- Progressive Retinal Atrophy (PRA)
- Degenerative Myelopathy (DM)
- Multi-Drug Resistance (MDR1)
- Collie Eye Anomaly (CEA)
- Hyperuricosuria (HUU)
- Hip Dysplasia
- Elbow Dysplasia
- Heart Conditions
- Epilepsy

### Hidden Disorders
Street dogs have 30% chance of hidden health disorders:
- Only revealed through special testing
- Affects adoption fees (discount)
- Realistic breeding considerations

### COI (Coefficient of Inbreeding)
- **Farm**: 0-15% (cleanest genetics)
- **Park**: 5-30% (moderate)
- **Streets**: 10-50% (highest variation)

## Bonding and Training

### Bonding Speed
- **Park**: +25% bonding speed bonus
- **Streets**: Normal bonding speed
- **Farm**: Normal bonding speed

### Taming Difficulty
- **Park**: 70% of base (easier)
- **Streets**: 130% of base (harder)
- **Farm**: 90% of base (moderate)

### Show Discipline Affinity
Farm dogs have 60% chance of discipline affinity:
- **Herding**: Border Collie, Australian Shepherd, German Shepherd
- **Tracking**: German Shepherd, Belgian Malinois, Rottweiler
- **Agility**: Jack Russell Terrier, Border Collie, Australian Shepherd
- **Obedience**: Golden Retriever, Labrador Retriever, German Shepherd
- **Protection**: Rottweiler, Doberman Pinscher, German Shepherd

## Premium Features

### Membership Requirements
- **Basic Members**: Park access only
- **Premium Members**: Full access to Streets and Farm locations

### Premium Benefits
- Access to Streets and Farm locations
- Dog sponsorship capabilities (up to 4 animals)
- Higher quality genetics from Farm location
- Special title opportunities from Streets

## User Interface

### Capture Page
- Location selection cards with visual feedback
- Resource display (coins, leashes)
- Cost breakdown and requirements
- Breed preferences and special effects
- Capture results modal with full dog details

### Shelter Page
- Paginated dog listings
- Filter by breed, rarity, age
- Adoption fee calculations
- Sponsorship options for premium members
- User reputation tracking

## Technical Implementation

### Backend Models
- **Dog Model**: Enhanced with capture location, shelter fields, bonding mechanics
- **User Model**: Leash inventory, shelter reputation, membership tiers
- **Capture Utility**: Location-specific dog generation logic

### API Endpoints
- `GET /api/dogs/capture-locations` - Get available locations
- `POST /api/dogs/capture` - Capture a wild dog
- `GET /api/dogs/shelter` - Get shelter dogs
- `POST /api/dogs/adopt/:id` - Adopt a shelter dog
- `POST /api/dogs/sponsor/:id` - Sponsor a shelter dog

### Frontend Components
- **DogCapture**: Location selection and capture interface
- **DogShelter**: Shelter browsing and adoption interface
- **Navigation**: Integrated into existing Dogs page

## Future Enhancements

### Planned Features
- Seasonal events affecting capture rates
- Location-specific weather effects
- Advanced breeding with capture location genetics
- Shelter volunteer missions
- Regional rescue organizations
- Cross-location breeding programs

### Expansion Possibilities
- Additional capture locations (Beach, Mountains, City)
- Time-of-day effects on captures
- Specialized leash types with bonuses
- Dog shows featuring captured dogs
- Rescue organization partnerships
- International dog exchanges

This system creates a comprehensive dog capture and rescue ecosystem that rewards both casual players and premium members while maintaining realistic genetics and shelter operations.
