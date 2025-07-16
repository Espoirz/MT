const Event = require('../models/Event');
const Horse = require('../models/Horse');
const Dog = require('../models/Dog');
const User = require('../models/User');

// @desc    Get all events
// @route   GET /api/events
// @access  Private
const getEvents = async (req, res) => {
  try {
    const { type, category, status } = req.query;
    
    const filter = {};
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (status) filter.status = status;

    const events = await Event.find(filter)
      .populate('participants.user', 'username')
      .populate('participants.animal', 'name breed')
      .sort({ startDate: 1 });

    res.json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Private
const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('participants.user', 'username')
      .populate('participants.animal', 'name breed stats training');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({
      success: true,
      data: event,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new event (Admin only)
// @route   POST /api/events
// @access  Private
const createEvent = async (req, res) => {
  try {
    const event = await Event.create({
      ...req.body,
      status: 'upcoming'
    });

    res.status(201).json({
      success: true,
      data: event,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register for event
// @route   POST /api/events/:id/register
// @access  Private
const registerForEvent = async (req, res) => {
  try {
    const { animalId } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if registration is open
    if (!event.isRegistrationOpen()) {
      return res.status(400).json({ message: 'Registration is closed for this event' });
    }

    // Check if user already registered
    const existingRegistration = event.participants.find(
      p => p.user.toString() === req.user.id
    );
    
    if (existingRegistration) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    // Get the animal
    const Model = event.type === 'horse' ? Horse : Dog;
    const animal = await Model.findById(animalId);

    if (!animal) {
      return res.status(404).json({ message: 'Animal not found' });
    }

    // Check ownership
    if (animal.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check if animal meets requirements
    if (!event.meetsRequirements(animal)) {
      return res.status(400).json({ message: 'Animal does not meet event requirements' });
    }

    // Check if user has enough coins for entry fee
    const user = await User.findById(req.user.id);
    if (user.coins < event.entryFee) {
      return res.status(400).json({ message: 'Insufficient coins for entry fee' });
    }

    // Deduct entry fee
    user.coins -= event.entryFee;
    await user.save();

    // Add participant
    event.participants.push({
      user: req.user.id,
      animal: animalId,
      registrationDate: new Date()
    });

    await event.save();

    res.json({
      success: true,
      message: 'Successfully registered for event',
      data: event,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Run event simulation
// @route   POST /api/events/:id/run
// @access  Private
const runEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('participants.animal');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.status !== 'registration_closed') {
      return res.status(400).json({ message: 'Event is not ready to run' });
    }

    // Calculate scores for each participant
    const results = [];
    
    for (const participant of event.participants) {
      const animal = participant.animal;
      
      // Calculate base score from relevant stats and training
      let baseScore = 0;
      
      if (event.type === 'horse') {
        const relevantStats = {
          'Show Jumping': ['agility', 'strength', 'reflexes'],
          'Dressage': ['obedience', 'temperament', 'intelligence'],
          'Cross Country': ['endurance', 'agility', 'speed'],
          'Barrel Racing': ['speed', 'reflexes', 'agility'],
          'Reining': ['obedience', 'agility', 'intelligence'],
          'Western Pleasure': ['temperament', 'obedience'],
          'Trail': ['endurance', 'temperament', 'intelligence']
        };
        
        const stats = relevantStats[event.category] || ['endurance'];
        baseScore = stats.reduce((sum, stat) => sum + animal.stats[stat], 0) / stats.length;
        
        // Add training bonus
        const trainingKey = event.category.toLowerCase().replace(' ', '_');
        baseScore += animal.training[trainingKey] || 0;
        
      } else { // dog
        const relevantStats = {
          'Agility': ['agility', 'reflexes', 'focus'],
          'Obedience': ['obedience', 'intelligence', 'focus'],
          'Tracking': ['tracking', 'intelligence', 'patience'],
          'Herding': ['intelligence', 'focus', 'agility'],
          'Dock Diving': ['strength', 'agility', 'reflexes'],
          'Trick Training': ['intelligence', 'patience', 'obedience']
        };
        
        const stats = relevantStats[event.category] || ['intelligence'];
        baseScore = stats.reduce((sum, stat) => sum + animal.stats[stat], 0) / stats.length;
        
        // Add training bonus
        const trainingKey = event.category.toLowerCase().replace(' ', '_');
        baseScore += animal.training[trainingKey] || 0;
      }
      
      // Add some randomness for excitement
      const randomFactor = (Math.random() - 0.5) * 20; // -10 to +10
      const finalScore = Math.max(0, baseScore + randomFactor);
      
      results.push({
        user: participant.user,
        animal: animal._id,
        score: Math.round(finalScore * 100) / 100,
        details: {
          speed: Math.round((Math.random() * 20 + 80) * 100) / 100,
          accuracy: Math.round((Math.random() * 20 + 80) * 100) / 100,
          style: Math.round((Math.random() * 20 + 80) * 100) / 100,
          difficulty: Math.round((Math.random() * 20 + 80) * 100) / 100
        }
      });
    }
    
    // Sort results by score (highest first)
    results.sort((a, b) => b.score - a.score);
    
    // Assign placements
    results.forEach((result, index) => {
      result.placement = index + 1;
    });
    
    // Update event
    event.results = results;
    event.status = 'completed';
    
    // Update participants with their scores and placements
    event.participants.forEach(participant => {
      const result = results.find(r => r.animal.toString() === participant.animal._id.toString());
      if (result) {
        participant.score = result.score;
        participant.placement = result.placement;
      }
    });
    
    await event.save();
    
    // Award prizes
    for (const result of results) {
      const prize = event.prizes.find(p => p.placement === result.placement);
      if (prize) {
        const user = await User.findById(result.user);
        user.coins += prize.coins || 0;
        user.gems += prize.gems || 0;
        await user.save();
        
        // Add achievement to animal
        const Model = event.type === 'horse' ? Horse : Dog;
        await Model.findByIdAndUpdate(result.animal, {
          $push: {
            achievements: {
              event: event.name,
              placement: result.placement,
              date: new Date(),
              points: prize.coins || 0
            }
          }
        });
      }
    }

    res.json({
      success: true,
      message: 'Event completed successfully',
      data: event,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's event history
// @route   GET /api/events/my-events
// @access  Private
const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({
      'participants.user': req.user.id
    })
    .populate('participants.animal', 'name breed')
    .sort({ startDate: -1 });

    // Filter to only show user's participation
    const userEvents = events.map(event => {
      const userParticipation = event.participants.find(
        p => p.user.toString() === req.user.id
      );
      
      return {
        ...event.toObject(),
        myParticipation: userParticipation,
        myResult: event.results.find(r => r.user.toString() === req.user.id)
      };
    });

    res.json({
      success: true,
      count: userEvents.length,
      data: userEvents,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEvents,
  getEvent,
  createEvent,
  registerForEvent,
  runEvent,
  getMyEvents,
};
