// Genetics utility for breeding calculations
class GeneticsCalculator {
  
  // Horse breed base stats
  static HORSE_BREED_STATS = {
    'Thoroughbred': { speed: 90, endurance: 75, agility: 80, obedience: 60, strength: 70, intelligence: 65, temperament: 60, reflexes: 75 },
    'Friesian': { speed: 60, endurance: 70, agility: 65, obedience: 85, strength: 80, intelligence: 65, temperament: 80, reflexes: 60 },
    'Arabian': { speed: 75, endurance: 95, agility: 70, obedience: 70, strength: 65, intelligence: 85, temperament: 75, reflexes: 70 },
    'Quarter Horse': { speed: 75, endurance: 70, agility: 70, obedience: 80, strength: 85, intelligence: 70, temperament: 75, reflexes: 70 },
    'Appaloosa': { speed: 65, endurance: 70, agility: 75, obedience: 75, strength: 70, intelligence: 80, temperament: 70, reflexes: 65 },
    'Mustang': { speed: 70, endurance: 85, agility: 75, obedience: 65, strength: 80, intelligence: 75, temperament: 70, reflexes: 70 },
    'Hanoverian': { speed: 70, endurance: 75, agility: 85, obedience: 90, strength: 75, intelligence: 80, temperament: 75, reflexes: 80 },
    'Paint Horse': { speed: 70, endurance: 70, agility: 70, obedience: 75, strength: 75, intelligence: 70, temperament: 80, reflexes: 65 },
    'Clydesdale': { speed: 40, endurance: 80, agility: 40, obedience: 75, strength: 95, intelligence: 60, temperament: 85, reflexes: 45 },
    'Belgian Draft': { speed: 35, endurance: 85, agility: 35, obedience: 70, strength: 95, intelligence: 60, temperament: 80, reflexes: 40 },
    'Lusitano': { speed: 70, endurance: 75, agility: 85, obedience: 90, strength: 70, intelligence: 85, temperament: 75, reflexes: 75 },
    'Akhal-Teke': { speed: 80, endurance: 90, agility: 75, obedience: 65, strength: 65, intelligence: 75, temperament: 65, reflexes: 70 },
    'Warmblood Mix': { speed: 75, endurance: 75, agility: 80, obedience: 75, strength: 75, intelligence: 75, temperament: 75, reflexes: 75 },
    'Morgan': { speed: 65, endurance: 75, agility: 70, obedience: 80, strength: 70, intelligence: 75, temperament: 85, reflexes: 70 },
    'Tennessee Walker': { speed: 60, endurance: 75, agility: 65, obedience: 85, strength: 65, intelligence: 70, temperament: 80, reflexes: 60 },
    'Welsh Pony': { speed: 70, endurance: 70, agility: 85, obedience: 85, strength: 60, intelligence: 75, temperament: 90, reflexes: 80 },
    'Shetland Pony': { speed: 55, endurance: 80, agility: 70, obedience: 75, strength: 70, intelligence: 75, temperament: 85, reflexes: 65 },
    'Connemara Pony': { speed: 70, endurance: 75, agility: 80, obedience: 80, strength: 75, intelligence: 75, temperament: 80, reflexes: 75 },
    'Fjord Pony': { speed: 60, endurance: 70, agility: 65, obedience: 80, strength: 85, intelligence: 70, temperament: 85, reflexes: 65 },
    'Hackney Pony': { speed: 75, endurance: 65, agility: 85, obedience: 75, strength: 65, intelligence: 80, temperament: 75, reflexes: 80 }
  };

