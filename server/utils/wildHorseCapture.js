const mongoose = require('mongoose');

// Biome configurations
const BIOMES = {
  plains: {
    name: 'Plains',
    description: 'All breeds appear equally, standard genetics',
    costs: { rope: 1, coins: 1500 },
    statModifiers: {},
    breedPreferences: [],
    rarityModifier: 1.0,
    specialEffects: []
  },
  beach: {
    name: 'Beach',
    description: 'High marking variety, rare pattern genes, lean/agile builds',
    costs: { cotton: 1, coins: 3000 },
    statModifiers: { speed: 10, flexibility: 15 },
    breedPreferences: ['Thoroughbred', 'Arabian', 'Mustang'],
    rarityModifier: 1.2,
    specialEffects: ['high_markings', 'rare_patterns']
  },
  hilltops: {
    name: 'Hill Tops',
    description: '25% cleaner health genetics, stamina/intelligence boost',
    costs: { nylon: 1, coins: 4000 },
    statModifiers: { stamina: 15, intelligence: 10 },
    breedPreferences: ['Hanoverian', 'Warmblood Mix', 'Quarter Horse'],
    rarityModifier: 1.1,
    specialEffects: ['clean_health', 'stat_boost']
  },
  desert: {
    name: 'Desert',
    description: 'Rare colors, high temperament variation, unique overlays',
    costs: { leather: 1, coins: 6000 },
    statModifiers: { endurance: 20 },
    breedPreferences: ['Arabian', 'Akhal-Teke', 'Mustang'],
    rarityModifier: 1.5,
    specialEffects: ['rare_colors', 'temperament_variation', 'unique_overlays']
  },
  snowfield: {
    name: 'Snowfield',
    description: 'Thick-coated breeds, calm temperaments, rare recessive traits',
    costs: { wool: 1, coins: 5000 },
    statModifiers: { strength: 10, temperament: 15 },
    breedPreferences: ['Friesian', 'Clydesdale', 'Belgian Draft'],
    rarityModifier: 1.3,
    specialEffects: ['calm_temperament', 'rare_recessive']
  },
  volcanic_ridge: {
    name: 'Volcanic Ridge',
    description: 'Event-only biome with exclusive rare coats and extreme stats',
    costs: { gold: 1, gems: 1 },
    statModifiers: {},
    breedPreferences: [],
    rarityModifier: 2.0,
    specialEffects: ['exclusive_coats', 'stat_extremes']
  }
};

// Maturity stage configurations
const MATURITY_STAGES = {
  foal: {
    name: 'Foal',
    ageRange: { min: 4, max: 12 }, // months
    trainingPotential: 'limited',
    bondingModifier: 1.5,
    description: 'Limited training potential, must grow up'
  },
  yearling: {
    name: 'Yearling',
    ageRange: { min: 13, max: 24 }, // months
    trainingPotential: 'moderate',
    bondingModifier: 1.2,
    description: 'Light training, moderate bonding time'
  },
  adult: {
    name: 'Adult',
    ageRange: { min: 25, max: 120 }, // months (2+ years)
    trainingPotential: 'full',
    bondingModifier: 0.8,
    description: 'Fully trainable, more stubborn temperament'
  }
};

// Rare colors and patterns
const RARE_COLORS = {
  desert: ['cream', 'pearl', 'champagne', 'dunalino'],
  volcanic_ridge: ['brindle', 'chimera'],
  beach: ['sabino', 'splash', 'overo'],
  snowfield: ['silver', 'dun'],
  hilltops: ['gray'],
  plains: ['bay', 'chestnut', 'black']
};

// Unique overlays
const UNIQUE_OVERLAYS = {
  desert: ['desert_shimmer', 'sand_dapple', 'mirage_pattern'],
  volcanic_ridge: ['flame_pattern', 'lava_flow', 'ember_glow'],
  beach: ['wave_pattern', 'sea_foam', 'tide_mark'],
  snowfield: ['frost_pattern', 'ice_crystal', 'snow_drift'],
  hilltops: ['mountain_shadow', 'cliff_edge', 'peak_highlight'],
  plains: ['grass_stain', 'wildflower_spot']
};

