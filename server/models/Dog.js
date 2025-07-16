const mongoose = require('mongoose');

const dogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Dog name is required'],
    trim: true,
    maxlength: [30, 'Dog name cannot exceed 30 characters']
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
      'Border Collie', 'Labrador Retriever', 'German Shepherd', 'Australian Shepherd',
      'Golden Retriever', 'Belgian Malinois', 'Jack Russell Terrier', 'Rottweiler',
      'Siberian Husky', 'Doberman Pinscher'
    ]
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true
  },
  age: {
    type: Number,
    min: 0,
    max: 20,
    default: 0
  },
  height: {
    type: Number, // in inches
    min: 8,
    max: 32
  },
  weight: {
    type: Number, // in pounds
    min: 5,
    max: 200
  },
  color: {
    base: String,
    pattern: String,
    markings: [String]
  },
  genetics: {
    // Coat color genes
    agouti: { type: String, enum: ['Ay/Ay', 'Ay/at', 'Ay/a', 'at/at', 'at/a', 'a/a'] },
    k_locus: { type: String, enum: ['KB/KB', 'KB/ky', 'ky/ky'] },
    extension: { type: String, enum: ['E/E', 'E/e', 'e/e'] },
    brown: { type: String, enum: ['B/B', 'B/b', 'b/b'] },
    dilution: { type: String, enum: ['D/D', 'D/d', 'd/d'] },
    merle: { type: String, enum: ['M/M', 'M/m', 'm/m'] },
    spotting: { type: String, enum: ['S/S', 'S/si', 'S/sp', 'S/sw', 'si/si', 'si/sp', 'si/sw', 'sp/sp', 'sp/sw', 'sw/sw'] },
    graying: { type: String, enum: ['G/G', 'G/g', 'g/g'] },
    brindle: { type: String, enum: ['Br/Br', 'Br/br', 'br/br'] },
    ticking: { type: String, enum: ['T/T', 'T/t', 't/t'] },
    
    // Health genes
    pra: { type: String, enum: ['N/N', 'N/pra', 'pra/pra'] },
    dm: { type: String, enum: ['N/N', 'N/dm', 'dm/dm'] },
    mdr1: { type: String, enum: ['N/N', 'N/mdr1', 'mdr1/mdr1'] },
    cea: { type: String, enum: ['N/N', 'N/cea', 'cea/cea'] },
    huu: { type: String, enum: ['N/N', 'N/huu', 'huu/huu'] }
  },
  stats: {
    intelligence: { type: Number, min: 0, max: 100, default: 50 },
    agility: { type: Number, min: 0, max: 100, default: 50 },
    strength: { type: Number, min: 0, max: 100, default: 50 },
    endurance: { type: Number, min: 0, max: 100, default: 50 },
    obedience: { type: Number, min: 0, max: 100, default: 50 },
    temperament: { type: Number, min: 0, max: 100, default: 50 },
    reflexes: { type: Number, min: 0, max: 100, default: 50 },
    focus: { type: Number, min: 0, max: 100, default: 50 },
    tracking: { type: Number, min: 0, max: 100, default: 50 },
    patience: { type: Number, min: 0, max: 100, default: 50 }
  },
  training: {
    agility: { type: Number, min: 0, max: 100, default: 0 },
    obedience: { type: Number, min: 0, max: 100, default: 0 },
    tracking: { type: Number, min: 0, max: 100, default: 0 },
    herding: { type: Number, min: 0, max: 100, default: 0 },
    dock_diving: { type: Number, min: 0, max: 100, default: 0 },
    trick_training: { type: Number, min: 0, max: 100, default: 0 }
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
    offspring: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dog' }],
    sire: { type: mongoose.Schema.Types.ObjectId, ref: 'Dog' },
    dam: { type: mongoose.Schema.Types.ObjectId, ref: 'Dog' },
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
    default: 500
  },
  forSale: {
    type: Boolean,
    default: false
  },
  salePrice: Number,
  location: {
    kennel: String,
    yard: String
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
dogSchema.virtual('overallRating').get(function() {
  const stats = this.stats;
  const total = stats.intelligence + stats.agility + stats.strength + stats.endurance + 
                stats.obedience + stats.temperament + stats.reflexes + stats.focus + 
                stats.tracking + stats.patience;
  return Math.round(total / 10);
});

// Calculate training level
dogSchema.virtual('trainingLevel').get(function() {
  const training = this.training;
  const total = training.agility + training.obedience + training.tracking + 
                training.herding + training.dock_diving + training.trick_training;
  return Math.round(total / 6);
});

module.exports = mongoose.model('Dog', dogSchema);