  // Dog breed base stats
  static DOG_BREED_STATS = {
    'Border Collie': { intelligence: 95, agility: 90, obedience: 90, focus: 85, strength: 70, endurance: 80, temperament: 75, reflexes: 85, tracking: 80, patience: 75 },
    'Labrador Retriever': { intelligence: 80, agility: 75, obedience: 85, focus: 75, strength: 85, endurance: 85, temperament: 90, reflexes: 75, tracking: 80, patience: 85 },
    'German Shepherd': { intelligence: 90, agility: 80, obedience: 90, focus: 85, strength: 85, endurance: 85, temperament: 75, reflexes: 80, tracking: 90, patience: 80 },
    'Australian Shepherd': { intelligence: 85, agility: 90, obedience: 85, focus: 80, strength: 75, endurance: 80, temperament: 80, reflexes: 85, tracking: 75, patience: 75 },
    'Golden Retriever': { intelligence: 80, agility: 70, obedience: 90, focus: 75, strength: 80, endurance: 80, temperament: 90, reflexes: 70, tracking: 75, patience: 85 },
    'Belgian Malinois': { intelligence: 85, agility: 85, obedience: 85, focus: 90, strength: 85, endurance: 85, temperament: 70, reflexes: 90, tracking: 85, patience: 70 },
    'Jack Russell Terrier': { intelligence: 80, agility: 95, obedience: 70, focus: 75, strength: 60, endurance: 85, temperament: 75, reflexes: 85, tracking: 70, patience: 65 },
    'Rottweiler': { intelligence: 75, agility: 65, obedience: 80, focus: 80, strength: 95, endurance: 80, temperament: 75, reflexes: 70, tracking: 75, patience: 80 },
    'Siberian Husky': { intelligence: 80, agility: 75, obedience: 70, focus: 70, strength: 80, endurance: 90, temperament: 75, reflexes: 75, tracking: 80, patience: 70 },
    'Doberman Pinscher': { intelligence: 85, agility: 80, obedience: 85, focus: 85, strength: 80, endurance: 80, temperament: 70, reflexes: 90, tracking: 85, patience: 75 }
  };

  // Generate random genetics for a new animal
  static generateRandomGenetics(animalType, breed) {
    if (animalType === 'horse') {
      return this.generateHorseGenetics(breed);
    } else {
      return this.generateDogGenetics(breed);
    }
  }

  static generateHorseGenetics(breed) {
    const genetics = {
      agouti: this.randomAllele(['Ay', 'at', 'a']),
      extension: this.randomAllele(['E', 'e']),
      cream: this.randomAllele(['C', 'Ccr', 'Cprl']),
      dun: this.randomAllele(['D', 'd']),
      gray: this.randomAllele(['G', 'g']),
      silver: this.randomAllele(['Z', 'z']),
      champagne: this.randomAllele(['Ch', 'ch']),
      tobiano: this.randomAllele(['TO', 'to']),
      sabino: this.randomAllele(['SB1', 'sb1']),
      splashed_white: this.randomAllele(['SW', 'sw']),
      hyperkalemic_paralysis: this.randomAllele(['N', 'H'], [0.95, 0.05]),
      malignant_hyperthermia: this.randomAllele(['N', 'M'], [0.98, 0.02]),
      polysaccharide_storage: this.randomAllele(['N', 'P'], [0.92, 0.08])
    };
    
    return genetics;
  }

  static generateDogGenetics(breed) {
    const genetics = {
      agouti: this.randomAllele(['Ay', 'at', 'a']),
      k_locus: this.randomAllele(['KB', 'ky']),
      extension: this.randomAllele(['E', 'e']),
      brown: this.randomAllele(['B', 'b']),
      dilution: this.randomAllele(['D', 'd']),
      merle: this.randomAllele(['M', 'm'], [0.1, 0.9]),
      spotting: this.randomAllele(['S', 'si', 'sp', 'sw']),
      graying: this.randomAllele(['G', 'g']),
      brindle: this.randomAllele(['Br', 'br']),
      ticking: this.randomAllele(['T', 't']),
      pra: this.randomAllele(['N', 'pra'], [0.9, 0.1]),
      dm: this.randomAllele(['N', 'dm'], [0.85, 0.15]),
      mdr1: this.randomAllele(['N', 'mdr1'], [0.8, 0.2]),
      cea: this.randomAllele(['N', 'cea'], [0.9, 0.1]),
      huu: this.randomAllele(['N', 'huu'], [0.95, 0.05])
    };
    
    return genetics;
  }

  // Helper to create random allele pairs
  static randomAllele(alleles, weights = null) {
    const getRandomAllele = () => {
      if (weights) {
        const random = Math.random();
        let cumulative = 0;
        for (let i = 0; i < weights.length; i++) {
          cumulative += weights[i];
          if (random <= cumulative) {
            return alleles[i];
          }
        }
      }
      return alleles[Math.floor(Math.random() * alleles.length)];
    };
    
    const allele1 = getRandomAllele();
    const allele2 = getRandomAllele();
    return `${allele1}/${allele2}`;
  }

