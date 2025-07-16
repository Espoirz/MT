const mongoose = require('mongoose');

// Dog capture locations configuration
const CAPTURE_LOCATIONS = {
  park: {
    name: 'Park',
    description: 'Mostly small and companion breeds with friendly temperaments',
    costs: { nylon: 1, coins: 4000 },
    breedPreferences: [
      'Jack Russell Terrier', 'Border Collie', 'Labrador Retriever', 'Golden Retriever'
    ],
    temperamentBias: 'friendly',
    healthModifier: 1.0,
    statsModifier: 1.0,
    bondingSpeedBonus: 25,
    tamingDifficulty: 0.7, // Lower difficulty
    specialEffects: ['bonding_speed_bonus'],
    premiumOnly: false
  },
  streets: {
    name: 'Streets',
    description: 'Mixed breeds and working breeds, wary but with stronger stats',
    costs: { leather: 1, coins: 6000 },
    breedPreferences: [
      'German Shepherd', 'Rottweiler', 'Doberman Pinscher', 'Belgian Malinois'
    ],
    temperamentBias: 'wary',
    healthModifier: 0.8, // Higher chance of disorders
    statsModifier: 1.15, // 15% higher stats
    bondingSpeedBonus: 0,
    tamingDifficulty: 1.3, // Higher difficulty
    specialEffects: ['hidden_disorders', 'stray_hero_chance'],
    premiumOnly: true
  },
  farm: {
    name: 'Farm',
    description: 'High rate of purebred dogs with clean genetics and work focus',
    costs: { slip: 1, coins: 8000 },
    breedPreferences: [
      'Border Collie', 'Australian Shepherd', 'German Shepherd', 'Belgian Malinois'
    ],
    temperamentBias: 'obedient',
    healthModifier: 1.2, // Cleaner genetics
    statsModifier: 1.1,
    bondingSpeedBonus: 0,
    tamingDifficulty: 0.9,
    specialEffects: ['purebred_bonus', 'discipline_affinity', 'breeder_points'],
    premiumOnly: true
  }
};

// Breed categories for different locations
const BREED_CATEGORIES = {
  small_companion: ['Jack Russell Terrier'],
  medium_companion: ['Border Collie', 'Labrador Retriever', 'Golden Retriever'],
  working: ['German Shepherd', 'Belgian Malinois', 'Australian Shepherd'],
  guardian: ['Rottweiler', 'Doberman Pinscher'],
  sporting: ['Labrador Retriever', 'Golden Retriever'],
  herding: ['Border Collie', 'Australian Shepherd', 'German Shepherd'],
  northern: ['Siberian Husky']
};

// Temperament types
const TEMPERAMENT_TYPES = {
  friendly: ['eager', 'social', 'gentle', 'playful'],
  wary: ['cautious', 'skittish', 'alert', 'reserved'],
  obedient: ['focused', 'trainable', 'disciplined', 'reliable'],
  confident: ['bold', 'assertive', 'independent', 'strong-willed'],
  balanced: ['stable', 'adaptable', 'even-tempered', 'versatile']
};

// Show discipline affinities
const DISCIPLINE_AFFINITIES = {
  herding: ['Border Collie', 'Australian Shepherd', 'German Shepherd'],
  tracking: ['German Shepherd', 'Belgian Malinois', 'Rottweiler'],
  agility: ['Jack Russell Terrier', 'Border Collie', 'Australian Shepherd'],
  obedience: ['Golden Retriever', 'Labrador Retriever', 'German Shepherd'],
  protection: ['Rottweiler', 'Doberman Pinscher', 'German Shepherd'],
  dock_diving: ['Labrador Retriever', 'Golden Retriever']
};

// Hidden disorders more common in street dogs
const HIDDEN_DISORDERS = [
  'hip_dysplasia',
  'elbow_dysplasia',
  'heart_condition',
  'epilepsy',
  'pra',
  'dm'
];