// Generate random stats based on biome and maturity
function generateStats(biome, maturityStage) {
  const baseStats = {
    speed: 30 + Math.floor(Math.random() * 40),
    endurance: 30 + Math.floor(Math.random() * 40),
    agility: 30 + Math.floor(Math.random() * 40),
    strength: 30 + Math.floor(Math.random() * 40),
    intelligence: 30 + Math.floor(Math.random() * 40),
    obedience: 30 + Math.floor(Math.random() * 40),
    temperament: 30 + Math.floor(Math.random() * 40),
    reflexes: 30 + Math.floor(Math.random() * 40),
    stamina: 30 + Math.floor(Math.random() * 40),
    flexibility: 30 + Math.floor(Math.random() * 40)
  };

  // Apply biome modifiers
  const biomeConfig = BIOMES[biome];
  if (biomeConfig.statModifiers) {
    Object.keys(biomeConfig.statModifiers).forEach(stat => {
      if (baseStats[stat] !== undefined) {
        baseStats[stat] = Math.min(100, baseStats[stat] + biomeConfig.statModifiers[stat]);
      }
    });
  }

  // Apply maturity modifiers
  const maturityConfig = MATURITY_STAGES[maturityStage];
  if (maturityStage === 'foal') {
    // Foals have lower stats but higher potential
    Object.keys(baseStats).forEach(stat => {
      baseStats[stat] = Math.floor(baseStats[stat] * 0.6);
    });
  } else if (maturityStage === 'yearling') {
    // Yearlings have moderate stats
    Object.keys(baseStats).forEach(stat => {
      baseStats[stat] = Math.floor(baseStats[stat] * 0.8);
    });
  }

  // Handle volcanic ridge extreme stats
  if (biome === 'volcanic_ridge') {
    Object.keys(baseStats).forEach(stat => {
      if (Math.random() < 0.3) { // 30% chance for extreme stats
        baseStats[stat] = Math.random() < 0.5 ? 
          Math.floor(Math.random() * 20) : // Very low
          80 + Math.floor(Math.random() * 20); // Very high
      }
    });
  }

  return baseStats;
}

// Generate temperament quality based on biome and maturity
function generateTemperamentQuality(biome, maturityStage) {
  const temperaments = ['calm', 'balanced', 'spirited', 'difficult', 'stubborn'];
  
  if (biome === 'snowfield') {
    // Snowfield horses are more likely to be calm
    return Math.random() < 0.6 ? 'calm' : 'balanced';
  }
  
  if (biome === 'desert') {
    // Desert horses have high temperament variation
    return Math.random() < 0.4 ? 'difficult' : 
           Math.random() < 0.7 ? 'spirited' : 'balanced';
  }
  
  if (maturityStage === 'adult') {
    // Adults are more likely to be stubborn
    return Math.random() < 0.3 ? 'stubborn' : 
           temperaments[Math.floor(Math.random() * temperaments.length)];
  }
  
  // Default random selection with bias toward balanced
  return Math.random() < 0.4 ? 'balanced' : 
         temperaments[Math.floor(Math.random() * temperaments.length)];
}

// Generate markings based on biome
function generateMarkings(biome) {
  const commonMarkings = ['blaze', 'star', 'snip', 'sock', 'stocking'];
  const beachMarkings = ['blaze', 'socks', 'belly_splash', 'face_white', 'leg_white'];
  
  let markings = [];
  
  if (biome === 'beach') {
    // Beach horses have 2-4 markings
    const numMarkings = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < numMarkings; i++) {
      const marking = beachMarkings[Math.floor(Math.random() * beachMarkings.length)];
      if (!markings.includes(marking)) {
        markings.push(marking);
      }
    }
  } else {
    // Other biomes have 0-2 markings
    const numMarkings = Math.floor(Math.random() * 3);
    for (let i = 0; i < numMarkings; i++) {
      const marking = commonMarkings[Math.floor(Math.random() * commonMarkings.length)];
      if (!markings.includes(marking)) {
        markings.push(marking);
      }
    }
  }
  
  return markings;
}

// Generate overlays based on biome
function generateOverlays(biome) {
  const overlays = [];
  const biomeOverlays = UNIQUE_OVERLAYS[biome] || [];
  
  if (biome === 'desert' && Math.random() < 0.3) {
    // Desert has unique overlays
    overlays.push(biomeOverlays[Math.floor(Math.random() * biomeOverlays.length)]);
  }
  
  if (biome === 'volcanic_ridge' && Math.random() < 0.7) {
    // Volcanic ridge has high chance of unique overlays
    overlays.push(biomeOverlays[Math.floor(Math.random() * biomeOverlays.length)]);
  }
  
  return overlays;
}

// Generate breed based on biome preferences
function generateBreed(biome) {
  const allBreeds = [
    'Thoroughbred', 'Friesian', 'Arabian', 'Quarter Horse', 'Appaloosa',
    'Mustang', 'Hanoverian', 'Paint Horse', 'Clydesdale', 'Belgian Draft',
    'Lusitano', 'Akhal-Teke', 'Warmblood Mix', 'Morgan', 'Tennessee Walker',
    'Welsh Pony', 'Shetland Pony', 'Connemara Pony', 'Fjord Pony', 'Hackney Pony'
  ];
  
  const biomeConfig = BIOMES[biome];
  
  if (biomeConfig.breedPreferences.length > 0 && Math.random() < 0.6) {
    // 60% chance to get preferred breed
    return biomeConfig.breedPreferences[Math.floor(Math.random() * biomeConfig.breedPreferences.length)];
  }
  
  return allBreeds[Math.floor(Math.random() * allBreeds.length)];
}

