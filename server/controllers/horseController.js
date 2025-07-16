const Horse = require('../models/Horse');
const User = require('../models/User');
const GeneticsCalculator = require('../utils/genetics');
const { BIOMES, MATURITY_STAGES, generateWildHorse, isVolcanicRidgeActive } = require('../utils/wildHorseCapture');

// @desc    Get all horses for a user
// @route   GET /api/horses
// @access  Private
const getHorses = async (req, res) => {
  try {
    const horses = await Horse.find({ owner: req.user.id })
      .populate('breeding.sire', 'name breed')
      .populate('breeding.dam', 'name breed')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: horses.length,
      data: horses,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single horse
// @route   GET /api/horses/:id
// @access  Private
const getHorse = async (req, res) => {
  try {
    const horse = await Horse.findById(req.params.id)
      .populate('breeding.sire', 'name breed')
      .populate('breeding.dam', 'name breed')
      .populate('breeding.offspring', 'name breed gender');

    if (!horse) {
      return res.status(404).json({ message: 'Horse not found' });
    }

    // Check if user owns this horse
    if (horse.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({
      success: true,
      data: horse,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new horse
// @route   POST /api/horses
// @access  Private
const createHorse = async (req, res) => {
  try {
    const { name, breed, gender } = req.body;

    // Generate genetics and stats for the horse
    const genetics = GeneticsCalculator.generateRandomGenetics('horse', breed);
    const stats = GeneticsCalculator.calculateStats('horse', breed, genetics);
    const color = GeneticsCalculator.calculateCoatColor(genetics);

    // Set height based on breed
    let height = 15.0; // Default height
    if (breed.includes('Pony')) {
      height = 12.0 + Math.random() * 3; // 12-15 hh for ponies
    } else if (breed === 'Clydesdale' || breed === 'Belgian Draft') {
      height = 16.0 + Math.random() * 2; // 16-18 hh for draft horses
    } else {
      height = 14.5 + Math.random() * 2.5; // 14.5-17 hh for regular horses
    }

    const horse = await Horse.create({
      name,
      breed,
      gender,
      owner: req.user.id,
      height: Math.round(height * 10) / 10, // Round to 1 decimal place
      genetics,
      stats,
      color,
      age: 0,
      rarity: Math.random() < 0.1 ? 'rare' : Math.random() < 0.3 ? 'uncommon' : 'common'
    });

    res.status(201).json({
      success: true,
      data: horse,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update horse
// @route   PUT /api/horses/:id
// @access  Private
const updateHorse = async (req, res) => {
  try {
    let horse = await Horse.findById(req.params.id);

    if (!horse) {
      return res.status(404).json({ message: 'Horse not found' });
    }

    // Check if user owns this horse
    if (horse.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    horse = await Horse.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      data: horse,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete horse
// @route   DELETE /api/horses/:id
// @access  Private
const deleteHorse = async (req, res) => {
  try {
    const horse = await Horse.findById(req.params.id);

    if (!horse) {
      return res.status(404).json({ message: 'Horse not found' });
    }

    // Check if user owns this horse
    if (horse.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await horse.deleteOne();

    res.json({
      success: true,
      message: 'Horse deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Breed two horses
// @route   POST /api/horses/breed
// @access  Private
const breedHorses = async (req, res) => {
  try {
    const { sireId, damId } = req.body;

    // Get both horses
    const sire = await Horse.findById(sireId);
    const dam = await Horse.findById(damId);

    if (!sire || !dam) {
      return res.status(404).json({ message: 'One or both horses not found' });
    }

    // Check ownership
    if (sire.owner.toString() !== req.user.id || dam.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to breed these horses' });
    }

    // Validate breeding requirements
    if (sire.gender !== 'stallion' || dam.gender !== 'mare') {
      return res.status(400).json({ message: 'Invalid breeding pair - need stallion and mare' });
    }

    if (sire.breed !== dam.breed) {
      return res.status(400).json({ message: 'Cannot breed horses of different breeds' });
    }

    if (sire.age < 3 || dam.age < 3) {
      return res.status(400).json({ message: 'Horses must be at least 3 years old to breed' });
    }

    if (dam.breeding.isPregnant) {
      return res.status(400).json({ message: 'Mare is already pregnant' });
    }

    // Check if breeding cooldown has passed
    const now = new Date();
    const cooldownPeriod = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
    
    if (dam.breeding.lastBred && (now - dam.breeding.lastBred) < cooldownPeriod) {
      return res.status(400).json({ message: 'Mare is still in breeding cooldown' });
    }

    // Generate offspring
    const offspring = GeneticsCalculator.breed(sire, dam);
    
    // Determine gender randomly
    const gender = Math.random() < 0.5 ? 'stallion' : 'mare';
    
    // Create foal
    const foal = await Horse.create({
      name: `${sire.name} x ${dam.name} Foal`,
      breed: offspring.breed,
      gender,
      owner: req.user.id,
      height: 10 + Math.random() * 2, // Foals are smaller
      genetics: offspring.genetics,
      stats: offspring.stats,
      color: GeneticsCalculator.calculateCoatColor(offspring.genetics),
      age: 0,
      'breeding.sire': sireId,
      'breeding.dam': damId,
      rarity: Math.random() < 0.05 ? 'legendary' : Math.random() < 0.15 ? 'epic' : 'common'
    });

    // Update parent records
    await Horse.findByIdAndUpdate(sireId, {
      $push: { 'breeding.offspring': foal._id }
    });

    await Horse.findByIdAndUpdate(damId, {
      $push: { 'breeding.offspring': foal._id },
      $inc: { 'breeding.pregnancies': 1 },
      $set: { 'breeding.lastBred': now }
    });

    res.status(201).json({
      success: true,
      message: 'Breeding successful!',
      data: foal,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Train horse
// @route   PUT /api/horses/:id/train
// @access  Private
const trainHorse = async (req, res) => {
  try {
    const { discipline } = req.body;
    const horse = await Horse.findById(req.params.id);

    if (!horse) {
      return res.status(404).json({ message: 'Horse not found' });
    }

    if (horse.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (horse.health.energy < 20) {
      return res.status(400).json({ message: 'Horse is too tired to train' });
    }

    // Increase training level
    const trainingGain = Math.floor(Math.random() * 5) + 1;
    horse.training[discipline] = Math.min(100, horse.training[discipline] + trainingGain);
    
    // Decrease energy
    horse.health.energy = Math.max(0, horse.health.energy - 20);
    
    // Small chance to improve stats
    if (Math.random() < 0.1) {
      const relevantStats = {
        'dressage': ['obedience', 'temperament'],
        'show_jumping': ['agility', 'strength'],
        'cross_country': ['endurance', 'agility'],
        'barrel_racing': ['speed', 'reflexes'],
        'reining': ['obedience', 'agility'],
        'western_pleasure': ['temperament', 'obedience'],
        'trail': ['endurance', 'temperament']
      };

      const statsToImprove = relevantStats[discipline] || ['endurance'];
      const statToImprove = statsToImprove[Math.floor(Math.random() * statsToImprove.length)];
      horse.stats[statToImprove] = Math.min(100, horse.stats[statToImprove] + 1);
    }

    await horse.save();

    res.json({
      success: true,
      message: `Training in ${discipline} improved by ${trainingGain} points!`,
      data: horse,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get capture biomes and information
// @route   GET /api/horses/capture/biomes
// @access  Private
const getCaptureBiomes = async (req, res) => {
  try {
    const biomes = Object.keys(BIOMES).map(key => ({
      id: key,
      ...BIOMES[key],
      isActive: key === 'volcanic_ridge' ? isVolcanicRidgeActive() : true
    }));
    
    res.json({
      success: true,
      data: {
        biomes,
        maturityStages: MATURITY_STAGES
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Capture a wild horse
// @route   POST /api/horses/capture
// @access  Private
const captureWildHorse = async (req, res) => {
  try {
    const { biome, maturityStage, paymentMethod } = req.body;
    
    // Validate input
    if (!BIOMES[biome]) {
      return res.status(400).json({ message: 'Invalid biome selected' });
    }
    
    if (!MATURITY_STAGES[maturityStage]) {
      return res.status(400).json({ message: 'Invalid maturity stage selected' });
    }
    
    // Check if volcanic ridge is active
    if (biome === 'volcanic_ridge' && !isVolcanicRidgeActive()) {
      return res.status(400).json({ message: 'Volcanic Ridge is not currently active' });
    }
    
    // Get user with lassos and currency
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const biomeConfig = BIOMES[biome];
    const costs = biomeConfig.costs;
    
    // Validate payment method and deduct costs
    let paymentValid = false;
    
    if (paymentMethod === 'coins' && user.coins >= costs.coins) {
      user.coins -= costs.coins;
      paymentValid = true;
    } else if (paymentMethod === 'gems' && biome === 'volcanic_ridge' && user.gems >= costs.gems) {
      user.gems -= costs.gems;
      paymentValid = true;
    } else {
      // Check for lasso payment
      const lassoType = Object.keys(costs).find(key => key !== 'coins' && key !== 'gems');
      if (lassoType && user.lassos && user.lassos[lassoType] >= costs[lassoType]) {
        user.lassos[lassoType] -= costs[lassoType];
        paymentValid = true;
      }
    }
    
    if (!paymentValid) {
      return res.status(400).json({ message: 'Insufficient funds or items for capture' });
    }
    
    // Generate wild horse
    const wildHorseData = generateWildHorse(biome, maturityStage, req.user.id);
    
    // Create horse in database
    const horse = await Horse.create(wildHorseData);
    
    // Add experience for capture
    const oldLevel = user.level;
    user.experience += 50;
    if (biome === 'volcanic_ridge') user.experience += 100; // Bonus for rare biome
    
    // Level up check (simple formula)
    const newLevel = Math.floor(user.experience / 1000) + 1;
    if (newLevel > user.level) {
      user.level = newLevel;
    }
    
    // Save user with updated currency/items and experience
    await user.save();
    
    res.status(201).json({
      success: true,
      message: `Successfully captured a wild ${biomeConfig.name} horse!`,
      data: {
        horse,
        experienceGained: biome === 'volcanic_ridge' ? 150 : 50,
        levelUp: newLevel > oldLevel,
        newLevel: newLevel
      }
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get available breeds
// @route   GET /api/horses/breeds
// @access  Public
const getBreeds = async (req, res) => {
  try {
    const breeds = [
      'Thoroughbred', 'Friesian', 'Arabian', 'Quarter Horse', 'Appaloosa',
      'Mustang', 'Hanoverian', 'Paint Horse', 'Clydesdale', 'Belgian Draft',
      'Lusitano', 'Akhal-Teke', 'Warmblood Mix', 'Morgan', 'Tennessee Walker',
      'Welsh Pony', 'Shetland Pony', 'Connemara Pony', 'Fjord Pony', 'Hackney Pony'
    ];
    
    res.json({
      success: true,
      data: breeds,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getHorses,
  getHorse,
  createHorse,
  updateHorse,
  deleteHorse,
  breedHorses,
  trainHorse,
  getBreeds,
  getCaptureBiomes,
  captureWildHorse,
};