// Generate random stats based on location
function generateStats(location) {
  const locationConfig = CAPTURE_LOCATIONS[location];
  const baseStats = {
    intelligence: 30 + Math.floor(Math.random() * 40),
    agility: 30 + Math.floor(Math.random() * 40),
    strength: 30 + Math.floor(Math.random() * 40),
    endurance: 30 + Math.floor(Math.random() * 40),
    obedience: 30 + Math.floor(Math.random() * 40),
    temperament: 30 + Math.floor(Math.random() * 40),
    reflexes: 30 + Math.floor(Math.random() * 40),
    focus: 30 + Math.floor(Math.random() * 40),
    tracking: 30 + Math.floor(Math.random() * 40),
    patience: 30 + Math.floor(Math.random() * 40)
  };

  // Apply location stat modifiers
  Object.keys(baseStats).forEach(stat => {
    baseStats[stat] = Math.min(100, Math.floor(baseStats[stat] * locationConfig.statsModifier));
  });

  // Apply temperament bias
  if (locationConfig.temperamentBias === 'friendly') {
    baseStats.temperament = Math.min(100, baseStats.temperament + 15);
    baseStats.obedience = Math.min(100, baseStats.obedience + 10);
  } else if (locationConfig.temperamentBias === 'wary') {
    baseStats.temperament = Math.max(0, baseStats.temperament - 10);
    baseStats.intelligence = Math.min(100, baseStats.intelligence + 10);
  } else if (locationConfig.temperamentBias === 'obedient') {
    baseStats.obedience = Math.min(100, baseStats.obedience + 20);
    baseStats.focus = Math.min(100, baseStats.focus + 15);
  }

  return baseStats;
}

// Generate breed based on location preferences
function generateBreed(location) {
  const locationConfig = CAPTURE_LOCATIONS[location];
  const allBreeds = [
    'Border Collie', 'Labrador Retriever', 'German Shepherd', 'Australian Shepherd',
    'Golden Retriever', 'Belgian Malinois', 'Jack Russell Terrier', 'Rottweiler',
    'Siberian Husky', 'Doberman Pinscher'
  ];

  if (locationConfig.breedPreferences.length > 0 && Math.random() < 0.7) {
    // 70% chance to get preferred breed
    return locationConfig.breedPreferences[Math.floor(Math.random() * locationConfig.breedPreferences.length)];
  }

  return allBreeds[Math.floor(Math.random() * allBreeds.length)];
}

// Generate temperament quality
function generateTemperamentQuality(location) {
  const locationConfig = CAPTURE_LOCATIONS[location];
  const temperamentTypes = TEMPERAMENT_TYPES[locationConfig.temperamentBias] || TEMPERAMENT_TYPES.balanced;
  
  return temperamentTypes[Math.floor(Math.random() * temperamentTypes.length)];
}

// Generate taming difficulty
function generateTamingDifficulty(location) {
  const locationConfig = CAPTURE_LOCATIONS[location];
  const baseDifficulty = 50;
  
  return Math.min(100, Math.max(0, Math.floor(baseDifficulty * locationConfig.tamingDifficulty)));
}

// Generate bonding speed
function generateBondingSpeed(location) {
  const locationConfig = CAPTURE_LOCATIONS[location];
  const baseBondingSpeed = 50;
  
  return Math.min(100, baseBondingSpeed + locationConfig.bondingSpeedBonus);
}

// Generate hidden disorders for street dogs
function generateHiddenDisorders(location) {
  const locationConfig = CAPTURE_LOCATIONS[location];
  const disorders = [];
  
  if (locationConfig.specialEffects.includes('hidden_disorders')) {
    // 30% chance of having a hidden disorder
    if (Math.random() < 0.3) {
      const disorder = HIDDEN_DISORDERS[Math.floor(Math.random() * HIDDEN_DISORDERS.length)];
      disorders.push(disorder);
    }
  }
  
  return disorders;
}

// Generate COI (Coefficient of Inbreeding) score
function generateCOI(location) {
  const locationConfig = CAPTURE_LOCATIONS[location];
  
  if (location === 'farm') {
    // Farm dogs have cleaner genetics (lower COI)
    return Math.floor(Math.random() * 15); // 0-15%
  } else if (location === 'streets') {
    // Street dogs might have higher COI due to limited gene pool
    return Math.floor(Math.random() * 40) + 10; // 10-50%
  } else {
    // Park dogs have moderate COI
    return Math.floor(Math.random() * 25) + 5; // 5-30%
  }
}