// Generate rarity based on biome
function generateRarity(biome) {
  const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
  const biomeConfig = BIOMES[biome];
  const modifier = biomeConfig.rarityModifier;
  
  let rarity = 'common';
  const roll = Math.random();
  
  if (roll < 0.05 * modifier) rarity = 'legendary';
  else if (roll < 0.15 * modifier) rarity = 'epic';
  else if (roll < 0.35 * modifier) rarity = 'rare';
  else if (roll < 0.60 * modifier) rarity = 'uncommon';
  
  return rarity;
}

// Generate genetics with biome-specific chances
function generateGenetics(biome) {
  const genetics = {
    agouti: 'Ay/at',
    extension: 'E/E',
    cream: 'C/C',
    dun: 'd/d',
    gray: 'g/g',
    silver: 'z/z',
    champagne: 'ch/ch',
    tobiano: 'to/to',
    sabino: 'sb1/sb1',
    splashed_white: 'sw/sw',
    overo: 'o/o',
    pearl: '+/+',
    brindle: 'br/br',
    chimera: 'chi/chi',
    hyperkalemic_paralysis: 'N/N',
    malignant_hyperthermia: 'N/N',
    polysaccharide_storage: 'N/N'
  };
  
  // Apply biome-specific genetic chances
  if (biome === 'beach') {
    // Better chance of rare patterns
    if (Math.random() < 0.4) genetics.sabino = 'SB1/sb1';
    if (Math.random() < 0.3) genetics.splashed_white = 'SW/sw';
    if (Math.random() < 0.2) genetics.overo = 'O/o';
  }
  
  if (biome === 'desert') {
    // Better chance of rare colors
    if (Math.random() < 0.3) genetics.cream = 'C/Ccr';
    if (Math.random() < 0.2) genetics.champagne = 'Ch/ch';
    if (Math.random() < 0.1) genetics.pearl = 'prl/+';
  }
  
  if (biome === 'hilltops') {
    // Cleaner health genetics
    if (Math.random() < 0.75) {
      genetics.hyperkalemic_paralysis = 'N/N';
      genetics.malignant_hyperthermia = 'N/N';
      genetics.polysaccharide_storage = 'N/N';
    }
  }
  
  if (biome === 'volcanic_ridge') {
    // Exclusive rare coats
    if (Math.random() < 0.3) genetics.brindle = 'Br/br';
    if (Math.random() < 0.2) genetics.chimera = 'Chi/chi';
  }
  
  return genetics;
}

// Check if volcanic ridge event is active
function isVolcanicRidgeActive() {
  // For now, return true for testing. In production, check event calendar
  return true;
}

// Main wild horse generation function
function generateWildHorse(biome, maturityStage, userId) {
  const biomeConfig = BIOMES[biome];
  const maturityConfig = MATURITY_STAGES[maturityStage];
  
  // Check if volcanic ridge is accessible
  if (biome === 'volcanic_ridge' && !isVolcanicRidgeActive()) {
    throw new Error('Volcanic Ridge is not currently active');
  }
  
  const horse = {
    name: `Wild ${biomeConfig.name} Horse`,
    owner: userId,
    breed: generateBreed(biome),
    gender: Math.random() < 0.5 ? 'mare' : 'stallion',
    age: Math.floor(Math.random() * (maturityConfig.ageRange.max - maturityConfig.ageRange.min + 1)) + maturityConfig.ageRange.min,
    maturityStage: maturityStage,
    biome: biome,
    isWild: true,
    captureDate: new Date(),
    height: 14 + Math.floor(Math.random() * 4), // 14-17 hands
    color: {
      base: RARE_COLORS[biome][Math.floor(Math.random() * RARE_COLORS[biome].length)],
      pattern: Math.random() < 0.3 ? 'solid' : 'pinto',
      markings: generateMarkings(biome),
      overlays: generateOverlays(biome)
    },
    genetics: generateGenetics(biome),
    stats: generateStats(biome, maturityStage),
    temperamentQuality: generateTemperamentQuality(biome, maturityStage),
    bondingPotential: Math.floor(50 + Math.random() * 50 * maturityConfig.bondingModifier),
    trainingPotential: maturityConfig.trainingPotential,
    rarity: generateRarity(biome),
    health: {
      status: 'healthy',
      energy: 100,
      happiness: Math.floor(60 + Math.random() * 40)
    },
    value: Math.floor(biomeConfig.costs.coins * 0.8 + Math.random() * biomeConfig.costs.coins * 0.4)
  };
  
  return horse;
}

module.exports = {
  BIOMES,
  MATURITY_STAGES,
  generateWildHorse,
  isVolcanicRidgeActive
};
