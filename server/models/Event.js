const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Event name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Event description is required']
  },
  type: {
    type: String,
    enum: ['horse', 'dog'],
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Show Jumping', 'Dressage', 'Cross Country', 'Barrel Racing', 'Reining', 'Western Pleasure', 'Trail', 'Agility', 'Obedience', 'Tracking', 'Herding', 'Dock Diving', 'Trick Training']
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'beginner'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  registrationDeadline: {
    type: Date,
    required: true
  },
  entryFee: {
    type: Number,
    min: 0,
    default: 0
  },
  maxParticipants: {
    type: Number,
    min: 1,
    default: 50
  },
  participants: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    animal: { type: mongoose.Schema.Types.ObjectId, refPath: 'type' },
    registrationDate: { type: Date, default: Date.now },
    score: { type: Number, default: 0 },
    placement: { type: Number, default: 0 }
  }],
  prizes: [{
    placement: Number,
    coins: Number,
    gems: Number,
    items: [{
      type: String,
      quantity: Number
    }]
  }],
  requirements: {
    minLevel: { type: Number, default: 1 },
    minAge: { type: Number, default: 0 },
    maxAge: { type: Number, default: 30 },
    allowedBreeds: [String],
    minTraining: { type: Number, default: 0 },
    healthRequired: { type: Boolean, default: true }
  },
  status: {
    type: String,
    enum: ['upcoming', 'registration_open', 'registration_closed', 'in_progress', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  results: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    animal: { type: mongoose.Schema.Types.ObjectId, refPath: 'type' },
    placement: Number,
    score: Number,
    details: {
      speed: Number,
      accuracy: Number,
      style: Number,
      difficulty: Number
    }
  }],
  judges: [{
    name: String,
    specialty: String,
    rating: Number
  }],
  location: {
    venue: String,
    city: String,
    state: String,
    country: String
  },
  weather: {
    condition: String,
    temperature: Number,
    humidity: Number
  },
  spectators: { type: Number, default: 0 },
  broadcastLive: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Index for efficient queries
eventSchema.index({ type: 1, category: 1, status: 1 });
eventSchema.index({ startDate: 1 });
eventSchema.index({ registrationDeadline: 1 });

// Virtual for current registration count
eventSchema.virtual('currentParticipants').get(function() {
  return this.participants.length;
});

// Virtual for spots remaining
eventSchema.virtual('spotsRemaining').get(function() {
  return this.maxParticipants - this.participants.length;
});

// Check if registration is open
eventSchema.methods.isRegistrationOpen = function() {
  const now = new Date();
  return this.status === 'registration_open' && 
         now <= this.registrationDeadline && 
         this.participants.length < this.maxParticipants;
};

// Check if animal meets requirements
eventSchema.methods.meetsRequirements = function(animal) {
  const req = this.requirements;
  
  // Check age
  if (animal.age < req.minAge || animal.age > req.maxAge) {
    return false;
  }
  
  // Check breed restrictions
  if (req.allowedBreeds.length > 0 && !req.allowedBreeds.includes(animal.breed)) {
    return false;
  }
  
  // Check health status
  if (req.healthRequired && animal.health.status !== 'healthy') {
    return false;
  }
  
  // Check training level
  const trainingLevel = animal.trainingLevel;
  if (trainingLevel < req.minTraining) {
    return false;
  }
  
  return true;
};

module.exports = mongoose.model('Event', eventSchema);