// Generate special title for street dogs
function generateSpecialTitle(location, breed) {
  if (location === 'streets' && Math.random() < 0.05) { // 5% chance
    const heroTitles = [
      'Stray Hero',
      'Street Survivor',
      'Urban Guardian',
      'Rescue Champion',
      'City Wanderer'
    ];
    return heroTitles[Math.floor(Math.random() * heroTitles.length)];
  }
  return '';
}

// Generate show discipline affinity
function generateDisciplineAffinity(location, breed) {
  const affinities = [];
  
  if (location === 'farm') {
    // Farm dogs more likely to have discipline affinity
    if (Math.random() < 0.6) { // 60% chance
      Object.keys(DISCIPLINE_AFFINITIES).forEach(discipline => {
        if (DISCIPLINE_AFFINITIES[discipline].includes(breed)) {
          affinities.push(discipline);
        }
      });
    }
  } else if (location === 'streets') {
    // Street dogs might have survival-based affinities
    if (Math.random() < 0.3) { // 30% chance
      if (['German Shepherd', 'Belgian Malinois', 'Rottweiler'].includes(breed)) {
        affinities.push('protection');
      }
      if (['Border Collie', 'Australian Shepherd'].includes(breed)) {
        affinities.push('tracking');
      }
    }
  }
  
  return affinities;
}

// Generate genetics with location-specific modifiers
function generateGenetics(location, breed) {
  const genetics = {
    agouti: 'Ay/at',
    k_locus: 'KB/ky',
    extension: 'E/E',
    brown: 'B/B',
    dilution: 'D/D',
    merle: 'm/m',
    spotting: 'S/S',
    graying: 'g/g',
    brindle: 'br/br',
    ticking: 't/t',
    // Health genes
    pra: 'N/N',
    dm: 'N/N',
    mdr1: 'N/N',
    cea: 'N/N',
    huu: 'N/N',
    hip_dysplasia: 'N/N',
    elbow_dysplasia: 'N/N',
    heart_condition: 'N/N',
    epilepsy: 'N/N'
  };
  
  const locationConfig = CAPTURE_LOCATIONS[location];
  
  // Apply health modifier
  if (locationConfig.healthModifier < 1.0) {
    // Street dogs have higher chance of carrying health issues
    const healthGenes = ['pra', 'dm', 'mdr1', 'cea', 'huu', 'hip_dysplasia', 'elbow_dysplasia', 'heart_condition', 'epilepsy'];
    healthGenes.forEach(gene => {
      if (Math.random() < 0.15) { // 15% chance to be carrier
        genetics[gene] = 'N/' + gene.split('_')[0];
      }
    });
  } else if (locationConfig.healthModifier > 1.0) {
    // Farm dogs have cleaner genetics - force clean health genes
    const healthGenes = ['pra', 'dm', 'mdr1', 'cea', 'huu', 'hip_dysplasia', 'elbow_dysplasia', 'heart_condition', 'epilepsy'];
    healthGenes.forEach(gene => {
      genetics[gene] = 'N/N';
    });
  }
  
  return genetics;
}

// Generate rarity based on location and special effects
function generateRarity(location, hasSpecialTitle) {
  const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
  let rarity = 'common';
  
  const locationConfig = CAPTURE_LOCATIONS[location];
  let rarityModifier = 1.0;
  
  if (location === 'farm') {
    rarityModifier = 1.3; // Farm dogs more likely to be rare
  } else if (location === 'streets') {
    rarityModifier = 1.2; // Street dogs slightly more likely to be rare
  }
  
  if (hasSpecialTitle) {
    rarityModifier *= 2.0; // Special title dogs are much more likely to be rare
  }
  
  const roll = Math.random();
  
  if (roll < 0.02 * rarityModifier) rarity = 'legendary';
  else if (roll < 0.08 * rarityModifier) rarity = 'epic';
  else if (roll < 0.20 * rarityModifier) rarity = 'rare';
  else if (roll < 0.45 * rarityModifier) rarity = 'uncommon';
  
  return rarity;
}

