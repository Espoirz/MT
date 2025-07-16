const Dog = require('../models/Dog');
const User = require('../models/User');
const GeneticsCalculator = require('../utils/genetics');
const { 
  CAPTURE_LOCATIONS, 
  generateWildDog, 
  calculateAdoptionFee, 
  calculateShelterReputationGain, 
  canAccessPremiumLocation, 
  canSponsorMore 
} = require('../utils/dogCapture');

// @desc    Get all dogs for a user
// @route   GET /api/dogs
// @access  Private
const getDogs = async (req, res) => {
  try {
    const dogs = await Dog.find({ owner: req.user.id })
      .populate('breeding.sire', 'name breed')
      .populate('breeding.dam', 'name breed')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: dogs.length,
      data: dogs,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single dog
// @route   GET /api/dogs/:id
// @access  Private
const getDog = async (req, res) => {
  try {
    const dog = await Dog.findById(req.params.id)
      .populate('breeding.sire', 'name breed')
      .populate('breeding.dam', 'name breed')
      .populate('breeding.offspring', 'name breed gender');

    if (!dog) {
      return res.status(404).json({ message: 'Dog not found' });
    }

    // Check if user owns this dog
    if (dog.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({
      success: true,
      data: dog,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new dog
// @route   POST /api/dogs
// @access  Private
const createDog = async (req, res) => {
  try {
    const { name, breed, gender } = req.body;

    // Generate genetics and stats for the dog
    const genetics = GeneticsCalculator.generateRandomGenetics('dog', breed);
    const stats = GeneticsCalculator.calculateStats('dog', breed, genetics);
    const color = GeneticsCalculator.calculateCoatColor(genetics);

    // Set height and weight based on breed
    const breedRanges = {
      'Border Collie': { height: [18, 22], weight: [30, 55] },
      'Labrador Retriever': { height: [21.5, 24.5], weight: [55, 80] },
      'German Shepherd': { height: [22, 26], weight: [50, 90] },
      'Australian Shepherd': { height: [18, 23], weight: [40, 65] },
      'Golden Retriever': { height: [21.5, 24], weight: [55, 75] },
      'Belgian Malinois': { height: [22, 26], weight: [40, 80] },
      'Jack Russell Terrier': { height: [10, 15], weight: [9, 15] },
      'Rottweiler': { height: [22, 27], weight: [80, 135] },
      'Siberian Husky': { height: [20, 24], weight: [35, 60] },
      'Doberman Pinscher': { height: [24, 28], weight: [60, 100] }
    };

    const range = breedRanges[breed] || { height: [20, 25], weight: [40, 70] };
    const height = range.height[0] + Math.random() * (range.height[1] - range.height[0]);
    const weight = range.weight[0] + Math.random() * (range.weight[1] - range.weight[0]);

    const dog = await Dog.create({
      name,
      breed,
      gender,
      owner: req.user.id,
      height: Math.round(height * 10) / 10,
      weight: Math.round(weight * 10) / 10,
      genetics,
      stats,
      color,
      age: 0,
      rarity: Math.random() < 0.1 ? 'rare' : Math.random() < 0.3 ? 'uncommon' : 'common'
    });

    res.status(201).json({
      success: true,
      data: dog,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update dog
// @route   PUT /api/dogs/:id
// @access  Private
const updateDog = async (req, res) => {
  try {
    let dog = await Dog.findById(req.params.id);

    if (!dog) {
      return res.status(404).json({ message: 'Dog not found' });
    }

    // Check if user owns this dog
    if (dog.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    dog = await Dog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      data: dog,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete dog
// @route   DELETE /api/dogs/:id
// @access  Private
const deleteDog = async (req, res) => {
  try {
    const dog = await Dog.findById(req.params.id);

    if (!dog) {
      return res.status(404).json({ message: 'Dog not found' });
    }

    // Check if user owns this dog
    if (dog.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await dog.deleteOne();

    res.json({
      success: true,
      message: 'Dog deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Breed two dogs
// @route   POST /api/dogs/breed
// @access  Private
const breedDogs = async (req, res) => {
  try {
    const { sireId, damId } = req.body;

    // Get both dogs
    const sire = await Dog.findById(sireId);
    const dam = await Dog.findById(damId);

    if (!sire || !dam) {
      return res.status(404).json({ message: 'One or both dogs not found' });
    }

    // Check ownership
    if (sire.owner.toString() !== req.user.id || dam.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to breed these dogs' });
    }

    // Validate breeding requirements
    if (sire.gender !== 'male' || dam.gender !== 'female') {
      return res.status(400).json({ message: 'Invalid breeding pair - need male and female' });
    }

    if (sire.breed !== dam.breed) {
      return res.status(400).json({ message: 'Cannot breed dogs of different breeds' });
    }

    if (sire.age < 2 || dam.age < 2) {
      return res.status(400).json({ message: 'Dogs must be at least 2 years old to breed' });
    }

    if (dam.breeding.isPregnant) {
      return res.status(400).json({ message: 'Female is already pregnant' });
    }

    // Check if breeding cooldown has passed
    const now = new Date();
    const cooldownPeriod = 180 * 24 * 60 * 60 * 1000; // 180 days in milliseconds
    
    if (dam.breeding.lastBred && (now - dam.breeding.lastBred) < cooldownPeriod) {
      return res.status(400).json({ message: 'Female is still in breeding cooldown' });
    }

    // Generate offspring
    const offspring = GeneticsCalculator.breed(sire, dam);
    
    // Determine gender randomly
    const gender = Math.random() < 0.5 ? 'male' : 'female';
    
    // Create puppy
    const puppy = await Dog.create({
      name: `${sire.name} x ${dam.name} Puppy`,
      breed: offspring.breed,
      gender,
      owner: req.user.id,
      height: 5 + Math.random() * 3, // Puppies are smaller
      weight: 5 + Math.random() * 10,
      genetics: offspring.genetics,
      stats: offspring.stats,
      color: GeneticsCalculator.calculateCoatColor(offspring.genetics),
      age: 0,
      'breeding.sire': sireId,
      'breeding.dam': damId,
      rarity: Math.random() < 0.05 ? 'legendary' : Math.random() < 0.15 ? 'epic' : 'common'
    });

    // Update parent records
    await Dog.findByIdAndUpdate(sireId, {
      $push: { 'breeding.offspring': puppy._id }
    });

    await Dog.findByIdAndUpdate(damId, {
      $push: { 'breeding.offspring': puppy._id },
      $inc: { 'breeding.pregnancies': 1 },
      $set: { 'breeding.lastBred': now }
    });

    res.status(201).json({
      success: true,
      message: 'Breeding successful!',
      data: puppy,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Train dog
// @route   PUT /api/dogs/:id/train
// @access  Private
const trainDog = async (req, res) => {
  try {
    const { discipline } = req.body;
    const dog = await Dog.findById(req.params.id);

    if (!dog) {
      return res.status(404).json({ message: 'Dog not found' });
    }

    if (dog.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (dog.health.energy < 20) {
      return res.status(400).json({ message: 'Dog is too tired to train' });
    }

    // Increase training level
    const trainingGain = Math.floor(Math.random() * 5) + 1;
    dog.training[discipline] = Math.min(100, dog.training[discipline] + trainingGain);
    
    // Decrease energy
    dog.health.energy = Math.max(0, dog.health.energy - 20);
    
    // Small chance to improve stats
    if (Math.random() < 0.1) {
      const relevantStats = {
        'agility': ['agility', 'reflexes'],
        'obedience': ['obedience', 'focus'],
        'tracking': ['tracking', 'intelligence'],
        'herding': ['intelligence', 'focus'],
        'dock_diving': ['strength', 'agility'],
        'trick_training': ['intelligence', 'patience']
      };

      const statsToImprove = relevantStats[discipline] || ['intelligence'];
      const statToImprove = statsToImprove[Math.floor(Math.random() * statsToImprove.length)];
      dog.stats[statToImprove] = Math.min(100, dog.stats[statToImprove] + 1);
    }

    await dog.save();

    res.json({
      success: true,
      message: `Training in ${discipline} improved by ${trainingGain} points!`,
      data: dog,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dog breeds
// @route   GET /api/dogs/breeds
// @access  Public
const getBreeds = async (req, res) => {
  try {
    const breeds = Object.keys(GeneticsCalculator.DOG_BREED_STATS).map(breed => ({
      name: breed,
      stats: GeneticsCalculator.DOG_BREED_STATS[breed]
    }));

    res.json({
      success: true,
      data: breeds,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get capture locations
// @route   GET /api/dogs/capture-locations
// @access  Private
const getCaptureLocations = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    const locations = Object.keys(CAPTURE_LOCATIONS).map(key => {
      const location = CAPTURE_LOCATIONS[key];
      return {
        id: key,
        name: location.name,
        description: location.description,
        costs: location.costs,
        premiumOnly: location.premiumOnly,
        breedPreferences: location.breedPreferences,
        specialEffects: location.specialEffects,
        accessible: !location.premiumOnly || canAccessPremiumLocation(user)
      };
    });

    res.json({
      success: true,
      data: locations,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Capture a wild dog
// @route   POST /api/dogs/capture
// @access  Private
const captureWildDog = async (req, res) => {
  try {
    const { location, paymentMethod, paymentAmount } = req.body;
    
    if (!location || !CAPTURE_LOCATIONS[location]) {
      return res.status(400).json({ message: 'Invalid capture location' });
    }
    
    const user = await User.findById(req.user.id);
    const locationConfig = CAPTURE_LOCATIONS[location];
    
    // Check premium access
    if (locationConfig.premiumOnly && !canAccessPremiumLocation(user)) {
      return res.status(403).json({ message: 'Premium membership required for this location' });
    }
    
    // Validate payment
    const costs = locationConfig.costs;
    const hasNylon = costs.nylon && user.leashes.nylon >= costs.nylon;
    const hasLeather = costs.leather && user.leashes.leather >= costs.leather;
    const hasSlip = costs.slip && user.leashes.slip >= costs.slip;
    const hasCoins = user.coins >= costs.coins;
    
    if (!hasCoins) {
      return res.status(400).json({ message: 'Insufficient coins' });
    }
    
    let canCapture = false;
    let leashType = '';
    
    if (costs.nylon && hasNylon) {
      canCapture = true;
      leashType = 'nylon';
    } else if (costs.leather && hasLeather) {
      canCapture = true;
      leashType = 'leather';
    } else if (costs.slip && hasSlip) {
      canCapture = true;
      leashType = 'slip';
    }
    
    if (!canCapture) {
      return res.status(400).json({ message: 'Insufficient leashes for this location' });
    }
    
    // Deduct payment
    user.coins -= costs.coins;
    user.leashes[leashType] -= costs[leashType];
    
    // Generate wild dog
    const wildDog = generateWildDog(location, req.user.id);
    
    // Create dog in database
    const dog = new Dog(wildDog);
    await dog.save();
    
    await user.save();
    
    res.json({
      success: true,
      message: `Successfully captured a wild dog from ${locationConfig.name}!`,
      data: {
        dog: dog,
        paymentUsed: {
          coins: costs.coins,
          [leashType]: costs[leashType]
        },
        remainingResources: {
          coins: user.coins,
          leashes: user.leashes
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get shelter dogs
// @route   GET /api/dogs/shelter
// @access  Private
const getShelterDogs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const dogs = await Dog.find({ 
      shelterEntry: { $exists: true },
      owner: null,
      quarantineUntil: { $lt: new Date() }
    })
      .sort({ shelterEntry: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const totalDogs = await Dog.countDocuments({ 
      shelterEntry: { $exists: true },
      owner: null,
      quarantineUntil: { $lt: new Date() }
    });
    
    const dogsWithAdoptionFees = dogs.map(dog => ({
      ...dog.toObject(),
      adoptionFee: calculateAdoptionFee(dog)
    }));
    
    res.json({
      success: true,
      data: dogsWithAdoptionFees,
      pagination: {
        current: page,
        total: Math.ceil(totalDogs / limit),
        totalDogs: totalDogs
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Adopt a dog from shelter
// @route   POST /api/dogs/adopt/:id
// @access  Private
const adoptDog = async (req, res) => {
  try {
    const dog = await Dog.findById(req.params.id);
    
    if (!dog) {
      return res.status(404).json({ message: 'Dog not found' });
    }
    
    if (dog.owner) {
      return res.status(400).json({ message: 'Dog already adopted' });
    }
    
    if (!dog.shelterEntry) {
      return res.status(400).json({ message: 'Dog not in shelter' });
    }
    
    if (dog.quarantineUntil && dog.quarantineUntil > new Date()) {
      return res.status(400).json({ message: 'Dog still in quarantine' });
    }
    
    const user = await User.findById(req.user.id);
    const adoptionFee = calculateAdoptionFee(dog);
    
    if (user.coins < adoptionFee) {
      return res.status(400).json({ message: 'Insufficient coins for adoption fee' });
    }
    
    // Process adoption
    user.coins -= adoptionFee;
    user.shelterReputation += calculateShelterReputationGain('adopt', dog);
    
    dog.owner = req.user.id;
    dog.shelterEntry = undefined;
    dog.quarantineUntil = undefined;
    dog.adoptionDate = new Date();
    dog.name = `Adopted ${dog.breed}`;
    
    await user.save();
    await dog.save();
    
    res.json({
      success: true,
      message: 'Dog adopted successfully!',
      data: {
        dog: dog,
        adoptionFee: adoptionFee,
        reputationGain: calculateShelterReputationGain('adopt', dog),
        remainingCoins: user.coins,
        newReputation: user.shelterReputation
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Sponsor a dog in shelter
// @route   POST /api/dogs/sponsor/:id
// @access  Private
const sponsorDog = async (req, res) => {
  try {
    const dog = await Dog.findById(req.params.id);
    
    if (!dog) {
      return res.status(404).json({ message: 'Dog not found' });
    }
    
    if (dog.owner) {
      return res.status(400).json({ message: 'Dog already adopted' });
    }
    
    if (!dog.shelterEntry) {
      return res.status(400).json({ message: 'Dog not in shelter' });
    }
    
    const user = await User.findById(req.user.id);
    
    if (!canSponsorMore(user)) {
      return res.status(400).json({ message: 'Maximum sponsorship limit reached or premium membership required' });
    }
    
    const sponsorshipCost = 500;
    
    if (user.coins < sponsorshipCost) {
      return res.status(400).json({ message: 'Insufficient coins for sponsorship' });
    }
    
    // Process sponsorship
    user.coins -= sponsorshipCost;
    user.shelterReputation += calculateShelterReputationGain('sponsor', dog);
    user.sponsoredAnimals.push({
      animal: dog._id,
      type: 'dog',
      sponsorshipDate: new Date()
    });
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Dog sponsored successfully!',
      data: {
        dog: dog,
        sponsorshipCost: sponsorshipCost,
        reputationGain: calculateShelterReputationGain('sponsor', dog),
        remainingCoins: user.coins,
        newReputation: user.shelterReputation
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDogs,
  getDog,
  createDog,
  updateDog,
  deleteDog,
  breedDogs,
  trainDog,
  getBreeds,
  getCaptureLocations,
  captureWildDog,
  getShelterDogs,
  adoptDog,
  sponsorDog,
};