  // Calculate stats based on breed and genetics
  static calculateStats(animalType, breed, genetics) {
    const baseStats = animalType === 'horse' ? 
      this.HORSE_BREED_STATS[breed] : 
      this.DOG_BREED_STATS[breed];
    
    const stats = {};
    
    // Add random variation (-10 to +10) to base stats
    for (const [stat, value] of Object.entries(baseStats)) {
      const variation = Math.floor(Math.random() * 21) - 10; // -10 to +10
      stats[stat] = Math.max(0, Math.min(100, value + variation));
    }
    
    // Apply genetic modifiers (simplified)
    if (genetics.gray === 'G/G') {
      stats.temperament = Math.min(100, stats.temperament + 5);
    }
    
    return stats;
  }

  // Breed two animals
  static breed(parent1, parent2) {
    if (parent1.breed !== parent2.breed) {
      throw new Error('Cannot breed animals of different breeds');
    }
    
    const offspring = {
      breed: parent1.breed,
      genetics: this.inheritGenetics(parent1.genetics, parent2.genetics),
      stats: {}
    };
    
    // Calculate offspring stats as average of parents with variation
    const statKeys = Object.keys(parent1.stats);
    for (const stat of statKeys) {
      const parentAvg = (parent1.stats[stat] + parent2.stats[stat]) / 2;
      const variation = Math.floor(Math.random() * 21) - 10; // -10 to +10
      offspring.stats[stat] = Math.max(0, Math.min(100, parentAvg + variation));
    }
    
    return offspring;
  }

  // Inherit genetics from two parents
  static inheritGenetics(parent1Genetics, parent2Genetics) {
    const offspring = {};
    
    for (const gene of Object.keys(parent1Genetics)) {
      const parent1Alleles = parent1Genetics[gene].split('/');
      const parent2Alleles = parent2Genetics[gene].split('/');
      
      const inheritedAllele1 = parent1Alleles[Math.floor(Math.random() * 2)];
      const inheritedAllele2 = parent2Alleles[Math.floor(Math.random() * 2)];
      
      offspring[gene] = `${inheritedAllele1}/${inheritedAllele2}`;
    }
    
    return offspring;
  }

  // Check for genetic health issues
  static checkHealthIssues(genetics) {
    const issues = [];
    
    // Horse health checks
    if (genetics.hyperkalemic_paralysis === 'H/H') {
      issues.push('Hyperkalemic Paralysis');
    }
    if (genetics.malignant_hyperthermia === 'M/M') {
      issues.push('Malignant Hyperthermia');
    }
    if (genetics.polysaccharide_storage === 'P/P') {
      issues.push('Polysaccharide Storage Myopathy');
    }
    
    // Dog health checks
    if (genetics.pra === 'pra/pra') {
      issues.push('Progressive Retinal Atrophy');
    }
    if (genetics.dm === 'dm/dm') {
      issues.push('Degenerative Myelopathy');
    }
    if (genetics.mdr1 && genetics.mdr1.includes('mdr1')) {
      issues.push('Multi-Drug Resistance');
    }
    if (genetics.cea === 'cea/cea') {
      issues.push('Collie Eye Anomaly');
    }
    if (genetics.huu === 'huu/huu') {
      issues.push('Hyperuricosuria');
    }
    
    return issues;
  }

  // Calculate coat color from genetics
  static calculateCoatColor(genetics) {
    // Simplified color calculation
    let baseColor = 'bay';
    let pattern = 'solid';
    
    if (genetics.extension === 'e/e') {
      baseColor = 'chestnut';
    } else if (genetics.agouti === 'a/a') {
      baseColor = 'black';
    }
    
    if (genetics.cream && genetics.cream.includes('Ccr')) {
      baseColor = baseColor + '_cream';
    }
    
    if (genetics.gray && genetics.gray.includes('G')) {
      baseColor = 'gray';
    }
    
    if (genetics.tobiano === 'TO/TO' || genetics.tobiano === 'TO/to') {
      pattern = 'tobiano';
    }
    
    if (genetics.merle && genetics.merle.includes('M')) {
      pattern = 'merle';
    }
    
    return { base: baseColor, pattern };
  }
}

module.exports = GeneticsCalculator;