// Main dog capture function
function generateWildDog(location, userId) {
  const locationConfig = CAPTURE_LOCATIONS[location];
  
  const breed = generateBreed(location);
  const specialTitle = generateSpecialTitle(location, breed);
  const disciplineAffinity = generateDisciplineAffinity(location, breed);
  const hiddenDisorders = generateHiddenDisorders(location);
  
  const dog = {
    name: `Wild ${locationConfig.name} Dog`,
    owner: userId,
    breed: breed,
    gender: Math.random() < 0.5 ? 'male' : 'female',
    age: Math.floor(Math.random() * 8) + 1, // 1-8 years old
    captureLocation: location,
    isWild: true,
    captureDate: new Date(),
    height: 16 + Math.floor(Math.random() * 12), // 16-28 inches
    weight: 25 + Math.floor(Math.random() * 75), // 25-100 pounds
    color: {
      base: ['black', 'brown', 'tan', 'white', 'red', 'blue'][Math.floor(Math.random() * 6)],
      pattern: Math.random() < 0.3 ? 'solid' : 'mixed',
      markings: Math.random() < 0.4 ? ['white_chest', 'white_paws'] : []
    },
    genetics: generateGenetics(location, breed),
    hiddenDisorders: hiddenDisorders,
    coi: generateCOI(location),
    stats: generateStats(location),
    tamingDifficulty: generateTamingDifficulty(location),
    bondingSpeed: generateBondingSpeed(location),
    specialTitle: specialTitle,
    showDisciplineAffinity: disciplineAffinity,
    rarity: generateRarity(location, specialTitle !== ''),
    health: {
      status: 'healthy',
      energy: 100,
      happiness: Math.floor(60 + Math.random() * 40)
    },
    value: Math.floor(locationConfig.costs.coins * 0.6 + Math.random() * locationConfig.costs.coins * 0.8)
  };
  
  return dog;
}

// Shelter system functions
function calculateAdoptionFee(dog) {
  let baseFee = 100;
  
  // Rarity modifier
  const rarityMultipliers = {
    common: 1.0,
    uncommon: 1.5,
    rare: 2.0,
    epic: 3.0,
    legendary: 5.0
  };
  
  baseFee *= rarityMultipliers[dog.rarity] || 1.0;
  
  // Health modifier
  if (dog.hiddenDisorders && dog.hiddenDisorders.length > 0) {
    baseFee *= 0.7; // Discount for health issues
  }
  
  // Age modifier
  if (dog.age > 6) {
    baseFee *= 0.8; // Discount for older dogs
  }
  
  // Special title bonus
  if (dog.specialTitle) {
    baseFee *= 1.5;
  }
  
  return Math.floor(baseFee);
}

function calculateShelterReputationGain(action, dog) {
  let baseGain = 0;
  
  switch (action) {
    case 'adopt':
      baseGain = 10;
      if (dog.hiddenDisorders && dog.hiddenDisorders.length > 0) {
        baseGain += 5; // Extra points for adopting dogs with issues
      }
      if (dog.age > 6) {
        baseGain += 5; // Extra points for adopting older dogs
      }
      break;
    case 'sponsor':
      baseGain = 15;
      break;
    case 'donate_coins':
      baseGain = 1; // Per 100 coins donated
      break;
    case 'complete_quest':
      baseGain = 20;
      break;
  }
  
  return baseGain;
}

// Check if user can access premium locations
function canAccessPremiumLocation(user) {
  return user.membershipTier === 'premium';
}

// Check if user can sponsor more animals
function canSponsorMore(user) {
  if (user.membershipTier !== 'premium') return false;
  return user.sponsoredAnimals.length < 4;
}

module.exports = {
  CAPTURE_LOCATIONS,
  generateWildDog,
  calculateAdoptionFee,
  calculateShelterReputationGain,
  canAccessPremiumLocation,
  canSponsorMore
};
