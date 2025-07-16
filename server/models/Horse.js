const mongoose = require('mongoose');

const horseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Horse name is required'],
    trim: true,
    maxlength: [30, 'Horse name cannot exceed 30 characters']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  breed: {
    type: String,
    required: true,
    enum: [
      'Thoroughbred', 'Friesian', 'Arabian', 'Quarter Horse', 'Appaloosa',
      'Mustang', 'Hanoverian', 'Paint Horse', 'Clydesdale', 'Belgian Draft',
      'Lusitano', 'Akhal-Teke', 'Warmblood Mix', 'Morgan', 'Tennessee Walker',
      'Welsh Pony', 'Shetland Pony', 'Connemara Pony', 'Fjord Pony', 'Hackney Pony'
    ]
  },
  gender: {
    type: String,
    enum: ['stallion', 'mare', 'gelding'],
    required: true
  },
  age: {
    type: Number,
    min: 0,
    max: 30,
    default: 0
  },
  height: {
    type: Number, // in hands (hh)
    min: 9,
    max: 19
  },
  color: {
    base: String,
    pattern: String,
    markings: [String]
  },
  genetics: {
    // Coat color genes
    agouti: { type: String, enum: ['Ay/Ay', 'Ay/at', 'Ay/a', 'at/at', 'at/a', 'a/a'] },
    extension: { type: String, enum: ['E/E', 'E/e', 'e/e'] },
    cream: { type: String, enum: ['C/C', 'C/Ccr', 'C/Cprl', 'Ccr/Ccr', 'Ccr/Cprl', 'Cprl/Cprl'] },
    dun: { type: String, enum: ['D/D', 'D/d', 'd/d'] },
    gray: { type: String, enum: ['G/G', 'G/g', 'g/g'] },
    silver: { type: String, enum: ['Z/Z', 'Z/z', 'z/z'] },
    champagne: { type: String, enum: ['Ch/Ch', 'Ch/ch', 'ch/ch'] },
    tobiano: { type: String, enum: ['TO/TO', 'TO/to', 'to/to'] },
    sabino: { type: String, enum: ['SB1/SB1', 'SB1/sb1', 'sb1/sb1'] },
    splashed_white: { type: String, enum: ['SW/SW', 'SW/sw', 'sw/sw'] },
    
    // Health genes
    hyperkalemic_paralysis: { type: String, enum: ['N/N', 'N/H', 'H/H'] },
    malignant_hyperthermia: { type: String, enum: ['N/N', 'N/M', 'M/M'] },
    polysaccharide_storage: { type: String, enum: ['N/N', 'N/P', 'P/P'] }
  },
  stats: {
    speed: { type: Number, min: 0, max: 100, default: 50 },
    endurance: { type: Number, min: 0, max: 100, default: 50 },
    agility: { type: Number, min: 0, max: 100, default: 50 },
    strength: { type: Number, min: 0, max: 100, default: 50 },
    intelligence: { type: Number, min: 0, max: 100, default: 50 },
    obedience: { type: Number, min: 0, max: 100, default: 50 },
    temperament: { type: Number, min: 0, max: 100, default: 50 },
    reflexes: { type: Number, min: 0, max: 100, default: 50 }
  },
  training: {
    dressage: { type: Number, min: 0, max: 100, default: 0 },
    show_jumping: { type: Number, min: 0, max: 100, default: 0 },
    cross_country: { type: Number, min: 0, max: 100, default: 0 },
    barrel_racing: { type: Number, min: 0, max: 100, default: 0 },
    reining: { type: Number, min: 0, max: 100, default: 0 },
    western_pleasure: { type: Number, min: 0, max: 100, default: 0 },
    trail: { type: Number, min: 0, max: 100, default: 0 }
  },
  health: {
    status: {
      type: String,
      enum: ['healthy', 'sick', 'injured', 'recovering'],
      default: 'healthy'
    },
    energy: { type: Number, min: 0, max: 100, default: 100 },
    happiness: { type: Number, min: 0, max: 100, default: 100 },
    lastVetCheck: Date,
    vaccinations: [{
      type: String,
      date: Date
    }],
    injuries: [{
      type: String,
      severity: String,
      date: Date,
      recovered: Boolean
    }]
  },
  breeding: {
    fertility: { type: Number, min: 0, max: 100, default: 100 },
    pregnancies: { type: Number, default: 0 },
    offspring: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Horse' }],
    sire: { type: mongoose.Schema.Types.ObjectId, ref: 'Horse' },
    dam: { type: mongoose.Schema.Types.ObjectId, ref: 'Horse' },
    isPregnant: { type: Boolean, default: false },
    pregnancyDue: Date,
    lastBred: Date
  },
  achievements: [{
    event: String,
    placement: Number,
    date: Date,
    points: Number
  }],
  value: {
    type: Number,
    default: 1000
  },
  forSale: {
    type: Boolean,
    default: false
  },
  salePrice: Number,
  location: {
    stable: String,
    pasture: String
  },
  image: String,
  rarity: {
    type: String,
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    default: 'common'
  }
}, {
  timestamps: true
});

// Calculate overall rating
horseSchema.virtual('overallRating').get(function() {
  const stats = this.stats;
  const total = stats.speed + stats.endurance + stats.agility + stats.strength + 
                stats.intelligence + stats.obedience + stats.temperament + stats.reflexes;
  return Math.round(total / 8);
});

// Calculate training level
horseSchema.virtual('trainingLevel').get(function() {
  const training = this.training;
  const total = training.dressage + training.show_jumping + training.cross_country + 
                training.barrel_racing + training.reining + training.western_pleasure + training.trail;
  return Math.round(total / 7);
});

module.exports = mongoose.model('Horse', horseSchema);
